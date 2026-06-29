import { nanoid } from 'nanoid';
import pool from '../db.js';

export async function createLink(req, res) {
  try {
    const { original_url, custom_slug, expires_at } = req.body;
    if (!original_url) return res.status(400).json({ error: 'Original URL is required' });

    try { new URL(original_url); } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const slug = custom_slug || nanoid(8);
    if (custom_slug) {
      const [existing] = await pool.query('SELECT id FROM links WHERE slug = ?', [slug]);
      if (existing.length > 0) return res.status(409).json({ error: 'Custom slug already taken' });
    }

    const [result] = await pool.query(
      'INSERT INTO links (user_id, slug, original_url, is_custom, expires_at) VALUES (?, ?, ?, ?, ?)',
      [req.userId, slug, original_url, !!custom_slug, expires_at || null]
    );

    res.status(201).json({
      id: result.insertId,
      slug,
      original_url,
      short_url: `${req.protocol}://${req.get('host')}/${slug}`,
      is_custom: !!custom_slug,
      expires_at: expires_at || null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getUserLinks(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, 
        (SELECT COUNT(*) FROM clicks WHERE link_id = l.id) as click_count
       FROM links l WHERE l.user_id = ? ORDER BY l.created_at DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getLinkStats(req, res) {
  try {
    const { id } = req.params;
    const [links] = await pool.query('SELECT * FROM links WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (links.length === 0) return res.status(404).json({ error: 'Link not found' });

    const [totalClicks] = await pool.query('SELECT COUNT(*) as total FROM clicks WHERE link_id = ?', [id]);

    const [clicksByDay] = await pool.query(
      `SELECT DATE(clicked_at) as date, COUNT(*) as count 
       FROM clicks WHERE link_id = ? AND clicked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(clicked_at) ORDER BY date`,
      [id]
    );

    const [countries] = await pool.query(
      `SELECT country, COUNT(*) as count FROM clicks 
       WHERE link_id = ? AND country IS NOT NULL AND country != ''
       GROUP BY country ORDER BY count DESC LIMIT 10`,
      [id]
    );

    res.json({
      link: links[0],
      total_clicks: totalClicks[0].total,
      clicks_by_day: clicksByDay,
      countries,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteLink(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM links WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Link not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function redirectToUrl(req, res) {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM links WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).send('Link not found');

    const link = rows[0];
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.status(410).send('Link has expired');
    }

    res.redirect(301, link.original_url);

    const ip = req.ip || req.connection?.remoteAddress || '';
    const country = req.headers['cf-ipcountry'] || '';

    pool.query(
      'INSERT INTO clicks (link_id, ip_address, country, user_agent, referer) VALUES (?, ?, ?, ?, ?)',
      [link.id, ip, country, req.headers['user-agent'] || '', req.headers['referer'] || '']
    ).catch(() => {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

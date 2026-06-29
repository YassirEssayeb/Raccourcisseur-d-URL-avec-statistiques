import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [formError, setFormError] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const fetchLinks = useCallback(async () => {
    const { data } = await api.get('/links');
    setLinks(data);
  }, []);

  const refreshStats = useCallback(async () => {
    if (selectedLink) {
      try {
        const { data } = await api.get(`/links/${selectedLink}/stats`);
        setStats(data);
      } catch {}
    }
  }, [selectedLink]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLinks();
      refreshStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchLinks, refreshStats]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/links', {
        original_url: url,
        custom_slug: customSlug || undefined,
        expires_at: expiresAt || undefined,
      });
      setUrl('');
      setCustomSlug('');
      setExpiresAt('');
      setShowForm(false);
      setFormError('');
      fetchLinks();
      showToast(`Lien créé → /${data.slug}`);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const handleCopy = (slug) => {
    navigator.clipboard.writeText(`http://localhost:3001/${slug}`);
    showToast('Copié dans le presse-papier !');
  };

  const handleDelete = async (id) => {
    await api.delete(`/links/${id}`);
    if (selectedLink === id) { setSelectedLink(null); setStats(null); }
    fetchLinks();
    showToast('Lien supprimé');
  };

  const viewStats = async (id) => {
    setSelectedLink(id);
    const { data } = await api.get(`/links/${id}/stats`);
    setStats(data);
  };

  const chartData = stats?.clicks_by_day?.map((d) => ({
    date: d.date?.slice(5),
    clics: Number(d.count),
  })) || [];

  return (
    <div className="dashboard">
      <header className="app-bar">
        <div className="app-bar-left">
          <div className="app-logo">✂</div>
          <h1>URL Shortener</h1>
        </div>
        <div className="app-bar-right">
          <span className="user-email">{user?.email}</span>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Nouveau lien'}
          </button>
          <button className="btn btn-secondary" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <div className="dashboard-main">
        {showForm && (
          <form className="create-form" onSubmit={handleCreate}>
            <p className="form-title">Créer un lien raccourci</p>
            <div className="form-group">
              <input type="url" placeholder="URL longue à raccourcir" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <input type="text" placeholder="Slug personnalisé (optionnel)" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
            </div>
            {formError && <p className="error">{formError}</p>}
            <button type="submit" className="btn btn-primary">Créer le lien court</button>
          </form>
        )}

        <div className="dashboard-grid">
          <div>
            <div className="section-header">
              <h2>Mes liens</h2>
              <span className="count">{links.length}</span>
            </div>
            {links.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔗</div>
                <p>Aucun lien pour le moment. Créez votre premier lien !</p>
              </div>
            ) : (
              <div className="links-list">
                {links.map((link) => (
                  <div key={link.id} className={`link-card ${selectedLink === link.id ? 'active' : ''}`}
                    onClick={() => viewStats(link.id)}>
                    <div className="link-info">
                      <div className="link-slug">
                        <span className="domain">localhost:3001/</span>
                        <span className="slug-value">{link.slug}</span>
                        <button className="btn-copy" onClick={(e) => { e.stopPropagation(); handleCopy(link.slug); }}>
                          Copier
                        </button>
                      </div>
                      <p className="link-url">{link.original_url}</p>
                      <div className="link-meta">
                        <span className="click-badge">{link.click_count} clics</span>
                        {link.is_custom ? <span className="badge">Custom</span> : null}
                        {link.expires_at ? <span className="badge badge-expires">Expire le {new Date(link.expires_at).toLocaleDateString()}</span> : null}
                      </div>
                    </div>
                    <button className="btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(link.id); }}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {stats ? (
            <div className="stats-section">
              <div className="section-header">
                <h2>Statistiques <span>/{stats.link?.slug}</span></h2>
              </div>
              <div className="stats-summary">
                <div className="stat-box">
                  <span className="stat-number">{stats.total_clicks}</span>
                  <span className="stat-label">Clics totaux</span>
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="chart-container">
                  <h3>Clics par jour (7 derniers jours)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                      <Line type="monotone" dataKey="clics" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: '#14b8a6', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {stats.countries?.length > 0 && (
                <div className="chart-container">
                  <h3>Pays d'origine</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.countries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis allowDecimals={false} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                      <Legend />
                      <Bar dataKey="count" name="Clics" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {stats.total_clicks === 0 && (
                <div className="empty-state" style={{ marginTop: '1rem' }}>
                  <div className="empty-icon">📊</div>
                  <p>Partagez votre lien pour voir les statistiques</p>
                </div>
              )}
            </div>
          ) : links.length > 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👆</div>
              <p>Cliquez sur un lien pour voir ses statistiques</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className={`toast ${toast ? 'visible' : ''}`}>
        <span className="toast-icon">✓</span>
        {toast}
      </div>
    </div>
  );
}

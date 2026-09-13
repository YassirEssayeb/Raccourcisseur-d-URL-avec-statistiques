-- ============================================================================
-- ShortLink — Données de démonstration
-- ----------------------------------------------------------------------------
-- Utilisateur de test : demo@shortlink.dev / password123
-- ============================================================================

USE url_shortener;

-- Utilisateur de démo
INSERT INTO users (email, password) VALUES
  ('demo@shortlink.dev', '$2a$10$3sE4SUk3jp8fMT6KS6YLRO8wac0yNiEArB9VTRZrYEkb9TO1sX9L2');

-- Liens de démonstration
INSERT INTO links (user_id, slug, original_url, is_custom, expires_at) VALUES
  (1, 'demo01', 'https://www.iana.org/help/example-domains', 0, NULL),
  (1, 'acceuil', 'https://www.iana.org/domains/reserved', 1, NULL),
  (1, 'temp-99', 'https://www.rfc-editor.org/rfc/rfc2606.txt', 0, DATE_ADD(NOW(), INTERVAL 7 DAY));

-- Clics sur les liens (derniers 7 jours)
INSERT INTO clicks (link_id, ip_address, country, user_agent, referer) VALUES
  (1, '196.65.10.1', 'MA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36', 'https://google.com'),
  (1, '196.65.10.1', 'MA', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36', 'https://twitter.com'),
  (1, '51.77.20.5', 'FR', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15', NULL),
  (1, '86.129.0.2', 'GB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36', 'https://linkedin.com'),
  (2, '196.65.10.1', 'MA', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36', 'https://whatsapp.com'),
  (2, '197.201.1.9', 'DZ', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile', NULL),
  (2, '51.91.50.8', 'FR', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36', 'https://facebook.com'),
  (3, '82.66.15.3', 'FR', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36', NULL),
  (3, '105.66.9.14', 'MA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edge/125.0 Safari/537.36', 'https://google.com'),
  (3, '196.65.10.1', 'MA', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36', 'https://instagram.com');
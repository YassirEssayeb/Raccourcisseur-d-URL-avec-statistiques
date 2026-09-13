-- ============================================================================
-- ShortLink — Schéma de base de données (MySQL)
-- ----------------------------------------------------------------------------
-- Tables : users, links, clicks
-- Jeu de caractères : utf8mb4 / collation : unicode_ci (compatible emoji)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS url_shortener
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE url_shortener;

-- ----------------------------------------------------------------------------
-- users : comptes utilisateurs de la plateforme
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  email       VARCHAR(255)     NOT NULL,
  password    VARCHAR(255)     NOT NULL,         -- hash bcrypt
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- links : liens courts créés par les utilisateurs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS links (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED   NOT NULL,
  slug         VARCHAR(20)    NOT NULL,          -- identifiant court unique
  original_url TEXT           NOT NULL,
  is_custom    TINYINT(1)     NOT NULL DEFAULT 0, -- slug choisi par l'utilisateur ?
  expires_at   TIMESTAMP      NULL DEFAULT NULL,  -- NULL = jamais expiré
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_links_slug (slug),
  KEY idx_links_user_id (user_id),
  CONSTRAINT fk_links_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- clicks : historique des redirections (1 ligne par clic)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clicks (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  link_id     INT UNSIGNED   NOT NULL,
  ip_address  VARCHAR(45)    NULL,               -- IPv4 ou IPv6
  country     VARCHAR(100)   NULL,               -- ex. "MA", "FR", "US"
  user_agent  TEXT           NULL,
  referer     TEXT           NULL,
  clicked_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_clicks_link_id (link_id),
  KEY idx_clicks_clicked_at (clicked_at),
  CONSTRAINT fk_clicks_link FOREIGN KEY (link_id)
    REFERENCES links (id) ON DELETE CASCADE
) ENGINE=InnoDB;
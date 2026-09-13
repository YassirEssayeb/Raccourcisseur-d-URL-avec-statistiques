# Base de données

Le projet utilise **MySQL 8** (ou MariaDB ≥ 10.3). La base se nomme `url_shortener`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `migration.sql` | Crée la base et les trois tables. Idempotent, peut être exécuté plusieurs fois. |
| `seed.sql` | Insère un utilisateur et des données de démonstration (optionnel). |

## Installation

```bash
mysql -u root -p < database/migration.sql
mysql -u root -p < database/seed.sql   # optionnel, données de démo
```

## Schéma

```
┌─────────┐       ┌─────────┐       ┌─────────┐
│  users  │ 1 ──── n │  links  │ 1 ──── n │  clicks  │
└─────────┘       └─────────┘       └─────────┘
```

### `users`
Comptes des utilisateurs de la plateforme.

| Colonne | Type | Notes |
|---|---|---|
| `id` | `INT UNSIGNED` | Clé primaire, auto-incrément |
| `email` | `VARCHAR(255)` | Unique |
| `password` | `VARCHAR(255)` | Hash bcrypt |
| `created_at` | `TIMESTAMP` | Date d'inscription |

### `links`
Liens courts créés par les utilisateurs.

| Colonne | Type | Notes |
|---|---|---|
| `id` | `INT UNSIGNED` | Clé primaire |
| `user_id` | `INT UNSIGNED` | FK → `users.id`, cascade |
| `slug` | `VARCHAR(20)` | Identifiant court unique |
| `original_url` | `TEXT` | URL de destination |
| `is_custom` | `TINYINT(1)` | 1 si le slug a été choisi manuellement |
| `expires_at` | `TIMESTAMP` | `NULL` = lien permanent |
| `created_at` | `TIMESTAMP` | Date de création |

### `clicks`
Une ligne par redirection effectuée sur un lien court.

| Colonne | Type | Notes |
|---|---|---|
| `id` | `INT UNSIGNED` | Clé primaire |
| `link_id` | `INT UNSIGNED` | FK → `links.id`, cascade |
| `ip_address` | `VARCHAR(45)` | IPv4 ou IPv6 |
| `country` | `VARCHAR(100)` | Code pays (en-tête `CF-IPCountry`) |
| `user_agent` | `TEXT` | Navigateur / appareil |
| `referer` | `TEXT` | Page d'origine du clic |
| `clicked_at` | `TIMESTAMP` | Date et heure du clic |

## Index et contraintes

- Index unique sur `users.email` et `links.slug` (intégrité + performance des recherches)
- Index sur `links.user_id`, `clicks.link_id` et `clicks.clicked_at` (jointures et agrégats temps réel)
- Suppression d'un utilisateur → suppression en cascade de ses liens et clics
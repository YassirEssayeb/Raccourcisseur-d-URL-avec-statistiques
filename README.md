# ShortLink — Raccourcisseur d'URL avec Statistiques

Application web complète de raccourcissement d'URL avec suivi analytique en temps réel. Créez des liens courts personnalisés, suivez les clics par jour et par pays, et gérez l'expiration de vos liens — le tout derrière une interface moderne et responsive.

## Fonctionnalités

- **Raccourcissement d'URL** : génération automatique de slug ou slug personnalisé
- **Statistiques en temps réel** : nombre total de clics, clics par jour (7 derniers jours), pays d'origine
- **Suivi des clics** : adresse IP, user-agent, referer, pays (via en-tête `CF-IPCountry`)
- **Liens à durée limitée** : expiration automatique programmée
- **Authentification** : inscription / connexion sécurisées (JWT + bcrypt)
- **Tableau de bord** : gestion complète des liens (création, copie, suppression avec confirmation)
- **Design responsif** : optimisé mobile et desktop

## Technologies

### Frontend
| Technologie | Usage |
|---|---|
| React 19 | Interface utilisateur |
| Vite | Build & développement |
| Tailwind CSS 4 | Styles et design system |
| React Router | Navigation |
| Recharts | Graphiques de statistiques |
| Motion | Animations |

### Backend
| Technologie | Usage |
|---|---|
| Node.js + Express | API REST |
| MySQL 2 | Accès base de données |
| JWT + bcryptjs | Authentification sécurisée |
| nanoid | Génération de slugs courts |

## Architecture

```
├── backend/               # API Express
│   ├── controllers/       # Logique métier
│   ├── middleware/        # Auth JWT
│   ├── routes/            # Définition des routes
│   ├── db.js              # Pool de connexions MySQL
│   └── server.js          # Point d'entrée
├── database/              # SQL
│   ├── migration.sql      # Schéma de la base de données
│   └── seed.sql           # Données de démonstration
└── frontend/              # Application React
    ├── src/pages/         # Landing, Login, Register, Dashboard
    ├── src/context/       # Gestion de l'authentification
    └── src/api.js         # Client Axios (JWT interceptor)
```

## Base de données

Le schéma est composé de trois tables :

| Table | Description |
|---|---|
| `users` | Comptes utilisateurs (email + mot de passe haché) |
| `links` | Liens raccourcis (slug, URL d'origine, expiration) |
| `clicks` | Historique des clics (IP, pays, user-agent, referer) |

## Installation

### Prérequis

- **Node.js** ≥ 18
- **MySQL** ≥ 8 (ou MariaDB ≥ 10.3)

### 1. Cloner le dépôt

```bash
git clone <votre-url-git>
cd url-shortener
```

### 2. Configurer la base de données

```bash
mysql -u root -p < database/migration.sql   # création du schéma
mysql -u root -p < database/seed.sql        # données de démo (optionnel)
```

### 3. Configurer le backend

```bash
cd backend
npm install
cp .env.example .env        # puis éditez .env
```

Variables d'environnement :

| Variable | Description | Défaut |
|---|---|---|
| `PORT` | Port du serveur API | `3001` |
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | *(vide)* |
| `DB_NAME` | Nom de la base | `url_shortener` |
| `JWT_SECRET` | Clé secrète JWT | *obligatoire* |

### 4. Lancer le backend

```bash
node server.js
# API disponible sur http://localhost:3001
```

### 5. Configurer et lancer le frontend

```bash
cd frontend
npm install
npm run dev
# Application disponible sur http://localhost:5173
```

> **Windows :** le fichier `start.bat` lance les deux serveurs en une seule commande.

## API

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Créer un compte `{ email, password }` |
| `POST` | `/api/auth/login` | Se connecter `{ email, password }` |
| `GET` | `/api/auth/profile` | Profil de l'utilisateur courant (JWT requis) |

### Liens (JWT requis)

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/links` | Créer un lien `{ original_url, custom_slug?, expires_at? }` |
| `GET` | `/api/links` | Lister les liens de l'utilisateur |
| `GET` | `/api/links/:id/stats` | Statistiques d'un lien (total, par jour, par pays) |
| `DELETE` | `/api/links/:id` | Supprimer un lien |

### Redirection

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/:slug` | Redirige vers l'URL d'origine et enregistre le clic |

**Exemple :** créer un lien

```bash
curl -X POST http://localhost:3001/api/links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://example.com/page"}'
```

## Licence

Ce projet est un exercice personnel. Libre de l'utiliser et de le modifier.
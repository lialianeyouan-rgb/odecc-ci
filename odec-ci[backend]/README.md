# ODEC-CI — Backend (API)

API REST du site ODEC-CI : articles, authentification admin, formulaire de contact, statistiques, envoi d’e-mails (SMTP Namecheap).

---

## Objectif

- Exposer les données (articles) et les actions (contact, auth, stats) via une API REST.
- Sécuriser les routes sensibles (JWT, rate limiting, CORS, Helmet).
- Valider les entrées (Zod), persister en base (Prisma), envoyer les e-mails de contact vers `contact@odec-ci.org`.

---

## Stack technique

| Technologie | Rôle |
|-------------|------|
| **Node.js** | Runtime |
| **Express** 5 | Serveur HTTP, routes, middlewares |
| **Prisma** | ORM, migrations, client MySQL/PostgreSQL |
| **MySQL** | Base de données (recommandé ; PostgreSQL possible) |
| **Zod** | Validation des payloads |
| **JWT** (jsonwebtoken) | Authentification admin |
| **bcrypt** | Hachage des mots de passe admin |
| **Nodemailer** | Envoi d’e-mails (SMTP Namecheap) |
| **Helmet** | En-têtes de sécurité |
| **express-rate-limit** | Limitation du débit (global + par route) |

---

## Structure du projet

```
odec-ci[backend]/
├── config/           # environment.js, db.js (Prisma)
├── middlewares/      # auth (JWT), rate limiters, erreurs, CORS
├── modules/
│   ├── articles/     # CRUD articles (controller, routes, service)
│   ├── auth/         # Login admin (JWT)
│   ├── contact/      # Formulaire contact (validation, DB, envoi mail)
│   └── stats/        # Statistiques dashboard (formulaires, dons, inscrits)
├── prisma/
│   ├── schema.prisma # Modèles : Article, Admin, ContactMessage, Don, Inscription
│   └── migrations/
├── utils/            # httpError, validate (Zod)
├── app.js            # Application Express (routes, CORS, erreurs)
├── server.js         # Démarrage du serveur
└── .env.example      # Modèle des variables d’environnement
```

---

## Installation

**Prérequis :** Node.js 18+, MySQL 8+ (ou PostgreSQL), compte SMTP (ex. Namecheap Private Email).

```bash
cd "odec-ci[backend]"
npm install
cp .env.example .env
# Éditer .env (voir section Variables d’environnement)
npx prisma generate
npx prisma migrate deploy   # ou npx prisma db push en développement
npm run dev                 # Lance l’API (port 5000 par défaut)
```

---

## Variables d’environnement

Créer un fichier `.env` à la racine du backend. Référence : `.env.example`.

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Oui | URL de connexion (ex. `mysql://user:pass@localhost:3306/odec_ci`) |
| `JWT_SECRET` | Oui | Secret pour signer les tokens admin |
| `SMTP_HOST` | Oui (contact) | Ex. `mail.privateemail.com` (Namecheap) |
| `SMTP_PORT` | Non | 465 (SSL) ou 587 (TLS) |
| `SMTP_USER` | Oui | Adresse e-mail d’envoi |
| `SMTP_PASS` | Oui | Mot de passe e-mail |
| `SMTP_FROM` | Non | Adresse « De » (défaut : SMTP_USER) |
| `CONTACT_TO_EMAIL` | Non | Destinataire des messages (défaut : `contact@odec-ci.org`) |
| `PORT` | Non | Port du serveur (défaut : 5000) |
| `NODE_ENV` | Non | `development` / `production` |
| `CORS_ORIGIN` | Non | Origines CORS autorisées, séparées par des virgules |

---

## Routes API

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/health` | Santé de l’API | Non |
| GET | `/api/articles` | Liste des articles | Non |
| POST | `/api/articles` | Créer un article | JWT |
| PUT | `/api/articles/:id` | Modifier un article | JWT |
| DELETE | `/api/articles/:id` | Supprimer un article | JWT |
| POST | `/api/auth/login` | Connexion admin (username, password) | Non |
| POST | `/api/contact` | Envoi formulaire contact (validation, DB, mail) | Non (rate limité) |
| GET | `/api/stats` | Statistiques (formulaires, dons, inscrits) | JWT |

---

## Base de données (Prisma)

- **Modèles principaux :** Article, Admin, ContactMessage, Don, Inscription.
- **Migrations :** `npx prisma migrate deploy` en production.
- **MySQL :** dans `schema.prisma`, `provider = "mysql"` et `url = env("DATABASE_URL")`.

---

## Sécurité

- **Authentification** : JWT pour les routes admin ; token dans l’en-tête `Authorization: Bearer <token>`.
- **Validation** : Zod sur les body (contact, login).
- **Rate limiting** : global + renforcé sur `/api/auth/login` et `/api/contact`.
- **CORS** : origines configurées via `CORS_ORIGIN` (et localhost en dev).
- **Helmet** : en-têtes sécurisés (CSP désactivée si besoin pour le front).

---

## Contribution

Respecter les conventions du projet (ESM, structure modules, erreurs HTTP via `createHttpError`). Pour les changements d’API ou de schéma, ouvrir une issue ou contacter les mainteneurs.

---

## Licence

Projet propriétaire — ODEC-CI. Tous droits réservés.

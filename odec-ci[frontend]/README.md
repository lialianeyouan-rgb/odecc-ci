# ODEC-CI — Frontend

Interface utilisateur du site officiel ODEC-CI : site vitrine et tableau de bord d’administration.

---

## Objectif

- **Site public** : pages institutionnelles (accueil, à propos, président, actions, actualités, contact, soutien).
- **Espace admin** : connexion sécurisée, gestion des articles, statistiques (formulaires, dons, inscriptions).
- Design cohérent avec la charte ODEC-CI (couleurs, typographie, espacements).

---

## Stack technique

| Technologie | Rôle |
|-------------|------|
| **React** 19 | UI, composants |
| **TypeScript** | Typage statique |
| **Vite** 6 | Build, dev server, proxy API |
| **React Router** 7 | Routage SPA |
| **Tailwind CSS** (CDN) | Styles, design system ODEC (bleu / or) |
| **Polices** | Inter, Montserrat (Google Fonts) |

---

## Structure du projet

```
odec-ci[frontend]/
├── components/       # Composants réutilisables (Header, Footer, ContactForm, Toast, Logo…)
├── pages/           # Pages par route (HomePage, ContactPage, Admin/*…)
├── services/        # Appels API (apiClient, authService, contactService, statsService, contentService)
├── types.ts         # Types TypeScript partagés
├── index.tsx        # Point d’entrée React
├── index.html       # HTML + config Tailwind (couleurs, polices)
├── index.css        # Styles globaux, animations
├── vite.config.ts   # Vite + alias @/, proxy /api
└── package.json
```

---

## Installation

**Prérequis :** Node.js 18+, npm 9+.

```bash
cd "odec-ci[frontend]"
npm install
```

### Variables d’environnement

Créer un fichier `.env` à la racine du frontend si besoin :

- `VITE_API_BASE_URL` : URL de base de l’API (ex. `https://api.odec-ci.org`).  
  En dev, laisser vide pour utiliser le proxy Vite (`/api` → `http://localhost:5000`).

```bash
npm run dev      # Démarre le serveur de dev (port 3000 par défaut)
npm run build    # Build de production → dossier dist/
npm run preview  # Prévisualisation du build
npm run typecheck # Vérification TypeScript
```

---

## Design system (ODEC-CI)

- **Couleurs** (définies dans `index.html`, config Tailwind) :
  - Bleu : `odec-blue-900` (#0A2463), `odec-blue-800`, `odec-blue-700`
  - Or : `odec-gold-500` (#FFD700), `odec-gold-600`
- **Typographie** : `font-montserrat` pour les titres, `font-sans` (Inter) pour le corps.
- **Composants** : boutons primaires (or), liens (bleu/or au survol), cartes avec bordures et ombres cohérentes.

---

## Routes

| Route | Description | Accès |
|-------|-------------|--------|
| `/` | Accueil | Public |
| `/a-propos` | À propos | Public |
| `/le-president` | Le président | Public |
| `/actions-plaidoyer` | Actions & plaidoyer | Public |
| `/actualites` | Actualités & communiqués | Public |
| `/contact` | Formulaire de contact | Public |
| `/soutenir` | Soutenir l’ODEC | Public |
| `/admin/login` | Connexion admin | Public (formulaire) |
| `/admin` | Dashboard admin | Protégé (JWT) |

---

## Contribution

Respecter les conventions du projet (nommage des composants, usage du design system, typage TypeScript). Pour les changements majeurs, ouvrir une issue ou contacter les mainteneurs.

---

## Licence

Projet propriétaire — ODEC-CI. Tous droits réservés.

# Checklist pré-déploiement — ODEC-CI

Checklist exhaustive à valider avant la mise en ligne du site et de l’API sur l’hébergement (Namecheap ou autre).

---

## 1. Variables d’environnement

### Backend (serveur)

- [ ] **DATABASE_URL** : URL MySQL (ou PostgreSQL) correcte pour l’environnement de production (hébergeur, base dédiée).
- [ ] **JWT_SECRET** : Secret fort et unique (min. 32 caractères aléatoires), jamais commité.
- [ ] **SMTP_HOST**, **SMTP_USER**, **SMTP_PASS** : Compte e-mail d’envoi (ex. Namecheap Private Email) testé (envoi réel).
- [ ] **CONTACT_TO_EMAIL** : `contact@odec-ci.org` (ou adresse validée).
- [ ] **NODE_ENV** : `production` sur le serveur.
- [ ] **CORS_ORIGIN** : Liste des origines autorisées (ex. `https://odec-ci.org`, `https://www.odec-ci.org`) sans espaces superflus.
- [ ] **PORT** : Cohérent avec la configuration du serveur / reverse proxy (ex. 5000 ou port fourni par l’hébergeur).
- [ ] Fichier **.env** absent du dépôt Git et présent uniquement sur le serveur (ou dans un gestionnaire de secrets).

### Frontend (build)

- [ ] **VITE_API_BASE_URL** : En production, définir l’URL complète de l’API (ex. `https://api.odec-ci.org` ou `https://odec-ci.org/api`) si différente de l’origine du site.
- [ ] Aucune clé API ou secret dans le code ou dans des variables d’environnement exposées au client.

---

## 2. Build de production

- [ ] **Backend** : `npm install --omit=dev` (ou `npm ci --omit=dev`) sur le serveur ; pas de dépendances de dev en production.
- [ ] **Frontend** : `npm run build` exécuté sans erreur ; dossier **dist/** généré.
- [ ] **TypeScript** : `npm run typecheck` (frontend) sans erreur.
- [ ] Vérifier que le build frontend pointe bien vers l’API de production (VITE_API_BASE_URL utilisée au build).

---

## 3. Base de données

- [ ] Base MySQL (ou PostgreSQL) créée sur l’hébergement.
- [ ] Utilisateur DB avec droits limités (SELECT, INSERT, UPDATE, DELETE sur la base concernée).
- [ ] **Prisma** : `npx prisma generate` exécuté après installation des dépendances.
- [ ] **Prisma** : `npx prisma migrate deploy` exécuté une fois (migrations appliquées) ; pas de `db push` en production.
- [ ] Au moins un compte **Admin** créé (via script ou manuellement) pour la connexion au dashboard.

---

## 4. Sécurité des routes API

- [ ] Routes **/api/articles** (POST, PUT, DELETE) et **/api/stats** protégées par JWT (middleware `protect`).
- [ ] Route **/api/contact** en POST uniquement, avec rate limiting actif.
- [ ] Route **/api/auth/login** avec rate limiting pour limiter le brute force.
- [ ] CORS configuré pour n’accepter que les origines autorisées (pas `*` en production).
- [ ] Helmet activé (sans désactiver inutilement les en-têtes de sécurité).

---

## 5. Formulaires et fonctionnalités métier

- [ ] **Formulaire de contact** : envoi réussi (message reçu sur CONTACT_TO_EMAIL), enregistrement en base (table ContactMessage).
- [ ] **Connexion admin** : login avec un compte Admin valide, redirection vers /admin, accès aux articles et aux stats.
- [ ] **Déconnexion** : logout et redirection vers /admin/login ; token supprimé côté client.
- [ ] **Dashboard** : statistiques (formulaires, dons, inscrits) chargées sans erreur pour un admin connecté.
- [ ] **Articles** : création, édition, suppression depuis le dashboard ; affichage correct sur la page Actualités.

---

## 6. Erreurs et pages 404

- [ ] **Frontend** : route inconnue (ex. `/page-inexistante`) renvoie une page 404 ou un composant « Page non trouvée » (selon configuration React Router).
- [ ] **Backend** : route API inconnue (ex. GET `/api/unknown`) renvoie 404 avec un format JSON cohérent (middleware notFound).
- [ ] **Backend** : erreurs 500 gérées par le middleware d’erreur (pas de stack trace exposée au client en production).

---

## 7. Images et assets

- [ ] Images du site (logo, visuels) chargées correctement après déploiement (chemins relatifs ou URL absolues valides).
- [ ] Pas d’images excessivement lourdes ; compression effectuée si besoin (formats WebP, tailles raisonnables).
- [ ] Si upload d’images (articles) : stockage sécurisé (ex. Cloudinary ou dossier serveur hors webroot) et validation des types/tailles côté backend.

---

## 8. Performance et SEO (recommandations)

- [ ] Build frontend minifié (Vite le fait par défaut en production).
- [ ] Métadonnées (titres, description) présentes sur les pages principales (index.html ou balises dynamiques).
- [ ] Pas de ressources bloquantes inutiles au premier chargement.

---

## 9. SSL et domaine

- [ ] **SSL/TLS** : site et API accessibles en **HTTPS** (certificat valide).
- [ ] **Domaine** : noms configurés (ex. `odec-ci.org`, `www.odec-ci.org`, éventuellement `api.odec-ci.org`) et DNS pointant vers l’hébergement.
- [ ] Redirection HTTP → HTTPS activée si l’hébergeur le permet.

---

## 10. Surveillance et sauvegardes

- [ ] Stratégie de **sauvegarde** de la base de données (quotidienne ou selon l’offre Namecheap).
- [ ] Logs d’erreur du serveur accessibles (cPanel, SSH ou outil fourni par l’hébergeur).
- [ ] Endpoint **/api/health** vérifié (ex. par un monitoring externe ou un cron).

---

## Résumé de validation

| Catégorie | Statut |
|-----------|--------|
| Variables d’environnement | ☐ |
| Build production | ☐ |
| Base de données | ☐ |
| Sécurité API | ☐ |
| Formulaires & métier | ☐ |
| 404 & erreurs | ☐ |
| Images & assets | ☐ |
| SSL & domaine | ☐ |
| Sauvegardes & logs | ☐ |

Une fois tous les points cochés, le déploiement peut être considéré comme prêt pour la mise en ligne. Pour la procédure détaillée sur Namecheap, voir [DEPLOIEMENT-NAMECHEAP.md](DEPLOIEMENT-NAMECHEAP.md).

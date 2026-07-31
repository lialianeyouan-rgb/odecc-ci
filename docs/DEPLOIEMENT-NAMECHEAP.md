# Guide de déploiement ODEC-CI sur Namecheap

Procédure pas à pas pour déployer le projet ODEC-CI (frontend + backend) sur un hébergement Namecheap (Shared Hosting avec Node.js ou VPS).

---

## Vue d’ensemble

- **Frontend** : build Vite (dossier `dist/`) servi soit par le serveur web (Apache/Nginx), soit par le même hébergeur que l’API.
- **Backend** : application Node.js (Express) exécutée via « Setup Node.js App » (cPanel) ou via PM2/systemd (VPS/SSH).
- **Base de données** : MySQL créée dans cPanel (Shared) ou sur le VPS.
- **E-mail** : SMTP Namecheap (Private Email ou compte e-mail du domaine) pour le formulaire de contact.

---

## Partie A — Domaine et SSL

### 1. Domaine

1. Dans **Namecheap** : **Domain List** → sélectionner le domaine (ex. `odec-ci.org`).
2. **Advanced DNS** (ou **Manage** → **Nameservers** si vous utilisez les DNS Namecheap) :
   - **A Record** : `@` → IP du serveur d’hébergement (fournie par Namecheap après achat d’hébergement).
   - **CNAME** (optionnel) : `www` → `odec-ci.org` ou vers le même serveur.
3. Attendre la propagation DNS (quelques minutes à 48 h).

### 2. SSL (HTTPS)

**Shared Hosting (cPanel) :**

1. Se connecter à **cPanel**.
2. Section **Security** → **SSL/TLS Status** ou **AutoSSL**.
3. Activer SSL pour le domaine (Let’s Encrypt / AutoSSL si disponible).
4. Forcer HTTPS : **Redirects** ou **.htaccess** (voir partie G).

**VPS :**  
Configurer Nginx/Apache avec un certificat (Let’s Encrypt avec Certbot, ou certificat fourni par Namecheap).

---

## Partie B — Base de données MySQL (cPanel)

### 1. Créer la base et l’utilisateur

1. **cPanel** → **Databases** → **MySQL® Databases**.
2. **Create a New Database** : nom (ex. `odecci_db`). Notez le préfixe (ex. `cpaneluser_`) → nom complet : `cpaneluser_odecci_db`.
3. **MySQL Users** : créer un utilisateur (ex. `odecci_user`) avec un mot de passe fort. Notez le nom complet (ex. `cpaneluser_odecci_user`).
4. **Add User To Database** : associer l’utilisateur à la base ; accorder **ALL PRIVILEGES**.
5. **DATABASE_URL** pour Prisma :
   ```text
   mysql://cpaneluser_odecci_user:MOT_DE_PASSE@localhost:3306/cpaneluser_odecci_db
   ```
   (Remplacer `MOT_DE_PASSE` et les noms réels.)

**VPS :** Créer la base et l’utilisateur en SSH (`mysql -u root -p` puis `CREATE DATABASE`, `CREATE USER`, `GRANT`).

---

## Partie C — Fichier .env sur le serveur

### 1. Où placer le .env

- **Shared (Node.js App cPanel)** : dans le répertoire racine de l’application Node (ex. `odec-ci-backend` ou `nodeapp`).
- **VPS** : dans le dossier du projet backend (ex. `/home/odec/odec-ci[backend]`).

### 2. Contenu minimal (backend)

Créer un fichier `.env` à la racine du backend avec :

```env
NODE_ENV=production
PORT=5000

DATABASE_URL="mysql://cpaneluser_odecci_user:MOT_DE_PASSE@localhost:3306/cpaneluser_odecci_db"

JWT_SECRET="votre_secret_jwt_long_et_aleatoire_32_caracteres_min"

SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=contact@odec-ci.org
SMTP_PASS=mot_de_passe_email
SMTP_FROM=contact@odec-ci.org
CONTACT_TO_EMAIL=contact@odec-ci.org

CORS_ORIGIN=https://odec-ci.org,https://www.odec-ci.org
```

- Adapter **DATABASE_URL** (préfixe cPanel, mot de passe).
- **JWT_SECRET** : générer une chaîne aléatoire (openssl, etc.).
- **SMTP** : utiliser les identifiants du compte e-mail Namecheap (Private Email ou e-mail du domaine).

---

## Partie D — Setup Node.js App (cPanel Shared Hosting)

Namecheap Shared avec cPanel propose souvent **Setup Node.js App** (ou **Application Manager**).

### 1. Créer l’application Node.js

1. **cPanel** → **Setup Node.js App** (ou **Software** → **Setup Node.js App**).
2. **Create Application** :
   - **Node.js version** : 18 ou 20 LTS.
   - **Application root** : ex. `odec-ci-backend` (dossier qui contiendra le backend).
   - **Application URL** : ex. `odec-ci.org` avec un sous-dossier comme `/api` ou un sous-domaine (ex. `api.odec-ci.org`) selon la config.
3. Créer l’application.

### 2. Déployer le code backend

**Option A — Upload (FTP / File Manager)**  
- Zipper le contenu de `odec-ci[backend]` (sans `node_modules`, sans `.env` à transférer en clair ; créer `.env` directement sur le serveur).
- Envoyer l’archive dans le répertoire de l’application Node.
- Extraire (File Manager → Extract).

**Option B — Git (si disponible)**  
- En SSH ou dans le terminal cPanel (si fourni) :  
  `cd node_application_folder`  
  `git clone <repo> .`  
  Puis créer `.env` manuellement.

### 3. Installer les dépendances et Prisma

Dans le **terminal** de l’application Node (cPanel fournit souvent un onglet **Run NPM Install** ou une console) :

```bash
cd /home/cpaneluser/odec-ci-backend   # chemin réel fourni par cPanel
npm install --omit=dev
npx prisma generate
npx prisma migrate deploy
```

- Si `migrate deploy` échoue (pas de migrations), utiliser une fois `npx prisma db push` pour créer les tables (à éviter ensuite en production si vous utilisez des migrations).

### 4. Démarrer / redémarrer l’app

- Dans **Setup Node.js App** : bouton **Run NPM Install** si besoin, puis **Start App** ou **Restart**.
- **Application startup file** : indiquer `server.js` (ou le fichier qui lance Express).
- Vérifier les **logs** en cas d’erreur (port, DATABASE_URL, etc.).

### 5. URL de l’API

- Si l’app est montée sur `https://odec-ci.org/api` : l’API sera par ex. `https://odec-ci.org/api/articles`, `https://odec-ci.org/api/contact`, etc.
- Si vous utilisez un sous-domaine `api.odec-ci.org` : configurer le sous-domaine dans cPanel et pointer l’application Node dessus. L’API sera alors `https://api.odec-ci.org`.

---

## Partie E — Déploiement via SSH (VPS Namecheap)

Si vous avez un VPS sous Namecheap :

### 1. Connexion et préparation

```bash
ssh utilisateur@votre-ip
```

Installer Node.js 20 LTS et MySQL si nécessaire.

### 2. Cloner le projet et configurer le backend

```bash
cd /var/www   # ou répertoire choisi
git clone <url-repo> odec-ci
cd odec-ci/odec-ci[backend]
```

Créer le fichier `.env` (voir Partie C).

```bash
npm install --omit=dev
npx prisma generate
npx prisma migrate deploy
```

### 3. Lancer l’API en permanence (PM2)

```bash
npm install -g pm2
pm2 start server.js --name odec-api
pm2 save
pm2 startup
```

Configurer Nginx (ou Apache) en reverse proxy vers `http://127.0.0.1:5000` (voir partie G).

---

## Partie F — Frontend (build / dist)

### 1. Build local ou sur le serveur

En local (recommandé) :

```bash
cd odec-ci[frontend]
# Si l’API est sur le même domaine (ex. odec-ci.org/api) :
# ne pas définir VITE_API_BASE_URL ou mettre VITE_API_BASE_URL=/api
# Si l’API est sur api.odec-ci.org :
# export VITE_API_BASE_URL=https://api.odec-ci.org
npm run build
```

Le dossier **dist/** est généré.

### 2. Déployer le contenu de dist/

**Shared Hosting (cPanel) :**

- **File Manager** → aller au répertoire du domaine (ex. `public_html` pour `odec-ci.org`).
- Supprimer ou sauvegarder l’ancien contenu.
- Uploader **tout le contenu** de `dist/` (index.html, assets/, etc.) dans ce répertoire.
- Pour une SPA (React Router) : configurer une règle de réécriture pour que toutes les routes renvoient `index.html` (voir partie G).

**VPS :**  
Copier le contenu de `dist/` vers le répertoire servi par Nginx/Apache (ex. `/var/www/odec-ci/frontend`).

### 3. Lien avec l’API

- Si le site est sur `https://odec-ci.org` et l’API sur `https://odec-ci.org/api` : au build, laisser `VITE_API_BASE_URL` vide ou `/api` pour que les appels aillent vers le même domaine.
- Si l’API est sur `https://api.odec-ci.org` : définir `VITE_API_BASE_URL=https://api.odec-ci.org` **avant** `npm run build`, puis redéployer le contenu de `dist/`.

---

## Partie G — Réécriture SPA et HTTPS (Apache/cPanel)

Dans la racine du site (ex. `public_html`), créer ou modifier un fichier **.htaccess** :

```apache
# Forcer HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA : toutes les routes non-fichiers vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Cela permet à React Router de gérer les routes (/, /contact, /admin, etc.) sans 404.

---

## Partie H — Récapitulatif des commandes (serveur)

**Backend (une fois le code et .env en place) :**

```bash
cd chemin/odec-ci[backend]
npm install --omit=dev
npx prisma generate
npx prisma migrate deploy
# Puis démarrer l’app (cPanel : Start App ; VPS : pm2 start server.js --name odec-api)
```

**Frontend (en local avant upload) :**

```bash
cd odec-ci[frontend]
# Optionnel : export VITE_API_BASE_URL=https://...
npm run build
# Upload du contenu de dist/ vers public_html (ou équivalent)
```

---

## Partie I — Vérifications finales

1. **https://odec-ci.org** : page d’accueil s’affiche.
2. **https://odec-ci.org/contact** : formulaire s’affiche ; envoi d’un message de test → réception sur CONTACT_TO_EMAIL.
3. **https://odec-ci.org/admin/login** : connexion avec un compte Admin → accès au dashboard et aux stats.
4. **https://odec-ci.org/actualites** : liste des articles (si des données existent).
5. **API** : `https://odec-ci.org/api/health` (ou `https://api.odec-ci.org/api/health`) renvoie `{"status":"ok"}`.

En cas d’erreur, consulter les logs Node (cPanel ou `pm2 logs`) et les logs Apache/Nginx, ainsi que la [CHECKLIST-PRE-DEPLOIEMENT.md](CHECKLIST-PRE-DEPLOIEMENT.md).

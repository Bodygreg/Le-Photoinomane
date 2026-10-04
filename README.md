# Le Photoïnomane

Site d'exposition photo à vocation artistique et documentaire. Les photos sont regroupées par **séries** (un événement, une idée, un moment précis). Le site est pensé « mobile first » mais soigné aussi sur grand écran, avec un design sombre et minimaliste, et traduit en quatre langues (français, anglais, russe, chinois).

- Site en ligne : https://le-photoinomane.vercel.app
- Dépôt : https://github.com/Bodygreg/Le-Photoinomane

## Sommaire

1. [Fonctionnalités](#fonctionnalités)
2. [Architecture et stack](#architecture-et-stack)
3. [Structure du dépôt](#structure-du-dépôt)
4. [Prérequis](#prérequis)
5. [Démarrage en local](#démarrage-en-local)
6. [Variables et secrets](#variables-et-secrets)
7. [Base de données](#base-de-données)
8. [Déploiement en production](#déploiement-en-production)
9. [Espace administrateur](#espace-administrateur)
10. [API](#api)
11. [Sécurité](#sécurité)
12. [Dépannage](#dépannage)
13. [Limites connues et pistes d'amélioration](#limites-connues-et-pistes-damélioration)

## Fonctionnalités

**Côté visiteur**

- Page d'accueil : liste des séries (photo de couverture, titre, extrait), en une colonne sur mobile et deux colonnes sur grand écran.
- Page détail d'une série : diaporama (flèches, lecture automatique avec pause), légende de la photo, description complète.
- Page contact : formulaire email + message, enregistré en base et notifié par email à l'administrateur.
- Livre d'or : consultation des messages validés (tri par date, inversible) et écriture d'un message, publié seulement après validation.
- Page à propos : présentation de l'auteur.
- Interface en 4 langues (Fr, Eng, Рус, 中文), le choix est mémorisé dans le navigateur.

**Côté administrateur**

- Accès discret (aucun lien visible), protégé par un mot de passe.
- Modération du livre d'or : approuver ou refuser les messages en attente.
- Gestion des séries : créer, modifier, supprimer, envoyer plusieurs photos à la fois, choisir la photo de couverture.
- Traduction automatique du contenu des séries vers l'anglais, le russe et le chinois (DeepL). L'administration reste en français.

## Architecture et stack

```
Navigateur ──► Vercel (frontend React)
                  │  réécriture /api/*  (vercel.json)
                  ▼
               Railway (API Express) ──► PostgreSQL (Railway, réseau privé)
                  ├──► Cloudinary  (stockage des images)
                  ├──► Resend      (emails de contact)
                  └──► DeepL       (traduction du contenu)
```

| Couche | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router 7, i18next / react-i18next, CSS (variables, Flexbox, Grid) |
| Backend | Node.js 22, Express 5, Prisma 7 (ORM), cookie-parser, jsonwebtoken, multer, Helmet, express-rate-limit, cors |
| Base de données | PostgreSQL 16 |
| Services externes | Cloudinary, Resend, DeepL |
| Conteneurs | Docker et Docker Compose (développement local) |
| Hébergement | Vercel (frontend), Railway (backend et base de données) |

Un seul langage, **JavaScript**, est utilisé partout.

Le frontend et l'API sont sur deux domaines différents. Pour que le cookie de session reste un cookie « de même site » (donc accepté par les navigateurs), les appels `/api/*` passent par le domaine Vercel, qui les relaie vers Railway (voir [Déploiement](#déploiement-en-production)).

## Structure du dépôt

```
le-photoinomane/
├── docker-compose.yml        # 3 services : db, backend, frontend
├── .env                      # identifiants de la base (non versionné)
├── frontend/
│   ├── Dockerfile
│   ├── vercel.json           # relais /api/* vers Railway + routage SPA
│   ├── .env                  # VITE_API_URL
│   └── src/
│       ├── main.jsx, App.jsx, i18n.js, adminApi.js
│       ├── components/       # Navbar, Footer, SeriesCard, AdminLoginModal, AdminRoute
│       ├── pages/            # Home, SeriesDetail, Contact, GuestBook, About
│       │   └── admin/        # AdminDashboard, AdminGuestbook, AdminSeries
│       └── locales/          # fr.json, en.json, ru.json, zh.json
└── backend/
    ├── Dockerfile
    ├── prisma.config.ts      # configuration Prisma 7 (URL de la base, seed)
    ├── prisma/
    │   ├── schema.prisma     # modèle de données
    │   ├── migrations/       # historique des migrations
    │   └── seed.js           # données de test
    └── src/
        ├── server.js         # point d'entrée Express
        ├── prisma.js, cloudinary.js, resend.js, deepl.js   # clients des services
        ├── routes/           # quelle URL déclenche quelle fonction
        ├── controllers/      # logique métier
        ├── middleware/       # auth (cookie), limitation de débit
        └── utils/            # translateSeries.js (traduction DeepL)
```

## Prérequis

- **Docker Desktop**, avec le moteur **démarré** avant toute commande `docker`.
- **Git**.
- **Node.js 22 ou plus** et npm, uniquement pour lancer des commandes Prisma depuis votre machine (seed, nouvelle migration).
- Des comptes (gratuits) chez : Cloudinary, Resend, DeepL, Railway, Vercel et GitHub.

## Démarrage en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Bodygreg/Le-Photoinomane.git
cd Le-Photoinomane
```

### 2. Créer les trois fichiers `.env`

Aucun n'est versionné. Le détail de chaque variable est dans [Variables et secrets](#variables-et-secrets).

**`.env` (à la racine)**, lu par `docker-compose.yml` :

```
DB_USER=photoinomane_user
DB_PASSWORD=choisir_un_mot_de_passe
DB_NAME=photoinomane_db
```

**`backend/.env`** :

```
DATABASE_URL="postgresql://photoinomane_user:choisir_un_mot_de_passe@localhost:5432/photoinomane_db"
ADMIN_PASSWORD=choisir_un_mot_de_passe_admin
JWT_SECRET=une_longue_chaine_aleatoire
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
ADMIN_EMAIL=email_du_compte_resend@exemple.com
DEEPL_API_KEY=...
```

**`frontend/.env`** :

```
VITE_API_URL=http://localhost:3000
```

### 3. Lancer les trois services

Depuis la **racine** du projet :

```bash
docker compose up -d --build
```

| Service | Adresse | Rôle |
| --- | --- | --- |
| frontend | http://localhost:5173 | site React (Vite) |
| backend | http://localhost:3000 | API Express |
| db | localhost:5432 | PostgreSQL 16 |

Au démarrage, le conteneur backend applique automatiquement les migrations en attente (`prisma migrate deploy`), puis lance le serveur. Pas de commande de migration à lancer pour une première installation.

### 4. (Optionnel) Insérer des données de test

```bash
cd backend
npm install
npx prisma db seed
```

> **Attention** : le script `prisma/seed.js` **supprime toutes les séries et photos existantes** avant d'insérer deux séries de démonstration (images `placehold.co`). À ne jamais lancer sur la base de production.

### Commandes Docker utiles

| Commande | Effet |
| --- | --- |
| `docker ps` | liste les conteneurs actifs |
| `docker compose logs backend` | logs du backend (à consulter en premier en cas d'erreur) |
| `docker compose restart frontend` | redémarre un service (utile si le rechargement automatique ne détecte pas un nouveau fichier) |
| `docker compose up -d --build --renew-anon-volumes` | reconstruit les images **et** réinstalle les dépendances (obligatoire après l'ajout d'un paquet npm) |
| `docker compose down` | arrête et supprime les conteneurs, conserve la base |
| `docker compose down -v` | idem, **et supprime le volume de la base : toutes les données sont perdues** |

> Le backend et le frontend ont chacun leur propre `node_modules` dans un volume Docker. Après l'ajout d'une dépendance, un simple `--build` ne suffit pas : ajoutez `--renew-anon-volumes`, sinon l'ancien dossier écrase le nouveau.

> Le backend tourne avec `node` (sans rechargement automatique) : après une modification du code backend, faites `docker compose restart backend`.

## Variables et secrets

Ne **jamais** versionner un fichier `.env`. Pour générer une valeur aléatoire pour `JWT_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Backend (`backend/.env` en local, variables du service sur Railway)

| Variable | Rôle | Local | Production (Railway) |
| --- | --- | --- | --- |
| `DATABASE_URL` | connexion PostgreSQL | pour les commandes Prisma lancées depuis votre machine (`localhost`). Docker la remplace par `db` pour le conteneur | URL **privée** de la base (`...railway.internal`) |
| `ADMIN_PASSWORD` | mot de passe de l'espace admin | oui | oui |
| `JWT_SECRET` | clé de signature de la session | oui | oui (valeur différente du local) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | stockage des images | oui | oui |
| `RESEND_API_KEY` | envoi des emails | oui | oui |
| `ADMIN_EMAIL` | destinataire des messages de contact | oui | oui |
| `DEEPL_API_KEY` | traduction automatique | oui | oui |
| `FRONTEND_URL` | origine autorisée par CORS (ex. `https://le-photoinomane.vercel.app`, sans `/` final) | inutile (`localhost:5173` est toujours autorisé) | **obligatoire** |
| `COOKIE_SECURE` | `true` : le cookie de session ne voyage qu'en HTTPS | absent | `true` |
| `PORT` | port d'écoute | `3000` par défaut | fourni par Railway |

> Le fichier `backend/.env` est lu par Docker Compose (`env_file`) : n'y collez jamais de syntaxe Railway du type `${{...}}`, Compose refuserait de démarrer.

### Frontend (`frontend/.env` en local, variables du projet sur Vercel)

| Variable | Local | Production (Vercel) |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | l'adresse du site Vercel lui-même (`https://le-photoinomane.vercel.app`) : les appels passent par le relais de `vercel.json` |

Vite intègre cette valeur **au moment du build** : après toute modification sur Vercel, il faut redéployer.

## Base de données

### Modèle de données (`backend/prisma/schema.prisma`)

| Table | Champs principaux |
| --- | --- |
| `Series` | `title`, `excerpt`, `description`, `translations` (JSON : `en`, `ru`, `zh`), `createdAt` |
| `Photo` | `url` (Cloudinary), `caption` (optionnelle), `order`, `seriesId` |
| `GuestbookEntry` | `text`, `status` (`PENDING`, `APPROVED`, `REJECTED`), `createdAt` |
| `ContactMessage` | `email`, `message`, `createdAt` |

Une série contient plusieurs photos ; supprimer une série supprime ses photos (`onDelete: Cascade`). La photo de couverture est celle dont `order` vaut 0.

### Modifier le schéma

1. Modifier `backend/prisma/schema.prisma`.
2. Depuis `backend/` : `npx prisma migrate dev --name description_du_changement` (crée la migration et l'applique à la base locale).
3. Depuis la racine : `docker compose up -d --build --renew-anon-volumes` (régénère le client Prisma dans le conteneur).
4. Commit et push : en production, la migration s'applique toute seule au prochain démarrage du backend.

### Consulter la base

- **En local** : TablePlus (ou équivalent), hôte `localhost`, port `5432`, identifiants du `.env` racine.
- **En production** : l'accès public à la base est désactivé volontairement. Pour l'inspecter ponctuellement, utiliser le tunnel chiffré du CLI Railway : `railway connect <nom-du-service-postgres> --tunnel-only`.

### Prisma 7 : points d'attention

- Le projet utilise **Prisma 7** (stable). Ne pas passer à la version 8 tant qu'elle est en « release candidate ».
- Prisma 7 exige un **driver adapter** (`@prisma/adapter-pg`, déjà configuré dans `src/prisma.js`) et lit l'adresse de la base dans `prisma.config.ts`.
- npm peut bloquer les scripts d'installation de certains paquets. Si `prisma` ou `@prisma/engines` sont signalés comme bloqués : `npm install-scripts approve prisma` puis `npm install-scripts approve @prisma/engines`.

## Déploiement en production

Il y a une dépendance circulaire à connaître : `vercel.json` a besoin de l'adresse de l'API (Railway), et l'API a besoin de l'adresse du site (Vercel) pour CORS. L'ordre ci-dessous la résout.

### Étape 1 : la base de données et l'API sur Railway

1. Sur [railway.com](https://railway.com), créer un projet, puis **+ New → Database → PostgreSQL**.
2. **+ New → GitHub Repo**, choisir ce dépôt. Dans **Settings** du service :
   - **Root Directory** : `backend`
   - **Builder** : Dockerfile (détecté automatiquement)
3. Dans **Variables**, ajouter toutes les variables du tableau Backend ci-dessus, sauf `FRONTEND_URL` pour l'instant. Pour `DATABASE_URL`, utiliser l'URL **privée** du service PostgreSQL (celle qui contient `railway.internal`).
4. Dans **Settings → Networking → Generate Domain**, renseigner comme *Target port* le port affiché dans les logs de démarrage (`Serveur backend démarré sur le port ...`, Railway fournit la variable `PORT`).
5. Au déploiement, le conteneur exécute `prisma migrate deploy` puis démarre le serveur (commande `CMD` du `backend/Dockerfile`).
6. Vérifier : `https://<votre-domaine-railway>/` doit répondre `{"message":"API Le Photoïnomane opérationnelle"}`, et `/api/series` un tableau (vide au départ).

N'activez **pas** l'accès public (TCP Proxy) de la base : le backend utilise le réseau privé.

### Étape 2 : le frontend sur Vercel

1. Dans `frontend/vercel.json`, remplacer l'adresse de destination par **votre** domaine Railway :

   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://<votre-domaine-railway>/api/:path*"
       },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

   L'ordre compte : `/api/*` est relayé vers Railway, toutes les autres adresses renvoient `index.html` (sans cette règle, recharger `/admin` donne une erreur 404 car cette page n'existe que côté React Router).

2. Sur [vercel.com](https://vercel.com), **Add New → Project**, choisir ce dépôt :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite (détecté automatiquement)
3. Dans **Environment Variables** : `VITE_API_URL` = l'adresse du site Vercel (`https://<votre-projet>.vercel.app`), de type **Config** (et non Secret, le préfixe `VITE_` étant public par nature). Si l'adresse n'est connue qu'après le premier déploiement, redéployer ensuite **sans le cache de build**.
4. Commit et push : Vercel déploie.

### Étape 3 : relier les deux

Sur Railway, ajouter dans les variables du backend :

```
FRONTEND_URL=https://<votre-projet>.vercel.app
COOKIE_SECURE=true
```

Les modifications de variables ne sont prises en compte qu'après redéploiement du service.

### Déploiements suivants

Chaque `git push` sur la branche principale redéploie automatiquement Vercel (frontend) et Railway (backend, migrations incluses).

### Checklist de mise en production

- [ ] Backend : toutes les variables présentes, `FRONTEND_URL` sans `/` final, `COOKIE_SECURE=true`
- [ ] `vercel.json` pointe vers le bon domaine Railway
- [ ] `VITE_API_URL` = adresse du site Vercel, type Config, build refait après modification
- [ ] Accès public de la base désactivé
- [ ] Connexion admin testée, cookie `adminToken` avec `HttpOnly`, `Secure` et `SameSite=Strict`
- [ ] Création d'une série avec une photo, envoi d'un message de contact et réception de l'email

## Espace administrateur

L'accès n'est annoncé nulle part sur le site : il se déclenche par une **séquence de clics secrète** (définie par la constante `SECRET_SEQUENCE`, avec un délai maximal entre deux clics). Une fenêtre demande alors le mot de passe (`ADMIN_PASSWORD`).

Une fois connecté, un lien « Admin » apparaît dans le pied de page tant que la session est valide (2 heures).

- **Onglet Modération** (affiché en premier) : messages du livre d'or en attente.
- **Onglet Séries** : création, modification, suppression. L'étoile ★ sur une photo la définit comme couverture.

### Conseils pour les photos

- Redimensionner avant l'envoi : environ **2500 px** sur le côté le plus long, JPEG qualité 80 à 85 %.
- Le relais Vercel limite la taille de chaque requête à quelques Mo (limite non mesurée précisément ; un fichier de 13 Mo a été refusé). Les photos sont envoyées une par une, la limite s'applique donc à chaque photo, pas à la série.

### Services externes

- **Resend** : sans domaine vérifié, l'expéditeur de test `onboarding@resend.dev` ne peut écrire qu'à l'adresse du compte Resend, d'où `ADMIN_EMAIL`. Pour utiliser une adresse de votre domaine, vérifier le domaine dans Resend puis modifier le champ `from` dans `backend/src/controllers/contact.controller.js`.
- **DeepL** : l'offre gratuite a un quota limité (vérifier les conditions actuelles sur le site de DeepL). En cas d'échec de traduction, le contenu s'affiche en français.
- **Cloudinary** : les images sont rangées dans le dossier `le-photoinomane`.

## API

**Publique**

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/api/series?lang=fr\|en\|ru\|zh` | liste des séries (photo de couverture seulement) |
| GET | `/api/series/:id?lang=...` | une série avec toutes ses photos |
| POST | `/api/contact` | enregistre et notifie un message de contact |
| GET | `/api/guestbook` | messages **approuvés** du livre d'or |
| POST | `/api/guestbook` | nouveau message (statut `PENDING`) |

**Administrateur** (cookie de session requis, sauf `login`)

| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/api/admin/login` | vérifie le mot de passe, dépose le cookie |
| POST | `/api/admin/logout` | efface le cookie |
| GET | `/api/admin/session` | 200 si la session est valide, sinon 401 |
| GET | `/api/admin/guestbook/pending` | messages en attente |
| PATCH | `/api/admin/guestbook/:id` | passe un message en `APPROVED` ou `REJECTED` |
| GET, POST | `/api/admin/series` | liste, création |
| PUT, DELETE | `/api/admin/series/:id` | modification, suppression |
| POST | `/api/upload` | envoie une image vers Cloudinary, renvoie son URL |

## Sécurité

- **Session** : jeton JWT (HS256, 2 h) placé dans un cookie `httpOnly` (illisible en JavaScript, donc protégé contre le vol par une faille XSS), `Secure` (HTTPS uniquement en production) et `SameSite=Strict` (jamais envoyé à la demande d'un autre site : protection contre le CSRF).
- **CORS** restreint à l'adresse du site (`FRONTEND_URL`) et à `localhost:5173`, avec `credentials: true`.
- **Helmet** : en-têtes HTTP de sécurité par défaut.
- **Limitation de débit** : 5 échecs de connexion admin par tranche de 15 minutes, et 20 envois par heure sur les formulaires publics. La clé de limitation est globale (et non par IP), car derrière le relais Vercel l'adresse IP réelle n'est pas garantie fiable.
- **Validation côté serveur** des champs et du statut de modération ; requêtes SQL paramétrées par Prisma (protection contre les injections SQL).
- **Modération** : un message du livre d'or n'est visible qu'après approbation.
- **Pas de cache** : les réponses `/api` portent `Cache-Control: no-store`.
- **Secrets** : uniquement dans des variables d'environnement, `.env` exclu de Git.
- **Dépendances** : `npm audit` signale des alertes dans la chaîne du CLI Prisma (`mysql2`, `deepmerge-ts`). Elles concernent un outil de développement et un pilote MySQL non utilisé ici (la base est PostgreSQL). Ne lancez **pas** `npm audit fix --force` : il rétrograderait Prisma en version 6. Refaites le point à chaque mise à jour de Prisma.

## Dépannage

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `failed to connect to the docker API` | Docker Desktop n'est pas démarré | lancer Docker Desktop, attendre qu'il soit prêt |
| `failed to read backend/.env: Invalid template` | une ligne `${{...}}` copiée depuis Railway | supprimer cette ligne du `backend/.env` |
| `ports are not available ... 3000` | un autre processus (ex. un ancien `npm run dev`) occupe le port | l'arrêter, ou `netstat -ano \| findstr :3000` puis fermer le processus |
| `Failed to resolve import "..."` (frontend) ou `Named export 'PrismaClient' not found` (backend) | `node_modules` ancien dans le volume Docker | `docker compose up -d --build --renew-anon-volumes` |
| Rien ne change après modification d'un fichier | le rechargement automatique n'a pas vu le fichier | `docker compose restart frontend` puis `Ctrl+Shift+R` |
| `Failed to fetch` / `ERR_EMPTY_RESPONSE` | le backend a planté au démarrage | `docker compose logs backend` |
| Erreur CORS en production | `FRONTEND_URL` absente, erronée (avec `/` final) ou non appliquée | corriger la variable, redéployer le backend |
| Connexion admin : 404, URL du type `site.vercel.app/domaine.railway.app/...` | `VITE_API_URL` vide ou sans `https://` | corriger la variable (type Config), redéployer sans cache |
| `/admin` donne 404 au rechargement | règle de routage manquante | vérifier `frontend/vercel.json` |
| Cookie sans attribut `Secure` en production | `COOKIE_SECURE` absente ou différente de `true` | la définir sur Railway et redéployer |
| « Trop de tentatives » à la connexion admin | limite de 5 échecs atteinte | attendre 15 minutes |
| Erreur à l'envoi d'une photo | fichier trop lourd pour le relais Vercel | redimensionner la photo (voir [Conseils pour les photos](#conseils-pour-les-photos)) |
| `Unknown argument ...` dans Prisma | client Prisma non régénéré après un changement de schéma | `npx prisma generate` en local, puis reconstruire Docker |
| Le service Railway n'apparaît pas dans `railway link` | aucun déploiement réussi pour l'instant | déployer une première fois |
| Installation npm extrêmement lente | lenteur d'accès au registre npm | patienter ; en dernier recours `--registry=https://registry.npmmirror.com` (miroir tiers) |
| Message « Update available ... prisma 8.0.0-rc » | simple notification | l'ignorer (version non stable) |

## Limites connues et pistes d'amélioration

- Un seul compte administrateur, identifié par un mot de passe unique.
- La limitation de débit étant globale, un tiers peut bloquer temporairement la connexion admin en multipliant les échecs.
- Les photos doivent être redimensionnées avant l'envoi ; une compression automatique dans le navigateur pourrait être ajoutée.
- Nom de domaine personnalisé (Vercel) et domaine d'envoi vérifié (Resend) à mettre en place.
- Le contenu du texte de présentation (« À propos », « Contact ») reste à rédiger ou traduire.
- Pas de tests automatisés pour l'instant.
- Migrer vers Prisma 8 une fois la version stable publiée.

## Auteur

Grégoire BODY, projet réalisé dans le cadre de la formation Développeur Web et Web Mobile Studi.

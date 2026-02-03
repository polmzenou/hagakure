# Hagakure – Encyclopédie interactive du Japon féodal

Application web full-stack : backend Symfony (API) + frontend React. Ce README décrit **point par point** comment initialiser le projet sur une nouvelle machine.

---

## Table des matières

- [Prérequis](#1-prérequis)
- [Initialisation du projet (étape par étape)](#2-initialisation-du-projet-étape-par-étape)
- [Lancement en développement](#3-lancement-en-développement)
- [Vérification que tout fonctionne](#4-vérification-que-tout-fonctionne)
- [Récapitulatif (checklist)](#5-récapitulatif-checklist)
- [À propos du projet](#6-à-propos-du-projet)
- [Structure du projet](#7-structure-du-projet)
- [Dépannage](#8-dépannage)

---

## 1. Prérequis

À installer sur la machine avant de commencer :

| Prérequis | Version minimale | Vérification |
|-----------|------------------|--------------|
| **PHP** | 8.2 | `php -v` |
| **Composer** | 2.x | `composer --version` |
| **Node.js** | 18.x | `node -v` |
| **npm** | 9.x (livré avec Node) | `npm -v` |
| **MySQL** | 8.0 (ou MariaDB 10.x) | Service démarré, accès avec utilisateur/mot de passe |
| **Symfony CLI** | Optionnel | `symfony version` |

- Si **Symfony CLI** est installé : on pourra lancer le backend avec `symfony server:start`.
- Sinon : on utilisera le serveur PHP intégré (`php -S localhost:8000 -t public`).

---

## 2. Initialisation du projet (étape par étape)

Toutes les commandes sont à exécuter depuis la racine du dépôt (ou depuis le dossier indiqué).

### Étape 2.1 – Cloner le dépôt

```bash
git clone <url-du-repo>
cd FullStackProjectHagakure
```

Vous devez vous retrouver dans le dossier qui contient `Hagakure/` et `hagakure-front/`.

---

### Étape 2.2 – Backend : installer les dépendances PHP

```bash
cd Hagakure
composer install
cd ..
```

- Si une erreur apparaît (extensions PHP manquantes, etc.), corrigez l’environnement PHP puis relancez `composer install`.

---

### Étape 2.3 – Backend : fichier `.env`

1. **Créer le fichier `.env`** à partir du template (dans le dossier `Hagakure/`) :

   ```bash
   cd Hagakure
   cp .env.example .env
   cd ..
   ```

2. **Ouvrir `Hagakure/.env`** dans un éditeur et modifier au minimum :

   - **`APP_SECRET`**  
     Remplacer par une chaîne aléatoire (ex. 32 caractères). Vous pouvez générer un secret avec :
     ```bash
     cd Hagakure
     php -r "echo bin2hex(random_bytes(16));"
     cd ..
     ```
     Puis coller le résultat dans `APP_SECRET=`.

   - **`DATABASE_URL`**  
     Adapter à votre MySQL/MariaDB :
     - Utilisateur, mot de passe, hôte, port, nom de base.
     - Exemple MySQL :
       ```env
       DATABASE_URL="mysql://USER:MOT_DE_PASSE@127.0.0.1:3306/NOM_DE_LA_BASE?serverVersion=8.0.0&charset=utf8mb4"
       ```
     - Remplacer `USER`, `MOT_DE_PASSE` et `NOM_DE_LA_BASE` par vos valeurs.
     - La base de données (ex. `hagakure`) peut ne pas exister encore : elle sera créée à l’étape suivante.

Ne pas commiter le fichier `.env` (il est dans `.gitignore`).

---

### Étape 2.4 – Backend : base de données et migrations

Toujours depuis la racine du projet :

```bash
cd Hagakure
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
cd ..
```

- **`doctrine:database:create`** : crée la base définie dans `DATABASE_URL` (si elle n’existe pas).
- **`doctrine:migrations:migrate`** : exécute les migrations (tables, schéma). Répondre `yes` si la console demande confirmation.

En cas d’erreur de connexion, vérifier que le serveur MySQL/MariaDB est démarré et que `DATABASE_URL` dans `Hagakure/.env` est correct.

---

### Étape 2.5 – Backend : créer un utilisateur administrateur (recommandé)

Pour vous connecter en tant qu’admin dans l’application :

```bash
cd Hagakure
php bin/console app:create-admin VOTRE_EMAIL@exemple.fr VOTRE_MOT_DE_PASSE
cd ..
```

Remplacer `VOTRE_EMAIL@exemple.fr` et `VOTRE_MOT_DE_PASSE` par les valeurs souhaitées. Cet utilisateur aura le rôle administrateur.

---

### Étape 2.6 – Backend : timeline (optionnel)

Si vous voulez que la page « Timeline » affiche des événements issus des batailles, naissances de samouraïs et événements historiques :

```bash
cd Hagakure
php bin/console app:timeline:generate
php bin/console app:timeline:generate-historical
cd ..
```

- **`app:timeline:generate`** : synchronise la timeline avec les batailles et naissances déjà en base.
- **`app:timeline:generate-historical`** : ajoute les événements historiques prédéfinis (politique, duels).

Vous pouvez les exécuter plus tard si la base est vide au premier lancement.

---

### Étape 2.7 – Frontend : installer les dépendances Node

```bash
cd hagakure-front
npm install
cd ..
```

---

### Étape 2.8 – Frontend : fichier `.env` (optionnel)

Par défaut, le frontend appelle l’API sur `http://localhost:8000/api` (voir `hagakure-front/src/services/api.ts` et le proxy Vite).

Si votre backend tourne sur une autre URL/port, créez un fichier `.env` dans `hagakure-front/` :

```bash
cd hagakure-front
# Créer le fichier .env (sous Linux/macOS : touch .env)
echo "VITE_API_URL=http://localhost:8000/api" > .env
cd ..
```

Ajustez `VITE_API_URL` si besoin (ex. `http://127.0.0.1:8080/api`). Après modification du `.env`, redémarrer le serveur Vite (`npm run dev`).

---

## 3. Lancement en développement

Il faut **deux terminaux** : un pour le backend, un pour le frontend.

### Terminal 1 – Backend (Symfony)

```bash
cd Hagakure

# Option A – Avec Symfony CLI (recommandé si installé)
symfony server:start

# Option B – Sans Symfony CLI
php -S localhost:8000 -t public
```

Laisser ce terminal ouvert. Le backend doit répondre sur **http://localhost:8000**.

# Hagakure – Frontend (React)

Frontend React + TypeScript + Vite de l’encyclopédie **Hagakure**.

Pour **initialiser tout le projet** (backend + frontend) sur une nouvelle machine, suivez le **README à la racine du dépôt** (`../README.md`). Ce fichier ne décrit que le frontend.

## Prérequis

- Node.js 18+
- npm
- Backend Symfony (Hagakure) en cours d’exécution sur `http://localhost:8000` (ou configurer `VITE_API_URL`)

## Installation rapide (dans le cadre du projet complet)

```bash
cd hagakure-front
npm install
```

Si l’API n’est pas sur `http://localhost:8000`, créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:8000/api
```

## Lancement

```bash
npm run dev
```

Application disponible sur **http://localhost:5173**.

## Scripts

- `npm run dev` – Serveur de développement
- `npm run build` – Build production (sortie dans `dist/`)
- `npm run preview` – Prévisualisation du build
- `npm run lint` – ESLint

## Connexion à l’API

- Par défaut, les appels API utilisent `http://localhost:8000/api` (voir `src/services/api.ts`).
- En dev, Vite peut proxyifier `/api` vers `http://localhost:8000` (voir `vite.config.ts`).
- Pour une autre URL, définir `VITE_API_URL` dans `.env` et redémarrer `npm run dev`.

## Structure

- `src/components/` – Composants réutilisables (Header, Footer, LandingPage, etc.)
- `src/pages/` – Pages (Timeline, listes, formulaires, Mon compte, etc.)
- `src/services/api.ts` – Client API (auth, samourais, batailles, clans, etc.)
- `public/` – Fichiers statiques (images, polices)

---

## 5. Récapitulatif (checklist)

Cocher mentalement ou sur papier pour une nouvelle machine :

- [ ] Prérequis installés (PHP 8.2+, Composer, Node 18+, MySQL/MariaDB)
- [ ] Dépôt cloné, `cd FullStackProjectHagakure`
- [ ] `cd Hagakure` puis `composer install`
- [ ] `Hagakure/.env` créé (`cp .env.example .env`) et configuré (`APP_SECRET`, `DATABASE_URL`)
- [ ] Base créée : `php bin/console doctrine:database:create`
- [ ] Migrations exécutées : `php bin/console doctrine:migrations:migrate`
- [ ] (Recommandé) Admin créé : `php bin/console app:create-admin email@exemple.fr motdepasse`
- [ ] (Optionnel) Timeline : `app:timeline:generate` et `app:timeline:generate-historical`
- [ ] `cd hagakure-front` puis `npm install`
- [ ] (Optionnel) `hagakure-front/.env` si l’API n’est pas sur `http://localhost:8000`
- [ ] Terminal 1 : backend (Symfony sur port 8000)
- [ ] Terminal 2 : frontend (`npm run dev` dans `hagakure-front`)
- [ ] Test : http://localhost:5173 et http://localhost:8000/api

---

## 6. À propos du projet

- **Backend** : Symfony 7.4, API REST (contrôleurs dédiés), Doctrine ORM, MySQL/MariaDB, authentification JWT, CORS configuré pour le frontend.
- **Frontend** : React 19, TypeScript, Vite 7, React Router, CSS responsive.

Fonctionnalités principales : timeline interactive, samouraïs, clans, batailles, armes, styles de combat, favoris, compte utilisateur, back office admin (gestion des entités et des utilisateurs).

---

## 7. Structure du projet

```
FullStackProjectHagakure/
├── Hagakure/                 # Backend Symfony
│   ├── bin/console           # Commandes Symfony
│   ├── config/               # Configuration (packages, routes)
│   ├── migrations/           # Migrations Doctrine
│   ├── public/               # Point d’entrée web (index.php, images)
│   ├── src/
│   │   ├── Controller/Api/   # Contrôleurs API
│   │   ├── Entity/           # Entités Doctrine
│   │   ├── Repository/
│   │   ├── Service/           # Ex. TimelineGeneratorService
│   │   ├── Command/          # app:create-admin, app:timeline:*
│   │   └── Security/
│   ├── .env                  # À créer à partir de .env.example
│   └── composer.json
├── hagakure-front/           # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # api.ts
│   │   └── main.tsx
│   ├── .env                  # Optionnel (VITE_API_URL)
│   └── package.json
└── README.md
```

---

## 8. Dépannage

### Erreur « DATABASE_URL not found » ou connexion base refusée

- Vérifier que `Hagakure/.env` existe et contient `DATABASE_URL` avec le bon utilisateur, mot de passe, hôte, port et nom de base.
- Vérifier que MySQL/MariaDB est démarré.

### Erreurs CORS ou « Network Error » côté frontend

- Vérifier que le backend tourne bien sur le port 8000.
- Vérifier `Hagakure/config/packages/nelmio_cors.yaml` (origines autorisées).
- Si vous utilisez une autre URL pour l’API, définir `VITE_API_URL` dans `hagakure-front/.env` et redémarrer `npm run dev`.

### Le frontend ne joint pas l’API

- Tester l’API dans le navigateur : **http://localhost:8000/api** (ou une route comme `/api/samourais`).
- Vérifier que `VITE_API_URL` (ou la valeur par défaut dans `api.ts`) pointe vers cette URL.
- Redémarrer le serveur Vite après toute modification du `.env` frontend.

### Erreur lors des migrations

Si le schéma est dans un état incohérent (à utiliser avec précaution, cela supprime les données) :

```bash
cd Hagakure
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
cd ..
```

### Fichiers à ne pas commiter

- `Hagakure/.env` et `Hagakure/.env.local` (déjà dans `.gitignore`)
- `hagakure-front/.env` si il contient des secrets (pour ce projet, en dev, souvent seulement `VITE_API_URL`)
- `vendor/`, `node_modules/`, `var/cache/`, `var/log/`

---

**Développé pour l’encyclopédie interactive du Japon féodal.**

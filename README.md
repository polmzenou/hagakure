# 🗾 Hagakure - Encyclopédie Interactive du Japon Féodal

**Hagakure** est une application web full-stack moderne qui présente une encyclopédie interactive sur le Japon féodal. L'application permet d'explorer l'histoire, les samouraïs, les clans, les batailles, les armes et les styles de combat de cette période fascinante.

## 📋 Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Structure du projet](#-structure-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Dépannage](#-dépannage)

## 🎯 À propos du projet

Hagakure est une encyclopédie interactive qui permet aux utilisateurs de :

- **Explorer** l'histoire du Japon féodal à travers une timeline interactive
- **Découvrir** les samouraïs, leurs clans, leurs armes et leurs styles de combat
- **Consulter** les batailles historiques et leurs détails
- **Créer un compte** pour sauvegarder leurs favoris
- **Personnaliser** leur profil et gérer leurs favoris

## ✨ Fonctionnalités

### Pour tous les utilisateurs
- 📜 **Timeline interactive** : Parcourir les événements historiques du Japon féodal
- ⚔️ **Batailles** : Consulter les détails des batailles historiques
- 🗡️ **Samouraïs** : Explorer les biographies des samouraïs célèbres
- 🏛️ **Clans** : Découvrir les différents clans et leur histoire
- ⚔️ **Armes** : Consulter les armes utilisées à l'époque
- 🥋 **Styles de combat** : Explorer les différents styles de combat

### Pour les utilisateurs connectés
- 🔐 **Authentification** : Création de compte et connexion
- ⭐ **Favoris** : Ajouter des éléments aux favoris (samouraïs, batailles, armes, clans, styles, événements)
- 👤 **Mon compte** : Gérer son profil (changer email, mot de passe)
- 📋 **Gestion des favoris** : Voir et organiser tous ses favoris par catégorie

## 🏗️ Architecture

Le projet est divisé en deux parties principales :

### Backend (Symfony)
- **Framework** : Symfony 7.4
- **API** : API Platform pour une API REST automatique
- **Base de données** : MySQL/PostgreSQL avec Doctrine ORM
- **Authentification** : JWT Token-based authentication
- **CORS** : Configuré pour accepter les requêtes du frontend

### Frontend (React)
- **Framework** : React 19 avec TypeScript
- **Build tool** : Vite
- **Routing** : React Router
- **Styling** : CSS3 avec design responsive

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP** >= 8.2 
- **Composer** (gestionnaire de dépendances PHP)
- **Node.js** >= 18.x et **npm**
- **MySQL** >= 8.0 ou **PostgreSQL** >= 16 (selon votre configuration)
- **Symfony CLI** (optionnel, mais recommandé)

### Vérification des prérequis

```bash
# Vérifier PHP
php -v

# Vérifier Composer
composer --version

# Vérifier Node.js
node -v
npm -v

# Vérifier Symfony CLI (optionnel)
symfony version
```

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd FullStackProjectHagakure
```

### 2. Installer les dépendances du backend

```bash
cd Hagakure
composer install
```

### 3. Installer les dépendances du frontend

```bash
cd ../hagakure-front
npm install
```

## ⚙️ Configuration

### Configuration du Backend (Symfony)

#### 1. Créer le fichier `.env`

Dans le dossier `Hagakure/`, créez un fichier `.env` à partir du template `.env` (s'il existe) ou créez-en un nouveau :

```bash
cd Hagakure
cp .env.example .env  # Si un fichier .env.example existe
# Sinon, créez simplement un fichier .env
```

#### 2. Configurer les variables d'environnement

Ouvrez le fichier `Hagakure/.env` et configurez les variables suivantes :

```env
# Environnement
APP_ENV=dev
APP_SECRET=votre_secret_aleatoire_ici_changez_le

# Base de données
# Pour MySQL :
DATABASE_URL="mysql://root:password@127.0.0.1:3306/hagakure?serverVersion=8.0.0&charset=utf8mb4"

# Pour PostgreSQL :
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"

# Mailer (optionnel pour le développement)
MAILER_DSN=null://null
```

**⚠️ Important :**
- Remplacez `votre_secret_aleatoire_ici_changez_le` par une chaîne aléatoire (vous pouvez utiliser `php bin/console secrets:generate-app-secret`)
- Remplacez les identifiants de la base de données (`root`, `password`, `hagakure`) par vos propres identifiants
- Ajustez le port et le nom de la base de données selon votre configuration

#### 3. Créer la base de données

```bash
# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# (Optionnel) Charger des données de test
# php bin/console doctrine:fixtures:load
```

#### 4. Créer un utilisateur administrateur (optionnel)

```bash
php bin/console app:create-admin
```

### Configuration du Frontend (React)

#### 1. Créer le fichier `.env`

Dans le dossier `hagakure-front/`, créez un fichier `.env` :

```bash
cd hagakure-front
touch .env
```

#### 2. Configurer l'URL de l'API

Ouvrez le fichier `hagakure-front/.env` et ajoutez :

```env
# URL de l'API Symfony (par défaut : http://localhost:8000/api)
VITE_API_URL=http://localhost:8000/api
```

**Note :** Si vous utilisez un port différent pour Symfony, modifiez l'URL en conséquence.

## 🎮 Lancement

### Développement

#### 1. Démarrer le serveur Symfony (Backend)

Dans un terminal, depuis le dossier `Hagakure/` :

```bash
cd Hagakure

# Avec Symfony CLI (recommandé)
symfony server:start

# Ou avec PHP built-in server
php -S localhost:8000 -t public
```

Le backend sera accessible sur `http://localhost:8000`

#### 2. Démarrer le serveur React (Frontend)

Dans un autre terminal, depuis le dossier `hagakure-front/` :

```bash
cd hagakure-front
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

#### 3. Accéder à l'application

Ouvrez votre navigateur et allez sur : **http://localhost:5173**

### Production

#### Build du frontend

```bash
cd hagakure-front
npm run build
```

Les fichiers de production seront générés dans `hagakure-front/dist/`

#### Configuration Symfony pour la production

1. Modifiez `APP_ENV=prod` dans `Hagakure/.env`
2. Optimisez le cache :

```bash
cd Hagakure
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
```

## 📁 Structure du projet

```
FullStackProjectHagakure/
├── Hagakure/                    # Backend Symfony
│   ├── bin/
│   │   └── console              # Commandes Symfony
│   ├── config/                  # Configuration Symfony
│   │   ├── packages/            # Configuration des bundles
│   │   └── routes/             # Routes
│   ├── migrations/              # Migrations Doctrine
│   ├── public/                  # Point d'entrée web
│   │   ├── index.php
│   │   └── images/              # Images uploadées
│   ├── src/
│   │   ├── Controller/
│   │   │   └── Api/             # Contrôleurs API
│   │   ├── Entity/              # Entités Doctrine
│   │   │   ├── User.php
│   │   │   ├── Samourai.php
│   │   │   ├── Battle.php
│   │   │   ├── Clan.php
│   │   │   ├── Weapon.php
│   │   │   ├── Style.php
│   │   │   ├── Timeline.php
│   │   │   └── Favorite.php
│   │   ├── Repository/          # Repositories Doctrine
│   │   ├── Service/              # Services métier
│   │   └── Security/            # Authentification
│   ├── var/                     # Cache et logs (ignoré par Git)
│   ├── vendor/                   # Dépendances Composer (ignoré par Git)
│   ├── .env                     # Variables d'environnement (à créer)
│   └── composer.json
│
├── hagakure-front/               # Frontend React
│   ├── public/                  # Fichiers statiques
│   │   ├── images/
│   │   └── fonts/
│   ├── src/
│   │   ├── components/          # Composants React réutilisables
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/               # Pages de l'application
│   │   │   ├── Timeline.tsx
│   │   │   ├── SamouraiList.tsx
│   │   │   ├── BattleShow.tsx
│   │   │   ├── MonCompte.tsx
│   │   │   └── ...
│   │   ├── services/            # Services API
│   │   │   └── api.ts
│   │   ├── App.tsx              # Composant principal
│   │   └── main.tsx             # Point d'entrée
│   ├── .env                     # Variables d'environnement (à créer)
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                    # Ce fichier
```

## 🛠️ Technologies utilisées

### Backend
- **Symfony 7.4** : Framework PHP
- **API Platform 4.2** : Génération automatique d'API REST
- **Doctrine ORM 3.5** : ORM pour la base de données
- **Nelmio CORS Bundle** : Gestion CORS
- **JWT Authentication** : Authentification par token

### Frontend
- **React 19** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Vite 7** : Build tool et serveur de développement
- **React Router 7** : Routing
- **CSS3** : Styles personnalisés

### Base de données
- **MySQL 8.0+** ou **PostgreSQL 16+**

## 🔧 Dépannage

### Erreur : "DATABASE_URL not found"

**Solution :** Assurez-vous d'avoir créé le fichier `Hagakure/.env` et configuré la variable `DATABASE_URL`.

### Erreur CORS

**Symptômes :** Les requêtes du frontend vers l'API sont bloquées.

**Solutions :**
1. Vérifiez que le backend Symfony est bien démarré
2. Vérifiez la configuration CORS dans `Hagakure/config/packages/nelmio_cors.yaml`
3. Assurez-vous que l'URL du frontend (`http://localhost:5173`) est dans la liste des origines autorisées

### Erreur : "Cannot connect to database"

**Solutions :**
1. Vérifiez que votre serveur de base de données est démarré
2. Vérifiez les identifiants dans `DATABASE_URL` du fichier `.env`
3. Vérifiez que la base de données existe : `php bin/console doctrine:database:create`

### Le frontend ne se connecte pas à l'API

**Solutions :**
1. Vérifiez que Symfony est bien démarré sur le port 8000
2. Testez l'API directement : `http://localhost:8000/api`
3. Vérifiez la variable `VITE_API_URL` dans `hagakure-front/.env`
4. Redémarrez le serveur Vite après modification du `.env`

### Erreur lors des migrations

**Solution :**
```bash
# Supprimer et recréer la base de données (⚠️ supprime toutes les données)
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### Les images ne s'affichent pas

**Solution :** Vérifiez que le dossier `Hagakure/public/images/` existe et contient les images nécessaires.

## 📝 Notes importantes

- ⚠️ **Ne commitez jamais** les fichiers `.env` dans Git (ils sont déjà dans `.gitignore`)
- 🔒 **Changez toujours** `APP_SECRET` en production
- 📦 Les dossiers `vendor/` et `node_modules/` sont ignorés par Git - ils seront installés via `composer install` et `npm install`
- 🗄️ Les fichiers de cache (`var/cache/`, `var/log/`) sont également ignorés

## 🤝 Contribution

Pour contribuer au projet :

1. Créez une branche pour votre fonctionnalité
2. Commitez vos changements
3. Poussez vers la branche
4. Ouvrez une Pull Request

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Développé avec ❤️ pour explorer l'histoire du Japon féodal**


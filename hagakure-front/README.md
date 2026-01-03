# Hagakure Frontend

Application React frontend pour l'encyclopédie interactive du Japon féodal **Hagakure**.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Symfony backend (Hagakure) en cours d'exécution sur `http://localhost:8000`

### Installation

1. **Installer les dépendances** :
   ```bash
   cd hagakure-front
   npm install
   ```

2. **Configurer l'URL de l'API** (optionnel) :
   
   Créez un fichier `.env` à la racine du projet :
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
   
   Par défaut, l'application utilise `http://localhost:8000/api` si la variable d'environnement n'est pas définie.

### Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

### Prévisualisation du build

```bash
npm run preview
```

## 🔗 Connexion avec Symfony

### Configuration CORS

Le backend Symfony doit être configuré pour accepter les requêtes depuis le frontend React. La configuration CORS est déjà présente dans `Hagakure/config/packages/nelmio_cors.yaml` et autorise les requêtes depuis `http://localhost:5173`.

### Proxy Vite

Le fichier `vite.config.ts` est configuré pour rediriger automatiquement les requêtes `/api/*` vers `http://localhost:8000/api`. Cela permet d'éviter les problèmes CORS en développement.

### Service API

Le service API est disponible dans `src/services/api.ts` et fournit des méthodes pour interagir avec l'API Symfony :

```typescript
import { samouraiApi, clanApi, battleApi } from './services/api'

// Exemples d'utilisation
const samourais = await samouraiApi.getAll()
const clan = await clanApi.getById(1)
```

## 📁 Structure du projet

```
hagakure-front/
├── public/
│   ├── fonts/          # Polices (YujiSyuku)
│   └── images/         # Images et logos
├── src/
│   ├── components/     # Composants React
│   │   └── LandingPage.tsx
│   ├── services/       # Services API
│   │   └── api.ts
│   ├── App.tsx         # Composant principal
│   ├── App.css
│   ├── index.css       # Styles globaux
│   └── main.tsx        # Point d'entrée
├── index.html
├── package.json
├── vite.config.ts      # Configuration Vite
└── README.md
```

## 🎨 Design

### Couleurs

- **Primaire** : `#c41e3a` (Rouge)
- **Primaire foncé** : `#8b1428`
- **Primaire clair** : `#dc143c`
- **Secondaire** : `#2c3e50`
- **Fond sombre** : `#1a1a1a`
- **Fond clair** : `#f5f5f5`

### Police

- **YujiSyuku** : Police principale pour le thème japonais
- Fallback : System fonts (Segoe UI, Tahoma, etc.)

## 🚀 Lancement complet du projet

### 1. Démarrer Symfony (Backend)

Dans le dossier `Hagakure` :

```bash
cd Hagakure
symfony server:start
# ou
php -S localhost:8000 -t public
```

Le backend sera accessible sur `http://localhost:8000`

### 2. Démarrer React (Frontend)

Dans le dossier `hagakure-front` :

```bash
cd hagakure-front
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### 3. Accéder à l'application

Ouvrez votre navigateur et allez sur `http://localhost:5173`

## 📝 Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run lint` : Vérifie le code avec ESLint

## 🔧 Dépannage

### Erreur CORS

Si vous rencontrez des erreurs CORS, vérifiez que :
1. Le backend Symfony est bien démarré
2. La configuration CORS dans `Hagakure/config/packages/nelmio_cors.yaml` inclut `http://localhost:5173`
3. Le proxy Vite est correctement configuré dans `vite.config.ts`

### L'API ne répond pas

1. Vérifiez que Symfony est bien démarré sur le port 8000
2. Testez l'API directement : `http://localhost:8000/api`
3. Vérifiez les logs Symfony dans `Hagakure/var/log/dev.log`

### La police ne s'affiche pas

Assurez-vous que le fichier `public/fonts/YujiSyuku-Regular.ttf` existe. Si nécessaire, copiez-le depuis `Hagakure/public/fonts/`.

## 📚 Technologies utilisées

- **React 19** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Vite** : Build tool et serveur de développement
- **CSS3** : Styles personnalisés avec animations

## 🎯 Fonctionnalités

- ✅ Landing page moderne et responsive
- ✅ Navigation fluide avec sections
- ✅ Hero section avec image de fond
- ✅ Sections de présentation des fonctionnalités
- ✅ Service API pour communiquer avec Symfony
- ✅ Design adaptatif (mobile, tablette, desktop)
- ✅ Animations et transitions fluides

## 📄 Licence

Propriétaire - Tous droits réservés
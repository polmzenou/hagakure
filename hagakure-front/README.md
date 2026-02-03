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

Pour le détail de l’installation complète et le dépannage, voir le **README principal** à la racine du dépôt.

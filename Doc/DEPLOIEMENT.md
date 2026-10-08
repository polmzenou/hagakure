# Déploiement gratuit de Hagakure

| Partie | Hébergeur (gratuit) | Dossier |
|---|---|---|
| Front React/Vite | Vercel (Hobby) | `hagakure-front/` |
| API Symfony | Render, Web Service Free (Docker) | `Hagakure/` (`Dockerfile`, `docker/`, `render.yaml` à la racine) |
| PostgreSQL | Neon, Free plan | — |

Le site reste toujours actif grâce à un ping toutes les 5 minutes sur `/api/health` (voir étape 6).

## 1. Base de données : Neon
1. Créer un compte sur neon.tech, puis **New project** (région Europe, par exemple Frankfurt).
2. Dans **Connect**, décocher *Connection pooling* pour obtenir la chaîne **directe** (hôte sans `-pooler`). Elle ressemble à :
   `postgresql://<user>:<mot_de_passe>@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
3. Noter la version de PostgreSQL du projet (16 ou 17). Elle sert pour `serverVersion`.

## 2. Importer les données (`db_hagakure_neon.sql`)
Le fichier `db_hagakure_neon.sql` a été généré depuis l'export phpMyAdmin (MySQL → PostgreSQL). Il contient le schéma, toutes les données et l'historique des migrations Doctrine. Il doit être importé dans une base **vide**.

Avec Docker (aucune installation de psql nécessaire), depuis PowerShell :
```
docker run --rm -v "$env:USERPROFILE\Downloads:/data" postgres:16 psql "postgresql://<user>:<mot_de_passe>@<host>.neon.tech/neondb?sslmode=require" -v ON_ERROR_STOP=1 -q -f /data/db_hagakure_neon.sql
```
⚠️ Ne pas envoyer le fichier par un pipe (`Get-Content ... | docker ...`). PowerShell 5.1 l'encode en ASCII, ce qui abîme les accents et les caractères japonais.
Ou avec psql s'il est installé : `psql "<chaîne Neon>" -v ON_ERROR_STOP=1 -f db_hagakure_neon.sql`

Le fichier n'utilise que des `INSERT` classiques : il fonctionne aussi dans pgAdmin ou DBeaver. L'éditeur SQL web de Neon est en revanche trop limité pour un fichier de 8 Mo.

## 3. API : Render
1. Pousser le repo sur GitHub.
2. Render → **New → Blueprint** → choisir le repo. Le fichier `render.yaml` crée le service `hagakure-api`.
3. Renseigner `DATABASE_URL` avec la chaîne Neon, en ajoutant `serverVersion` et `charset` :
   `postgresql://<user>:<mot_de_passe>@<host>.neon.tech/neondb?serverVersion=16&charset=utf8&sslmode=require`
   Mettre `serverVersion=17` si le projet Neon est en 17.
4. Au démarrage, le conteneur génère les clés JWT, lance les migrations (déjà à jour si l'import est fait) puis Apache. Pour tester : `https://hagakure-api.onrender.com/api/health` doit renvoyer `{"status":"ok"}`.

Note : les clés JWT sont régénérées à chaque redéploiement, les utilisateurs doivent alors se reconnecter.

## 4. Front : Vercel
1. Vercel → **Add New → Project** → importer le repo.
2. **Root Directory** : `hagakure-front`. Framework : Vite. Build : `npm run build`. Output : `dist`.
3. Variable d'env : `VITE_API_URL` = `https://hagakure-api.onrender.com/api`
4. Déployer. `vercel.json` redirige toutes les routes vers `index.html`, ce qui évite les 404 au rafraîchissement d'une page.

## 5. Autoriser le front (CORS)
Sur Render, la variable `CORS_ALLOW_ORIGIN` vaut par défaut `^https://hagakure[a-z0-9-]*\.vercel\.app$`. Si l'URL Vercel ne commence pas par `hagakure`, adapter la regex, par exemple `^https://mon-site\.vercel\.app$`.

## 6. Garder le site toujours actif
Render endort le service gratuit après 15 min sans requête.
1. Créer un compte gratuit sur uptimerobot.com, puis **New monitor → HTTP(s)**.
2. URL : `https://hagakure-api.onrender.com/api/health`. Intervalle : **5 minutes**.

Un service qui tourne 24h/24 consomme ~744 h par mois, sous le quota gratuit de 750 h de Render. Il ne faut donc pas créer d'autre service gratuit sur le même compte.

Neon met aussi en veille la base après quelques minutes d'inactivité. Le réveil prend moins d'une seconde et se fait automatiquement à la première requête.

## 7. Développement en local
Le projet utilise maintenant PostgreSQL (les migrations MySQL ont été remplacées).
1. Activer l'extension dans le `php.ini` utilisé (WAMP/XAMPP) : décommenter `extension=pdo_pgsql`.
2. Mettre une base PostgreSQL dans `Hagakure/.env.local`. Le plus simple est une **branche `dev` dans Neon**, gratuite et séparée de la prod :
   `DATABASE_URL="postgresql://...neon.tech/neondb?serverVersion=16&charset=utf8&sslmode=require"`

## Tester l'image en local (optionnel)
```
docker build -t hagakure-api Hagakure
docker run -p 8080:8080 -e DATABASE_URL="postgresql://..." -e APP_SECRET=x -e JWT_PASSPHRASE=x hagakure-api
```

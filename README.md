# PawConnect Frontend

Application mobile React Native (Expo) de PawConnect pour signaler des animaux en détresse et suivre leur prise en charge.

## Fonctionnalités

### Authentification et session

- Inscription et connexion utilisateur (`signup` / `login`).
- Gestion du token JWT pour sécuriser les appels backend.
- Comportement de navigation adapté selon l'état de session.

### Signalement côté citoyen

- Création d'un signalement avec le type d'animal, un titre, une description et un état.
- Ajout de la position GPS via `expo-location`.
- Ajout d'une photo via signature backend puis upload Cloudinary.

### Suivi et prise en charge

- Consultation des signalements liés à l'utilisateur connecté.
- Vue agent pour consulter les signalements et mettre à jour leur statut.
- Mise à jour de l'historique de prise en charge côté backend.

### Notifications

- Récupération des notifications utilisateur.
- Marquage d'une notification comme lue.
- Marquage global de toutes les notifications comme lues.

### Carte et distance

- Affichage cartographique des signalements.
- Calcul et affichage de la distance entre utilisateur et signalement.
- Accès rapide aux détails depuis les écrans de suivi.

## Stack

- Expo / React Native
- React Navigation (stack + tabs)
- Redux Toolkit + React Redux
- NativeWind (Tailwind)
- Expo Camera / Expo Location
- React Native Maps

## Installation

```bash
cd frontend
npm install
```

## Variables d’environnement

Créer le fichier local depuis l’exemple:

```bash
cp .env.example .env.local
```

Puis choisir une URL backend selon ton contexte:

```env
EXPO_PUBLIC_BACKEND=http://192.168.x.x:3000
# EXPO_PUBLIC_BACKEND=https://paw-connect-backend.vercel.app
```

Notes:

- `http://192.168.x.x:3000`:
  backend local, pratique pour développer backend et frontend en même temps.
- `https://paw-connect-backend.vercel.app`:
  backend déployé, utile pour tester sans backend local ou partager des tests.
- Les fichiers `.env*` locaux sont ignorés par Git.

## Lancement

```bash
npm start
```

Scripts disponibles:

```bash
npm run android
npm run ios
```

## Architecture

```text
frontend/
  api/               # appels backend (auth, animals, notifications, upload)
  assets/            # images, icônes, fonts
  components/        # composants UI par domaine
  constants/         # couleurs, typo, spacing
  helpers/           # gestion d'erreurs app et utilitaires
  hooks/             # hooks métier/UI
  navigation/        # root, stacks, tabs
  reducers/          # slices Redux
  screens/           # écrans applicatifs
```

## Contrat backend consommé par le frontend

- `POST /auth/signup`
- `POST /auth/login`
- `POST /animals`
- `GET /animals/me`
- `PATCH /animals/:id/photo`
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`
- `GET /upload/signature`

## Gestion des erreurs

Le frontend normalise les erreurs réseau/backend avec:

- `helpers/appError.js`
- `helpers/readJsonSafely.js`

Ce mécanisme permet d'unifier les messages utilisateurs et les codes backend.

## Backend

- Dépôt backend GitHub: https://github.com/Yipno/PawConnect-backend
- Backend déployé (Vercel): https://paw-connect-backend.vercel.app
- Documentation backend locale: `../backend/README.md`

## Tests

Aucun script `test` n'est défini actuellement.

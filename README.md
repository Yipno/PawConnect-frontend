# 🐾 PawConnect – Application Mobile (MVP)

Bienvenue dans le dépôt frontend de PawConnect — interface mobile (React Native / Expo) destinée à faciliter le signalement et la prise en charge d’animaux en détresse, en mettant en relation citoyen·ne·s et structures d’intervention.

---

## 📱 Fonctionnalités clés (MVP)

1. Signalement citoyen
   - Création d’un signalement (type d’animal, description, état)
   - Prise d’une photo depuis la caméra
   - Géolocalisation automatique du signalement
   - Envoi sécurisé vers le backend

2. Gestion des rôles utilisateurs
   - Citoyen·ne : création et suivi de ses signalements
   - Agent / intervenant : consultation, prise en charge et mise à jour des signalements
   - Interface adaptée selon le rôle connecté

3. Suivi des signalements
   - Liste filtrée par statut (nouveau / en cours / terminé) et / ou par priorité.
   - Historique des actions sur un signalement
   - Mise à jour en temps réel côté client via Redux
   - Envoi de notifications aux utilisateurs concernés (nouveau signalement ou mise à jour d'un signalement)

4. Carte interactive
   - Visualisation des signalements sur une carte
   - Calcul de distance entre l’utilisateur et le signalement
   - Accès rapide aux détails depuis la carte

---

## 🛠 Stack technique – Frontend

- Framework : React Native (Expo)
- State management : Redux Toolkit
- Navigation : React Navigation (Stack / Tabs)
- UI : NativeWind (Tailwind pour React Native)
- Cartographie : react-native-maps
- Images : Expo Camera / Image Picker
- Langage principal : JavaScript

---

## 🚀 Installation & Lancement

1. Pré-requis
   - Node.js (v18+ recommandé)
   - Expo CLI (ou utiliser `npx expo`)
   - Expo Go (mobile) ou simulateur iOS / Android
   - Backend PawConnect opérationnel (local ou déployé)

2. Cloner le repo
```bash
git clone https://github.com/Yipno/PawConnect-frontend.git
cd PawConnect-frontend
```

3. Installer les dépendances
```bash
npm install
```

4. Configuration des variables d’environnement
- Créer un fichier `.env` à la racine (ne pas committer) et ajouter :
```
EXPO_PUBLIC_BACKEND=http://TON_IP_LOCALE:3000
```
⚠️ En environnement Expo Go, utiliser l’IP locale de ta machine (ex. `192.168.x.x`), pas `localhost`.

5. Démarrage
```bash
npx expo start
```
Scanner le QR Code avec Expo Go ou lancer sur simulateur.

---

## 📂 Structure du projet

/
├── api/            # Fonctions d’appel API  
├── assets/         # Images, icônes  
├── components/     # Composants UI réutilisables  
├── constants/      # Couleurs, thèmes, constantes globales  
├── helpers/        # Fonctions utilitaires (distance, formatage…)  
├── hooks/          # Hooks personnalisés
├── navigation/     # Navigators (Stack / Tabs)  
├── reducers/       # Redux slices  
├── screens/        # Écrans de l’application  
└── utils/          # Utilitaires divers

---

## 🔗 Repos associés

- Backend : [PawConnect-backend](https://github.com/Yipno/PawConnect-backend)

---

## ℹ️ Informations

Projet de MVP réalisé dans le cadre de fin de bootcamp de la Capsule en 13 jours maximum par une équipe de 5 developpeurs juniors. 

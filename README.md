# Caly - Assistante de Vie Intelligente 🌟

Une application mobile complète pour gérer votre vie quotidienne avec intelligence et équilibre.

## 🎯 Objectifs

Caly est conçue pour vous aider à :
- **Aide familiale** : Gérer 77h/semaine d'aide (femme + enfants)
- **Santé** : Atteindre -25kg avec un coach sportif adapté
- **Empire digital** : Suivre vos clients et projets (Calytia + sous-projets)
- **Équilibre** : Prévenir le burn-out et gérer votre énergie

## 🛠 Stack Technique

- **React Native + Expo** avec Expo Router
- **TypeScript** pour la sécurité du code
- **Firebase** (Plan Spark gratuit) : Auth, Firestore, Cloud Functions, Notifications
- **Google Calendar API** pour la synchronisation agenda
- **React Native Paper** pour les composants UI
- **Async Storage** pour le cache local

## 📱 Fonctionnalités

### ✅ Déjà Implémentées

- **Dashboard** : Vue d'ensemble (énergie, poids, alertes, famille)
- **Kanban** : Planification type Trello avec synchronisation Google Agenda
- **Coach Sportif** : Programmes 10-15min, suivi poids -25kg
- **Module Aidant** : Planification famille, rendez-vous, médicaments
- **Monitoring Empire** : Alertes clients BDD en temps réel
- **Authentification** : Écran de connexion

### ⏳ À Développer

- Intégration Firebase complète
- Synchronisation Google Calendar
- Intelligence prédictive
- Notifications push
- Mode hors ligne
- Gamification (badges, séries)

## 📁 Structure du Projet

```
caly-assistant/
├── app/                     # Expo Router
│   ├── (tabs)/             # Écrans avec navigation
│   │   ├── index.tsx       # Dashboard
│   │   ├── kanban.tsx      # Planification
│   │   ├── health.tsx      # Coach sportif
│   │   ├── family.tsx      # Aidant familial
│   │   └── empire.tsx      # Monitoring
│   ├── _layout.tsx         # Layout principal
│   └── auth/
│       └── login.tsx       # Authentification
├── components/             # Composants réutilisables
├── services/              # Services externes
├── hooks/                 # Custom hooks
├── contexts/              # Context providers
├── types/                 # Types TypeScript
├── utils/                 # Fonctions utilitaires
├── constants/             # Constantes
└── assets/                # Images, icônes
```

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo Go sur votre mobile

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/cyrilhamel/caly-assistant.git
cd caly-assistant
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos clés Firebase et Google
```

4. **Lancer l'application**
```bash
npx expo start
```

5. **Scanner le QR code** avec Expo Go sur votre mobile !

## 🔧 Configuration Firebase

1. Créer un projet Firebase (gratuit)
2. Activer Authentication (Email/Password)
3. Créer une base Firestore
4. Copier les clés dans `.env`

## 📅 Prochaines Étapes

Pour continuer le développement, demandez simplement :

- "**Continuer Caly - Configurer Firebase**"
- "**Continuer Caly - Ajouter Google Calendar**"
- "**Suite Caly - Intelligence prédictive**"
- "**Suite Caly - Notifications push**"

## 🏆 Objectifs Mesurables

- 📉 **Poids** : -25kg (de 101kg à 75kg)
- 👨‍👩‍👧‍👦 **Famille** : 77h/semaine organisées
- 💼 **Empire** : Monitoring 24/7 de tous les clients
- ⚡ **Énergie** : Score > 70% en continu
- 🎯 **Burn-out** : 0 alerte critique

## 📄 Licence

MIT - Projet personnel de Cyril Hamel

## 💪 Motivation

> "Gérer sa vie comme on gère ses projets : avec méthode, intelligence et bienveillance."

---

**Version** : 1.0.0  
**Status** : En développement actif  
**100% Gratuit** - Aucun coût récurrent
# 📱 Caly - Documentation Complète

**Assistant de Vie Intelligente**  
Version 1.0.0 - Novembre 2025

---

## 🎯 Vue d'ensemble

Caly est une application mobile tout-en-un conçue pour gérer simultanément plusieurs aspects de la vie quotidienne : santé personnelle, vie familiale (aidant familial), projets professionnels et tâches quotidiennes.

### Points forts
- ✅ **5 modules intégrés** travaillant ensemble
- ✅ **Synchronisation automatique** entre les modules
- ✅ **Données persistantes** sauvegardées localement
- ✅ **Interface intuitive** avec thème sombre et doré
- ✅ **Agenda intelligent** avec auto-planification

---

## 📊 Module 1 : Dashboard (Accueil)

### Fonctionnalités principales

#### Score Énergie Dynamique (0-100%)
**Calcul automatique basé sur :**
- 🛏️ **Heures de sommeil** (saisie quotidienne au démarrage)
  - 8h+ = +25 points
  - 7h = +20 points
  - 6h = +10 points
  - <5h = -10 points

- 💪 **Programme workout complété**
  - Tous les exercices = +20 points
  - Partiellement = proportionnel

- 👟 **Pas quotidiens**
  - 10 000+ pas = +15 points
  - 7 500 pas = +10 points
  - 5 000 pas = +5 points
  - <3 000 pas = -5 points

- 🔥 **Série active** (jours consécutifs)
  - 7+ jours = +10 points
  - 4+ jours = +7 points
  - 2+ jours = +4 points

**Affichage :** 
- Indicateur coloré : 🟢 ≥70% | 🟡 50-70% | 🔴 <50%
- Lien "Modifier le sommeil" pour ajuster

#### Vue d'ensemble quotidienne
- 📅 **Événements du jour** (nombre affiché)
- 🚨 **Alertes critiques** (projets, tâches)
- ✅ **Tâches urgentes** (Kanban)

#### Alertes intelligentes
**Famille :**
- 💊 Médicaments à renouveler (≤25 jours)
- 📋 Ordonnances à renouveler (≤30 jours)
- 📄 Documents administratifs expirant

**Empire :**
- 🔴 Alertes critiques projets
- 🟡 Warnings performance

---

## 📅 Module 2 : Agenda Intelligent

### Vue d'ensemble
Système d'agenda avec **auto-planification intelligente** des tâches selon les disponibilités.

### 3 Vues disponibles

#### 1️⃣ Vue Jour
- **Affichage proportionnel** de 6h à 23h
- Hauteur des événements = durée réelle
- Séparation visuelle entre :
  - 🔒 **Événements fixes** (RDV, activités enfants)
  - 📝 **Tâches planifiées** (auto-schedulées)
- Clic sur événement → Actions rapides

#### 2️⃣ Vue Semaine
- Grille 7 jours avec horaires
- Aperçu des événements par jour
- **Clic sur jour** → Bascule en vue jour

#### 3️⃣ Vue Mois
- Calendrier mensuel complet
- Indicateurs visuels :
  - 🔵 Points pour événements
  - 🔴 Jours avec alertes
- Navigation mois précédent/suivant

### Gestion des événements

#### Types d'événements
1. **RDV Famille** (source : Module Famille)
   - Fixes, non déplaçables
   - Priorité maximale
   
2. **Activités enfants** (source : Module Famille)
   - Fixes, non déplaçables
   
3. **Tâches Kanban** (source : Module Kanban)
   - Auto-planifiées dans les créneaux libres
   - Déplaçables si urgentes
   
4. **Tâches Empire** (source : Module Empire)
   - Planifiées selon priorité
   
5. **Tâches admin** (source : Module Famille)
   - Durée estimée ou par défaut 30min

#### Actions sur tâche en cours

**Pendant l'exécution :**
- ✅ **Valider** → Marque comme terminée, supprime de l'agenda
- ⏸️ **Reporter** → Reporte à demain, réorganise le reste
- ⏱️ **Prolonger** → +15, +30, +60 min (ajuste actualDuration)

**Réorganisation automatique :**
- Après validation/report : recalcule les horaires suivants
- Préserve les tâches "en cours"
- Respecte les créneaux libres

#### Tâches récurrentes

**Templates disponibles :**
- 🏃 Sport quotidien (30 min, matin préféré)
- 🛒 Courses hebdomadaires (60 min, weekend)
- 📧 Emails quotidiens (30 min, début/fin journée)
- 🧹 Ménage hebdomadaire (90 min, weekend)
- 📞 Appels famille hebdomadaires (30 min, flexible)

**Configuration :**
- Date début/fin
- Jours préférés
- Horaires flexibles ou fixes
- Weekend autorisé ou non

---

## 💪 Module 3 : Santé

### Suivi Poids & Objectifs

#### Graphique évolution
- Courbe poids sur 30 derniers jours
- Poids actuel vs objectif
- Progression calculée automatiquement

#### Paliers de motivation
Configuration de 3 paliers :
- 🎯 Palier 1 : Premier objectif
- 🎯 Palier 2 : Objectif intermédiaire  
- 🎯 Palier 3 : Objectif final

**Suivi :**
- ✅ Atteint (avec date)
- ⏳ En cours

### Programme Workout Intelligent

#### Caractéristiques
- **12 semaines** de progression structurée
- **Adaptation automatique** selon jour et niveau
- **3 niveaux** : Débutant → Intermédiaire → Avancé
- **4 types** : Cardio, Renforcement, Mixte, Récupération

#### Rotation hebdomadaire
**Semaines 1-4 (Débutant) :**
- Lundi : Cardio léger + Haut du corps (60 min)
- Mercredi : Renforcement global (45 min)
- Vendredi : Circuit complet (50 min)
- Dimanche : Récupération active (30 min)

**Semaines 5-8 (Intermédiaire) :**
- Intensité augmentée
- Durées plus longues (60-75 min)
- Exercices plus complexes

**Semaines 9-12 (Avancé) :**
- Haute intensité
- Endurance maximale
- Durées 70-80 min

#### Suivi d'exercice
- ✅ Cocher chaque exercice complété
- Calcul automatique du % réalisé
- Impact sur score énergie

### Activité Quotidienne

#### Compteur de pas
- Affichage en temps réel
- Objectif recommandé : 10 000 pas
- Barre de progression visuelle

#### Calories brûlées
- Calcul automatique selon activité
- Historique journalier

#### Minutes actives
- Suivi temps d'activité physique
- Contributions au score énergie

### Série Active
- Compteur de jours consécutifs
- Réinitialisation si jour manqué
- Badge motivation selon palier

---

## 👨‍👩‍👧‍👦 Module 4 : Aidant Familial

### Vue d'ensemble
- **77h/semaine** calculées automatiquement
- Agrégation RDV + activités + médicaments + admin
- Affichage RDV du jour

### Rendez-vous Médicaux

#### Gestion complète
- 📋 **Informations** : Titre, description, personne concernée
- 📅 **Planification** : Date, heure, lieu
- ⏱️ **Durée** estimée (synchronisée avec Agenda)
- 👥 **Personnes** : Albine, Anna, Yoan, Louis, Tom, Moi

#### Actions disponibles
- ➕ Ajouter nouveau RDV
- ✏️ Modifier RDV existant
- 🗑️ Supprimer RDV

### Médicaments

#### Suivi traitement
**Informations :**
- 💊 Nom du médicament
- 👤 Personne (Albine ou Louis)
- ⏰ Horaires de prise (liste flexible)
- ✅ Prises effectuées (coches journalières)

**Alertes automatiques :**
- 🔴 **Réapprovisionnement** (≤25 jours)
- 🟡 **Renouvellement ordonnance** (≤30 jours)

#### Actions
- Cocher prise effectuée
- Gérer les horaires
- Modifier dates limites

### Activités Enfants

#### Gestion
- 🎨 Type d'activité
- 📅 Date et horaire
- 👶 Enfant concerné
- 📝 Description détaillée
- ⏱️ Durée (si connue)

**Synchronisation :** Activités = événements fixes dans Agenda

### Courses

#### Liste intelligente
**5 Catégories :**
- 🥫 Sec
- 🥕 Légumes
- 🧈 Frais
- 🥩 Viandes
- 🧊 Surgelé

**Fonctionnalités :**
- ✅ Cocher articles achetés
- ➕ Ajouter article dans catégorie
- 🗑️ Supprimer article
- 🧹 Vider la liste complète

### Gestion Administrative

#### Documents administratifs
**Suivi par personne :**
- 📋 **ALD** (Affection Longue Durée) - Date expiration
- 🏛️ **MDPH** - Date fin dossier
- ♿ **Carte handicap** - Date expiration

**Alertes :** Notification avant expiration

#### Tâches administratives
- 📄 Titre de la tâche
- 📅 Date limite (deadline)
- ⏱️ Durée estimée (défaut 30 min)
- ✅ État : À faire / Terminée

**Synchronisation :** Tâches admin = événements Agenda

---

## 💼 Module 5 : Empire Digital

### Vue d'ensemble
Monitoring et gestion de projets/clients professionnels.

### Monitoring Projets

#### État des projets
**Pour chaque projet :**
- 📊 **Uptime** (%)
- ⚡ **Temps de réponse** (secondes)
- 🚨 **Nombre d'alertes** actives
- 🔴/🟢 **Statut** : Opérationnel / Attention / Critique

**Projets configurés :**
- 🏢 Calytia
- 🌐 Client #2
- 💻 Client #3

#### Contrôles monitoring
- ▶️ **Démarrer monitoring** → Vérifications actives
- ⏸️ **Arrêter monitoring** → Pause surveillance
- ⚙️ **Configuration** → Paramètres avancés

### Alertes Temps Réel

#### Types d'alertes
- 🔴 **Critique** : Erreurs graves, downtime
- 🟡 **Attention** : Performance dégradée

**Informations :**
- Projet concerné
- Description du problème
- Horodatage (Il y a X minutes/heures)

**Actions :**
- ✅ **Résoudre** → Marque comme traitée
- 🚫 **Ignorer** → Supprime l'alerte

### Performance 24h

**Métriques calculées automatiquement :**
- 📊 **Requêtes totales** 
  - Basé sur checks/heure × projets actifs × trafic estimé
- ❌ **Erreurs** 
  - Alertes critiques × 5 + warnings × 2
- 📉 **Taux d'erreur** 
  - (Erreurs / Requêtes) × 100

**Mise à jour temps réel** selon alertes actives.

### Notifications Configurées

#### Règles de notification
**Composition :**
- 📋 Titre de la règle
- 📝 Description du déclencheur
- 🎯 Type : Critique, Attention, Performance, Downtime, Personnalisé
- 📢 Canaux : 📧 Email, 💬 SMS, 🔔 Push, 📞 Appel
- ⏸️/✅ Statut : Actif / Désactivé

**Actions :**
- ➕ Ajouter règle → Redirige vers Settings
- 👁️ Visualiser règles actives

### Tâches Empire

#### Gestion des tâches projet
- 📋 Titre et description
- 📅 Date et heure planifiées
- ⏱️ Durée estimée
- ✏️ Modifier
- 🗑️ Supprimer

**Synchronisation :** Tâches Empire = événements Agenda

---

## 📋 Module 6 : Kanban

### Vue d'ensemble
Tableau Kanban à 4 colonnes pour gestion visuelle des tâches.

### 4 Statuts

#### 🔴 Urgent
- Tâches prioritaires
- Traitement immédiat requis
- Apparaissent en premier dans Agenda

#### 🟡 En cours
- Tâches actuellement traitées
- Préservées lors des réorganisations
- Peuvent être prolongées

#### 🔵 À faire
- Tâches planifiées
- Seront auto-schedulées dans Agenda
- Ordre selon priorité

#### ✅ Terminé
- Tâches complétées
- Historique des réalisations

### Gestion des tâches

#### Informations
- 📋 **Titre**
- 📝 **Description**
- 🏷️ **Catégorie** : Santé, Famille, Empire, Autre
- 🏷️ **Tags** personnalisés
- 📅 **Date limite** (optionnelle)
- ⏱️ **Durée estimée** (pour auto-scheduling)

#### Actions
- ➕ **Ajouter** nouvelle tâche
- 🔀 **Déplacer** entre colonnes (drag & drop)
- ✏️ **Modifier** détails
- 🗑️ **Supprimer** tâche

### Synchronisation Agenda

**Automatique :**
- Tâches "Urgent" et "À faire" → Agenda
- Respect des durées estimées
- Placement dans créneaux libres
- Évite conflits avec événements fixes

---

## 🔄 Synchronisation Inter-Modules

### Flux de données

#### Agenda ← Sources multiples
```
Family (RDV, Activités, Admin) → Agenda (Fixes)
Kanban (Tâches) → Agenda (Flexibles)
Empire (Tâches) → Agenda (Planifiées)
```

#### Score Énergie ← Données consolidées
```
Santé (Sommeil, Workout, Pas, Série) → Score
Famille (RDV aujourd'hui) → Impact score
Empire (Alertes critiques) → Impact score
Kanban (Tâches urgentes) → Impact score
```

#### Alertes Dashboard ← Tous modules
```
Famille (Médicaments, Documents) → Dashboard
Empire (Monitoring projets) → Dashboard
Kanban (Tâches urgentes) → Dashboard
Agenda (Événements jour) → Dashboard
```

---

## 💾 Persistence des Données

### Stockage local (AsyncStorage)

**Toutes les données sont sauvegardées automatiquement :**
- ✅ Rendez-vous famille
- ✅ Médicaments et prises
- ✅ Activités enfants
- ✅ Liste de courses
- ✅ Documents et tâches admin
- ✅ Données santé (poids, workout, pas, sommeil)
- ✅ Tâches Kanban
- ✅ Projets et alertes Empire
- ✅ Tâches Empire
- ✅ Règles de notification
- ✅ Événements agenda

**Chargement :** Au démarrage de l'app, toutes les données sont restaurées.

**Sauvegarde :** Chaque modification est immédiatement persistée.

---

## 🎨 Interface Utilisateur

### Design global
- 🌑 **Thème sombre** : Fond #1A1A1A
- ✨ **Accent or** : #FFD700 pour éléments importants
- 📱 **React Native Paper** : Composants Material Design
- 🎯 **Navigation par onglets** : 6 onglets principaux

### Expérience utilisateur

#### Points forts
- ✅ **Navigation intuitive** : Onglets clairement identifiés
- ✅ **Actions rapides** : Boutons contextuels
- ✅ **Feedback visuel** : Indicateurs colorés
- ✅ **Scrolling fluide** : Performance optimisée
- ✅ **Dialogues clairs** : Confirmations explicites

#### Icônes & Emojis
Utilisation extensive d'emojis pour identification rapide :
- 📅 Calendrier
- 💪 Santé
- 👨‍👩‍👧‍👦 Famille
- 💼 Empire
- 📋 Tâches
- 🎯 Objectifs

---

## 🚀 Fonctionnalités Avancées

### Auto-planification intelligente

**Algorithme :**
1. Identifie tous les créneaux libres (6h-23h)
2. Place d'abord les événements fixes (RDV, activités)
3. Auto-schedule les tâches selon :
   - Urgence (urgent > normal)
   - Durée estimée
   - Préférences horaires
   - Weekend autorisé ou non
4. Évite les chevauchements
5. Laisse des pauses entre tâches

**Réorganisation dynamique :**
- Après validation/report d'une tâche
- Recalcule positions suivantes
- Préserve tâches "en cours"
- Décale si conflit

### Calculs automatiques

#### Score Énergie
Recalculé en temps réel à chaque modification :
- Sommeil modifié → Recalcul immédiat
- Exercice complété → Mise à jour
- Pas augmentés → Score ajusté
- Série prolongée → Bonus ajouté

#### Heures hebdomadaires Famille
Agrégation automatique :
- RDV de la semaine (durée réelle)
- Activités de la semaine (durée réelle)
- Temps médicaments : `nb_médicaments × doses × 2min × 7 jours`
- Tâches admin : durée définie ou 30min par défaut

**Total** : Converti en heures avec arrondi

#### Performance 24h Empire
Calcul dynamique :
- Requêtes : `projets × checks/h × 24h × multiplicateur_trafic`
- Erreurs : `critiques × 5 + warnings × 2`
- Taux : `(erreurs / requêtes) × 100`

### Alertes préventives

**Médicaments :**
- 25 jours avant fin de stock → Alerte réapprovisionnement
- 30 jours avant fin ordonnance → Alerte renouvellement

**Documents administratifs :**
- Surveillance dates expiration ALD, MDPH, Carte handicap
- Notifications préventives

**Projets Empire :**
- Temps de réponse > seuil → Alerte performance
- Uptime < seuil → Alerte critique
- Erreurs multiples → Alerte downtime

---

## 📱 Spécifications Techniques

### Plateforme
- **Framework** : React Native + Expo
- **Navigation** : Expo Router (tabs)
- **UI Library** : React Native Paper
- **Stockage** : AsyncStorage
- **Charts** : react-native-chart-kit
- **Dates** : react-native-paper-dates
- **Capteurs** : expo-sensors (podomètre)

### Performance
- ⚡ Chargement instantané (<1s)
- 📱 Optimisé pour Android
- 💾 Stockage local (pas de serveur requis)
- 🔄 Synchronisation temps réel entre modules

### Compatibilité
- Android 5.0+ (API 21+)
- Version actuelle : 1.0.0
- Package : com.cyrilhamel.caly

---

## 🔮 Évolutions Possibles

### Fonctionnalités à considérer

#### Synchronisation Cloud
- ☁️ Firebase Firestore
- 🔄 Sync multi-appareils
- 💻 Version web
- 📱 Backup automatique

#### Notifications Push
- ⏰ Rappels médicaments
- 📅 Rappels RDV (15 min avant)
- 🚨 Alertes Empire en temps réel
- 💪 Motivation workout

#### Intelligence Artificielle
- 🤖 Suggestions planning optimisé
- 📊 Prédictions score énergie
- 🎯 Recommandations personnalisées
- 📈 Analyses tendances

#### Partage & Collaboration
- 👥 Partage agenda famille
- 📤 Export calendrier (iCal)
- 📊 Rapports PDF
- 📧 Envoi automatique résumés

#### Intégrations externes
- 📧 Google Calendar sync
- 🏥 Doctolib import RDV
- 💼 Trello/Jira sync projets
- ⌚ Apple Health / Google Fit

#### Personnalisation
- 🎨 Thèmes personnalisables
- 🔔 Sons notifications custom
- 📋 Templates tâches
- 🏷️ Catégories personnalisées

#### Reporting & Analytics
- 📊 Graphiques détaillés
- 📈 Évolution sur 3/6/12 mois
- 🎯 Atteinte objectifs
- ⏱️ Temps passé par catégorie

---

## ❓ Questions pour Personnalisation

### Module Santé
1. Quels objectifs de poids/forme ?
2. Quels types d'exercices préférés ?
3. Besoin de suivi nutrition/calories ?
4. Tracking autres métriques (sommeil détaillé, hydratation) ?

### Module Famille
1. Nombre de personnes à gérer ?
2. Types de RDV fréquents ?
3. Nombre et âges des enfants ?
4. Besoin suivi école/devoirs ?
5. Gestion budget famille ?

### Module Empire
1. Nombre de projets/clients ?
2. Types de monitoring requis ?
3. Intégrations outils existants ?
4. Besoin facturation/comptabilité ?

### Module Agenda
1. Horaires travail spécifiques ?
2. Temps trajet à considérer ?
3. Pauses obligatoires ?
4. Créneaux préférés par type tâche ?

### Module Kanban
1. Catégories spécifiques ?
2. Workflow particulier ?
3. Priorités personnalisées ?
4. Besoin sous-tâches ?

### Général
1. Notifications préférées (fréquence, types) ?
2. Langue(s) de l'interface ?
3. Partage données avec qui ?
4. Budget fonctionnalités premium ?

---

## 📞 Support & Contact

### Informations
- **Développeur** : Cyril Hamel
- **Version** : 1.0.0
- **Date** : Novembre 2025

### Limitations actuelles
- 📱 Android uniquement (iOS possible)
- 💾 Stockage local uniquement (pas de cloud)
- 🔔 Notifications limitées
- 🌐 Pas de version web
- 👥 Mono-utilisateur

---

## 📝 Conclusion

Caly est un assistant de vie complet qui centralise la gestion de multiples aspects de la vie quotidienne dans une seule application intuitive. L'interconnexion des modules offre une vision globale et des automatisations intelligentes pour optimiser le temps et l'énergie de l'utilisateur.

**Points forts principaux :**
- ✅ Tout-en-un : Santé + Famille + Travail + Organisation
- ✅ Automatisations intelligentes
- ✅ Synchronisation inter-modules
- ✅ Données persistantes
- ✅ Interface intuitive

**Idéal pour :**
- Aidants familiaux gérant plusieurs personnes
- Entrepreneurs/freelances avec multiples projets
- Personnes cherchant optimisation santé + productivité
- Familles nombreuses avec emplois du temps complexes

---

*Document généré le 6 novembre 2025*

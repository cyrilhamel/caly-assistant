# 🎛️ Page Paramètres - Guide d'Utilisation

## Vue d'ensemble

La nouvelle page **Paramètres** vous permet de configurer entièrement le système de monitoring directement depuis l'application mobile, sans toucher au code !

---

## 📍 Accès

Deux façons d'accéder aux paramètres :

1. **Onglet Paramètres** : Dernier onglet de la barre de navigation (icône ⚙️)
2. **Depuis Empire** : Bouton "Config" en haut de la page Empire

---

## 🎯 Fonctionnalités

### 1. **Monitoring Principal**

#### Activer/Désactiver le monitoring
- **Switch** : Active ou désactive la surveillance en temps réel
- **Projets surveillés** : Liste des projets actuellement monitorés
- **Bouton Config** : Configure les endpoints et seuils de chaque projet
- **Ajouter un projet** : Crée un nouveau projet à surveiller

#### Configuration d'un projet
- **Nom** : Nom du projet (ex: "Mon Application")
- **Endpoints** : Liste des URLs à surveiller
  - Ajouter plusieurs endpoints (API, site web, health checks)
  - Supprimer des endpoints inutiles
- **Intervalle** : Fréquence des vérifications (en minutes)
- **Seuils d'alerte** :
  - Temps de réponse Warning (ms) : Ex: 1500ms
  - Temps de réponse Critical (ms) : Ex: 3000ms
  - Uptime minimum (%) : Ex: 99%

**Exemple de configuration :**
```
Nom: Mon API REST
Endpoints:
  - https://api.monsite.com/health
  - https://api.monsite.com/status
Intervalle: 2 minutes
Seuils:
  - Warning: 1500ms
  - Critical: 3000ms
  - Uptime: 99%
```

---

### 2. **Notifications Push**

Configurez comment vous recevez les alertes :

- **Activer notifications** : On/Off
- **Son** : Émet un son lors des alertes
- **Vibration** : Vibre lors des alertes
- **Heures silencieuses** : Désactive les notifications entre 22h et 8h
  - Modifiez les horaires selon vos besoins

**Boutons d'action :**
- **Enregistrer** : Sauvegarde la configuration
- **Tester** : Envoie une notification de test pour vérifier

---

### 3. **Intégrations Externes**

Connectez des services de monitoring professionnels :

#### 🌐 UptimeRobot
- **Switch** : Active/désactive l'intégration
- **Configuration** : Cliquez sur la ligne pour configurer
  - API Key : Votre clé d'API UptimeRobot
  - Obtention : Sur [uptimerobot.com](https://uptimerobot.com) → Settings → API
  - **Test** : Vérifie automatiquement la connexion

**Avantages :**
- Monitoring externe indépendant
- Historique complet
- Alertes multi-canaux (SMS, email)

#### 🐛 Sentry
- **Switch** : Active/désactive l'intégration
- **Configuration** :
  - Auth Token : Token d'authentification Sentry
  - Organization : Nom de votre organisation
  - Obtention : Sentry.io → Settings → Developer Settings → Auth Tokens
  - **Test** : Vérifie la connexion

**Avantages :**
- Suivi d'erreurs en temps réel
- Stack traces détaillées
- Groupement d'erreurs

#### 🔗 Webhooks Personnalisés
- **Switch** : Active/désactive
- **Configuration** :
  - URL : Adresse de votre webhook
  - Format : Les alertes sont envoyées en POST JSON

**Avantages :**
- Intégration avec n'importe quel système
- Slack, Discord, Teams, etc.
- Scripts personnalisés

**Format du payload webhook :**
```json
{
  "id": "alert-123",
  "projectId": "1",
  "type": "critical",
  "title": "Service Down",
  "description": "Erreur de connexion",
  "timestamp": "2025-11-02T12:00:00.000Z"
}
```

---

## 💡 Cas d'usage typiques

### Monitoring simple (débutant)
```
1. Activer le monitoring (switch)
2. Les 3 projets par défaut se lancent
3. Activer les notifications
4. C'est tout ! Vous recevrez des alertes
```

### Monitoring avancé (professionnel)
```
1. Configurer chaque projet :
   - Ajouter vos vraies URLs
   - Ajuster les seuils selon votre SLA
   - Définir l'intervalle optimal

2. Connecter UptimeRobot :
   - Monitoring 24/7 externe
   - Historique long terme

3. Connecter Sentry :
   - Suivi d'erreurs applicatives
   - Alertes sur bugs critiques

4. Configurer heures silencieuses :
   - Pas de notifications la nuit
   - Sauf alertes critiques
```

### Multi-projets (freelance/agency)
```
1. Ajouter tous vos projets clients :
   - Client A : API + Frontend
   - Client B : E-commerce
   - Client C : Application mobile

2. Configurer seuils par projet :
   - E-commerce : Seuils stricts (SLA 99.9%)
   - Blog : Seuils souples (SLA 95%)

3. Webhook vers Slack :
   - Canal #alertes-clients
   - Notification équipe

4. UptimeRobot en backup :
   - Double vérification
   - Alertes SMS d'urgence
```

---

## 🔧 Conseils de configuration

### Intervalles de vérification
- **Sites critiques** : 1-2 minutes
- **Applications normales** : 3-5 minutes
- **Sites peu critiques** : 10-15 minutes

⚠️ Plus l'intervalle est court, plus la batterie est sollicitée

### Seuils de performance
- **API REST** :
  - Warning: 500-1000ms
  - Critical: 2000-3000ms
  
- **Site web** :
  - Warning: 1000-1500ms
  - Critical: 3000-5000ms
  
- **Backend lourd** :
  - Warning: 2000-3000ms
  - Critical: 5000-10000ms

### Uptime minimum
- **Production critique** : 99.9%
- **Production normale** : 99%
- **Développement/staging** : 95%

---

## 🚨 Résolution de problèmes

### "Connexion UptimeRobot échouée"
1. Vérifiez votre API Key
2. Testez sur uptimerobot.com
3. Vérifiez vos permissions

### "Pas de notifications reçues"
1. Vérifiez les permissions de l'app
2. Testez avec le bouton "Tester"
3. Désactivez les heures silencieuses
4. Vérifiez le volume du téléphone

### "Trop d'alertes"
1. Augmentez les seuils (plus tolérant)
2. Augmentez l'intervalle
3. Vérifiez la stabilité de votre connexion
4. Activez les heures silencieuses

### "Projet ne se lance pas"
1. Vérifiez que l'URL est accessible
2. Testez l'URL dans un navigateur
3. Vérifiez qu'il n'y a pas de localhost
4. Ajoutez https:// au début

---

## 📱 Navigation

```
Empire
  ↓ (Bouton Config)
Paramètres
  ↓ (Configurer projet)
Dialog Configuration Projet
  ↓ (Enregistrer)
Monitoring actif ✅
```

---

## ✅ Checklist de démarrage rapide

1. [ ] Aller dans l'onglet Paramètres
2. [ ] Activer le monitoring (switch en haut)
3. [ ] Cliquer sur "Config" d'un projet
4. [ ] Remplacer les URLs d'exemple par les vraies
5. [ ] Ajuster les seuils si nécessaire
6. [ ] Enregistrer
7. [ ] Activer les notifications
8. [ ] Tester les notifications
9. [ ] (Optionnel) Configurer UptimeRobot ou Sentry
10. [ ] Retourner sur Empire pour voir les métriques en temps réel

---

## 🎉 C'est tout !

Votre système de monitoring est maintenant **entièrement configurable** depuis l'application. Plus besoin de toucher au code !

**Support** : Consultez `services/monitoring/README.md` pour la documentation technique complète.

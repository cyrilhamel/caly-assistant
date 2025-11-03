# Système de Monitoring Hybride 🚨

## Vue d'ensemble

Le système de monitoring hybride permet de surveiller en temps réel la santé de vos projets et applications, avec trois composants principaux :

1. **MonitoringService** : Monitoring HTTP basique intégré
2. **ExternalMonitoringService** : Intégrations avec services externes (UptimeRobot, Sentry, etc.)
3. **NotificationService** : Notifications push pour alertes critiques

---

## 🔧 Configuration

### 1. Monitoring Basique

Le monitoring HTTP vérifie automatiquement vos endpoints :

```typescript
import { monitoringService } from '@/services/monitoring';

// Configurer un projet
const config = {
  projectId: '1',
  name: 'Mon Application',
  endpoints: [
    'https://mon-app.com',
    'https://mon-app.com/api/health',
  ],
  checkInterval: 2 * 60 * 1000, // 2 minutes
  thresholds: {
    responseTime: 1500, // Warning si > 1.5s
    criticalResponseTime: 3000, // Critical si > 3s
    errorRate: 5, // Critical si > 5%
    uptimeWarning: 99, // Warning si < 99%
  },
};

monitoringService.registerProject(config);
monitoringService.startMonitoring('1');
```

### 2. Intégrations Externes

#### UptimeRobot

```typescript
import { externalMonitoringService } from '@/services/monitoring';

externalMonitoringService.configureUptimeRobot({
  isEnabled: true,
  apiKey: 'votre-api-key',
  monitors: [
    {
      id: 'monitor-123',
      projectId: '1',
      url: 'https://mon-app.com',
    },
  ],
});

// Tester la connexion
const result = await externalMonitoringService.testProvider('uptimerobot');
```

#### Sentry

```typescript
externalMonitoringService.configureSentry({
  isEnabled: true,
  apiKey: 'votre-sentry-token',
  organization: 'mon-org',
  projects: [
    {
      slug: 'mon-projet',
      projectId: '1',
    },
  ],
});
```

#### Webhooks Personnalisés

```typescript
externalMonitoringService.configureWebhooks({
  isEnabled: true,
  endpoints: [
    {
      projectId: '1',
      url: 'https://monitoring-system.com/webhook',
      headers: {
        'Authorization': 'Bearer token',
      },
    },
  ],
});

// Traiter un webhook entrant
const alert = await externalMonitoringService.handleWebhook(
  '1',
  webhookPayload
);
```

### 3. Notifications Push

```typescript
import { notificationService } from '@/services/monitoring';

// Initialiser (fait automatiquement dans EmpireContext)
await notificationService.initialize();

// Configurer
notificationService.updateConfig({
  enablePush: true,
  enableSound: true,
  enableVibration: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
});

// Envoyer une notification de test
await notificationService.sendTestNotification();
```

---

## 📊 Utilisation dans l'App

### Dans EmpireContext

Le monitoring est automatiquement configuré dans `EmpireContext.tsx` :

```typescript
const { 
  projects, 
  alerts, 
  startMonitoring, 
  stopMonitoring, 
  isMonitoringActive 
} = useEmpire();

// Démarrer le monitoring
startMonitoring();

// Arrêter le monitoring
stopMonitoring();
```

### Affichage des Alertes

Les alertes sont automatiquement ajoutées au state et affichées dans la page Empire :

- **Critical** 🔴 : Erreur grave (service down, temps critique)
- **Warning** 🟡 : Performance dégradée
- **Info** 🔵 : Information

### Métriques en Temps Réel

Les métriques sont calculées automatiquement :

- **Uptime** : % de disponibilité (sur 100 dernières vérifications)
- **Response Time** : Temps de réponse moyen
- **Alerts** : Nombre d'erreurs récentes

---

## 🔔 Notifications Push

### Configuration Android

Le système crée automatiquement deux canaux :

1. **Alertes Critiques** : Priorité MAX, vibration
2. **Alertes Avertissement** : Priorité HIGH

### Gestion des Notifications

```typescript
// Écouter les notifications reçues (app au premier plan)
notificationService.addNotificationReceivedListener((notification) => {
  console.log('Notification reçue:', notification);
});

// Gérer le clic sur une notification
notificationService.addNotificationResponseReceivedListener((response) => {
  const { alertId, projectId } = response.notification.request.content.data;
  // Naviguer vers les détails de l'alerte
});

// Annuler toutes les notifications
await notificationService.cancelAllNotifications();
```

---

## 🔌 Ajouter un Provider Personnalisé

```typescript
import { externalMonitoringService } from '@/services/monitoring';

// 1. Créer votre configuration
const myProviderConfig = {
  name: 'mon-provider',
  isEnabled: true,
  apiKey: 'api-key',
  // ... autres paramètres
};

// 2. L'enregistrer
externalMonitoringService.configureCustomProvider('mon-provider', myProviderConfig);

// 3. Implémenter la logique de polling ou webhooks
// (étendre ExternalMonitoringService si nécessaire)
```

---

## 📈 Statistiques et Historique

```typescript
// Obtenir l'historique d'un projet
const history = monitoringService.getHealthHistory('1');

// Obtenir les stats des dernières 24h
const stats = monitoringService.getProjectStats('1');
/*
{
  totalChecks: 720,
  upChecks: 718,
  downChecks: 2,
  uptimePercentage: 99.72,
  avgResponseTime: 0.85
}
*/
```

---

## 🎯 Roadmap

### Fonctionnalités à venir

- [ ] Dashboard détaillé avec graphiques
- [ ] Historique d'alertes avec filtres
- [ ] Rapports hebdomadaires par email
- [ ] Intégration Slack/Discord pour alertes
- [ ] Monitoring de métriques personnalisées
- [ ] Alertes basées sur des règles complexes
- [ ] API REST pour monitoring externe
- [ ] Support WebSockets pour updates temps réel

### Providers à ajouter

- [ ] New Relic
- [ ] Datadog
- [ ] PagerDuty
- [ ] Grafana
- [ ] Prometheus

---

## 🛠️ Dépannage

### Le monitoring ne démarre pas

Vérifiez que les URLs sont accessibles depuis l'app mobile (pas de localhost).

### Pas de notifications

1. Vérifier les permissions : `Settings > Notifications`
2. Initialiser le service : `await notificationService.initialize()`
3. Tester : `await notificationService.sendTestNotification()`

### Faux positifs

Ajustez les seuils dans la configuration :

```typescript
thresholds: {
  responseTime: 2000, // Augmenter si réseau lent
  criticalResponseTime: 5000,
  errorRate: 10, // Tolérer plus d'erreurs
  uptimeWarning: 95,
}
```

---

## 📚 Ressources

- [React Native Paper Dates](https://www.npmjs.com/package/react-native-paper-dates)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [UptimeRobot API](https://uptimerobot.com/api/)
- [Sentry API](https://docs.sentry.io/api/)

---

## 🤝 Contribution

Pour ajouter un nouveau provider :

1. Créer une interface dans `ExternalMonitoringService.ts`
2. Implémenter la logique de polling/webhooks
3. Ajouter la méthode de test
4. Documenter dans ce README

---

**Statut** : ✅ Système hybride opérationnel avec monitoring basique + architecture prête pour intégrations externes

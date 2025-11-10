# Configuration Google Calendar

## Erreur 400 : Requête invalide

Si vous obtenez une erreur 400 lors de la connexion, c'est que la configuration OAuth n'est pas encore faite. Suivez ces étapes :

## 📋 Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le nom de votre projet

### 2. Activer l'API Google Calendar

1. Dans le menu latéral, allez dans **APIs & Services** > **Library**
2. Recherchez "Google Calendar API"
3. Cliquez sur **Enable** (Activer)

### 3. Créer les identifiants OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Si demandé, configurez l'écran de consentement OAuth :
   - Type d'utilisateur : **Externe** (External)
   - Remplissez les informations requises (nom de l'app, email, etc.)
   - Scopes : Ajoutez `https://www.googleapis.com/auth/calendar.readonly`
   - Enregistrez

4. Créez l'identifiant OAuth :
   - Type d'application : **Application Web** (Web application)
   - Nom : "Caly Assistant" (ou autre)
   - **URIs de redirection autorisés** : Ajoutez ces deux URLs :
     ```
     https://auth.expo.io/@cyrilhamel/caly-assistant
     exp://localhost:8081/--/redirect
     ```
     
5. Cliquez sur **Create**
6. **Copiez le CLIENT ID** qui s'affiche

### 4. Configurer le CLIENT_ID dans l'application

1. Ouvrez le fichier `hooks/useGoogleAuth.ts`
2. Remplacez la ligne :
   ```typescript
   const GOOGLE_CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';
   ```
   par :
   ```typescript
   const GOOGLE_CLIENT_ID = 'VOTRE_VRAI_CLIENT_ID.apps.googleusercontent.com';
   ```
   (en utilisant le CLIENT_ID copié à l'étape 3)

### 5. Redémarrer l'application

```bash
# Arrêtez l'app (Ctrl+C)
# Puis relancez
npx expo start --clear
```

### 6. Tester la connexion

1. Ouvrez l'app
2. Allez dans **Paramètres** > **Google Calendar**
3. Cliquez sur **Se connecter**
4. Vous devriez voir la page de connexion Google
5. Acceptez les permissions
6. Vous serez redirigé vers l'app

## 🔍 Vérification du Redirect URI

Lors de la première tentative de connexion, l'app affichera dans les logs l'URI de redirection exact à configurer. Vérifiez que cette URI est bien ajoutée dans Google Cloud Console.

Pour voir les logs :
- Avec Expo : regardez la console où vous avez lancé `npx expo start`
- Message à chercher : `[GoogleAuth] Redirect URI: ...`

## 🐛 Résolution de problèmes

### Erreur 400 : redirect_uri_mismatch

**Cause** : L'URI de redirection ne correspond pas

**Solution** :
1. Vérifiez les logs pour voir l'URI utilisée par l'app
2. Ajoutez cette URI exacte dans Google Cloud Console
3. Attendez quelques minutes (propagation)
4. Réessayez

### Erreur : "Une erreur s'est produite lors de la connexion"

**Cause** : L'URI Expo n'est pas correctement configurée

**Solution** :
1. Dans Google Cloud Console > Credentials > OAuth 2.0 Client ID
2. Ajoutez **TOUTES** ces URIs dans "Authorized redirect URIs" :
   - `https://auth.expo.io/@cyrilhamel/caly-assistant`
   - `exp://localhost:8081/--/redirect`
   - `caly://redirect`
3. Cliquez sur **Save**
4. **Attendez 10-15 minutes** pour la propagation
5. Redémarrez votre app Expo
6. Réessayez la connexion

### Erreur : CLIENT_ID non configuré

**Cause** : Le CLIENT_ID n'a pas été remplacé dans le code

**Solution** :
1. Vérifiez `hooks/useGoogleAuth.ts`
2. Assurez-vous d'avoir remplacé `VOTRE_CLIENT_ID`
3. Redémarrez l'app avec `--clear`

### Erreur : invalid_client

**Cause** : Le CLIENT_ID est incorrect

**Solution** :
1. Vérifiez que vous avez copié le bon CLIENT_ID
2. Assurez-vous de copier l'ID complet (se termine par `.apps.googleusercontent.com`)

## 📱 Configuration pour production

Pour une app publiée sur les stores :

### Android
Dans `app.json`, ajoutez :
```json
"android": {
  "package": "com.cyrilhamel.caly",
  "intentFilters": [
    {
      "action": "VIEW",
      "data": [
        {
          "scheme": "caly"
        }
      ],
      "category": [
        "BROWSABLE",
        "DEFAULT"
      ]
    }
  ]
}
```

### iOS
Dans `app.json`, ajoutez :
```json
"ios": {
  "bundleIdentifier": "com.cyrilhamel.caly",
  "associatedDomains": [
    "applinks:caly-assistant.app"
  ]
}
```

Puis configurez l'URI dans Google Cloud Console :
```
caly://redirect
```

## 📚 Ressources

- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)

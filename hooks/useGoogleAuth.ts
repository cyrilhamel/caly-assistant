import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';

// TODO: Remplacer par votre vrai CLIENT_ID depuis Google Cloud Console
// Pour obtenir un CLIENT_ID :
// 1. Aller sur https://console.cloud.google.com/
// 2. Créer un projet ou sélectionner un projet existant
// 3. Activer l'API Google Calendar
// 4. Créer des identifiants OAuth 2.0 (type: Application Web)
// 5. Ajouter l'URI de redirection : exp://localhost:8081 (pour développement)
// 6. Pour production, utiliser l'URL de votre app
const GOOGLE_CLIENT_ID = '1057320946430-gq0trhqdplbl31qbpbfujib7cc67pocf.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/**
 * Hook pour gérer l'authentification Google OAuth
 */
export function useGoogleAuth() {
  // Pour le développement, utiliser l'URI locale
  // Pour la production, utiliser l'URI Expo
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'caly',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      redirectUri,
      // Utiliser PKCE pour plus de sécurité
      usePKCE: true,
      // Forcer le choix du compte
      prompt: AuthSession.Prompt.SelectAccount,
    },
    discovery
  );

  // Log pour debug
  useEffect(() => {
    if (redirectUri) {
      console.log('[GoogleAuth] Redirect URI:', redirectUri);
      console.log('[GoogleAuth] À configurer dans Google Cloud Console');
    }
  }, [redirectUri]);

  const authenticate = async (): Promise<string | null> => {
    try {
      if (!request) {
        console.error('[GoogleAuth] Request non initialisée');
        return null;
      }

      console.log('[GoogleAuth] Démarrage de l\'authentification...');
      const result = await promptAsync();
      
      console.log('[GoogleAuth] Résultat:', result.type);
      
      if (result.type === 'success') {
        const { authentication } = result;
        console.log('[GoogleAuth] ✅ Authentification réussie');
        return authentication?.accessToken || null;
      }
      
      if (result.type === 'error') {
        console.error('[GoogleAuth] Erreur:', result.error);
      }
      
      return null;
    } catch (error) {
      console.error('[GoogleAuth] Erreur d\'authentification:', error);
      return null;
    }
  };

  return {
    authenticate,
    request,
    redirectUri,
  };
}

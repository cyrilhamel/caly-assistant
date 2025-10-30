import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Ajouter la logique d'authentification ici
  // Pour l'instant, on redirige directement vers les tabs
  return <Redirect href="/(tabs)" />;
}

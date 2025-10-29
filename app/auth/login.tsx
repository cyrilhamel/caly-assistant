import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card } from 'react-native-paper';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // TODO: Implémenter l'authentification Firebase
    // Pour l'instant, simulation simple
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>🌟 Caly</Title>
          <Paragraph style={styles.subtitle}>Votre assistante de vie intelligente</Paragraph>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#6200EE"
          >
            Se connecter
          </Button>

          <Button
            mode="text"
            onPress={() => {}}
            style={styles.forgotButton}
          >
            Mot de passe oublié ?
          </Button>

          <View style={styles.divider} />

          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.registerButton}
          >
            Créer un compte
          </Button>
        </Card.Content>
      </Card>

      <Paragraph style={styles.footer}>
        Version 1.0.0 - 100% Gratuit
      </Paragraph>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#6200EE',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  forgotButton: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
  },
  registerButton: {
    borderColor: '#6200EE',
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
    fontSize: 12,
  },
});

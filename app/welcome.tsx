import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { Button } from "../components/ui/Button";
import { View, Text, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Finanzaas</Text>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>
          Una experiencia simple y minimalista para tu día a día.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Iniciar sesión" onPress={() => router.push("/(auth)/login")} />
        <View style={{ height: 12 }} />
        <Button
          label="Crear cuenta"
          variant="ghost"
          onPress={() => router.push("/(auth)/register")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: Colors.background,
  },
  content: {
    marginTop: 80,
  },
  logo: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  actions: {
    marginBottom: 40,
  },
});

import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              placeholder="Tu nombre"
              placeholderTextColor="#ABABAB"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="tu@email.com"
              placeholderTextColor="#ABABAB"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#ABABAB"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Button
            label="Registrarme"
            onPress={() => router.replace("/(main)/home")}
          />
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.back()}
        >
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta?{" "}
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#888888",
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#111111",
    backgroundColor: "#FAFAFA",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    color: "#888888",
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
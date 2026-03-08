import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../constants/colors";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsPending(true);
    try {
      await login(data.email, data.password);
    } catch {
      Alert.alert("Error", "Email o contraseña incorrectos.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={Keyboard.dismiss}
            style={styles.container}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Bienvenido</Text>
              <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email requerido",
                    validate: (v) => v.includes("@") || "Email inválido",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        placeholder="tu@email.com"
                        placeholderTextColor="#ABABAB"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[
                          styles.input,
                          errors.email && styles.inputError,
                        ]}
                        value={value}
                        onChangeText={onChange}
                        editable={!isPending}
                      />
                      {errors.email && (
                        <Text style={styles.error}>{errors.email.message}</Text>
                      )}
                    </>
                  )}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Contraseña requerida",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#ABABAB"
                        secureTextEntry
                        style={[
                          styles.input,
                          errors.password && styles.inputError,
                        ]}
                        value={value}
                        onChangeText={onChange}
                        editable={!isPending}
                      />
                      {errors.password && (
                        <Text style={styles.error}>
                          {errors.password.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              <Button
                label={isPending ? "Entrando..." : "Entrar"}
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              />

              <TouchableOpacity
                style={styles.footer}
                onPress={() => router.push("/(auth)/register")}
                disabled={isPending}
              >
                <Text style={styles.footerText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.footerLink}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 80,
    justifyContent: "center",
  },
  header: { marginBottom: 36 },
  title: { fontSize: 30, fontWeight: "800", color: "#111111", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#888888" },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#333333" },
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
  footer: { alignItems: "center", marginTop: 8, paddingVertical: 12 },
  footerText: { color: "#888888", fontSize: 14 },
  footerLink: { color: Colors.primary, fontWeight: "700" },
  inputError: { borderColor: "#FF4444" },
  error: { fontSize: 12, color: "#FF4444", marginTop: 4 },
});

import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegister } from "@/hooks/useAuth";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function RegisterScreen() {
  const { mutate: register, isPending } = useRegister();
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    watch 
  } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Para validar password_confirmation vs password
  const password = watch("password");

  const onSubmit = (data: RegisterForm) => {
    register({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar</Text>
        </View>

        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Nombre requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Tu nombre"
                    placeholderTextColor="#ABABAB"
                    style={[
                      styles.input,
                      errors.name && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                  />
                  {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                </>
              )}
            />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email requerido",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email inválido",
                },
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
                  {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                </>
              )}
            />
          </View>

          {/* Password */}
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
                  {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                </>
              )}
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <Controller
              control={control}
              name="password_confirmation"
              rules={{
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#ABABAB"
                    secureTextEntry
                    style={[
                      styles.input,
                      errors.password_confirmation && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                  />
                  {errors.password_confirmation && (
                    <Text style={styles.error}>{errors.password_confirmation.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <Button
            label={isPending ? "Registrando..." : "Registrarme"}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          />
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.back()}
          disabled={isPending}
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
  inputError: {
    borderColor: "#FF4444",
  },
  error: {
    fontSize: 12,
    color: "#FF4444",
    marginTop: 4,
  },
});
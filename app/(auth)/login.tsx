import { useForm, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "@/hooks/useAuth";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { mutate: login, isPending } = useLogin();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    // Validación manual simple
    if (!data.email.includes("@")) {
      return setError("email", { message: "Email inválido" });
    }
    if (data.password.length < 6) {
      return setError("password", { message: "Mínimo 6 caracteres" });
    }
    
    login({ email: data.email, password: data.password });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header igual */}
        
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email requerido",
                validate: (value) => value.includes("@") || "Email inválido",
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, errors.email && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
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
                    secureTextEntry
                    style={[styles.input, errors.password && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                  />
                  {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                </>
              )}
            />
          </View>

          <Button
            label={isPending ? "Entrando..." : "Entrar"}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          />
        </View>
        
        {/* Footer igual */}
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
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    textAlign: "right",
    marginTop: -4,
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
function setError(arg0: string, arg1: { message: string; }) {
  throw new Error("Function not implemented.");
}


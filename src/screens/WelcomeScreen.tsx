import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/router/AuthStack";
import colors from "@/constants/colors";
import Button from "@/components/Button";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const { height: screenHeight } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white[100] }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white[100]} />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingBottom: screenHeight > 800 ? 100 : 50,
        }}
      >
        {/* Logo */}
        <View style={{ marginBottom: 40 }}>
          <Image
            source={{
              uri: "https://via.placeholder.com/120x120/006AB5/FFFFFF?text=Logo",
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              backgroundColor: colors.primary[500],
            }}
          />
        </View>

        {/* Título */}
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: colors.gray[900],
            textAlign: "center",
            marginBottom: 16,
            lineHeight: 40,
          }}
        >
          Bienvenido
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: colors.gray[500],
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 48,
          }}
        >
          Inicia sesión o crea una cuenta para continuar
        </Text>

        {/* Botones */}

        <View style={{ width: "100%", gap: 16 }}>
          <Button
            title="Iniciar Sesión"
            variant="primary"
            onPress={() => navigation.navigate("Login")}
          />

          <Button
            title="Registrarse"
            variant="secondary"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </View>
    </View>
  );
}

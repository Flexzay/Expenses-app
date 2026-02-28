import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "@/components/Button";
import colors from "@/constants/colors";

export const LoginScreen = ({ navigation }: any) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    console.log("Login:", { nickname, password });
    // navigation.navigate('Home');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.white[100] }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.white[100]}
        />

        <View
          style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
        >
          {/* Título */}
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: colors.gray[900],
              textAlign: "center",
              marginBottom: 8,
              lineHeight: 40,
            }}
          >
            Iniciar Sesión
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.gray[500],
              textAlign: "center",
              marginBottom: 48,
              lineHeight: 24,
            }}
          >
            Ingresa tu nickname y contraseña
          </Text>

          {/* Campo Nickname */}
          <View style={{ marginBottom: 24 }}>
            <TextInput
              style={{
                backgroundColor: colors.gray[50],
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                fontSize: 16,
                color: colors.gray[900],
                borderWidth: 1,
                borderColor: colors.gray[200],
                minHeight: 56,
              }}
              placeholder="Nickname"
              placeholderTextColor={colors.gray[400]}
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          {/* Campo Password con ojo */}
          <View style={{ marginBottom: 32 }}>
            <TextInput
              ref={passwordRef}
              style={{
                backgroundColor: colors.gray[50],
                paddingHorizontal: 16,
                paddingVertical: 16,
                paddingRight: 50,
                borderRadius: 12,
                fontSize: 16,
                color: colors.gray[900],
                borderWidth: 1,
                borderColor: colors.gray[200],
                minHeight: 56,
              }}
              placeholder="Contraseña"
              placeholderTextColor={colors.gray[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                marginTop: -12,
              }}
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>

          {/* Botón Login */}
          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            variant="primary"
          />

          {/* Link Register */}
          <TouchableOpacity
            style={{
              marginTop: 24,
              paddingVertical: 12,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.primary[500],
                fontWeight: "500",
              }}
            >
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

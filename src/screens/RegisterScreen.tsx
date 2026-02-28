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
  ScrollView,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Button from "@/components/Button";
import colors from "@/constants/colors";

export const RegisterScreen = ({ navigation }: any) => {
  const [documentType, setDocumentType] = useState("Cédula"); 
  
  const [documentNumber, setDocumentNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDocumentOptions, setShowDocumentOptions] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);

  const documentTypes = ["Cédula", "Cédula de Extranjería", "Pasaporte", "NIT"];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    Keyboard.dismiss();
    console.log("Register:", { documentType, documentNumber, nickname, password });
    // navigation.navigate('Home');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white[100] }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white[100]} />
        
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 50 }}>
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
            Crear Cuenta
          </Text>
          
          <Text
            style={{
              fontSize: 16,
              color: colors.gray[500],
              textAlign: "center",
              marginBottom: 32,
              lineHeight: 24,
            }}
          >
            Completa tus datos para registrarte
          </Text>

          {/* Tipo de Documento */}
          <View style={{ marginBottom: 24 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.gray[50],
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.gray[200],
                minHeight: 56,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => setShowDocumentOptions(!showDocumentOptions)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: colors.gray[900] }}>{documentType}</Text>
              <MaterialIcons name={showDocumentOptions ? "expand-less" : "expand-more"} size={24} color={colors.gray[500]} />
            </TouchableOpacity>
            
            {showDocumentOptions && (
              <View
                style={{
                  backgroundColor: colors.gray[50],
                  borderRadius: 12,
                  marginTop: 8,
                  maxHeight: 200,
                  borderWidth: 1,
                  borderColor: colors.gray[200],
                }}
              >
                {documentTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.gray[200],
                    }}
                    onPress={() => {
                      setDocumentType(type);
                      setShowDocumentOptions(false);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: colors.gray[900] }}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Número de Documento */}
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
              placeholder="Número de documento"
              placeholderTextColor={colors.gray[400]}
              value={documentNumber}
              onChangeText={setDocumentNumber}
              keyboardType="numeric"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => nicknameRef.current?.focus()}
            />
          </View>

          {/* Nickname */}
          <View style={{ marginBottom: 24 }}>
            <TextInput
              ref={nicknameRef}
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

          {/* Password */}
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
              onSubmitEditing={handleRegister}
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

          {/* Botón Register */}
          <Button
            title="Registrarse"
            onPress={handleRegister}
            variant="primary"
          />

          {/* Link Login */}
          <TouchableOpacity
            style={{
              marginTop: 24,
              paddingVertical: 12,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ fontSize: 16, color: colors.primary[500], fontWeight: "500" }}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/router/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Bienvenido</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
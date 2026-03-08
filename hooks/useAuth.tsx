// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { loginService, profileService, registerService } from "@/services/auth";
import { setToken } from "@/services/api";

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.replace("/(main)/(tabs)/home"); 
    },
    onError: (error) => {
      Alert.alert("Error", "Registro falló. Verifica tus datos.");
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.replace("/(main)/(tabs)/home"); 
    },
    onError: (error) => {
      Alert.alert("Error", "Email o contraseña incorrectos.");
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileService,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await setToken(null);
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/(auth)/login");
    },
  });
}

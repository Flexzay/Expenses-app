import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { loginService, logoutService, profileService, registerService } from "@/services/auth";
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
    staleTime: 0,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/welcome"); 
    },
    onError: () => {
      setToken(null);
      queryClient.clear();
      router.replace("/welcome");
    },
  });
}
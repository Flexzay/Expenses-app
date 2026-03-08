import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { createCategoryService } from "@/services/categories";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo crear la categoría.");
    },
  });
}
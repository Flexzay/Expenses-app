import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { deleteCategoryService } from "@/services/categories";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryService,
    onSuccess: () => {
      // Refresca la lista de categorías automáticamente
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo eliminar la categoría. Tal vez tiene gastos asociados.");
    },
  });
}
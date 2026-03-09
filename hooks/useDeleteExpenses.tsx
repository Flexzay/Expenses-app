import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { deleteExpenseService } from "@/services/expenses";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpenseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo eliminar el gasto.");
    },
  });
}
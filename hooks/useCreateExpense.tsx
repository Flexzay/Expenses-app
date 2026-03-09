import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { createExpenseService } from "@/services/expenses";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });

    },
    onError: () => {
      Alert.alert("Error", "No se pudo guardar el gasto.");
    },
  });
}
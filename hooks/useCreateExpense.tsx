import { createExpenseService } from "@/services/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] });
      queryClient.invalidateQueries({ queryKey: ["wealth", "summary"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo guardar el gasto.");
    },
  });
}

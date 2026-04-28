import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { deleteExpenseService } from "@/services/expenses";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpenseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] })
      queryClient.invalidateQueries({ queryKey: ["wealth", "summary"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo eliminar el gasto.");
    },
  });
}
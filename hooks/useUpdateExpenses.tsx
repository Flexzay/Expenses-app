import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { updateExpenseService, UpdateExpensePayload } from "@/services/expenses";

export function useUpdateExpense(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateExpensePayload) => updateExpenseService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses", id] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] });
      queryClient.invalidateQueries({ queryKey: ["wealth", "summary"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo actualizar el gasto.");
    },
  });
}
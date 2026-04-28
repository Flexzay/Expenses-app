import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAmountService } from "@/services/amount";
import { Alert } from "react-native";

export function useUpdateAmount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAmountService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo actualizar el monto.");
    },
  });
}
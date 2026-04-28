import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { createCollaboratorService } from "@/services/collaborators";

export function useCreateCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollaboratorService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo agregar el colaborador.");
    },
  });
}
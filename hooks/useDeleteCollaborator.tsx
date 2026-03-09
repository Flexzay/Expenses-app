import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { deleteCollaboratorService } from "@/services/collaborators";

export function useDeleteCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollaboratorService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo eliminar el colaborador.");
    },
  });
}
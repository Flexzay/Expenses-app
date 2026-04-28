import { deleteCollaboratorService } from "@/services/collaborators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useDeleteCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollaboratorService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo eliminar el colaborador.");
    },
  });
}

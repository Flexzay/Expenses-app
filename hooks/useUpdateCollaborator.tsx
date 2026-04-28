import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { updateCollaboratorService, UpdateCollaboratorPayload } from "@/services/collaborators";

export function useUpdateCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCollaboratorPayload }) =>
      updateCollaboratorService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
       queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      Alert.alert("Error", "No se pudo actualizar el colaborador.");
    },
  });
}
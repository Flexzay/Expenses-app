import { useQuery } from "@tanstack/react-query";
import { getCollaboratorsService } from "@/services/collaborators";

export function useCollaborators() {
  return useQuery({
    queryKey: ["collaborators"],
    queryFn: getCollaboratorsService,
    staleTime: 0,
  });
}
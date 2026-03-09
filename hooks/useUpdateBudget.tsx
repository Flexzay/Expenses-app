import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBudgetService, UpdateBudgetPayload } from "@/services/budgets";

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBudgetPayload }) =>
      updateBudgetService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBudgetService, CreateBudgetPayload } from "@/services/budgets";

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => createBudgetService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] });
    },
  });
}
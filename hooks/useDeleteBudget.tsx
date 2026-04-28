import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudgetService } from "@/services/budgets";

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBudgetService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "daily"] });
    },
  });
}
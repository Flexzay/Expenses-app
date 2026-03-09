import { useQuery } from "@tanstack/react-query";
import { getBudgetsService } from "@/services/budgets";

export function useBudgets(month?: number, year?: number) {
  return useQuery({
    queryKey: ["budgets", month, year],
    queryFn: () => getBudgetsService(month, year),
    staleTime: 0,
  });
}
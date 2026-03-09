import { useQuery } from "@tanstack/react-query";
import { getExpenseService } from "@/services/expenses";

export function useExpense(id: number) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => getExpenseService(id),
    staleTime: 0,
    retry: 1,
    enabled: !!id,
  });
}
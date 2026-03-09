import { useQuery } from "@tanstack/react-query";
import { getExpensesService } from "@/services/expenses";

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpensesService,
    staleTime: 0,
    retry: 1,
  });
}
import { useProfile } from "@/hooks/useAuth";
import { formatCOP } from "@/utils/currency";
import { useExpenses } from "@/hooks/useExpenses";


export function useMonthlyLimit() {
  const { data: profile } = useProfile();
  const { data: expenses } = useExpenses();

  const monthlyLimit = profile?.monthly_amount ?? 0;
  
  // Suma gastos del mes actual
  const currentMonthExpenses = expenses?.filter(exp => 
    new Date(exp.expense_date).getMonth() === new Date().getMonth() &&
    new Date(exp.expense_date).getFullYear() === new Date().getFullYear()
  ) ?? [];
  
  const spentThisMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = Math.max(0, monthlyLimit - spentThisMonth);

  return {
    monthlyLimit,
    spentThisMonth,
    remaining,
    remainingFormatted: formatCOP(remaining),
    isOverLimit: remaining <= 0,
    percentageUsed: monthlyLimit > 0 ? (spentThisMonth / monthlyLimit) * 100 : 0
  };
}

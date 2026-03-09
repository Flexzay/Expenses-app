import { useProfile } from "@/hooks/useAuth";
import { useExpenses } from "@/hooks/useExpenses";

export function useMonthlyLimit() {
  const { data: profile } = useProfile();
  const { data: expenses } = useExpenses();

  const monthlyLimit = profile?.total_budget ?? 0;

  const now = new Date();
  const spentThisMonth =
    expenses
      ?.filter((e) => {
        const d = new Date(e.expense_date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((acc, e) => acc + e.amount, 0) ?? 0;

  const remaining = Math.max(monthlyLimit - spentThisMonth, 0);

  return { monthlyLimit, spentThisMonth, remaining };
}

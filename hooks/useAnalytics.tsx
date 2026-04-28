import { useQuery } from "@tanstack/react-query";
import { getDailyAnalyticsService } from "@/services/analytics";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "daily"],
    queryFn: getDailyAnalyticsService,
    staleTime: 1000 * 60 * 5, 
  });
}
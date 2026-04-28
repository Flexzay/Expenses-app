import { useQuery } from "@tanstack/react-query";
import { getWealthSummaryService } from "@/services/wealth";

export function useWealthSummary() {
  return useQuery({
    queryKey: ["wealth", "summary"],
    queryFn: getWealthSummaryService,
  });
}
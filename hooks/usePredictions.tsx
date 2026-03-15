import { getMonthlyPredictionsService, MonthlyPredictionsResponse } from "@/services/predictions";
import { useQuery } from "@tanstack/react-query";


export const PREDICTIONS_QUERY_KEY = ["predictions", "monthly"] as const;

export function useMonthlyPredictions() {
  return useQuery<MonthlyPredictionsResponse, Error>({
    queryKey: PREDICTIONS_QUERY_KEY,
    queryFn: getMonthlyPredictionsService,
    staleTime: 1000 * 60 * 5,  
  });
}
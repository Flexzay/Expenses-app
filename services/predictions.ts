import { request } from "./request";

export type MonthlyHistoryItem = {
  month: string;
  year: number;
  amount: number;
};

export type CurrentMonthStats = {
  month: string;
  year: number;
  spent_so_far: number;
  daily_rate: number;
  days_elapsed: number;
  days_in_month: number;
  projected_amount: number;
};

export type MonthlyPredictionsResponse = {
  history: MonthlyHistoryItem[];
  current_month: CurrentMonthStats;
  prediction: number;
  trend_pct: number;
  average: number;
};

export async function getMonthlyPredictionsService() {
  return request<MonthlyPredictionsResponse>("get", "/predictions/monthly");
}
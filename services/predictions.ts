import { request } from "./request";

export type MonthlyPrediction = {
  month: string;           // e.g. "2026-03"
  predicted_amount: number;
  actual_amount?: number;
  category_id?: number;
  category?: string;
};

export type MonthlyPredictionsResponse = {
  predictions: MonthlyPrediction[];
  // ajusta según lo que devuelva tu API
};

export async function getMonthlyPredictionsService() {
  return request<MonthlyPredictionsResponse>("get", "/predictions/monthly");
}
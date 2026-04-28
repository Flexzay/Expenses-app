import { request } from "./request";

export interface DailyDataPoint {
  day: number;
  spent_today: number;
  cumulative: number;
}

export interface AnalyticsResponse {
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  calculus: {
    current_velocity: number;
    acceleration: number;
    acceleration_status: "Acelerando" | "Frenando" | "Constante";
  };
  statistics: {
    daily_mean: number;
    standard_deviation: number;
    volatility_status: "Alta volatilidad" | "Estable";
  };
  projection: {
    end_of_month_estimate: number;
    will_exceed_budget: boolean;
  };
  daily_series: DailyDataPoint[];
}

export async function getDailyAnalyticsService() {
  return request<AnalyticsResponse>("get", "/analytics/daily");
}
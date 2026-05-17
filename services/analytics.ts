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
    instant_velocity: number;
    acceleration: number;
    acceleration_status: "Acelerando" | "Frenando" | "Constante";
  };
  statistics: {
    daily_mean: number;
    median: number;
    mode_category: string;
    mode_count: number;
    expected_value: number;
    percentile_90: number;
    standard_deviation: number;
    coefficient_of_variation: number;
    volatility_status: "Alta volatilidad" | "Estable";
  };
  probability: {
    zero_spend_prob: number;
    z_score: number;
    binomial_success_prob: number;
    binomial_n_days: number;
    binomial_k_target: number;
  };
  projection: {
    end_of_month_estimate: number;
    optimistic_estimate: number;
    pessimistic_estimate: number;
    margin_of_error: number;
    confidence_level: string;
    will_exceed_budget: boolean;
  };
  insights: {
    weekend_overspend_risk: number;
    is_weekend_today: boolean;
  };
  daily_series: DailyDataPoint[];
}

export async function getDailyAnalyticsService() {
  return request<AnalyticsResponse>("get", "/analytics/daily");
}
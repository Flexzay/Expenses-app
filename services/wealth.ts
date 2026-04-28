import { request } from "./request";

export interface WealthSummary {
  total_incomes: number;
  total_expenses: number;
  free_cash_flow: number;
}

export async function getWealthSummaryService() {
  return request<WealthSummary>("get", "/wealth/summary");
}
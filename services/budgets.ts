import { request } from "./request";

export type Budget = {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  spent: number; // calculado por el backend
  month: number;
  year: number;
  category: { id: number; name: string; type: string };
  created_at: string;
  updated_at: string;
};

export type CreateBudgetPayload = {
  category_id: number;
  amount: number;
  month: number;
  year: number;
};

export type UpdateBudgetPayload = {
  amount: number;
};

export function getBudgetsService(month?: number, year?: number) {
  const m = month ?? new Date().getMonth() + 1;
  const y = year  ?? new Date().getFullYear();
  return request<Budget[]>("get", `/budgets?month=${m}&year=${y}`);
}

export function createBudgetService(payload: CreateBudgetPayload) {
  return request<Budget>("post", "/budgets", payload);
}

export function updateBudgetService(id: number, payload: UpdateBudgetPayload) {
  return request<Budget>("put", `/budgets/${id}`, payload);
}

export function deleteBudgetService(id: number) {
  return request<{ message: string }>("delete", `/budgets/${id}`);
}
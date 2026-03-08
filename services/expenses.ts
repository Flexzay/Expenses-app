import { request } from "./request";
import { Category } from "./categories";

export type Expense = {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  amount: number;
  description?: string;
  expense_date: string;
  created_at?: string;
  updated_at?: string;
  category?: Category;
};

export type CreateExpensePayload = {
  category_id: number;
  title: string;
  amount: number;
  description?: string;
  expense_date: string;
};

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export async function getExpensesService() {
  return request<Expense[]>("get", "/expenses");
}

export async function getExpenseService(id: number) {
  return request<Expense>("get", `/expenses/${id}`);
}

export async function createExpenseService(payload: CreateExpensePayload) {
  return request<Expense>("post", "/expenses", payload);
}

export async function updateExpenseService(id: number, payload: UpdateExpensePayload) {
  return request<Expense>("put", `/expenses/${id}`, payload);
}

export async function deleteExpenseService(id: number) {
  return request<{ message: string }>("delete", `/expenses/${id}`);
}
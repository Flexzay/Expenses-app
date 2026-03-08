import { request } from "./request";

export type Category = {
  id: number;
  name: string;
  type: "expense";
  created_at?: string;
  updated_at?: string;
};

type CreateCategoryPayload = {
  name: string;
  type: "expense";
};

export async function getCategoriesService() {
  return request<Category[]>("get", "/categories");
}

export async function createCategoryService(payload: CreateCategoryPayload) {
  return request<Category>("post", "/categories", payload);
}
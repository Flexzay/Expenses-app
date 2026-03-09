import { request } from "./request";
import { setToken } from "./api";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user?: any;
};

export type Profile = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  monthly_amount: number;
  collaborators_total: number; 
  total_budget: number;       
  created_at: string;
  updated_at: string;
};

export async function registerService(payload: RegisterPayload) {
  const data = await request<AuthResponse>("post", "/register", payload);
  await setToken(data.token);
  return data;
}

export async function loginService(payload: LoginPayload) {
  const data = await request<AuthResponse>("post", "/login", payload);
  await setToken(data.token);
  return data;
}

export async function profileService() {
  return request<Profile>("get", "/profile");
}

export async function logoutService() {
  await request("post", "/logout");
  await setToken(null);
}
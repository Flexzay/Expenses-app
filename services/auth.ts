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
  return request<any>("get", "/profile");
}
import { api, getToken } from "./api";

type Method = "get" | "post" | "put" | "patch" |"delete";

type RequestConfig = {
  token?: string | null;
};

export async function request<T = any>(
  method: Method,
  url: string,
  data?: any,
  cfg?: RequestConfig
): Promise<T> {
  const tk = cfg?.token ?? (await getToken()); 
  const headers: Record<string, string> = {};

  if (tk) {
    headers.Authorization = `Bearer ${tk}`;
  }

  const res = await api.request<T>({
    method,
    url,
    data,
    headers,
  });

  return res.data;
}

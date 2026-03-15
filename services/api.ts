import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.3:8000";
// const BASE_URL = "http://172.20.10.3:8000";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "auth_token";

export async function setToken(token: string | null) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.Authorization;
  }
}

export async function getToken() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
  return token;
}
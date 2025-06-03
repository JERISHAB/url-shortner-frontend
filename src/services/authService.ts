import api from "./api";
import { setToken, removeToken } from "../utils/token";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  setToken(res.data.token);
  return res.data;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  return await api.post("/auth/register", {username,email, password });
};

export const logout = () => {
  removeToken();
};

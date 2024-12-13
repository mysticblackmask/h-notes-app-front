import API from "./api";
import { jwtDecode } from "jwt-decode";

export const login = (email: string, password: string) => {
  return API.post<{
    access: string;
    refresh: string;
  }>("/notesapp/login/", { email, password });
};

export const refreshToken = () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token available");
  localStorage.removeItem("access_token");
  API.post<{ access: string; refresh: string }>("/notesapp/gettoken/", {
    refresh,
  })
    .then((res) => {
      localStorage.setItem("access_token", res.data.access);
    })
    .catch((err) => {
      return false;
    });
  return true;
};

export const isTokenExpired = (token: string): boolean => {
  const decoded: { exp: number } = jwtDecode<{ exp: number }>(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const regist = (
  username: string,
  surname: string,
  email: string,
  password: string
) => {
  return API.post<{ message: string }>("/notesapp/register/", {
    username,
    surname,
    email,
    password,
  });
};
export const logout = () => {
  localStorage.removeItem("access_token");
  const refresh = localStorage.getItem("refresh_token");
  return API.post<{ message: string }>("/notesapp/logout/", { refresh });
};

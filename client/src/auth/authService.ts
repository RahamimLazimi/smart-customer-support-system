import { jwtDecode } from "jwt-decode";

export interface JwtUser {
  name: string;
  role: string;
}

export const getUserFromToken = (): JwtUser | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<JwtUser>(token);
  } catch {
    return null;
  }
};
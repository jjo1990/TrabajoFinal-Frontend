import type { IUser } from "../types/IUser";
import { getUser, removeUser } from "./localStorage";


export const saveUserSession = (user: IUser) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUserSession = (): IUser | null => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem("userData");
  window.location.href = "/index.html";
};

export const requireAuth = (role?: "admin" | "cliente") => {
  const user = getUserSession();
  if (!user) {
    window.location.href = "/index.html";
    return;
  }
  if (role && user.role !== role) {
    alert("No tienes permisos para acceder a esta página");
    window.location.href = "/index.html";
  }
};

// Inicializa la página, valida login y rol
export const initPage = (role?: "admin" | "cliente"): IUser | null => {
  requireAuth(role);          // valida sesión y rol
  return getUserSession();    // devuelve usuario para usar en la página
};
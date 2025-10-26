import type { IUser } from "../types/IUser";

export const saveUser = (user: IUser) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUser = (): IUser | null => {
  const user = localStorage.getItem("userData");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem("userData");
};
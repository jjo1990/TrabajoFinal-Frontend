// src/utils/api.ts
const BASE_URL = "http://localhost:8085/api"; // Cambia según tu configuración

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

// Login
export async function loginUser(user: IUserLogin) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al iniciar sesión");
  }
  return res.json(); // Devuelve usuario y token si tu API lo envía
}

// Registro
export async function registerUser(user: IUserRegister) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al registrarse");
  }
  return res.json();
}

//crud prodructos
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }
  return res.json();
}



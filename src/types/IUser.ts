// src/types/IUser.ts
export interface IUser {
  id: number;        // ID del usuario en la base de datos
  name: string;      // Nombre completo
  email: string;     // Correo electrónico
  role: "admin" | "cliente"; // Rol del usuario
  
}
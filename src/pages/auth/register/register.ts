// src/pages/auth/register/register.ts
import { registerUser } from "../../../utils/api";
import { saveUserSession } from "../../../utils/auth";

const form = document.getElementById("formRegistro") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = (document.getElementById("nombre") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const confirm = (document.getElementById("confirmar") as HTMLInputElement).value;

  if (password !== confirm) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const user = await registerUser({ name, email, password });
    saveUserSession(user);
    window.location.href = user.role === "admin" ? "/src/pages/admin/adminHome/adminHome.html" : "/src/pages/store/home/home.html";
  } catch (err: any) {
    alert(err.message);
  }
});
// src/pages/auth/login/login.ts
import { loginUser } from "../../../utils/api";
import { saveUserSession } from "../../../utils/auth";

const form = document.getElementById("formlogin") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("contraseña") as HTMLInputElement).value;
  
 

  try {
    const user = await loginUser({ email, password });
    saveUserSession(user);
    window.location.href = user.role === "admin" ? "/src/pages/admin/adminHome/adminHome.html" : "/src/pages/client/home/home.html";
  } catch (err: any) {
    alert(err.message);
  }
});
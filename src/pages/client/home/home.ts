// src/pages/store/home/home.ts
import { initPage } from "../../../utils/auth";

const user = initPage("cliente"); // solo clientes pueden acceder

// Mostrar nombre en la página
const welcome = document.getElementById("welcome");
if (welcome && user) {
  welcome.textContent = `Bienvenido, ${user.name}`;
}

// Logout
const btnLogout = document.getElementById("btnLogout");
btnLogout?.addEventListener("click", () => {
  localStorage.removeItem("userData");
  window.location.href = "/index.html";
});
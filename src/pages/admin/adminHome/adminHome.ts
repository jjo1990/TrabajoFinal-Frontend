// src/pages/admin/adminHome/adminHome.ts
import { initPage } from "../../../utils/auth";

const user = initPage("admin"); // solo admins pueden acceder

// Mostrar nombre en la página si querés
const welcome = document.getElementById("welcome");
if (welcome && user) {
  welcome.textContent = `Bienvenido, ${user.name}`;
}

// Botón de logout
const btnLogout = document.getElementById("btnLogout");
btnLogout?.addEventListener("click", () => {
  localStorage.removeItem("userData");
  window.location.href = "/index.html";
});

// Theme toggle: cambia entre paleta por defecto y alternativa
const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "adminTheme";

function applySavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "alt") {
      document.documentElement.classList.add("theme-alt");
    } else {
      document.documentElement.classList.remove("theme-alt");
    }
  } catch (e) {
    // no hacer nada si falla localStorage
  }
}

applySavedTheme();

themeToggle?.addEventListener("click", () => {
  const isAlt = document.documentElement.classList.toggle("theme-alt");
  try {
    localStorage.setItem(THEME_KEY, isAlt ? "alt" : "default");
  } catch (e) {
    // ignore
  }
});
// Detectar preferencia del sistema
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Leer memoria previa
let saved = localStorage.getItem("theme");

if (!saved) {
    saved = systemDark ? "dark" : "light";
}

document.documentElement.setAttribute("data-theme", saved);

// Botón de cambio
const btn = document.getElementById("themeToggle");
btn.textContent = saved === "dark" ? "☀️" : "🌙";

btn.addEventListener("click", () => {
    let cur = document.documentElement.getAttribute("data-theme");
    let next = cur === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

    btn.textContent = next === "dark" ? "☀️" : "🌙";
});

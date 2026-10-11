/* =========================================================
   NEXO · Interacciones
   ========================================================= */

// Número de WhatsApp en formato internacional, solo dígitos.
// Ejemplo México: "5215512345678". Mientras esté vacío, WhatsApp
// pedirá elegir el contacto al abrir el enlace.
const WHATSAPP_NUMBER = "";

const DEFAULT_MESSAGE = "Hola NEXO, me interesa una página web para mi negocio. ¿Podemos hablar?";

document.documentElement.classList.add("js");

function whatsappUrl(message) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  const waFloat = document.querySelector(".wa-float");

  /* ---------- Barra al desplazarse ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    waFloat.classList.toggle("is-visible", y > window.innerHeight * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  menu.hidden = false;
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Enlace activo en la navegación ---------- */
  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Animaciones de aparición ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Enlaces de WhatsApp ---------- */
  document.querySelectorAll(".js-whatsapp").forEach((a) => {
    a.href = whatsappUrl(DEFAULT_MESSAGE);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Servicio preseleccionado desde las tarjetas ---------- */
  const form = document.getElementById("quoteForm");
  const select = document.getElementById("f-service");
  document.querySelectorAll("[data-service]").forEach((a) => {
    a.addEventListener("click", () => {
      const option = [...select.options].find((o) => o.text === a.dataset.service);
      if (option) select.value = option.value;
    });
  });

  /* ---------- Formulario → WhatsApp ---------- */
  const error = document.getElementById("formError");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("nombre") || "").trim();
    const business = (data.get("negocio") || "").trim();
    const service = data.get("servicio") || "";
    const message = (data.get("mensaje") || "").trim();

    form.querySelector("#f-name").parentElement.classList.toggle("is-invalid", !name);
    select.parentElement.classList.toggle("is-invalid", !service);
    if (!name || !service) {
      error.hidden = false;
      return;
    }
    error.hidden = true;

    const lines = [
      "Hola NEXO, quiero solicitar una cotización.",
      "",
      `• Nombre: ${name}`,
      business && `• Negocio: ${business}`,
      `• Servicio: ${service}`,
      message && `• Proyecto: ${message}`,
    ].filter((l) => typeof l === "string");

    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});

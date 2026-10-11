/* =========================================================
   NEXO · Interacciones
   ========================================================= */

// Número de WhatsApp en formato internacional, solo dígitos.
// Ejemplo México: "5215512345678". Mientras esté vacío, WhatsApp
// pedirá elegir el contacto al abrir el enlace.
const WHATSAPP_NUMBER = "526731144723";

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

  /* ---------- Fotos bajo demanda ---------- */
  // Las fotos usan data-img y solo se descargan cuando se van a ver.
  const loadImages = (root) => {
    const els = root.matches?.("[data-img]") ? [root] : [];
    els.concat([...root.querySelectorAll("[data-img]")]).forEach((el) => {
      el.style.setProperty("--img", `url('${el.dataset.img}')`);
      el.removeAttribute("data-img");
    });
  };
  const lazyEls = [...document.querySelectorAll("[data-img]")].filter((el) => !el.closest(".showcase"));
  if ("IntersectionObserver" in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImages(entry.target);
        imgObserver.unobserve(entry.target);
      });
    }, { rootMargin: "400px 0px" });
    lazyEls.forEach((el) => imgObserver.observe(el));
  } else {
    lazyEls.forEach(loadImages);
  }

  /* ---------- Carrusel de estilos en los dispositivos ---------- */
  const showcase = document.querySelector(".showcase");
  if (showcase) {
    const SLIDE_MS = 5000;
    const tabs = [...showcase.querySelectorAll(".showcase__tab")];
    const laptopSlides = [...showcase.querySelectorAll(".laptop__screen > .site")];
    const phoneSlides = [...showcase.querySelectorAll(".phone > .site")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let timer = null;

    showcase.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);

    // Carga las fotos del estilo indicado (y del siguiente, para que el cambio sea fluido)
    const loadSlide = (i) => {
      [laptopSlides, phoneSlides].forEach((list) => list[i % list.length] && loadImages(list[i % list.length]));
    };
    loadSlide(0);
    // El segundo estilo se precarga después, para no competir con la carga inicial
    window.addEventListener("load", () => setTimeout(() => loadSlide(1), 1500));

    const show = (i) => {
      current = (i + tabs.length) % tabs.length;
      loadSlide(current);
      loadSlide(current + 1);
      [laptopSlides, phoneSlides, tabs].forEach((list) =>
        list.forEach((el, j) => el.classList.toggle("is-active", j === current))
      );
      // Reinicia la barra de progreso de la pestaña activa
      const active = tabs[current];
      active.classList.remove("is-active");
      void active.offsetWidth;
      active.classList.add("is-active");
    };
    const start = () => {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), SLIDE_MS);
      showcase.classList.remove("is-paused");
    };
    const stop = () => {
      clearInterval(timer);
      showcase.classList.add("is-paused");
    };

    tabs.forEach((tab, i) => tab.addEventListener("click", () => { show(i); start(); }));
    showcase.addEventListener("mouseenter", stop);
    showcase.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if (reduceMotion) showcase.classList.add("is-paused");
    start();
  }

  /* ---------- Comparador antes / después ---------- */
  const compare = document.getElementById("compare");
  if (compare) {
    const range = compare.querySelector(".compare__range");
    const update = () => compare.style.setProperty("--pos", `${range.value}%`);
    range.addEventListener("input", update);
    update();
  }

  document.getElementById("year").textContent = new Date().getFullYear();
});

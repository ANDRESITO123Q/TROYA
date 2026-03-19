/* ═══════════════════════════════════════
   TROYA — script.js
═══════════════════════════════════════ */

/* ── Pantalla de transición ── */
function iniciarTransicion(href, texto) {
  const overlay = document.getElementById("page-transition");
  if (!overlay) { window.location.href = href; return; }
  const bar   = document.getElementById("tr-bar");
  const label = overlay.querySelector(".tr-label");
  if (label && texto) label.textContent = texto + "...";
  overlay.classList.add("show");
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 20 + 8;
    if (p >= 92) { p = 92; clearInterval(iv); }
    if (bar) bar.style.width = p + "%";
  }, 80);
  setTimeout(() => {
    if (bar) bar.style.width = "100%";
    clearInterval(iv);
    setTimeout(() => { window.location.href = href; }, 350);
  }, 950);
}

document.addEventListener("DOMContentLoaded", () => {

  /* ── Entrada de página ── */
  window.addEventListener("load", () => { document.body.classList.add("ready"); });
  setTimeout(() => { document.body.classList.add("ready"); }, 100);

  /* ── Interceptar links con transición ── */
  document.querySelectorAll('a[href="planes.html"]').forEach(a => {
    a.addEventListener("click", e => { e.preventDefault(); iniciarTransicion("planes.html","Cargando planes"); });
  });
  document.querySelectorAll('a[href="login.html"]').forEach(a => {
    a.addEventListener("click", e => { e.preventDefault(); iniciarTransicion("login.html","Accediendo"); });
  });

  /* ── Scroll reveal (anim-item) ── */
  const animItems = document.querySelectorAll(".anim-item");
  animItems.forEach(el => {
    el.style.opacity   = "0";
    el.style.transition = "opacity .8s ease, transform .8s ease";
    const t = el.dataset.anim;
    if (t === "fadeUp")    el.style.transform = "translateY(38px)";
    if (t === "fadeLeft")  el.style.transform = "translateX(-40px)";
    if (t === "fadeRight") el.style.transform = "translateX(40px)";
    if (t === "zoomIn")    el.style.transform = "scale(.93)";
  });
  const io1 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || "0");
      setTimeout(() => { e.target.style.opacity = "1"; e.target.style.transform = "none"; }, delay);
      io1.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  animItems.forEach(el => io1.observe(el));

  /* ── Scroll reveal (.sr) ── */
  const io2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || "0");
      setTimeout(() => e.target.classList.add("visible"), delay);
      io2.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".sr,.sr-l,.sr-r").forEach(el => io2.observe(el));

  /* ── Navbar ── */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  function scrollSpy() {
    navbar.style.boxShadow = window.scrollY > 10 ? "0 2px 20px rgba(0,0,0,.12)" : "0 2px 16px rgba(0,0,0,.09)";
    let cur = "";
    sections.forEach(s => { if (s.getBoundingClientRect().top <= window.innerHeight * .45) cur = s.id; });
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + cur));
  }
  window.addEventListener("scroll", scrollSpy, { passive: true });
  scrollSpy();

  /* ── Hamburguesa ── */
  const ham  = document.getElementById("hamburger");
  const menu = document.getElementById("nav-menu");
  if (ham && menu) {
    const open  = () => { ham.classList.add("open"); menu.classList.add("open"); ham.setAttribute("aria-expanded","true"); document.body.style.overflow="hidden"; };
    const close = () => { ham.classList.remove("open"); menu.classList.remove("open"); ham.setAttribute("aria-expanded","false"); document.body.style.overflow=""; };
    ham.addEventListener("click", e => { e.stopPropagation(); ham.classList.contains("open") ? close() : open(); });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    document.addEventListener("click", e => { if (menu.classList.contains("open") && !navbar.contains(e.target)) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const t = document.querySelector(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 70), behavior: "smooth" });
    });
  });

  /* ── Parallax hero (desktop) ── */
  const heroBg = document.querySelector(".section-hero .bg");
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener("scroll", () => {
      if (window.scrollY < window.innerHeight * 1.2) heroBg.style.transform = `translateY(${window.scrollY * .2}px)`;
    }, { passive: true });
  }

  /* ── Tilt 3D tarjetas (desktop) ── */
  if (window.innerWidth > 900) {
    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top  - r.height/ 2) / (r.height/ 2);
        card.style.transform = `translateY(-14px) rotateX(${(-dy*6).toFixed(1)}deg) rotateY(${(dx*6).toFixed(1)}deg)`;
        card.style.boxShadow = `${dx*-8}px ${dy*-8}px 40px rgba(0,0,0,.18)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .6s cubic-bezier(.25,.46,.45,.94), box-shadow .6s";
        card.style.transform = ""; card.style.boxShadow = "";
      });
    });
  }

  /* ── Hover foto equipo ── */
  const foto = document.querySelector(".equipo-foto");
  if (foto && window.innerWidth > 768) {
    foto.addEventListener("mousemove", e => {
      const r = foto.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top  - r.height/ 2) / (r.height/ 2);
      foto.style.transform = `scale(1.05) rotateX(${(-dy*8).toFixed(1)}deg) rotateY(${(dx*8).toFixed(1)}deg)`;
    });
    foto.addEventListener("mouseleave", () => { foto.style.transition = "transform .5s ease"; foto.style.transform = ""; });
  }

  /* ── Formulario de contacto ── */
  window.enviarMensaje = function() {
    const campos = [
      { id:"f-nombre", errId:"ferr-nombre", tipo:"text"  },
      { id:"f-email",  errId:"ferr-email",  tipo:"email" },
      { id:"f-msg",    errId:"ferr-msg",    tipo:"text"  },
    ];
    let valido = true;
    campos.forEach(({ id, errId, tipo }) => {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el||!err) return;
      const val = el.value.trim();
      el.style.borderColor = ""; el.style.boxShadow = ""; err.textContent = "";
      if (!val) {
        el.style.borderColor = "#e05454"; el.style.boxShadow = "0 0 0 3px rgba(224,84,84,.1)";
        err.textContent = "Este campo es obligatorio."; valido = false;
        el.style.animation = "shake .4s ease";
        el.addEventListener("animationend", () => { el.style.animation = ""; }, { once:true });
        return;
      }
      if (tipo === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        el.style.borderColor = "#e05454"; el.style.boxShadow = "0 0 0 3px rgba(224,84,84,.1)";
        err.textContent = "Ingresa un e-mail válido."; valido = false;
        el.style.animation = "shake .4s ease";
        el.addEventListener("animationend", () => { el.style.animation = ""; }, { once:true });
        return;
      }
      el.style.borderColor = "#5cb872"; el.style.boxShadow = "0 0 0 3px rgba(92,184,114,.1)";
    });
    if (!valido) return;
    ["f-nombre","f-email","f-msg"].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.borderColor = ""; el.style.boxShadow = ""; }
    });
    const btn    = document.getElementById("btn-enviar");
    const formOk = document.getElementById("form-ok");
    btn.classList.add("loading"); btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove("loading"); btn.disabled = false;
      ["f-nombre","f-email","f-tel","f-msg"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
      ["ferr-nombre","ferr-email","ferr-msg"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ""; });
      formOk.style.display   = "flex";
      formOk.style.animation = "slideInOk .5s cubic-bezier(.34,1.56,.64,1) both";
      setTimeout(() => {
        formOk.style.animation = "fadeOutDown .4s ease both";
        formOk.addEventListener("animationend", () => { formOk.style.display = "none"; formOk.style.animation = ""; }, { once:true });
      }, 6000);
    }, 1500);
  };
  // Limpiar error al escribir
  ["f-nombre","f-email","f-msg"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      el.style.borderColor = ""; el.style.boxShadow = "";
      const errId = id === "f-msg" ? "ferr-msg" : "ferr-" + id.replace("f-","");
      const err = document.getElementById(errId);
      if (err) err.textContent = "";
    });
  });

});

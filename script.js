/* ═══════════════════════════════════════
   TROYA — script.js
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Fade-in al hacer scroll ── */
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('hidden'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('hidden');
      io.unobserve(e.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));


  /* ── 2. Navbar scroll spy ── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function scrollSpy() {
    let current = '';
    sections.forEach(s => {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.45) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', scrollSpy, { passive: true });
  scrollSpy();


  /* ── 3. Hamburguesa ── */
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');

  function openMenu() {
    ham.classList.add('open');
    menu.classList.add('open');
    ham.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // evita scroll del fondo
  }
  function closeMenu() {
    ham.classList.remove('open');
    menu.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', (e) => {
    e.stopPropagation();
    ham.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Cerrar al hacer click en un link
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ── 4. Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
    });
  });


  /* ── 5. Parallax en hero (solo desktop) ── */
  const heroBg = document.querySelector('.section-hero .bg');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight)
        heroBg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }, { passive: true });
  }


  /* ── 6. Tilt 3D en tarjetas (solo desktop) ── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
        card.style.transform = `translateY(-10px) rotateX(${(-dy*4).toFixed(1)}deg) rotateY(${(dx*4).toFixed(1)}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
        card.style.transform  = '';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }


  /* ── 7. Formulario ── */
  const form   = document.getElementById('form');
  const formOk = document.getElementById('form-ok');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  function validate(field) {
    const err = field.closest('.fg')?.querySelector('.ferr');
    field.classList.remove('err');
    if (err) err.textContent = '';
    const v = field.value.trim();
    if (field.required && !v) {
      field.classList.add('err');
      if (err) err.textContent = 'Campo obligatorio.';
      return false;
    }
    if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      field.classList.add('err');
      if (err) err.textContent = 'E-mail inválido.';
      return false;
    }
    return true;
  }

  form.querySelectorAll('input, textarea').forEach(f => {
    f.addEventListener('blur',  () => validate(f));
    f.addEventListener('input', () => { if (f.classList.contains('err')) validate(f); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => { if (!validate(f)) ok = false; });
    if (!ok) return;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    await new Promise(r => setTimeout(r, 1500));
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    form.reset();
    formOk.classList.add('show');
    setTimeout(() => formOk.classList.remove('show'), 6000);
  });

});

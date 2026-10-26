// Portafolio — Daniel Esteban Rojas Sánchez

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 1. Menú móvil (aria-expanded, Escape y clic fuera)
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const setMenu = (open) => {
    menu.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
    navLinks.forEach((l) => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  // 2. Filtro de proyectos (botones con aria-pressed + anuncio de resultados)
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.project-card');
  const status = document.getElementById('filter-status');
  const grid = document.getElementById('projects-container');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => {
        const on = p === pill;
        p.classList.toggle('active', on);
        p.setAttribute('aria-pressed', String(on));
      });
      const filter = pill.dataset.filter;
      if (grid) grid.dataset.filter = filter;
      let count = 0;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          count++;
          if (!reduceMotion.matches) {
            card.animate(
              [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
              { duration: 450, easing: 'ease-out' }
            );
          }
        }
      });
      if (status) status.textContent = `${count} ${count === 1 ? 'proyecto' : 'proyectos'}`;
    });
  });

  // 3. Copiar correo (botón real + anuncio para lectores de pantalla)
  const copyBtn = document.getElementById('copy-status');
  const emailEl = document.getElementById('email-text');
  const live = document.getElementById('copy-live');

  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  };

  if (copyBtn && emailEl) {
    copyBtn.addEventListener('click', async () => {
      const email = emailEl.textContent.trim();
      let ok = true;
      try {
        await navigator.clipboard.writeText(email);
      } catch (_) {
        ok = fallbackCopy(email);
      }
      copyBtn.textContent = ok ? 'Copiado' : 'No se pudo copiar';
      copyBtn.classList.toggle('is-done', ok);
      if (live) live.textContent = ok ? 'Correo copiado al portapapeles' : 'No se pudo copiar el correo';
      setTimeout(() => {
        copyBtn.textContent = 'Copiar';
        copyBtn.classList.remove('is-done');
      }, 2200);
    });
  }

  // 4. Navegación activa (clase + aria-current, no solo color)
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const match = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', match);
        if (match) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach((s) => navObserver.observe(s));
});

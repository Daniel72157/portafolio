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
  const pills = document.querySelectorAll('#proyectos .filter-pill');
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
        const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
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

  // 5. Galería: pestañas por proyecto y flechas de desplazamiento
  const tabs = document.querySelectorAll('.gallery-tab');
  const tracks = document.querySelectorAll('.gallery-track');
  const paddles = document.querySelectorAll('.paddle');
  const trackFor = (name) => document.querySelector(`.gallery-track[data-gallery="${name}"]`);
  const visibleTrack = () => [...tracks].find((t) => !t.hidden);

  const updatePaddles = () => {
    const t = visibleTrack();
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth - 2;
    paddles.forEach((p) => {
      p.disabled = p.dataset.dir === '-1' ? t.scrollLeft <= 2 : t.scrollLeft >= max;
    });
  };

  const showGallery = (name) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.gallery === name;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-pressed', String(on));
    });
    tracks.forEach((t) => {
      t.hidden = t.dataset.gallery !== name;
      if (!t.hidden) t.scrollLeft = 0;
    });
    updatePaddles();
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => showGallery(tab.dataset.gallery)));
  paddles.forEach((p) => p.addEventListener('click', () => {
    const t = visibleTrack();
    if (!t) return;
    const item = t.querySelector('.shot-item');
    const step = item ? item.getBoundingClientRect().width + 20 : t.clientWidth * 0.8;
    t.scrollBy({ left: step * Number(p.dataset.dir), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }));
  tracks.forEach((t) => t.addEventListener('scroll', updatePaddles, { passive: true }));
  window.addEventListener('resize', updatePaddles);
  updatePaddles();

  // 6. Visor de imágenes (dialog nativo: Escape, foco y lectores de pantalla)
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbCount = document.getElementById('lb-count');
  let lbItems = [];
  let lbIndex = 0;
  let lbOpener = null;

  const renderLightbox = () => {
    const item = lbItems[lbIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.shot-caption');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCaption.innerHTML = caption ? caption.innerHTML : '';
    lbCount.textContent = `${lbIndex + 1} de ${lbItems.length}`;
  };

  const openLightbox = (name, index, opener) => {
    const track = trackFor(name);
    if (!lb || !track) return;
    lbItems = [...track.querySelectorAll('.shot-item')];
    lbIndex = index;
    lbOpener = opener;
    renderLightbox();
    document.documentElement.classList.add('lb-lock');
    if (typeof lb.showModal === 'function') lb.showModal();
    else lb.setAttribute('open', '');
  };

  const step = (dir) => {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    renderLightbox();
  };

  if (lb) {
    document.getElementById('lb-prev').addEventListener('click', () => step(-1));
    document.getElementById('lb-next').addEventListener('click', () => step(1));
    document.getElementById('lb-close').addEventListener('click', () => lb.close());
    lb.addEventListener('close', () => {
      document.documentElement.classList.remove('lb-lock');
      if (lbOpener) lbOpener.focus();
    });
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    // clic fuera de la imagen y los controles cierra
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb-figure')) lb.close();
    });
    // deslizar en pantallas táctiles
    let startX = null;
    lbImg.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    lbImg.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    });
  }

  tracks.forEach((track) => {
    track.querySelectorAll('.shot').forEach((btn, i) => {
      btn.setAttribute('aria-label', `Ampliar: ${btn.querySelector('img').alt}`);
      btn.addEventListener('click', () => openLightbox(track.dataset.gallery, i, btn));
    });
  });

  document.querySelectorAll('[data-open-gallery]').forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(btn.dataset.openGallery, 0, btn));
  });
});

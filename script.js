// Portfolio Scripts - Daniel Esteban Rojas Sánchez (Apple Minimalist & Liquid Glass)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Project Filter System (Liquid Pills)
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle active status
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filterValue = pill.getAttribute('data-filter');

      // Filter cards with smooth opacity transition
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 3. Apple-Style Email Copy to Clipboard
  const copyEmailBox = document.getElementById('copy-email-box');
  const copyStatus = document.getElementById('copy-status');
  const emailText = document.getElementById('email-text');

  if (copyEmailBox && emailText && copyStatus) {
    copyEmailBox.addEventListener('click', async () => {
      const email = emailText.innerText.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyStatus.textContent = '¡Copiado!';
        copyStatus.style.color = '#34c759';
        copyStatus.style.borderColor = 'rgba(52, 199, 89, 0.4)';

        setTimeout(() => {
          copyStatus.textContent = 'Copiar';
          copyStatus.style.color = '';
          copyStatus.style.borderColor = '';
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyStatus.textContent = '¡Copiado!';
        setTimeout(() => {
          copyStatus.textContent = 'Copiar';
        }, 2200);
      }
    });
  }

  // 4. Active Navigation Observer
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));
});

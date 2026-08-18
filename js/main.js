document.addEventListener('DOMContentLoaded', () => {

  /* ── Footer year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Scroll progress bar ── */
  const scrollProgress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    if (!scrollProgress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (window.scrollY / max * 100).toFixed(2) + '%';
  };

  /* ── Navbar scroll state ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar?.classList.toggle('is-scrolled', window.scrollY > 8);
    updateProgress();
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    if (navMenu) {
      navMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          navbar.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ── Custom cursor ── */
  const cursorEl = document.getElementById('cursor');
  if (cursorEl && window.matchMedia('(pointer: fine)').matches) {
    const dot  = cursorEl.querySelector('.cursor__dot');
    const ring = cursorEl.querySelector('.cursor__ring');
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

    const hoverTargets = 'a, button, .grid-cell, .badge, .accordion__trigger';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    const lerpRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    };
    lerpRing();
  }

  /* ── Hero headline line-by-line stagger ── */
  const heroHeadline = document.querySelector('.hero__headline');
  if (heroHeadline) {
    const lines = heroHeadline.innerHTML.split(/<br\s*\/?>/i);
    heroHeadline.innerHTML = lines
      .map((line, i) => `<span class="hero__line" style="--li:${i}">${line.trim()}</span>`)
      .join('<br>');
    setTimeout(() => heroHeadline.classList.add('is-animated'), 80);
  }

  /* ── Hero background parallax ── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${(window.scrollY * 0.28).toFixed(1)}px)`;
    }, { passive: true });
  }

  /* ── Card content parallax ── */
  document.querySelectorAll('.grid-cell').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 9;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 9;
      el.style.setProperty('--cx', x.toFixed(1));
      el.style.setProperty('--cy', y.toFixed(1));
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--cx', '0');
      el.style.setProperty('--cy', '0');
    });
  });

  /* ── Magnetic buttons ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left - r.width  / 2) * 0.28).toFixed(1);
      const y = ((e.clientY - r.top  - r.height / 2) * 0.28).toFixed(1);
      btn.style.setProperty('--bx', x + 'px');
      btn.style.setProperty('--by', y + 'px');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--bx', '0px');
      btn.style.setProperty('--by', '0px');
    });
  });

  /* ── FAQ accordion ── */
  const accordionItems = document.querySelectorAll('.accordion__item');
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel   = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      accordionItems.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.accordion__panel').style.removeProperty('max-height');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.removeProperty('max-height');
      }
    });
  });

  /* ── Contact form ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      formSuccess.classList.add('is-visible');
      contactForm.reset();
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    revealEls.forEach((el) => {
      const delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.setProperty('--reveal-delay', delay);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ── Animated count-up stats ── */
  const counters = document.querySelectorAll('.js-count');
  if (counters.length && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target   = parseFloat(el.getAttribute('data-count'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      let start = null;

      const tick = (now) => {
        if (!start) start = now;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

});

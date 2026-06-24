/* =============================================================================
   BOSCO CONSTRUCTION GROUP - global.js
   Fichier unique centralisé. Enrichi progressivement page par page.
   Zéro dépendance. IIFE pour ne pas polluer le scope global.
   ============================================================================= */
(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Header : état au scroll ---------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- 2. Menu mobile ---------------------------------------------------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open ?? !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggleMenu());
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
  }

  /* ---- 3. Scroll reveal (IntersectionObserver) --------------------------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(el => io.observe(el));
    }
  }

  /* ---- 4. Compteurs animés ----------------------------------------------- */
  const counters = document.querySelectorAll('.count');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1600; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const cIO = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(c => cIO.observe(c));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---- 5. Slider témoignages --------------------------------------------- */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  if (slides.length && dotsWrap) {
    let idx = 0, timer;
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Témoignage ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.children);
    const go = (n) => {
      slides[idx].classList.remove('active'); dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active'); dots[idx].classList.add('active');
    };
    const restart = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    restart();
  }

  /* ---- 6. Nav active au scroll ------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  // Active state based on current page URL
  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const childPageMap = { 'article_detail.html': 'blog.html' };
  const currentPage = childPageMap[rawPage] || rawPage;
  navLinks.forEach(l => {
    const href = l.getAttribute('href');
    l.setAttribute('aria-current', href === currentPage ? 'true' : 'false');
  });

  // Scroll-spy on pages with identified sections (homepage)
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionNavMap = {
      'accueil':      'index.html',
      'services':     'services.html',
      'realisations': 'realisations.html',
      'blog':         'blog.html',
      'contact':      'contact.html',
    };
    const setNavActive = (href) => {
      navLinks.forEach(l => l.setAttribute('aria-current', l.getAttribute('href') === href ? 'true' : 'false'));
    };
    const sIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const mapped = sectionNavMap[e.target.id];
          if (mapped) setNavActive(mapped);
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });
    sections.forEach(s => sIO.observe(s));
  }

  /* ---- 7. FAQ accordéon -------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-q');
      const panel = item.querySelector('.faq-a');
      if (!btn || !panel) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const ob = other.querySelector('.faq-q');
            const op = other.querySelector('.faq-a');
            if (ob) ob.setAttribute('aria-expanded', 'false');
            if (op) op.style.maxHeight = null;
          }
        });
        item.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
      });
    });
  }

  /* ---- 9. Filtres portfolio (page réalisations) --------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards = Array.from(document.querySelectorAll('.proj-card'));
  const gridEmpty = document.getElementById('gridEmpty');

  if (filterBtns.length && projCards.length) {
    const applyFilter = (cat) => {
      let visible = 0;
      projCards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => card.classList.remove('is-hidden'));
          visible++;
        } else {
          card.classList.add('is-hidden');
          const hide = () => { card.style.display = 'none'; };
          if (reduceMotion) hide(); else setTimeout(hide, 360);
        }
      });
      if (gridEmpty) gridEmpty.classList.toggle('show', visible === 0);
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        applyFilter(btn.dataset.filter);
      });
    });
  }

  /* ---- 10. Lightbox projet ------------------------------------------------ */
  const lb = document.getElementById('lightbox');
  const lbClose = document.getElementById('lbClose');

  if (lb && lbClose) {
    const lbImg = document.getElementById('lbImg');
    const lbCat = document.getElementById('lbCat');
    const lbTitle = document.getElementById('lbTitle');
    const lbLoc = document.getElementById('lbLoc');
    const lbDesc = document.getElementById('lbDesc');
    let lastFocused = null;

    const openLightbox = (card) => {
      lbImg.src = card.dataset.img;
      lbImg.alt = card.dataset.title;
      lbCat.textContent = card.dataset.cat;
      lbTitle.textContent = card.dataset.title;
      lbLoc.textContent = card.dataset.loc;
      lbDesc.textContent = card.dataset.desc;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      lastFocused = card;
      lbClose.focus();
    };

    const closeLightbox = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      if (lastFocused) lastFocused.focus();
    };

    projCards.forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(card); }
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
    });
  }

  /* ---- 11. Blog : filtres catégorie + recherche textuelle ---------------- */
  const postCards = Array.from(document.querySelectorAll('.post-card'));
  const blogSearch = document.getElementById('blogSearch');

  if (postCards.length) {
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    let currentBlogCat = 'all';
    let currentQuery = '';

    const applyBlog = () => {
      let visible = 0;
      postCards.forEach(card => {
        const matchCat = currentBlogCat === 'all' || card.dataset.category === currentBlogCat;
        const matchText = currentQuery === '' || norm(card.dataset.title).includes(currentQuery);
        const show = matchCat && matchText;
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => card.classList.remove('is-hidden'));
          visible++;
        } else {
          card.classList.add('is-hidden');
          const hide = () => { card.style.display = 'none'; };
          if (reduceMotion) hide(); else setTimeout(hide, 360);
        }
      });
      if (gridEmpty) gridEmpty.classList.toggle('show', visible === 0);
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentBlogCat = btn.dataset.filter;
        applyBlog();
      });
    });

    if (blogSearch) {
      blogSearch.addEventListener('input', () => {
        currentQuery = norm(blogSearch.value.trim());
        applyBlog();
      });
    }
  }

  /* ---- 8. Formulaire contact → WhatsApp (validation visuelle) -------------- */
  const form = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetBtn = document.getElementById('resetForm');

  if (form) {
    const nameWrap = document.getElementById('f-name-wrap');
    const phoneWrap = document.getElementById('f-phone-wrap');
    const nameInput = document.getElementById('f-name');
    const phoneInput = document.getElementById('f-phone');

    const setInvalid = (wrap, input, invalid) => {
      if (!wrap || !input) return;
      wrap.classList.toggle('invalid', invalid);
      input.setAttribute('aria-invalid', String(invalid));
    };

    if (nameInput) nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) setInvalid(nameWrap, nameInput, false);
    });
    if (phoneInput) phoneInput.addEventListener('input', () => {
      if (phoneInput.value.replace(/\D/g, '').length >= 8) setInvalid(phoneWrap, phoneInput, false);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();

      const nameBad = name === '';
      const phoneBad = phone.replace(/\D/g, '').length < 8;
      setInvalid(nameWrap, nameInput, nameBad);
      setInvalid(phoneWrap, phoneInput, phoneBad);
      if (nameBad) { nameInput.focus(); return; }
      if (phoneBad) { phoneInput.focus(); return; }

      const budget = data.get('budget');
      const text =
        `Bonjour Bosco Construction Group,%0A%0A` +
        `*Nom :* ${encodeURIComponent(name)}%0A` +
        `*Téléphone :* ${encodeURIComponent(phone)}%0A` +
        `*Type de projet :* ${encodeURIComponent(data.get('type') || '')}%0A` +
        `*Localisation :* ${encodeURIComponent(data.get('loc') || 'Non précisée')}%0A` +
        (budget ? `*Budget estimé :* ${encodeURIComponent(budget)}%0A` : '') +
        `*Message :* ${encodeURIComponent(data.get('msg') || 'Non précisé')}`;

      window.open(`https://wa.me/237652321897?text=${text}`, '_blank', 'noopener');

      if (formSuccess) {
        form.style.display = 'none';
        formSuccess.classList.add('show');
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        if (formSuccess) formSuccess.classList.remove('show');
        form.style.display = '';
        setInvalid(nameWrap, nameInput, false);
        setInvalid(phoneWrap, phoneInput, false);
        if (nameInput) nameInput.focus();
      });
    }
  }

  /* ---- 12. Barre de progression de lecture -------------------------------- */
  const readingProgress = document.getElementById('progress');
  const articleBody = document.getElementById('articleBody');

  if (readingProgress && articleBody) {
    const updateProgress = () => {
      const rect = articleBody.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const ratio = total > 0 ? scrolled / total : 0;
      readingProgress.style.transform = 'scaleX(' + Math.min(Math.max(ratio, 0), 1) + ')';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* ---- 13. Bouton retour en haut ------------------------------------------ */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const toggleToTop = () => toTop.classList.toggle('show', window.scrollY > 600);
    toggleToTop();
    window.addEventListener('scroll', toggleToTop, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---- 14. Scroll-spy sommaire article ------------------------------------ */
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const tocHeadings = tocLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const setTocActive = (id) => tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    const tocSpy = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setTocActive(entry.target.id); });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    tocHeadings.forEach(h => tocSpy.observe(h));
  }

  /* ---- 15. Copier le lien article ----------------------------------------- */
  const copyBtn = document.getElementById('copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
        setTimeout(() => { copyBtn.innerHTML = original; }, 1600);
      } catch (e) { /* presse-papiers indisponible */ }
    });
  }
})();

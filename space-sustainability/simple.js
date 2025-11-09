/**
 * Enhanced simple.js
 * - Brings back the video reveal animation and smooth scrolling feel
 * - Implements robust IntersectionObserver and smooth counters
 * - Keeps lightweight/no WebGL
 *
 * Notes:
 * - The script tolerates autoplay being blocked and retries on first user interaction
 * - Observers are throttled/guarded for performance
 */
(function () {
  'use strict';

  // Respect reduced motion preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helpers
  function rafThrottled(fn) {
    let scheduled = false;
    return function (...args) {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        scheduled = false;
      });
    };
  }

  // 1) Video reveal + autoplay logic (retries on user interaction)
  function initVideoReveal() {
    const v = document.querySelector('.objects-video');
    const wrapper = v ? v.closest('.video-w') : null;
    if (!v || !wrapper) return;

    function tryPlay() {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.play().catch(() => {
        // autoplay blocked — will wait for user interaction
      });
    }

    // Reveal animation triggered by intersection observer (below) uses 'visible' class.
    // Also attempt to play immediately once DOM is ready.
    tryPlay();

    // If autoplay blocked, retry once on first user gesture
    const onUserGesture = function () {
      tryPlay();
      document.removeEventListener('click', onUserGesture);
      document.removeEventListener('touchstart', onUserGesture);
      document.removeEventListener('keydown', onUserGesture);
    };
    document.addEventListener('click', onUserGesture, { once: true, passive: true });
    document.addEventListener('touchstart', onUserGesture, { once: true, passive: true });
    document.addEventListener('keydown', onUserGesture, { once: true, passive: true });
  }

  // 2) Intersection observer that drives reveals and triggers counters
  function initObservers() {
    if (reduceMotion) {
      // If reduced motion, just mark everything visible
      document.querySelectorAll('section.fullscreen, .cards-w .card').forEach(el => el.classList.add('visible', 'animated'));
      // Also ensure numbers show target values (no animated counting)
      document.querySelectorAll('.number').forEach(el => {
        el.textContent = el.getAttribute('data-final') || el.textContent;
      });
      return;
    }

    const options = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('visible', 'animated');
          // If it's a section that contains numbers, trigger count
          if (el.querySelector && (el.classList.contains('objects-section') || el.classList.contains('satellites-section'))) {
            el.querySelectorAll('.number').forEach(runCounterOnce);
          }
          // If it's video wrapper, attempt to play video
          if (el.classList.contains('objects-section')) {
            const video = el.querySelector('.objects-video');
            if (video) {
              video.play().catch(()=>{});
            }
          }
          observer.unobserve(el); // one-time reveal to match original behavior
        }
      });
    }, options);

    // Observe the main full-screen sections
    document.querySelectorAll('.hero-section, .protecting-section, .objects-section, .satellites-section, .privateer-section, .wayfinder-section, .crew-section').forEach(s => {
      observer.observe(s);
    });

    // Observe individual cards for subtle stagger reveal
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -8% 0px' });

    document.querySelectorAll('.cards-w .card').forEach(c => cardObserver.observe(c));
  }

  // 3) Smooth scroll anchors (robust handling)
  function initAnchorScrolls() {
    // Only if not reduced motion (otherwise instant jump is preferred by user)
    if (reduceMotion) return;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update focus for accessibility
          target.setAttribute('tabindex','-1');
          target.focus({ preventScroll:true });
          window.setTimeout(()=> target.removeAttribute('tabindex'), 1200);
        }
      });
    });
  }

  // 4) Smooth counters using requestAnimationFrame for precision
  function runCounterOnce(el) {
    if (!el || el.dataset.counted) return;
    el.dataset.counted = '1';
    const text = el.textContent.trim();
    const target = parseInt((el.getAttribute('data-final') || text).toString().replace(/,/g,''), 10);
    if (isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const fmt = (n) => Math.floor(n).toLocaleString('en-US');

    function step(ts) {
      const t = Math.min(1, (ts - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(eased * target);
      el.textContent = fmt(cur);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  // 5) Lightweight carousel for cards (touch-friendly)
  function initCardCarousels() {
    function setup(sectionSelector) {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      const wrapper = section.querySelector('[data-slides-wrapper] .inside-w') || section.querySelector('.cards-w .inside-w');
      const cards = section.querySelectorAll('.cards-w .card, .inside-w .card');
      const dots = section.querySelectorAll('.carousel-counter .circle-counter, .circle-counter');
      if (!wrapper || cards.length === 0) return;

      let idx = 0;
      const total = cards.length;
      // only use carousel behavior on narrower viewports
      const enabled = () => window.innerWidth < 1024;

      function show(i) {
        idx = (i + total) % total;
        cards.forEach((c, k) => {
          c.style.transition = 'opacity 420ms cubic-bezier(.2,.9,.2,1), transform 420ms cubic-bezier(.2,.9,.2,1)';
          if (k === idx) { c.style.opacity = '1'; c.style.transform = 'translateX(0)'; c.style.visibility='visible'; }
          else if (k < idx) { c.style.opacity = '0'; c.style.transform = 'translateX(-20px)'; c.style.visibility='hidden'; }
          else { c.style.opacity = '0'; c.style.transform = 'translateX(20px)'; c.style.visibility='hidden'; }
        });
        dots.forEach((d, k) => d.classList.toggle('active', k === idx));
      }

      // initial
      show(0);

      // touch handling
      let startX = null;
      wrapper.addEventListener('touchstart', e => { if (!enabled()) return; startX = e.touches[0].clientX; }, { passive:true });
      wrapper.addEventListener('touchend', e => {
        if (!enabled() || startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { show(idx + (diff > 0 ? 1 : -1)); }
        startX = null;
      }, { passive:true });

      // dot click
      dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
      // resize reset styles on desktop
      window.addEventListener('resize', rafThrottled(() => {
        if (!enabled()) {
          cards.forEach(c => { c.style.opacity=''; c.style.transform=''; c.style.visibility=''; });
          dots.forEach(d => d.classList.remove('active'));
        } else show(idx);
      }));
    }

    setup('.privateer-section');
    setup('.crew-section');
  }

  // 6) Back to top: simple accessibility-friendly
  function initBackToTop() {
    const el = document.querySelector('.back-top-w');
    if (!el) return;
    el.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    // subtle visibility toggle
    const onScroll = rafThrottled(() => {
      const show = window.scrollY > (window.innerHeight * 0.3);
      el.style.opacity = show ? '1' : '0.5';
    });
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  // 7) Scroll indicator: hide when users scroll down
  function initScrollIndicator() {
    const el = document.querySelector('.scroll-w');
    if (!el) return;
    let hidden = false;
    const onScroll = rafThrottled(() => {
      if (window.scrollY > 80 && !hidden) { el.style.opacity = '0'; hidden = true; }
      else if (window.scrollY <= 80 && hidden) { el.style.opacity = '1'; hidden = false; }
    });
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  // 8) Cursor reveal (desktop only)
  function initCursor() {
    const cw = document.querySelector('.cursor-w');
    if (!cw) return;
    setTimeout(()=> cw.classList.add('visible'), 450);
    if ('ontouchstart' in window || window.innerWidth < 1024) return;
    const outer = cw.querySelector('.outer-circle');
    if (!outer) return;
    document.addEventListener('mousemove', (e) => {
      outer.style.left = (e.clientX - 29) + 'px';
      outer.style.top  = (e.clientY - 29) + 'px';
    }, { passive:true });
  }

  // 9) Accessibility toggles and initialization
  function initAccessibility() {
    const animBtn = document.querySelector('.accessibility-button.animation');
    const contrastBtn = document.querySelector('.accessibility-button.contrast');
    if (animBtn) animBtn.addEventListener('click', () => document.body.classList.toggle('animations-off'));
    if (contrastBtn) contrastBtn.addEventListener('click', () => document.body.classList.toggle('contrast'));
  }

  // Initialize everything
  function initAll() {
    try { initVideoReveal(); } catch(e){ console.warn(e); }
    try { initObservers(); } catch(e){ console.warn(e); }
    try { initAnchorScrolls(); } catch(e){ console.warn(e); }
    try { initCardCarousels(); } catch(e){ console.warn(e); }
    try { initBackToTop(); } catch(e){ console.warn(e); }
    try { initScrollIndicator(); } catch(e){ console.warn(e); }
    try { initCursor(); } catch(e){ console.warn(e); }
    try { initAccessibility(); } catch(e){ console.warn(e); }
    document.body.classList.add('page-loaded');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

})();
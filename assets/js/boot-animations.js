/**
 * boot-animations.js
 * Initializes Locomotive Scroll and GSAP ScrollTrigger integration
 * Runs before app.js to set up the scrolling environment
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Configuration
  const config = {
    smoothScroll: !prefersReducedMotion,
    scrollContainer: '.ow-page-wrapper',
    fallbackToNative: true
  };

  console.log('[Boot] Initializing scroll and animation system...');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Detect scroll container
    const scrollContainer = document.querySelector(config.scrollContainer) || 
                           document.querySelector('[data-scroll-container]');
    
    if (!scrollContainer) {
      console.warn('[Boot] No scroll container found, using document scroll');
      initializeWithFallback();
      return;
    }

    // Check if Locomotive Scroll is available
    if (typeof LocomotiveScroll !== 'undefined') {
      initializeLocomotiveScroll(scrollContainer);
    } else {
      console.warn('[Boot] LocomotiveScroll not found, using native scroll');
      initializeWithFallback();
    }

    // Emit ready event for app.js
    window.dispatchEvent(new CustomEvent('scroll-system-ready'));
  }

  function initializeLocomotiveScroll(container) {
    try {
      console.log('[Boot] Initializing Locomotive Scroll...');
      
      // Initialize Locomotive Scroll
      const scroll = new LocomotiveScroll({
        el: container,
        smooth: config.smoothScroll,
        smoothMobile: false,
        resetNativeScroll: true,
        tablet: {
          smooth: false
        },
        smartphone: {
          smooth: false
        }
      });

      // Store reference globally
      window.locomotiveScroll = scroll;

      // Initialize GSAP ScrollTrigger integration if available
      if (typeof gsap !== 'undefined' && gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        initializeGSAPIntegration(scroll, container);
      }

      // Update on scroll
      scroll.on('scroll', function(args) {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.update();
        }
      });

      // Update when page loads
      scroll.on('call', function(func, way, obj, id) {
        console.log('[Boot] Locomotive scroll event:', func);
      });

      console.log('[Boot] Locomotive Scroll initialized successfully');

    } catch (error) {
      console.error('[Boot] Error initializing Locomotive Scroll:', error);
      initializeWithFallback();
    }
  }

  function initializeGSAPIntegration(scroll, container) {
    try {
      console.log('[Boot] Setting up GSAP ScrollTrigger integration...');
      
      gsap.registerPlugin(ScrollTrigger);

      // Tell ScrollTrigger to use Locomotive Scroll's scrollbar
      ScrollTrigger.scrollerProxy(container, {
        scrollTop(value) {
          return arguments.length 
            ? scroll.scrollTo(value, 0, 0) 
            : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          };
        },
        pinType: container.style.transform ? 'transform' : 'fixed'
      });

      // Update ScrollTrigger when Locomotive Scroll updates
      scroll.on('scroll', ScrollTrigger.update);

      // Refresh after everything is set up
      ScrollTrigger.addEventListener('refresh', () => scroll.update());
      ScrollTrigger.refresh();

      console.log('[Boot] GSAP ScrollTrigger integration complete');

    } catch (error) {
      console.error('[Boot] Error setting up GSAP integration:', error);
    }
  }

  function initializeWithFallback() {
    console.log('[Boot] Using native scroll fallback');
    
    // Set up GSAP with native scroll if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      try {
        gsap.registerPlugin(ScrollTrigger);
        
        // Use document scrolling element
        ScrollTrigger.defaults({
          scroller: document.documentElement || document.body
        });

        console.log('[Boot] GSAP ScrollTrigger initialized with native scroll');
      } catch (error) {
        console.error('[Boot] Error initializing GSAP with native scroll:', error);
      }
    }
  }

  // Provide resize handler
  window.addEventListener('resize', function() {
    if (window.locomotiveScroll) {
      window.locomotiveScroll.update();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  console.log('[Boot] Boot script loaded');

})();

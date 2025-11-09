/*!
 * Omega Space - Boot Animations Script
 * Initializes LocomotiveScroll with ScrollTrigger integration
 * Provides graceful fallback to native scrolling
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    locomotiveSelector: '[data-scroll-container]',
    smoothScrolling: true,
    timeout: 5000, // Timeout for script loading
  };

  // State
  let scrollerInstance = null;
  let isInitialized = false;

  /**
   * Dispatches scroller-ready event
   * @param {Object} scroller - LocomotiveScroll instance or null for native
   */
  function dispatchScrollerReady(scroller) {
    const event = new CustomEvent('scroller-ready', {
      detail: {
        scroller: scroller,
        type: scroller ? 'locomotive' : 'native'
      }
    });
    window.dispatchEvent(event);
    console.log('[Boot] Scroller ready:', scroller ? 'LocomotiveScroll' : 'Native');
  }

  /**
   * Initialize LocomotiveScroll with ScrollTrigger proxy
   */
  function initializeLocomotiveScroll() {
    // Check if LocomotiveScroll is available
    if (typeof LocomotiveScroll === 'undefined') {
      console.warn('[Boot] LocomotiveScroll not found, falling back to native scrolling');
      fallbackToNativeScrolling();
      return;
    }

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger === 'undefined') {
      console.warn('[Boot] ScrollTrigger not found');
    }

    try {
      // Find scroll container
      const scrollContainer = document.querySelector(CONFIG.locomotiveSelector) || document.body;

      // Initialize LocomotiveScroll
      scrollerInstance = new LocomotiveScroll({
        el: scrollContainer,
        smooth: CONFIG.smoothScrolling,
        smartphone: {
          smooth: false // Disable smooth scrolling on mobile for better performance
        },
        tablet: {
          smooth: false // Disable smooth scrolling on tablet
        }
      });

      console.log('[Boot] LocomotiveScroll initialized');

      // Wire ScrollTrigger proxy if available
      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        ScrollTrigger.scrollerProxy(scrollContainer, {
          scrollTop(value) {
            return arguments.length
              ? scrollerInstance.scrollTo(value, 0, 0)
              : scrollerInstance.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            };
          },
          pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
        });

        // Update ScrollTrigger when LocomotiveScroll updates
        scrollerInstance.on('scroll', ScrollTrigger.update);

        // Refresh both after DOM is ready
        ScrollTrigger.addEventListener('refresh', () => scrollerInstance.update());
        ScrollTrigger.refresh();

        console.log('[Boot] ScrollTrigger proxy configured');
      }

      isInitialized = true;
      dispatchScrollerReady(scrollerInstance);

    } catch (error) {
      console.error('[Boot] Failed to initialize LocomotiveScroll:', error);
      fallbackToNativeScrolling();
    }
  }

  /**
   * Fallback to native scrolling
   */
  function fallbackToNativeScrolling() {
    console.log('[Boot] Using native scrolling');
    scrollerInstance = null;
    isInitialized = true;
    dispatchScrollerReady(null);
  }

  /**
   * Wait for dependencies to load
   */
  function waitForDependencies() {
    const startTime = Date.now();

    function check() {
      // Check if we've exceeded timeout
      if (Date.now() - startTime > CONFIG.timeout) {
        console.warn('[Boot] Dependency loading timeout, falling back to native scrolling');
        fallbackToNativeScrolling();
        return;
      }

      // Check if LocomotiveScroll is available
      if (typeof LocomotiveScroll !== 'undefined') {
        initializeLocomotiveScroll();
        return;
      }

      // Check again in 100ms
      setTimeout(check, 100);
    }

    check();
  }

  /**
   * Initialize on DOM ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForDependencies);
    } else {
      waitForDependencies();
    }
  }

  // Public API
  window.OmegaBootstrap = {
    getScroller: () => scrollerInstance,
    isInitialized: () => isInitialized,
    refresh: () => {
      if (scrollerInstance && scrollerInstance.update) {
        scrollerInstance.update();
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }
  };

  // Start initialization
  init();

})();

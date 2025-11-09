// boot-animations.js
// Detect/initialize LocomotiveScroll (if available), register GSAP ScrollTrigger,
// set scrollerProxy, fallback to native scroll, and dispatch a 'scroller-ready' event.
(function () {
  'use strict';

  function isDefined(x) { return typeof x !== 'undefined' && x !== null; }

  function init() {
    var locoInstance = null;
    var container = document.querySelector('[data-scroll-container]') ||
                    document.querySelector('.ow-page-wrapper') ||
                    document.querySelector('body');

    function dispatchReady() {
      try {
        window.dispatchEvent(new CustomEvent('scroller-ready', {
          detail: { locomotive: !!locoInstance, instance: locoInstance }
        }));
        window.scrollerReady = { locomotive: !!locoInstance, instance: locoInstance };
      } catch (err) {
        console.warn('boot-animations: could not dispatch scroller-ready event', err);
      }
    }

    function wireScrollTriggerForLocomotive(loco) {
      if (!window.gsap || !window.ScrollTrigger) {
        console.warn('boot-animations: GSAP or ScrollTrigger missing when wiring locomotive.');
        return;
      }
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
      var scrollerEl = loco.el || container;

      ScrollTrigger.scrollerProxy(scrollerEl, {
        scrollTop: function (value) {
          if (arguments.length) { loco.scrollTo(value, { duration: 0, disableLerp: true }); }
          return (loco.scroll && loco.scroll.instance && loco.scroll.instance.scroll) ? loco.scroll.instance.scroll.y : 0;
        },
        getBoundingClientRect: function () { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
        pinType: scrollerEl.style.transform ? 'transform' : 'fixed'
      });

      loco.on && loco.on('scroll', ScrollTrigger.update);
    }

    function fallbackToNative() {
      console.warn('boot-animations: LocomotiveScroll not detected — falling back to native scrolling.');
      if (window.gsap && window.ScrollTrigger) {
        try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
        var scroller = document.scrollingElement || document.documentElement;
        ScrollTrigger.scrollerProxy(scroller, {
          scrollTop: function (value) {
            if (arguments.length) { window.scrollTo(0, value); }
            return window.pageYOffset || document.documentElement.scrollTop;
          },
          getBoundingClientRect: function () { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
          pinType: scroller.style.transform ? 'transform' : 'fixed'
        });
        ScrollTrigger.refresh();
      }
      dispatchReady();
    }

    if (isDefined(window.LocomotiveScroll)) {
      try {
        locoInstance = new LocomotiveScroll({
          el: container,
          smooth: true,
          multiplier: 1,
          tablet: { smooth: true },
          smartphone: { smooth: true }
        });

        setTimeout(function () {
          try {
            if (window.ScrollTrigger) {
              wireScrollTriggerForLocomotive(locoInstance);
              ScrollTrigger.refresh();
            }
          } catch (err) {
            console.warn('boot-animations: error wiring ScrollTrigger ->', err);
          }
          dispatchReady();
        }, 100);

      } catch (err) {
        console.warn('boot-animations: locomotive init failed, falling back', err);
        fallbackToNative();
      }
    } else {
      fallbackToNative();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
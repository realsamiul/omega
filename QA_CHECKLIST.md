# QA Checklist for Space Sustainability Restoration

## Pre-Deployment Checks

### 1. Asset Loading
- [ ] All CSS files load without 404 errors
  - `/assets/css/fonts.css`
  - `/assets/css/main.css`
  - `/assets/css/layout.css`
  - `/assets/css/components.css`
  - `/assets/css/animations.css`
  - Locomotive Scroll CSS from CDN

- [ ] All JavaScript files load without errors
  - GSAP from CDN
  - ScrollTrigger from CDN
  - Locomotive Scroll from CDN
  - `/assets/js/boot-animations.js`
  - `/assets/js/app.js`

- [ ] All media files load correctly
  - `/public/media/images/fielding.jpg`
  - `/public/media/images/moriba.jpg`
  - `/public/media/images/wozniak.jpg`
  - `/public/media/video/objects.mp4`

### 2. Font Loading & Typography
- [ ] OMEGA CT Light font loads and displays correctly
- [ ] OMEGA CT Regular font loads and displays correctly
- [ ] OMEGA CT Bold font loads and displays correctly
- [ ] Font fallbacks work properly if custom fonts fail
- [ ] All text is readable and properly styled
- [ ] Font sizes are responsive across breakpoints

### 3. Locomotive Scroll & Smooth Scrolling
- [ ] Locomotive Scroll initializes without errors (check browser console)
- [ ] Smooth scroll works on desktop (1024px+)
- [ ] Native scroll is used on mobile/tablet
- [ ] Scroll position updates correctly
- [ ] `window.locomotiveScroll` is defined in console
- [ ] No JavaScript errors in console related to scrolling

### 4. GSAP & ScrollTrigger Integration
- [ ] GSAP loads successfully
- [ ] ScrollTrigger plugin registers correctly
- [ ] ScrollTrigger.scrollerProxy is set up properly
- [ ] Animations trigger at correct scroll positions
- [ ] No timing or synchronization issues between scroll and animations

### 5. Video Playback
- [ ] Objects video loads in the correct section
- [ ] Video attempts autoplay (muted)
- [ ] Video loops correctly
- [ ] Video is responsive and maintains aspect ratio
- [ ] Fallback works if autoplay is blocked
- [ ] User gesture allows video to play if initially blocked

### 6. Number Counters & Animations
- [ ] Number counter for "27,000" animates when scrolled into view
- [ ] Number counter for "24,000" animates when scrolled into view
- [ ] Counter animations are smooth and complete correctly
- [ ] Counters don't re-trigger on every scroll

### 7. Responsive Behavior
- [ ] Layout works correctly on mobile (< 768px)
- [ ] Layout works correctly on tablet (768px - 1023px)
- [ ] Layout works correctly on desktop (1024px+)
- [ ] Layout works correctly on large desktop (1440px+)
- [ ] Grid system adapts properly at each breakpoint
- [ ] No horizontal overflow or scrollbar

### 8. Carousel/Slider Interactions (Privateer & Crew sections)
- [ ] Carousel indicators display correctly
- [ ] Carousel cards are navigable on mobile
- [ ] Touch/swipe gestures work on mobile
- [ ] Active card indicator updates correctly
- [ ] Desktop displays all cards in a row

### 9. Accessibility Features
- [ ] "Animation" toggle button displays and functions
- [ ] "Contrast" toggle button displays and functions
- [ ] Animation toggle disables all animations
- [ ] Contrast mode changes background appropriately
- [ ] All interactive elements are keyboard accessible
- [ ] Screen reader labels are present and correct
- [ ] WCAG hidden content is properly hidden visually but accessible

### 10. Reduced Motion Support
- [ ] Smooth scroll is disabled when `prefers-reduced-motion: reduce`
- [ ] Animations respect reduced motion preference
- [ ] Page is fully functional with reduced motion
- [ ] No essential content is hidden by disabled animations

### 11. Header & Navigation
- [ ] FPS header displays correctly
- [ ] Menu button is functional
- [ ] Language selector works
- [ ] OMEGA logo links to correct URL
- [ ] Header hides/shows appropriately on scroll
- [ ] Header hover states work correctly

### 12. Footer
- [ ] "Back to top" button appears and functions
- [ ] Footer links are clickable and go to correct destinations
- [ ] Footer displays correctly on all screen sizes
- [ ] Footer layout adjusts for different languages (if applicable)

### 13. Performance
- [ ] Page loads in < 3 seconds on 3G
- [ ] No layout shift (CLS) during load
- [ ] Images are properly sized and optimized
- [ ] Videos load progressively
- [ ] Cache headers are set correctly (check Network tab)
  - Static assets: 1 year cache
  - HTML: must-revalidate

### 14. Browser Compatibility
- [ ] Works in Chrome (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Works in Edge (latest)
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

### 15. Console Checks
- [ ] No JavaScript errors in console
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] Boot script logs initialization messages
- [ ] Locomotive Scroll logs successful initialization

## Manual Testing Instructions

### Desktop Testing (1024px+)
1. Open the preview URL in a desktop browser
2. Check that smooth scroll is active
3. Open browser console and verify:
   ```javascript
   window.locomotiveScroll !== undefined
   typeof gsap !== 'undefined'
   typeof ScrollTrigger !== 'undefined'
   ```
4. Scroll through entire page slowly
5. Verify all animations trigger correctly
6. Test "Back to top" button
7. Test animation and contrast toggles

### Mobile Testing (< 768px)
1. Open preview URL on mobile device or use DevTools device emulation
2. Verify native scroll (no smooth scroll)
3. Test touch gestures on carousels
4. Check that all content is accessible
5. Verify responsive layout at different screen widths

### Performance Testing
1. Open Chrome DevTools Network tab
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
3. Check asset sizes and load times
4. Verify cache headers on assets
5. Check Lighthouse score (aim for 90+ in all categories)

### Accessibility Testing
1. Use keyboard only to navigate entire page
2. Test with screen reader (NVDA, JAWS, or VoiceOver)
3. Enable high contrast mode and verify readability
4. Test with browser zoom at 200%
5. Enable reduced motion in OS and verify page still works

## Deployment Verification

After deployment to production:
- [ ] Visit https://www.omegawatches.com/ and verify redirect works
- [ ] Check all assets load from correct paths
- [ ] Verify cache headers in production
- [ ] Test on multiple devices and browsers
- [ ] Monitor error logs for any runtime errors

## Known Issues & Limitations

Document any known issues or limitations discovered during testing:

1. [Add issues here as discovered]

## Sign-off

- [ ] All critical checks passed
- [ ] All blocking issues resolved
- [ ] Ready for production deployment

**Tested by:** _______________  
**Date:** _______________  
**Environment:** _______________  
**Browser/Device:** _______________

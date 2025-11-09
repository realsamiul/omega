# Omega Space Sustainability - Design System Restoration

This repository contains the restored original design system, motion pipeline, and assets for the OMEGA Space Sustainability page.

## 🎯 Project Goals

Restore the original design system with:
- ✅ Proper CSS cascade (fonts, main, layout, components, animations)
- ✅ Locomotive Scroll + GSAP ScrollTrigger integration
- ✅ Organized asset structure
- ✅ Optimized caching strategy
- ✅ Production-ready deployment configuration

## 📁 Project Structure

```
/
├── assets/
│   ├── css/
│   │   ├── fonts.css           # Font-face definitions
│   │   ├── main.css            # Base styles & resets
│   │   ├── layout.css          # Grid system & layout
│   │   ├── components.css      # Component styles
│   │   └── animations.css      # Animations & transitions
│   └── js/
│       ├── boot-animations.js  # Scroll system initialization
│       ├── app.js              # Main application bundle
│       └── vendor/             # Optional vendor copies
├── public/
│   └── media/
│       ├── images/             # Image assets
│       │   ├── fielding.jpg
│       │   ├── moriba.jpg
│       │   └── wozniak.jpg
│       └── video/              # Video assets
│           └── objects.mp4
├── space-sustainability/
│   └── assets/                 # Original asset location (kept for compatibility)
├── space-sustainability.html   # Main HTML page
├── vercel.json                # Deployment configuration
├── QA_CHECKLIST.md            # Comprehensive QA checklist
└── README.md                  # This file
```

## 🎨 CSS Architecture

The CSS is organized in a cascading manner for optimal specificity and maintainability:

1. **fonts.css** - Font-face declarations with proper fallbacks
2. **main.css** - CSS resets, base styles, and global utilities
3. **layout.css** - Responsive grid system (6-col mobile, 12-col desktop)
4. **components.css** - All component-specific styles
5. **animations.css** - Keyframes, transitions, and animation utilities

### CSS Loading Order

```html
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/main.css">
<link rel="stylesheet" href="/assets/css/layout.css">
<link rel="stylesheet" href="/assets/css/components.css">
<link rel="stylesheet" href="/assets/css/animations.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.css">
```

## ⚡ JavaScript Architecture

### Loading Order

Scripts are loaded synchronously in the following order to ensure proper initialization:

1. **GSAP Core** - Animation library
2. **ScrollTrigger** - GSAP scroll-based animation plugin
3. **Locomotive Scroll** - Smooth scroll library
4. **boot-animations.js** - Initializes scroll system
5. **app.js** - Main application logic

### boot-animations.js

The boot script handles:
- Detection and initialization of Locomotive Scroll
- GSAP ScrollTrigger integration with `scrollerProxy`
- Graceful fallback to native scroll
- Reduced motion support
- Event emission for app coordination

```javascript
// Check if system is ready
window.addEventListener('scroll-system-ready', () => {
  console.log('Scroll system initialized');
});

// Access Locomotive instance
if (window.locomotiveScroll) {
  window.locomotiveScroll.update();
}
```

## 🖼️ Media Management

All media assets are organized in `/public/media/`:

- **Images**: `/public/media/images/` - Team portraits
- **Videos**: `/public/media/video/` - Animated space objects

### Image Paths in HTML
```html
<img src="/public/media/images/fielding.jpg" alt="Alex Fielding" />
```

### Video Paths in HTML
```html
<video loop muted playsinline>
  <source src="/public/media/video/objects.mp4" type="video/mp4">
</video>
```

## 🚀 Deployment Configuration

### Vercel.json

The deployment is configured with optimal caching:

```json
{
  "rewrites": [
    { "source": "/", "destination": "/space-sustainability.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/public/media/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

### Cache Strategy

- **Static Assets** (CSS, JS, images, videos): 1 year immutable cache
- **HTML Files**: Must revalidate (enables instant updates)

## 🎭 Motion & Animation System

### Locomotive Scroll Features

- Smooth scrolling on desktop (1024px+)
- Native scroll on mobile/tablet
- Data attribute API for scroll-based animations
- ScrollTrigger integration for GSAP animations

### GSAP Integration

The boot script sets up ScrollTrigger with Locomotive:

```javascript
ScrollTrigger.scrollerProxy(container, {
  scrollTop(value) {
    return arguments.length 
      ? scroll.scrollTo(value, 0, 0) 
      : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0, left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
});
```

### Reduced Motion Support

The system respects `prefers-reduced-motion: reduce`:
- Disables smooth scroll
- Simplifies animations
- Maintains full functionality

## ♿ Accessibility Features

### Built-in Accessibility

- **Animation Toggle**: User can disable all animations
- **Contrast Toggle**: User can enable high contrast mode
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Reduced Motion**: Respects OS-level preferences

### WCAG Compliance

- Proper heading hierarchy
- Alt text for images
- ARIA labels for interactive elements
- Sufficient color contrast
- No content hidden by animations

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (6-column grid)
- **Tablet**: 768px - 1023px (6-column grid)
- **Desktop**: 1024px+ (12-column grid)
- **Large Desktop**: 1440px+ (12-column grid)

### Grid System

The layout uses a flexible grid system:
- Mobile: 6 columns
- Desktop: 12 columns
- Responsive column utilities (e.g., `col-start-1`, `dk:col-start-2`)

## 🧪 Testing

### Quick Test

```bash
# Serve locally
npx serve .

# Open in browser
open http://localhost:3000
```

### Console Verification

Open browser console and run:

```javascript
// Check Locomotive Scroll
console.log('Locomotive:', typeof LocomotiveScroll, window.locomotiveScroll);

// Check GSAP
console.log('GSAP:', typeof gsap, typeof ScrollTrigger);

// Test scroll update
if (window.locomotiveScroll) {
  window.locomotiveScroll.update();
}
```

### QA Checklist

See [QA_CHECKLIST.md](./QA_CHECKLIST.md) for comprehensive testing guide.

## 🔧 Development

### Prerequisites

- Modern browser with ES6 support
- No build step required (uses CDN libraries)

### Local Development

1. Clone the repository
2. Serve with any static file server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   # or
   php -S localhost:8000
   ```
3. Open http://localhost:8000 in your browser

### Making Changes

1. Edit CSS files in `/assets/css/`
2. Edit JavaScript in `/assets/js/`
3. Update HTML in `space-sustainability.html`
4. Test locally before committing
5. Push to deploy (automatic via Vercel)

## 📊 Performance

### Optimization Strategies

- **Long-term caching** for static assets
- **CDN delivery** for vendor libraries
- **Lazy loading** for videos
- **Font preloading** (optional, can be added)
- **Image optimization** (pre-optimized)

### Expected Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: 90+

## 🐛 Troubleshooting

### Smooth scroll not working

1. Check console for Locomotive Scroll errors
2. Verify `.ow-page-wrapper` element exists
3. Check screen width (smooth scroll disabled on mobile)

### Animations not triggering

1. Verify GSAP and ScrollTrigger loaded
2. Check ScrollTrigger.scrollerProxy is set
3. Call `ScrollTrigger.refresh()` after content changes

### Video not playing

1. Check browser autoplay policies
2. Verify video is muted (required for autoplay)
3. Check video path is correct
4. Ensure video codec is supported

### Fonts not loading

1. Check font paths in fonts.css
2. Verify WOFF2 files exist
3. Check browser console for 404 errors
4. Clear cache and reload

## 📝 License

© OMEGA - All rights reserved

## 👥 Contributors

- Design: 60fps
- Implementation: Restoration Team
- QA: [To be filled]

## 📞 Support

For issues or questions, please contact the development team.

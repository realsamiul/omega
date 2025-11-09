// Enhanced JavaScript for OMEGA Space Sustainability page
// Maintains original aesthetic while ensuring media is visible and interactive features work

(function() {
    'use strict';

    // ========================================
    // 1. Video Autoplay
    // ========================================
    function setupVideoAutoplay() {
        const video = document.querySelector('.objects-video');
        if (video) {
            // Ensure video is visible and plays
            video.style.display = 'block';
            video.style.opacity = '1';
            video.style.visibility = 'visible';
            
            // Attempt to play video
            video.play().catch(err => {
                console.log('Video autoplay prevented:', err);
                // Try again on user interaction
                document.addEventListener('click', () => {
                    video.play().catch(() => {});
                }, { once: true });
            });
        }
    }

    // ========================================
    // 2. Smooth Scroll Behavior
    // ========================================
    function setupSmoothScroll() {
        // Enable smooth scrolling for the page
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Handle anchor links with smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ========================================
    // 3. Intersection Observer for Scroll Animations
    // ========================================
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'animated');
                    
                    // Trigger number counters when sections become visible
                    if (entry.target.classList.contains('objects-section') || 
                        entry.target.classList.contains('satellites-section')) {
                        animateNumbers(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe sections for fade-in animations
        const sections = document.querySelectorAll(
            '.hero-section, .protecting-section, .objects-section, ' +
            '.satellites-section, .privateer-section, .wayfinder-section, .crew-section'
        );
        
        sections.forEach(section => {
            observer.observe(section);
        });

        // Make hero section visible immediately
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('visible', 'animated');
        }
    }

    // ========================================
    // 4. Number Counter Animation
    // ========================================
    function animateNumbers(section) {
        const numberElement = section.querySelector('.number');
        if (!numberElement || numberElement.dataset.animated) return;
        
        numberElement.dataset.animated = 'true';
        const targetText = numberElement.textContent.trim();
        
        // Extract the number (remove commas)
        const targetNumber = parseInt(targetText.replace(/,/g, ''));
        if (isNaN(targetNumber)) return;
        
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetNumber / steps;
        let currentNumber = 0;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            currentNumber = Math.min(currentNumber + increment, targetNumber);
            
            // Format number with commas
            const formatted = Math.floor(currentNumber).toLocaleString('en-US');
            numberElement.textContent = formatted;
            
            if (currentStep >= steps || currentNumber >= targetNumber) {
                clearInterval(timer);
                // Ensure final number is exact
                numberElement.textContent = targetNumber.toLocaleString('en-US');
            }
        }, duration / steps);
    }

    // ========================================
    // 5. Card Carousel for Team Members
    // ========================================
    function setupCardCarousel() {
        // Handle Privateer cards carousel (mobile/tablet)
        setupCarouselForSection('.privateer-section');
        
        // Handle Crew cards carousel (mobile/tablet)
        setupCarouselForSection('.crew-section');
    }

    function setupCarouselForSection(sectionSelector) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        const cardsWrapper = section.querySelector('.cards-w[data-slides-wrapper]');
        const cards = section.querySelectorAll('.card');
        const counters = section.querySelectorAll('.circle-counter');
        
        if (!cardsWrapper || cards.length === 0) return;

        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;

        // Only enable carousel on mobile/tablet
        function isCarouselEnabled() {
            return window.innerWidth < 1024;
        }

        function showCard(index) {
            if (!isCarouselEnabled()) return;
            
            currentIndex = index;
            
            // Update card positions
            cards.forEach((card, i) => {
                if (i === currentIndex) {
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    card.style.transform = 'translateX(0)';
                    card.style.zIndex = '1';
                } else {
                    card.style.opacity = '0';
                    card.style.visibility = 'hidden';
                    card.style.transform = i < currentIndex ? 'translateX(-100%)' : 'translateX(100%)';
                    card.style.zIndex = '0';
                }
            });

            // Update counter dots
            counters.forEach((counter, i) => {
                if (i === currentIndex) {
                    counter.classList.add('active');
                } else {
                    counter.classList.remove('active');
                }
            });
        }

        // Touch/Mouse event handlers
        function handleStart(e) {
            if (!isCarouselEnabled()) return;
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        }

        function handleEnd(e) {
            if (!isCarouselEnabled() || !isDragging) return;
            isDragging = false;
            
            const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].pageX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0 && currentIndex < cards.length - 1) {
                    // Swipe left - next card
                    showCard(currentIndex + 1);
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous card
                    showCard(currentIndex - 1);
                }
            }
        }

        // Add event listeners
        cardsWrapper.addEventListener('mousedown', handleStart);
        cardsWrapper.addEventListener('touchstart', handleStart, { passive: true });
        cardsWrapper.addEventListener('mouseup', handleEnd);
        cardsWrapper.addEventListener('touchend', handleEnd, { passive: true });
        cardsWrapper.addEventListener('mouseleave', () => { isDragging = false; });

        // Click handlers for counter dots
        counters.forEach((counter, index) => {
            counter.addEventListener('click', () => {
                if (isCarouselEnabled()) {
                    showCard(index);
                }
            });
        });

        // Initialize first card
        showCard(0);

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!isCarouselEnabled()) {
                    // Reset styles when carousel is disabled (desktop)
                    cards.forEach(card => {
                        card.style.opacity = '';
                        card.style.visibility = '';
                        card.style.transform = '';
                        card.style.zIndex = '';
                    });
                } else {
                    showCard(currentIndex);
                }
            }, 250);
        });
    }

    // ========================================
    // 6. Back to Top Button
    // ========================================
    function setupBackToTop() {
        const backToTop = document.querySelector('.back-top-w');
        if (!backToTop) return;

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
            } else {
                backToTop.style.opacity = '0.5';
            }
        });
    }

    // ========================================
    // 7. Scroll Indicator
    // ========================================
    function setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-w');
        if (!scrollIndicator) return;

        // Show scroll indicator
        scrollIndicator.style.opacity = '1';
        const scrollText = scrollIndicator.querySelector('.scroll-text');
        const scrollIcon = scrollIndicator.querySelector('.scroll-icon');
        
        if (scrollText) scrollText.style.opacity = '1';
        if (scrollIcon) scrollIcon.style.opacity = '1';

        // Hide scroll indicator after scrolling
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    // ========================================
    // 8. Simple Fade-in Effects
    // ========================================
    function setupFadeInEffects() {
        // Add fade-in class to elements that should animate
        const elementsToFade = document.querySelectorAll(
            '.button, .card, .card-text-w, .privateer-icon, .wayfinder-svg'
        );

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elementsToFade.forEach(el => {
            fadeObserver.observe(el);
        });
    }

    // ========================================
    // 9. Cursor Animation (Simple version)
    // ========================================
    function setupCursor() {
        const cursorWrapper = document.querySelector('.cursor-w');
        if (!cursorWrapper) return;

        // Show cursor after page load
        setTimeout(() => {
            cursorWrapper.classList.add('visible');
            cursorWrapper.classList.remove('loading');
        }, 500);

        // Only track cursor on desktop with mouse
        if (window.innerWidth >= 1024 && !('ontouchstart' in window)) {
            const cursor = document.querySelector('.cursor.outer-circle');
            if (!cursor) return;

            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX - 29 + 'px';
                cursor.style.top = e.clientY - 29 + 'px';
            });
        }
    }

    // ========================================
    // 10. Accessibility Buttons
    // ========================================
    function setupAccessibilityButtons() {
        const animButton = document.querySelector('.accessibility-button.animation');
        const contrastButton = document.querySelector('.accessibility-button.contrast');

        if (animButton) {
            animButton.style.opacity = '1';
            animButton.addEventListener('click', () => {
                document.body.classList.toggle('animations-off');
                animButton.classList.toggle('off');
            });
        }

        if (contrastButton) {
            contrastButton.style.opacity = '1';
            contrastButton.addEventListener('click', () => {
                document.body.classList.toggle('contrast');
                contrastButton.classList.toggle('off');
            });
        }
    }

    // ========================================
    // Initialize Everything on DOM Ready
    // ========================================
    function init() {
        setupVideoAutoplay();
        setupSmoothScroll();
        setupScrollAnimations();
        setupCardCarousel();
        setupBackToTop();
        setupScrollIndicator();
        setupFadeInEffects();
        setupCursor();
        setupAccessibilityButtons();

        // Mark page as loaded
        document.body.classList.add('page-loaded');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

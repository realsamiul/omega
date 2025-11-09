// Ensure video plays
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.objects-video');
    if (video) {
        video.play();
    }
    
    // Make hero section visible immediately
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('visible');
    }
    
    // Simple scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.hero-section, .protecting-section, .objects-section, .crew-section').forEach(el => {
        observer.observe(el);
    });
});

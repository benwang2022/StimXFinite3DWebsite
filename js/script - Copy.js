// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Initialize language preference
    initLanguage();
    
    // Initialize carousel if on software page
    initCarousel();
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

// Language Selection
function initLanguage() {
    // Check browser language
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = localStorage.getItem('preferredLanguage') || (userLang.startsWith('zh') ? 'zh' : 'en');
    
    // Set language buttons
    const enBtn = document.getElementById('lang-en');
    const zhBtn = document.getElementById('lang-zh');
    
    if (enBtn && zhBtn) {
        // Set initial active state
        if (currentLang === 'zh') {
            enBtn.classList.remove('active');
            zhBtn.classList.add('active');
        } else {
            enBtn.classList.add('active');
            zhBtn.classList.remove('active');
        }
        
        // Add click events
        enBtn.addEventListener('click', function() {
            setLanguage('en');
            enBtn.classList.add('active');
            zhBtn.classList.remove('active');
        });
        
        zhBtn.addEventListener('click', function() {
            setLanguage('zh');
            zhBtn.classList.add('active');
            enBtn.classList.remove('active');
        });
    }
    
    // Apply current language
    setLanguage(currentLang);
}

function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    
    // Hide all language elements
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.classList.remove('lang-active');
    });
    
    // Show elements for selected language
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
        el.classList.add('lang-active');
    });
}

// Image Carousel
function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show specific slide
    function showSlide(n) {
        // Reset all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Handle index overflow
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
        else currentSlide = n;
        
        // Activate current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Start auto slideshow
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    // Reset interval on user interaction
    function resetInterval() {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    
    // Initialize carousel
    showSlide(currentSlide);
    startAutoSlide();
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            resetInterval();
            showSlide(currentSlide + 1);
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            resetInterval();
            showSlide(currentSlide - 1);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (currentSlide !== index) {
                resetInterval();
                showSlide(index);
            }
        });
    });
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            resetInterval();
            showSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            resetInterval();
            showSlide(currentSlide - 1);
        }
    }
    
    // Pause slideshow when mouse is over carousel
    carousel.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    // Resume slideshow when mouse leaves carousel
    carousel.addEventListener('mouseleave', function() {
        startAutoSlide();
    });
}
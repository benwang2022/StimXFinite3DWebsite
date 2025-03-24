// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const languageSelector = document.querySelector('.language-selector');

    // Add additional spacing to the language selector
    if (languageSelector) {
        // Ensure language selector has proper spacing on mobile and desktop
        const adjustLanguageSelector = () => {
            if (window.innerWidth <= 768) {
                // On mobile: position it better when menu is toggled
                languageSelector.style.marginLeft = '0';
                languageSelector.style.marginTop = '15px';
                languageSelector.style.alignSelf = 'flex-start';
            } else {
                // On desktop: ensure proper margin from menu
                languageSelector.style.marginLeft = '20px';
                languageSelector.style.marginTop = '0';
                languageSelector.style.alignSelf = 'center';
            }
        };

        // Run on load and on resize
        adjustLanguageSelector();
        window.addEventListener('resize', adjustLanguageSelector);
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Adjust language selector position when menu is toggled on mobile
            if (window.innerWidth <= 768 && languageSelector) {
                if (navMenu.classList.contains('active')) {
                    // When menu is active, position language selector below the menu
                    languageSelector.style.position = 'absolute';
                    languageSelector.style.top = navMenu.offsetHeight + 'px';
                    languageSelector.style.right = '20px';
                } else {
                    // Reset position when menu is closed
                    languageSelector.style.position = 'static';
                }
            }
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
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    const slidesContainer = carouselContainer.querySelector('.carousel-slides');
    if (!slidesContainer) return;
    
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const dots = carouselContainer.querySelectorAll('.dot');
    const prevBtn = carouselContainer.querySelector('.carousel-btn.prev');
    const nextBtn = carouselContainer.querySelector('.carousel-btn.next');
    
    let currentSlide = 0;
    let slideInterval;
    const totalSlides = slides.length;
    
    // Function to show specific slide
    function showSlide(n) {
        // Handle index bounds properly
        if (n >= totalSlides) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = n;
        }
        
        // Reset all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
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
    showSlide(0);
    startAutoSlide();
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showSlide(currentSlide + 1);
            resetInterval();
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlide - 1);
            resetInterval();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (currentSlide !== index) {
                showSlide(index);
                resetInterval();
            }
        });
    });
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            showSlide(currentSlide + 1);
            resetInterval();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            showSlide(currentSlide - 1);
            resetInterval();
        }
    }
    
    // Pause slideshow when mouse is over carousel
    carouselContainer.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    // Resume slideshow when mouse leaves carousel
    carouselContainer.addEventListener('mouseleave', function() {
        startAutoSlide();
    });
}
/* ============================================
   ESTATE COMPANY - MODERN JAVASCRIPT
   High Performance & Smooth Interactions
   ============================================ */

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
const debounce = (func, wait = 20) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll events
const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

class Navigation {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupScrollEffects();
        this.setupActiveLink();
    }
    
    // Mobile Menu Toggle
    setupMobileMenu() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => {
                this.hamburger.classList.toggle('active');
                this.navMenu.classList.toggle('active');
                document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.hamburger.classList.remove('active');
                    this.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar') && this.navMenu.classList.contains('active')) {
                    this.hamburger.classList.remove('active');
                    this.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    // Smooth Scrolling
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Scroll Effects (Hide/Show Header)
    setupScrollEffects() {
        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow on scroll
            if (currentScroll > 100) {
                this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                this.header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
            }
            
            this.lastScroll = currentScroll;
        }, 100));
    }
    
    // Active Link Highlighting
    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', throttle(() => {
            const scrollPosition = window.pageYOffset + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100));
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.property-card, .service-card, .testimonial-card, .stat-box, .feature-item, .info-card');
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Show/Hide button on scroll
        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 200));
        
        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// FORM VALIDATION & HANDLING
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.removeError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Phone validation (optional but if filled, should be valid)
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        // Select validation
        else if (field.tagName === 'SELECT' && (!value || value === '')) {
            isValid = false;
            errorMessage = 'Please select an option';
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#dc3545';
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        errorElement.textContent = message;
        
        field.parentElement.appendChild(errorElement);
    }
    
    removeError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    submitForm() {
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            // Success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }
    
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        successDiv.innerHTML = `
            <strong>✓ Success!</strong><br>
            Your message has been sent successfully. We'll get back to you soon!
        `;
        
        document.body.appendChild(successDiv);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }, 5000);
    }
}

// ============================================
// PROPERTY CARD INTERACTIONS
// ============================================

class PropertyCards {
    constructor() {
        this.cards = document.querySelectorAll('.property-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            // Add click tracking
            const learnMoreBtn = card.querySelector('.btn-secondary');
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const propertyTitle = card.querySelector('.property-title').textContent;
                    console.log(`User clicked: ${propertyTitle}`);
                    
                    // Smooth scroll to contact
                    const contactSection = document.getElementById('contact');
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    window.scrollTo({
                        top: contactSection.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                });
            }
        });
    }
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-item h3, .stat-box h3');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.stats.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasDollar = text.includes('$');
        const hasPercent = text.includes('%');
        const hasSlash = text.includes('/');
        
        // Extract number
        let number = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(number)) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            let displayValue = current;
            
            // Format based on size
            if (number >= 1000000000) {
                displayValue = (current / 1000000000).toFixed(1) + 'B';
            } else if (number >= 1000000) {
                displayValue = (current / 1000000).toFixed(1) + 'M';
            } else if (number >= 1000) {
                displayValue = (current / 1000).toFixed(1) + 'K';
            } else {
                displayValue = Math.floor(current);
            }
            
            // Add symbols
            let finalText = displayValue;
            if (hasDollar) finalText = '$' + finalText;
            if (hasPlus) finalText = finalText + '+';
            if (hasPercent) finalText = finalText + '%';
            if (hasSlash) finalText = finalText.replace(/[^0-9]/g, '') + '/7';
            
            element.textContent = finalText;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = text; // Reset to original
            }
        }, duration / steps);
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================

class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero-section');
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                this.hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                this.hero.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }, 10));
    }
}

// ============================================
// LAZY LOADING IMAGES (Future Implementation)
// ============================================

class LazyLoad {
    constructor() {
        this.images = document.querySelectorAll('.image-placeholder[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.style.backgroundImage = `url(${src})`;
                            img.removeAttribute('data-src');
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            this.images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Log page load performance
        window.addEventListener('load', () => {
            if (window.performance) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`🚀 Page Load Time: ${pageLoadTime}ms`);
            }
        });
    }
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Keyboard navigation for cards
        const interactiveElements = document.querySelectorAll('.property-card, .service-card');
        
        interactiveElements.forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const link = element.querySelector('a');
                    if (link) link.click();
                }
            });
        });
        
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-accent);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10001;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 Estate Company Website Initialized');
    
    // Initialize all modules
    new Navigation();
    new ScrollAnimations();
    new BackToTop();
    new ContactForm();
    new PropertyCards();
    new StatsCounter();
    new ParallaxEffect();
    new LazyLoad();
    new PerformanceMonitor();
    new AccessibilityEnhancer();
    
    // Add smooth reveal on page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✅ All modules loaded successfully');
});

// ============================================
// SERVICE WORKER (Optional - for PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ============================================
// PREVENT CONSOLE ERRORS IN PRODUCTION
// ============================================

// Uncomment for production
// if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
//     console.log = () => {};
//     console.warn = () => {};
//     console.error = () => {};
// }

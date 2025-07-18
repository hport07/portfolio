// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePortfolio();
});

function initializePortfolio() {
    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize smooth scrolling
    initializeSmoothScrolling();

    // Initialize home page animations
    initializeHomeAnimations();

    // Initialize contact form
    initializeContactForm();

    // Initialize navbar scroll effect
    initializeNavbarScroll();

    // Initialize section animations
    initializeSectionAnimations();
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (!hamburger || !mobileMenu || !menuOverlay) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    });

    // Close mobile menu when clicking on overlay
    menuOverlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close mobile menu when clicking on menu links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Home page animations
function initializeHomeAnimations() {
    // Inject animation styles
    injectAnimationStyles();

    // Initialize particle system
    try {
        new ParticleSystem();
    } catch (error) {
        console.warn('Particle system initialization failed:', error);
    }

    // Initialize matrix rain
    try {
        new MatrixRain();
    } catch (error) {
        console.warn('Matrix rain initialization failed:', error);
    }

    // Initialize other animations
    createFloatingElements();
    createGlitchEffect();
    createParallaxEffect();
    createPulseAnimation();
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50; // Reduced for better performance
        this.animationId = null;

        if (!this.setupCanvas()) return;

        this.createParticles();
        this.animate();

        // Add event listeners
        this.resizeHandler = () => {
            this.setupCanvas();
            this.createParticles();
        };

        this.mouseMoveHandler = (e) => this.handleMouseMove(e);

        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    setupCanvas() {
        const homeSection = document.getElementById('home');
        if (!homeSection) return false;

        this.canvas.width = homeSection.offsetWidth;
        this.canvas.height = homeSection.offsetHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';

        if (!homeSection.querySelector('canvas')) {
            homeSection.appendChild(this.canvas);
        }

        return true;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `rgba(0, 255, 136, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }

    handleMouseMove(e) {
        if (!this.canvas || !this.particles.length) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
            }
        });
    }

    animate() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= this.canvas.height) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Draw connections (limit to improve performance)
            for (let i = 0; i < Math.min(this.particles.length, 10); i++) {
                const otherParticle = this.particles[i];
                if (otherParticle === particle) continue;

                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${(100 - distance) / 500})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeHandler);
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.chars = '01';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;

        if (!this.setupCanvas()) return;

        this.initDrops();
        this.animate();

        this.resizeHandler = () => {
            this.setupCanvas();
            this.initDrops();
        };

        window.addEventListener('resize', this.resizeHandler);
    }

    setupCanvas() {
        const homeSection = document.getElementById('home');
        if (!homeSection) return false;

        this.canvas.width = homeSection.offsetWidth;
        this.canvas.height = homeSection.offsetHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.1';

        if (!homeSection.querySelector('.matrix-canvas')) {
            this.canvas.className = 'matrix-canvas';
            homeSection.appendChild(this.canvas);
        }

        return true;
    }

    initDrops() {
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    animate() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeHandler);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Floating Elements Animation
function createFloatingElements() {
    const homeSection = document.getElementById('home');
    if (!homeSection || homeSection.querySelector('.floating-elements')) return;

    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    floatingContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
    `;

    const shapes = ['◆', '●', '▲', '■', '★'];

    for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.cssText = `
            position: absolute;
            color: rgba(0, 255, 136, 0.3);
            font-size: ${Math.random() * 20 + 10}px;
            animation: float ${Math.random() * 10 + 10}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            transform: rotate(${Math.random() * 360}deg);
        `;

        floatingContainer.appendChild(shape);
    }

    homeSection.appendChild(floatingContainer);
}

// Glitch Effect
function createGlitchEffect() {
    const homeTitle = document.querySelector('#home h1');
    if (!homeTitle) return;

    const originalText = homeTitle.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let glitchInterval;

    function glitch() {
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchedText += originalText[i];
            }
        }

        homeTitle.textContent = glitchedText;
        homeTitle.style.color = Math.random() > 0.5 ? '#ff0055' : '#00ff88';

        setTimeout(() => {
            homeTitle.textContent = originalText;
            homeTitle.style.color = '#00ff88';
        }, 50);
    }

    glitchInterval = setInterval(() => {
        if (Math.random() < 0.05) {
            glitch();
        }
    }, 200);
}

// Parallax Mouse Effect
function createParallaxEffect() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const elements = homeSection.querySelectorAll('h1, p, a');
    if (!elements.length) return;

    homeSection.addEventListener('mousemove', (e) => {
        const rect = homeSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        elements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;

            element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            element.style.transition = 'transform 0.1s ease-out';
        });
    });

    homeSection.addEventListener('mouseleave', () => {
        elements.forEach(element => {
            element.style.transform = 'translate(0, 0)';
            element.style.transition = 'transform 0.5s ease-out';
        });
    });
}

// Pulse Animation for CTA Button
function createPulseAnimation() {
    const ctaButton = document.querySelector('#home a');
    if (!ctaButton) return;

    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.animation = 'pulse 0.5s ease-in-out';
    });

    ctaButton.addEventListener('animationend', () => {
        ctaButton.style.animation = '';
    });
}

// CSS Animations (injected dynamically)
function injectAnimationStyles() {
    if (document.querySelector('#portfolio-animations')) return;

    const style = document.createElement('style');
    style.id = 'portfolio-animations';
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
            100% { transform: translateY(0) rotate(360deg); opacity: 0.3; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideInFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes neonGlow {
            0%, 100% { text-shadow: 0 0 20px rgba(0, 255, 136, 0.5); }
            50% { text-shadow: 0 0 30px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.6); }
        }
        
        #home h1 {
            animation: slideInFromLeft 1s ease-out, neonGlow 2s ease-in-out infinite;
        }
        
        #home p {
            animation: slideInFromRight 1s ease-out 0.3s both;
        }
        
        #home a {
            animation: slideInFromBottom 1s ease-out 0.6s both;
        }
    `;

    document.head.appendChild(style);
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.querySelector('#contact form');
    if (!contactForm) return;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    // Form validation
    function validateForm(formData) {
        const errors = [];

        if (!formData.name?.trim()) {
            errors.push('Name is required');
        }

        if (!formData.email?.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!formData.subject?.trim()) {
            errors.push('Subject is required');
        }

        if (!formData.message?.trim()) {
            errors.push('Message is required');
        }

        return errors;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Set button loading state
    function setButtonLoading(loading) {
        if (loading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.7';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            submitButton.style.opacity = '1';
        }
    }

    // Handle form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: contactForm.name?.value || '',
            email: contactForm.email?.value || '',
            subject: contactForm.subject?.value || '',
            message: contactForm.message?.value || ''
        };

        const errors = validateForm(formData);
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            return;
        }

        setButtonLoading(true);

        try {
            const response = await fetch('https://conta-back.onrender.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showNotification('Message sent successfully! Thank you for getting in touch.', 'success');
                contactForm.reset();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
                throw new Error(errorData.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification(
                error.message || 'Failed to send message. Please try again later.',
                'error'
            );
        } finally {
            setButtonLoading(false);
        }
    });

    // Form input visual feedback
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#007bff';
            input.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        });
    });
}

// Navbar scroll effect
function initializeNavbarScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;

    function updateNavbar() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Section fade-in animation
function initializeSectionAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const sections = document.querySelectorAll('section:not(#home)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Error handling wrapper
function safeExecute(fn, errorMessage = 'Error executing function') {
    try {
        return fn();
    } catch (error) {
        console.warn(`${errorMessage}:`, error);
        return null;
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't show user-facing errors for non-critical issues
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the default behavior (console error)
    event.preventDefault();
});
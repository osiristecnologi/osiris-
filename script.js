// OSIRIS - JavaScript Moderno

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Learning path navigation
    const pathItems = document.querySelectorAll('.path-item');
    const contentSections = document.querySelectorAll('.content-section');
    const heroSection = document.querySelector('#inicio');

    pathItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            pathItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide hero and all content sections
            heroSection.style.display = 'none';
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show corresponding content section
            if (index === 0) {
                // Show hero section for first item
                heroSection.style.display = 'flex';
                heroSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Show content section
                const targetSection = document.querySelectorAll('.content-section')[index - 1];
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Section navigation buttons
    document.querySelectorAll('.section-nav .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentSection = this.closest('.content-section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection && nextSection.classList.contains('content-section')) {
                currentSection.classList.remove('active');
                nextSection.classList.add('active');
                nextSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update path items
                const sectionIndex = Array.from(contentSections).indexOf(nextSection) + 1;
                pathItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx === sectionIndex);
                });
            }
        });
    });

    document.querySelectorAll('.section-nav .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentSection = this.closest('.content-section');
            const prevSection = currentSection.previousElementSibling;
            
            if (prevSection && prevSection.classList.contains('content-section')) {
                currentSection.classList.remove('active');
                prevSection.classList.add('active');
                prevSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update path items
                const sectionIndex = Array.from(contentSections).indexOf(prevSection) + 1;
                pathItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx === sectionIndex);
                });
            } else {
                // Go back to hero
                currentSection.classList.remove('active');
                heroSection.style.display = 'flex';
                heroSection.scrollIntoView({ behavior: 'smooth' });
                pathItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx === 0);
                });
            }
        });
    });

    // Theme toggle (Dark/Light mode preparation)
    const themeToggle = document.getElementById('themeToggle');
    let isDarkMode = true;

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        const icon = themeToggle.querySelector('i');
        
        if (isDarkMode) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            document.body.style.filter = '';
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.content-card, .project-card, .feature-item, .path-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Button click effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Tech stack animation on hover
    document.querySelectorAll('.tech-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Console easter egg
    console.log('%c👁️ OSIRIS - Sistema de Aprendizado', 'color: #00BFFF; font-size: 24px; font-weight: bold;');
    console.log('%cDesperte seu potencial. Construa o futuro.', 'color: #8A2BE2; font-size: 14px;');
    console.log('%cBem-vindo à jornada do conhecimento!', 'color: #00F0FF; font-size: 12px;');
});

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Particle system for background
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.5;
        `;
        document.querySelector('.bg-animation').appendChild(this.canvas);
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const particleCount = Math.min(100, window.innerWidth / 10);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 191, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Connect particles
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 191, 255, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
new ParticleSystem();

// Typing effect for hero title (optional enhancement)
class TypingEffect {
    constructor(element, texts, speed = 100, delay = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.delay = delay;
        this.currentText = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const current = this.texts[this.currentText];
        
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = current.substring(0, this.currentChar + 1);
            this.currentChar++;
        }
        
        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;
        
        if (!this.isDeleting && this.currentChar === current.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentText = (this.currentText + 1) % this.texts.length;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing effect if needed
// const heroTitle = document.querySelector('.hero-text h1');
// new TypingEffect(heroTitle, ['DOMINE A PROGRAMAÇÃO', 'E A INTELIGÊNCIA ARTIFICIAL']);

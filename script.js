// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Unified Scroll Handler (navbar shadow + nav active state + parallax)
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Navbar shadow
    if (navbar) {
        navbar.style.boxShadow = currentScroll > 50
            ? '0 4px 12px rgba(0,0,0,0.15)'
            : '0 2px 8px rgba(0,0,0,0.08)';
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', currentScroll > 400);
    }

    // Active navigation link
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= (section.offsetTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${currentScroll * 0.5}px)`;
        hero.style.opacity = 1 - currentScroll / 600;
    }
});

// Single IntersectionObserver for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Apply fade-in to cards and sections
document.querySelectorAll('.about-card, .method-card, .country-card, .contact-card, .detail-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// Formula elements with staggered delay
document.querySelectorAll('.formula-item, .calc-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    item.style.transition = `all 0.5s ease ${index * 100}ms`;
    fadeObserver.observe(item);
});

// Counter Animation for 360 Types
const counterElement = document.querySelector('.calc-result .calc-number');
if (counterElement) {
    const targetNumber = 360;
    let currentNumber = 0;
    const duration = 2000;
    const increment = targetNumber / (duration / 16);

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && currentNumber === 0) {
                const updateCounter = () => {
                    currentNumber += increment;
                    if (currentNumber < targetNumber) {
                        counterElement.textContent = Math.floor(currentNumber);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counterElement.textContent = targetNumber;
                    }
                };
                updateCounter();
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(counterElement);
}

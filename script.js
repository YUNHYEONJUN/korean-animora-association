(() => {
'use strict';
// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Mobile menu backdrop
const menuBackdrop = document.createElement('div');
menuBackdrop.className = 'menu-backdrop';
document.body.appendChild(menuBackdrop);

function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    menuBackdrop.classList.remove('active');
    // 포커스 복원
    if (hamburger) hamburger.focus();
}

if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'nav-menu');

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        menuBackdrop.classList.toggle('active', isOpen);

        // 포커스 트랩: 메뉴 열렸을 때 첫 링크로 포커스 이동
        if (isOpen) {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });

    // 키보드로 햄버거 메뉴 토글
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// nav-menu에 id 추가 (aria-controls 연결)
if (navMenu) {
    navMenu.id = 'nav-menu';
}

menuBackdrop.addEventListener('click', closeMenu);

// Escape 키로 메뉴 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // 포커스를 대상 요소로 이동 (접근성)
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
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
        const parallaxSpeed = 0.5;
        const fadeDistance = 600; // px until fully faded
        hero.style.transform = `translateY(${currentScroll * parallaxSpeed}px)`;
        hero.style.opacity = Math.max(0, 1 - currentScroll / fadeDistance);
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
                        // 애니메이션 완료 후 옵저버 정리
                        counterObserver.disconnect();
                    }
                };
                updateCounter();
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(counterElement);
}
})();

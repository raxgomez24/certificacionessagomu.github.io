/**
 * Main JavaScript - Sagomu
 * Funcionalidades globales del sitio
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
});

/**
 * Menú móvil (hamburger)
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    // Toggle del menú al hacer click en hamburger
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');

        // Animación del hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active')
            ? 'rotate(45deg) translateY(10px)'
            : 'rotate(0) translateY(0)';
        spans[1].style.opacity = navLinks.classList.contains('active')
            ? '0'
            : '1';
        spans[2].style.transform = navLinks.classList.contains('active')
            ? 'rotate(-45deg) translateY(-10px)'
            : 'rotate(0) translateY(0)';
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');

            // Resetear animación del hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'rotate(0) translateY(0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translateY(0)';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');

            // Resetear animación del hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'rotate(0) translateY(0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translateY(0)';
        }
    });
}

/**
 * Smooth scroll para enlaces internos
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Ignorar enlaces que solo son "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Calcular la posición considerando el header sticky
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Efecto de sombra en header al hacer scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    if (!header) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Aumentar sombra cuando hay scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'var(--sombra-suave)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Utilidad: Animación de entrada para elementos
 */
function fadeInElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observar tarjetas de certificaciones
    document.querySelectorAll('.cert-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Ejecutar animación cuando se cargue el catálogo
if (document.querySelector('.catalogo-grid')) {
    // Esperar a que se carguen las tarjetas
    setTimeout(fadeInElements, 100);
}
/**
 * Portfólio - Script Principal
 * Lógica pura em Vanilla JS focado em performance e UX.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ALTERNÂNCIA DE TEMA (DARK/LIGHT)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    const updateThemeIcon = (theme) => {
        const iconContainer = document.getElementById('theme-icon');

        if (theme === 'light') {
            iconContainer.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        } else {
            iconContainer.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        }
    };

    updateThemeIcon(htmlElement.getAttribute('data-theme'));

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    /* ==========================================================================
       2. MENU MOBILE
       ========================================================================== */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });

    /* ==========================================================================
       3. ANIMAÇÕES NO SCROLL
       ========================================================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        scrollObserver.observe(section);
    });

    /* ==========================================================================
       4. CARROSSEL
       ========================================================================== */
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const carousel = document.getElementById('projects-carousel');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 370;

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       5. FORMULÁRIO + VALIDAÇÃO + MODAL
       ========================================================================== */
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Estado inicial acessibilidade
    modal.setAttribute('aria-hidden', 'true');

    /* ---------- Funções utilitárias ---------- */

    const isEmailValid = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const setError = (input, message) => {
        const formControl = input.parentElement;
        formControl.classList.add('error');

        const errorMsg = formControl.querySelector('.error-msg');
        if (errorMsg) errorMsg.innerText = message;
    };

    const clearError = (input) => {
        const formControl = input.parentElement;
        formControl.classList.remove('error');
    };

    /* ---------- Validação em tempo real ---------- */

    const inputsRealtime = form.querySelectorAll('input, textarea');

    inputsRealtime.forEach(input => {
        input.addEventListener('input', () => {

            if (input.value.trim() !== '') {
                clearError(input);
            }

            if (input.type === 'email' && input.value.trim() !== '') {
                if (!isEmailValid(input.value.trim())) {
                    setError(input, 'E-mail inválido');
                }
            }
        });
    });

    /* ---------- Submit ---------- */

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => clearError(input));

        const nome = document.getElementById('nome');
        if (nome.value.trim() === '') {
            setError(nome, 'Nome é obrigatório');
            isValid = false;
        }

        const sobrenome = document.getElementById('sobrenome');
        if (sobrenome.value.trim() === '') {
            setError(sobrenome, 'Sobrenome é obrigatório');
            isValid = false;
        }

        const email = document.getElementById('email');
        if (email.value.trim() === '') {
            setError(email, 'E-mail é obrigatório');
            isValid = false;
        } else if (!isEmailValid(email.value.trim())) {
            setError(email, 'Insira um e-mail válido');
            isValid = false;
        }

        const assunto = document.getElementById('assunto');
        if (assunto.value.trim() === '') {
            setError(assunto, 'Assunto é obrigatório');
            isValid = false;
        }

        const mensagem = document.getElementById('mensagem');
        if (mensagem.value.trim() === '') {
            setError(mensagem, 'A mensagem não pode estar vazia');
            isValid = false;
        }

        if (isValid) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            form.reset();
        }
    });

    /* ---------- Modal ---------- */

    const fecharModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    };

    closeModalBtn.addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // ESC para fechar (UX profissional)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            fecharModal();
        }
    });

});
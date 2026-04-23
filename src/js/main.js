/**
 * Portfólio - Script Principal
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

    const toggleMenu = () => {
        const isActive = navList.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', isActive);
    };

    mobileBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       3. ANIMAÇÕES NO SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    // Verifica se o usuário não ativou "reduzir movimento" no SO
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
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
    } else {
        // Para movimento mais reduzido, isso exibe tudo imediatamente
        document.querySelectorAll('.animate-on-scroll').forEach(section => {
            section.classList.add('is-visible');
        });
    }

    /* ==========================================================================
       4. CARROSSEL DE PORTFÓLIO
       ========================================================================== */
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const carousel = document.getElementById('projects-carousel');

    if (carousel && prevBtn && nextBtn) {
        const getScrollAmount = () => {
            const cardWidth = carousel.querySelector('.project-card').offsetWidth;
            const gap = 32; // Equivalente a 2rem
            return cardWidth + gap;
        };

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       5. FORMULÁRIO E VALIDAÇÃO ACESSÍVEL
       ========================================================================== */
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    let lastFocusedElement; // Para devolver o foco ao fechar o modal

    const isEmailValid = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const setError = (input, message) => {
        const formControl = input.parentElement;
        formControl.classList.add('error');
        input.setAttribute('aria-invalid', 'true');

        const errorMsg = formControl.querySelector('.error-msg');
        if (errorMsg) errorMsg.innerText = message;
    };

    const clearError = (input) => {
        const formControl = input.parentElement;
        formControl.classList.remove('error');
        input.removeAttribute('aria-invalid');
    };

    // Validação em tempo real
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        let firstInvalidInput = null;
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => clearError(input));

        const fieldsToValidate = [
            { id: 'nome', msg: 'Nome é obrigatório' },
            { id: 'sobrenome', msg: 'Sobrenome é obrigatório' },
            { id: 'assunto', msg: 'Assunto é obrigatório' },
            { id: 'mensagem', msg: 'A mensagem não pode estar vazia' }
        ];

        fieldsToValidate.forEach(field => {
            const input = document.getElementById(field.id);
            if (input.value.trim() === '') {
                setError(input, field.msg);
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = input;
            }
        });

        // Validação específica de email
        const email = document.getElementById('email');
        if (email.value.trim() === '') {
            setError(email, 'E-mail é obrigatório');
            isValid = false;
            if (!firstInvalidInput) firstInvalidInput = email;
        } else if (!isEmailValid(email.value.trim())) {
            setError(email, 'Insira um e-mail válido');
            isValid = false;
            if (!firstInvalidInput) firstInvalidInput = email;
        }

        if (isValid) {
            abrirModal();
            form.reset();
        } else if (firstInvalidInput) {
            // Acessibilidade: focar no primeiro campo com erro
            firstInvalidInput.focus();
        }
    });

    /* ==========================================================================
       6. CONTROLE DO MODAL
       ========================================================================== */
    const abrirModal = () => {
        lastFocusedElement = document.activeElement; // Salva quem chamou o modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Trap focus no modal após a animação
        setTimeout(() => {
            closeModalBtn.focus();
        }, 100);
    };

    const fecharModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Devolve o foco para quem abriu
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    closeModalBtn.addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            fecharModal();
        }
    });
});
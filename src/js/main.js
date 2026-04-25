/**
 * Portfólio - Script Principal
 * O DOMContentLoaded garante que o JavaScript só seja executado
 * após todo o HTML da página estar carregado. Isso evita erros ao 
 * tentar manipular elementos que ainda não foram renderizados.
 */
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ALTERNÂNCIA DE TEMA (DARK/LIGHT)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Pega a tag <html>

    // Verifica se há um tema salvo previamente no navegador
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    // Função para atualizar o ícone dependendo do tema ativo
    // O SVG foi inserido diretamente para evitar dependências externas
    const updateThemeIcon = (theme) => {
        const iconContainer = document.getElementById('theme-icon');
        if (theme === 'light') {
            // Ícone de Lua
            iconContainer.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        } else {
            // Ícone de Sol
            iconContainer.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        }
    };

    updateThemeIcon(htmlElement.getAttribute('data-theme'));

    // Alterna o tema ao clicar no botão
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; // Operador ternário para a troca

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // Salva a escolha do usuário
        updateThemeIcon(newTheme);
    });

    /* ==========================================================================
       2. MENU MOBILE
       ========================================================================== */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        // O toggle adiciona a classe se não existir, ou remove se já estiver presente
        const isActive = navList.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        
        // Atualiza a acessibilidade para leitores de tela
        mobileBtn.setAttribute('aria-expanded', isActive);
    };

    mobileBtn.addEventListener('click', toggleMenu);

    // Fecha o menu mobile automaticamente ao clicar em um link
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
    // Utilizando IntersectionObserver no lugar do evento de scroll nativo
    // para melhorar a performance da página.

    // Verifica configurações de acessibilidade do SO (movimento reduzido)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1, // Dispara quando 10% do elemento estiver visível
            rootMargin: "0px 0px -50px 0px" // Margem de antecipação
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible'); 
                    observer.unobserve(entry.target); // Remove o observador após a animação
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(section => {
            scrollObserver.observe(section);
        });
    } else {
        // Exibe os elementos diretamente se o movimento reduzido estiver ativo
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
        // Calcula a largura do scroll baseada no tamanho atual do card
        const getScrollAmount = () => {
            const cardWidth = carousel.querySelector('.project-card').offsetWidth;
            const gap = 32; 
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
       5. FORMULÁRIO E VALIDAÇÃO
       ========================================================================== */
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    let lastFocusedElement; 

    // Validação de formato de e-mail usando Regex
    const isEmailValid = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Funções auxiliares para manipular mensagens de erro no DOM
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

    // Remove o aviso de erro em tempo real enquanto o usuário digita
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

    // Validação principal no envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        let isValid = true;
        let firstInvalidInput = null; 
        const inputs = form.querySelectorAll('input, textarea');

        // Reseta os erros antes da nova validação
        inputs.forEach(input => clearError(input));

        const fieldsToValidate = [
            { id: 'nome', msg: 'Nome é obrigatório' },
            { id: 'sobrenome', msg: 'Sobrenome é obrigatório' },
            { id: 'assunto', msg: 'Assunto é obrigatório' },
            { id: 'mensagem', msg: 'A mensagem não pode estar vazia' }
        ];

        fieldsToValidate.forEach(field => {
            const input = document.getElementById(field.id);
            // .trim() evita validação de campos preenchidos apenas com espaços
            if (input.value.trim() === '') {
                setError(input, field.msg);
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = input;
            }
        });

        // Lógica de validação separada para o e-mail
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
            firstInvalidInput.focus(); // Direciona o usuário para o primeiro erro
        }
    });

    /* ==========================================================================
       6. CONTROLE DO MODAL
       ========================================================================== */
    const abrirModal = () => {
        lastFocusedElement = document.activeElement; // Guarda a referência de foco
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Direciona o foco para dentro do modal (Acessibilidade)
        setTimeout(() => {
            closeModalBtn.focus();
        }, 100);
    };

    const fecharModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Retorna o foco ao elemento original
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    closeModalBtn.addEventListener('click', fecharModal);

    // Fecha o modal ao clicar fora da área central
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // Suporte a fechamento pelo teclado (Esc)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            fecharModal();
        }
    });
});
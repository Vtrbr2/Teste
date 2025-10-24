document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.WhatsApp-flot');
  if (!btn) return;

  // margem mínima da viewport
  const MARGIN = 12;

  // Inicializa posição (se quiser manter o bottom/right originais, pode ajustar aqui)
  // Remove propriedades que podem conflitar (right/bottom) para usar left/top
  btn.style.right = 'auto';
  btn.style.bottom = 'auto';

  // Se o botão ainda não tiver left/top, posiciona no canto inferior direito por padrão
  const rect = btn.getBoundingClientRect();
  if (!btn.style.left && !btn.style.top) {
    const initialLeft = window.innerWidth - rect.width - 40;
    const initialTop = window.innerHeight - rect.height - 40;
    btn.style.left = `${Math.max(MARGIN, initialLeft)}px`;
    btn.style.top  = `${Math.max(MARGIN, initialTop)}px`;
  }

  let isDragging = false;
  let startX = 0, startY = 0, origLeft = 0, origTop = 0, pointerId = null;

  const getFooterTop = () => {
    const footer = document.querySelector('.footer');
    if (!footer) return Infinity;
    return footer.getBoundingClientRect().top;
  };

  const clampPosition = (left, top, elWidth, elHeight) => {
    const footerTop = getFooterTop();
    const maxLeft = window.innerWidth - elWidth - MARGIN;
    // se houver footer, evita descer demais para não cobrir o footer
    const maxTopDefault = window.innerHeight - elHeight - MARGIN;
    const maxTop = footerTop === Infinity ? maxTopDefault : Math.min(maxTopDefault, footerTop - elHeight - 8);

    left = Math.max(MARGIN, Math.min(left, maxLeft));
    top  = Math.max(MARGIN, Math.min(top, maxTop));
    return { left, top };
  };

  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDragging = true;
    pointerId = e.pointerId;
    btn.setPointerCapture(pointerId);

    startX = e.clientX;
    startY = e.clientY;
    const r = btn.getBoundingClientRect();
    origLeft = r.left;
    origTop = r.top;

    btn.classList.add('dragging');
  });

  document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    // calcula novo left/top
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = origLeft + dx;
    const newTop  = origTop + dy;
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    const pos = clampPosition(newLeft, newTop, w, h);

    btn.style.left = `${pos.left}px`;
    btn.style.top  = `${pos.top}px`;
  });

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try { btn.releasePointerCapture(pointerId); } catch (err) {}
    btn.classList.remove('dragging');

    // snap: encaixa no lado esquerdo ou direito da tela (sem cobrir footer)
    const r = btn.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const finalLeft = centerX < window.innerWidth / 2 ? MARGIN : (window.innerWidth - r.width - MARGIN);

    // garante top válido (não cobrir footer)
    const footerTop = getFooterTop();
    const maxTopDefault = window.innerHeight - r.height - MARGIN;
    const maxTop = footerTop === Infinity ? maxTopDefault : Math.min(maxTopDefault, footerTop - r.height - 8);
    const finalTop = Math.max(MARGIN, Math.min(r.top, maxTop));

    // animação suave ao encaixar
    btn.style.transition = 'left 0.22s ease, top 0.22s ease';
    btn.style.left = `${finalLeft}px`;
    btn.style.top  = `${finalTop}px`;

    // remove transition depois da animação
    setTimeout(() => { btn.style.transition = ''; }, 230);
  };

  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  // Reajusta limites quando a janela é redimensionada
  window.addEventListener('resize', () => {
    const r = btn.getBoundingClientRect();
    const clamped = clampPosition(r.left, r.top, r.width, r.height);
    btn.style.left = `${clamped.left}px`;
    btn.style.top  = `${clamped.top}px`;
  });
});




// ===== EFEITO DE SCROLL (fade-in nos cards e textos) =====
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        // ===== FUNÇÃO DE NOTIFICAÇÃO VISUAL =====
        function showNotification(message) {
            const box = document.getElementById("notification");
            if (!box) return;
            box.textContent = message;
            box.classList.add("show");
            setTimeout(() => box.classList.remove("show"), 3000);
        }

        // ===== SCROLL SUAVE PARA SEÇÕES =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    showNotification("Indo até " + targetId.substring(1) + "...");
                }
            });
        });

        // ===== MENSAGEM AUTOMÁTICA (exemplo) =====
        window.addEventListener("load", () => {
            showNotification("Bem-vindo à AI Web Factory 🚀");
        });

        // ===== ATUALIZAR NAVBAR ATIVA =====
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
        // ===== FAQ interativo =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        item.classList.toggle('active');
    });
});
     
        
        
        //====troca de tema====
    const toggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Verifica se o tema foi salvo anteriormente
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Alternar tema ao clicar
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Atualiza o ícone
        const isDark = document.body.classList.contains("dark-mode");
        toggleBtn.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';

        // Salva a escolha no navegador
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });



             //====tentativa principal do nav bar 18:12. 18/10/25===//
// Seleciona elementos
const menuIcon = document.querySelector('.fa-notdog-duo');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');


// Abrir menu lateral
menuIcon.addEventListener('click', () => {
    sidebar.classList.add('active');
    menuIcon.classList.add('active');
});


// Fechar menu lateral
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    menuIcon.classList.remove('active');
});


    //tela de carregamento bb
        const explorarBtn = document.getElementById('explorar-btn');
const loadingScreen = document.getElementById('loading-screen');

explorarBtn.addEventListener('click', (event) => {
    event.preventDefault(); // impede o redirecionamento imediato

 
  // mostra a tela de loading
    loadingScreen.classList.add('active');

  
  // espera 7 segundos e redireciona
    setTimeout(() => {
        window.location.href = explorarBtn.getAttribute('href');
    }, 7000); // 7 segundos = 7000 ms
});


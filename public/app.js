const router = {
    init() {
        console.log('👁️ OSIRIS Router v2.0 Iniciado');
        this.bindNavigation();
        this.handleRoute(); // Carrega a página inicial
    },

    bindNavigation() {
        // Intercepta TODOS os cliques na página (Event Delegation)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.getAttribute('href')) return;

            const href = link.getAttribute('href');

            // Só intercepta rotas internas do OSIRIS
            if (href === '/' || href.startsWith('/aula/')) {
                e.preventDefault();
                router.navigate(href);
            }
        });

        // Botão voltar/avançar do navegador
        window.addEventListener('popstate', () => router.handleRoute());

        // Menu mobile
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    },

    navigate(path) {
        console.log(`📍 Navegando para: ${path}`);
        window.history.pushState({}, '', path);
        router.handleRoute();
    },

    async handleRoute() {
        const app = document.getElementById('app');
        if (!app) return console.error('❌ Container #app não encontrado!');

        const path = window.location.pathname;

        // Rota Inicial
        if (path === '/' || path === '/index.html') {
            await router.renderHome(app);
        }
        // Rota de Aula
        else if (path.startsWith('/aula/')) {
            const id = parseInt(path.split('/')[2]);
            if (id >= 1 && id <= 10) {
                await router.renderAula(app, id);
            } else {
                app.innerHTML = `<div class="container" style="text-align:center; padding:200px 0;"><h1>🔍 Aula ${id} não encontrada</h1><a href="/" class="btn btn-primary">Voltar ao Início</a></div>`;
            }
        }
        // Rota Desconhecida
        else {
            app.innerHTML = `<div class="container" style="text-align:center; padding:200px 0;"><h1>🚧 Página não encontrada</h1><a href="/" class="btn btn-primary">Ir para Home</a></div>`;
        }

        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async renderHome(app) {
        try {
            const res = await fetch('/api/aulas');
            if (!res.ok) throw new Error('Falha ao carregar aulas');
            const aulas = await res.json();

            app.innerHTML = `
                <section class="hero-content">
                    <div class="hero-text">
                        <div class="badge">DO BÁSICO AO AVANÇADO</div>
                        <h1 class="glitch" data-text="DOMINE A PROGRAMAÇÃO">
                            DOMINE A PROGRAMAÇÃO<br>
                            <span class="neon-text">E A INTELIGÊNCIA ARTIFICIAL</span>
                        </h1>
                        <p class="hero-description">Uma jornada completa em 10 partes para transformar você de iniciante a especialista.</p>
                        <a href="/aula/1" class="btn-primary btn-large">COMEÇAR AGORA <i class="fas fa-arrow-right"></i></a>
                    </div>
                </section>
                <section class="learning-path">
                    <div class="container">
                        <h2 class="section-title">TRILHA DE APRENDIZADO - <span class="neon-text">10 PARTES</span></h2>
                        <div class="path-timeline">
                            ${aulas.map(a => `
                                <a href="/aula/${a.id}" class="path-item">
                                    <div class="path-number">${a.id}</div>
                                    <div class="path-icon"><i class="fas ${a.icone}"></i></div>
                                    <h3>${a.titulo}</h3>
                                    <p>${a.subtitulo}</p>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;
        } catch (err) {
            console.error(err);
            app.innerHTML = `<div class="container" style="text-align:center; padding:200px 0;"><h1>⚠️ Erro ao carregar dados</h1><p>${err.message}</p></div>`;
        }
    },

    async renderAula(app, id) {
        try {
            const res = await fetch(`/api/aulas/${id}`);
            if (!res.ok) throw new Error('Aula não encontrada');
            const aula = await res.json();

            const prev = id > 1 ? id - 1 : null;
            const next = id < 10 ? id + 1 : null;

            app.innerHTML = `
                <div class="aula-container">
                    <div class="aula-header">
                        <div class="aula-badge">AULA ${aula.id} DE 10</div>
                        <h1><i class="fas ${aula.icone}"></i> ${aula.titulo}</h1>
                        <p class="aula-subtitle">${aula.subtitulo}</p>
                    </div>
                    <div class="aula-content">
                        ${aula.secoes.map(s => `
                            <section class="aula-section">
                                <h2><i class="fas fa-book-open"></i> ${s.titulo}</h2>
                                <div class="content-block">
                                    ${s.codigo ? `
                                    <div class="code-block">
                                        <div class="code-header">
                                            <span>exemplo.js</span>
                                            <button class="copy-btn"><i class="fas fa-copy"></i> Copiar</button>
                                        </div>
                                        <pre><code>${s.codigo}</code></pre>
                                    </div>` : ''}
                                    <p>${s.conteudo.replace(/\n/g, '<br>')}</p>
                                </div>
                            </section>
                        `).join('')}

                        <section class="aula-section">
                            <h2><i class="fas fa-dumbbell"></i> Exercício Prático</h2>
                            <div class="exercise-box">
                                <p>${aula.exercicio}</p>
                            </div>
                        </section>

                        <section class="aula-section">
                            <h2><i class="fas fa-check-circle"></i> Resumo</h2>
                            <div class="resumo-box">
                                <ul class="resumo-list">
                                    ${aula.resumo.map(r => `<li><i class="fas fa-check"></i> ${r}</li>`).join('')}
                                </ul>
                            </div>
                        </section>

                        <div class="aula-nav">
                            ${prev ? `<a href="/aula/${prev}" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Aula Anterior</a>` : '<div></div>'}
                            ${next ? `<a href="/aula/${next}" class="btn btn-primary">Próxima Aula <i class="fas fa-arrow-right"></i></a>` : `<a href="/" class="btn btn-primary"><i class="fas fa-home"></i> Voltar ao Início</a>`}
                        </div>
                    </div>
                </div>
            `;

            // Ativa botão de copiar código
            app.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evita conflito com roteamento
                    const code = btn.closest('.code-block').querySelector('code').innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        const original = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                        btn.style.background = '#00C853';
                        setTimeout(() => {
                            btn.innerHTML = original;
                            btn.style.background = '';
                        }, 2000);
                    });
                });
            });

        } catch (err) {
            console.error(err);
            app.innerHTML = `<div class="container" style="text-align:center; padding:200px 0;"><h1>⚠️ Erro</h1><p>${err.message}</p><a href="/" class="btn btn-primary">Voltar</a></div>`;
        }
    }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => router.init());

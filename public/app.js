const router = {
    go(page, id = null) {
        this.page = page;
        this.id = id;
        window.history.pushState({}, '', id ? `/aula/${id}` : '/');
        this.render();
    },
    async render() {
        const app = document.getElementById('app');
        if (this.page === 'home') return this.renderHome(app);
        if (this.page === 'aula') return this.renderAula(app, this.id);
    },
    async renderHome(app) {
        const res = await fetch('/api/aulas');
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
                    <button class="btn-primary btn-large" onclick="router.go('aula', 1)">
                        COMEÇAR AGORA <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </section>
            <section class="learning-path">
                <div class="container">
                    <h2 class="section-title">TRILHA DE APRENDIZADO - <span class="neon-text">10 PARTES</span></h2>
                    <div class="path-timeline">
                        ${aulas.map(a => `
                            <div class="path-item" onclick="router.go('aula', ${a.id})">
                                <div class="path-number">${a.id}</div>
                                <div class="path-icon"><i class="fas ${a.icone}"></i></div>
                                <h3>${a.titulo}</h3>
                                <p>${a.subtitulo}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    },
    async renderAula(app, id) {
        const res = await fetch(`/api/aulas/${id}`);
        if (!res.ok) return app.innerHTML = '<div class="container"><h1>404 - Aula não encontrada</h1></div>';
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
                                ${s.codigo ? `<div class="code-block"><div class="code-header"><span>exemplo.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i> Copiar</button></div><pre><code>${s.codigo}</code></pre></div>` : ''}
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
                        ${prev ? `<a href="#" class="btn btn-secondary" onclick="router.go('aula', ${prev}); return false;"><i class="fas fa-arrow-left"></i> Aula Anterior</a>` : '<div></div>'}
                        ${next ? `<a href="#" class="btn btn-primary" onclick="router.go('aula', ${next}); return false;">Próxima Aula <i class="fas fa-arrow-right"></i></a>` : '<a href="#" class="btn btn-primary" onclick="router.go(\'home\'); return false;"><i class="fas fa-home"></i> Voltar ao Início</a>'}
                    </div>
                </div>
            </div>
        `;
    }
};

// 🌐 Routing
window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path.startsWith('/aula/')) router.go('aula', parseInt(path.split('/')[2]));
    else router.go('home');
});

//  Menu Mobile
document.getElementById('hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('nav-menu').classList.toggle('active');
});

//  Anti-Cópia & Segurança
function setupAntiCopy() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            alert('🔒 OSIRIS: Inspeção desativada para proteger o conteúdo.');
        }
    });
}

//  Copiar Código
window.copyCode = function(btn) {
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
};

//  Init
document.addEventListener('DOMContentLoaded', () => {
    setupAntiCopy();
    const path = window.location.pathname;
    if (path.startsWith('/aula/')) router.go('aula', parseInt(path.split('/')[2]));
    else router.go('home');
});

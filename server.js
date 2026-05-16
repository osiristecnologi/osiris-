const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Headers de Segurança & Anti-cópia
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    next();
});

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Carregar banco de dados de aulas
let aulas = [];
try {
    aulas = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/aulas.json'), 'utf8'));
} catch (err) {
    console.error('❌ Erro ao carregar aulas.json:', err.message);
}

// 🌐 API Routes
app.get('/api/aulas', (req, res) => {
    res.json(aulas.map(({ id, titulo, subtitulo, icone }) => ({ id, titulo, subtitulo, icone })));
});

app.get('/api/aulas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const aula = aulas.find(a => a.id === id);
    if (!aula) return res.status(404).json({ error: 'Aula não encontrada' });
    res.json(aula);
});

//  SPA Route (tudo vai para index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`\n👁️ OSIRIS ONLINE\n🌐 http://localhost:${PORT}\n🔒 Proteção ativa\n`);
});

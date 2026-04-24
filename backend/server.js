/**
 * server.js - Servidor principal do Tigrinho Slot Game
 * 
 * Estrutura:
 * - Express com CORS e sessões
 * - Rotas: /api/game, /api/payment, /webhook
 * - Serve o frontend estático da pasta ../frontend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

// Importa rotas
const gameRoutes = require('./routes/game');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const solanaRoutes = require('./routes/solana');

// Importa middlewares
const sessionMiddleware = require('./middleware/session');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// CORS - permite requisições do frontend
app.use(cors({
  origin: true,
  credentials: true,
}));

// Parse de JSON (com limite maior para webhooks)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'tigrinho_dev_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true em produção com HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  },
}));

// Middleware de sessão de usuário
app.use(sessionMiddleware);

// ============================================
// SERVIR FRONTEND ESTÁTICO
// ============================================
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================
// ROTAS DA API
// ============================================
app.use('/api/game', gameRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/solana', solanaRoutes);
app.use('/webhook', webhookRoutes);

// ============================================
// ROTA DE SAÚDE (health check)
// ============================================
app.get('/api/health', (req, res) => {
  const db = require('./models/database');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stats: db.getStats(),
    config: {
      spinCost: process.env.SPIN_COST || 50,
      dailyBonus: process.env.DAILY_BONUS || 100,
      mpConfigured: !!(process.env.MP_ACCESS_TOKEN && 
        process.env.MP_ACCESS_TOKEN !== 'SEU_ACCESS_TOKEN_DE_PRODUCAO_AQUI'),
    },
  });
});

// ============================================
// FALLBACK - Serve o index.html para SPAs
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============================================
// INICIALIZAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('\n🐯 ========================================');
  console.log('   TIGRINHO SLOT GAME - SERVIDOR INICIADO');
  console.log('========================================');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`💳 MP Configurado: ${!!(process.env.MP_ACCESS_TOKEN && 
    process.env.MP_ACCESS_TOKEN !== 'SEU_ACCESS_TOKEN_DE_PRODUCAO_AQUI') ? '✅ SIM' : '❌ NÃO (modo demo)'}`);
  console.log(`🎰 Custo por giro: ${process.env.SPIN_COST || 50} moedas`);
  console.log(`🎁 Bônus diário: ${process.env.DAILY_BONUS || 100} moedas`);
  console.log('========================================\n');
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('[SERVER] Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER] Promise rejeitada:', reason);
});

module.exports = app

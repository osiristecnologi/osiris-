// OSIRIS - Script Principal Funcional

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ OSIRIS carregado com sucesso!');
    
    // ==========================================
    // BOTÃO ENTRAR - VERSÃO SIMPLES E FUNCIONAL
    // ==========================================
    
    const btnEntrar = document.getElementById('btnEntrar');
    
    if (btnEntrar) {
        console.log('✅ Botão Entrar encontrado!');
        
        btnEntrar.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔘 Botão Entrar clicado!');
            
            // Pega email e senha (ou usa valores padrão)
            const email = prompt('👤 Digite seu email:');
            
            if (email) {
                const senha = prompt('🔒 Digite sua senha:');
                
                if (senha) {
                    // Simula login
                    alert(`🎉 LOGIN REALIZADO COM SUCESSO!\n\n👤 Email: ${email}\n\nBem-vindo ao OSIRIS!`);
                    
                    // Aqui você pode redirecionar
                    // window.location.href = '/dashboard.html';
                }
            }
        });
    } else {
        console.error('❌ Botão Entrar NÃO encontrado! Verifique o ID no HTML.');
    }
    
    // ==========================================
    // RESTO DO CÓDIGO (Navbar, Scroll, etc)
    // ==========================================
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

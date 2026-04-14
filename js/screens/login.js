'use strict';

/* ===================================================
   login.js — Écran de connexion
   Affiche deux profils cliquables (Camille / Isabelle)
   =================================================== */
window.LoginScreen = {

  /* Génère le HTML de l'écran de connexion */
  render() {
    return `
      <style>
        .login-screen-minimal {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #FAFAFA;
          font-family: var(--font-family);
        }
        .login-minimal-header {
          padding: 24px 32px;
        }
        .login-minimal-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          text-align: center;
        }
        .login-minimal-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }
        .login-minimal-subtitle {
          font-size: 16px;
          color: var(--color-text-secondary);
          margin-bottom: 48px;
        }
        .login-minimal-cards {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 800px;
        }
        .login-minimal-card {
          background: #FFFFFF;
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 32px 24px;
          width: 320px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          opacity: 0;
          animation: fadeInTransform 0.4s ease forwards;
        }
        .login-minimal-card:nth-child(1) { animation-delay: 0.1s; }
        .login-minimal-card:nth-child(2) { animation-delay: 0.2s; }

        @keyframes fadeInTransform {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-minimal-card:hover {
          border-color: #6B4EFF;
          box-shadow: 0 8px 24px rgba(107, 78, 255, 0.15);
          transform: translateY(-2px);
        }
        .card-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .card-info h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0 0 8px 0;
        }
        .card-info p {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin: 0 0 20px 0;
          line-height: 1.4;
        }
        .card-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }
        .login-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--color-primary, #6B4EFF);
          padding: 8px 16px;
          border-radius: 8px;
          color: white;
        }
        .login-brand-mark {
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.5px;
        }
        .login-brand-name {
          font-weight: 700;
          font-size: 16px;
          line-height: 1.2;
        }
        .login-brand-tagline {
          font-size: 11px;
          opacity: 0.8;
          font-weight: 500;
        }
      </style>

      <div class="login-screen-minimal screen-enter">

        <main class="login-minimal-main">
          
          <div class="login-brand" style="margin-bottom: 24px;">
            <div class="login-brand-mark">IA</div>
            <div style="text-align: left;">
              <div class="login-brand-name">Compl-IA</div>
              <div class="login-brand-tagline">Validation réglementaire</div>
            </div>
          </div>

          <h1 class="login-minimal-title">Connexion à Compl-IA</h1>
          <p class="login-minimal-subtitle">Sélectionnez votre profil pour accéder à votre espace de validation réglementaire</p>

          <div class="login-minimal-cards">
            
            <button class="login-minimal-card" id="btn-profil-marketing" data-profil="marketing">
              <div class="card-icon-container" style="background:#F5F3FF; color:#6B4EFF;">👤</div>
              <div class="card-info">
                <h3>Camille Fouet</h3>
                <p>Social Media Manager · LumièreCosmetics</p>
                <div class="card-badge" style="background:#6B4EFF; color:white;">Marketing</div>
              </div>
            </button>

            <button class="login-minimal-card" id="btn-profil-juridique" data-profil="juridique">
              <div class="card-icon-container" style="background:#F3F4F6; color:#374151;">⚖️</div>
              <div class="card-info">
                <h3>Isabelle Renard</h3>
                <p>Responsable Réglementaire · LumièreCosmetics</p>
                <div class="card-badge" style="background:#1F2937; color:white;">Juridique</div>
              </div>
            </button>

          </div>
        </main>
      </div>
    `;
  },

  /* Initialise les événements après insertion dans le DOM */
  init() {
    /* Clic sur le profil Marketing (Camille) */
    const btnMkt = document.getElementById('btn-profil-marketing');
    btnMkt.addEventListener('click', async () => {
      btnMkt.disabled = true;
      btnMkt.style.opacity = '0.5';
      const user = await window.FirebaseService.loginUser('marketing');
      window.AppState.currentUser = user;
      window.navigate('Dashboard');
    });

    /* Clic sur le profil Juridique (Isabelle) */
    const btnJur = document.getElementById('btn-profil-juridique');
    btnJur.addEventListener('click', async () => {
      btnJur.disabled = true;
      btnJur.style.opacity = '0.5';
      const user = await window.FirebaseService.loginUser('juridique');
      window.AppState.currentUser = user;
      window.navigate('Dashboard');
    });
  }
};

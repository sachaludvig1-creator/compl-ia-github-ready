'use strict';

/* ===================================================
   selection.js — Écran de sélection du type de produit
   =================================================== */

window.SelectionScreen = {
  render() {
    return `
      <div class="app-layout screen-enter">
        ${window.renderSidebar('nouvelle')}

        <div class="main-content selection-screen" style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
          <div style="max-width: 800px; width: 100%; padding: 40px;">
            <div class="header-section" style="text-align: center; margin-bottom: 48px;">
              <h1 style="font-size: 32px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 16px;">Quel type de contenu souhaitez-vous analyser ?</h1>
              <p style="color: var(--color-text-secondary); font-size: 16px;">Choisissez le référentiel réglementaire adapté à votre produit pour une analyse sur-mesure.</p>
            </div>
            
            <div class="selection-cards" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
              
              <!-- Carte Cosmétiques -->
              <button class="selection-card" data-type="cosmetique" style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 16px; padding: 40px 32px; text-align: center; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div class="card-icon" style="width: 64px; height: 64px; border-radius: 16px; background: rgba(99, 102, 241, 0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 8px;">
                  💧
                </div>
                <h2 style="font-size: 24px; font-weight: 600; color: var(--color-text-primary); margin: 0;">Cosmétiques</h2>
                <p style="color: var(--color-text-secondary); font-size: 14px; margin: 0; line-height: 1.5;">Crèmes, sérums, maquillage, soins corporels, capillaires, etc.</p>
              </button>

              <!-- Carte Compléments -->
              <button class="selection-card" data-type="complement" style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 16px; padding: 40px 32px; text-align: center; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div class="card-icon" style="width: 64px; height: 64px; border-radius: 16px; background: rgba(34, 197, 94, 0.1); display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 8px;">
                  💊
                </div>
                <h2 style="font-size: 24px; font-weight: 600; color: var(--color-text-primary); margin: 0;">Compléments alimentaires</h2>
                <p style="color: var(--color-text-secondary); font-size: 14px; margin: 0; line-height: 1.5;">Gélules, comprimés, poudres, gummies, cures, etc.</p>
              </button>

            </div>
          </div>
        </div>
      </div>
      
      <style>
        .selection-card:hover {
          border-color: var(--color-primary) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(99, 102, 241, 0.15);
        }
        .selection-card[data-type="complement"]:hover {
          border-color: #22c55e !important;
          box-shadow: 0 12px 24px -8px rgba(34, 197, 94, 0.15);
        }
      </style>
    `;
  },

  init() {
    /* Navigation latérale / Mobile topbar */
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.nav;
        if (action === 'nouvelle') window.navigate('Selection');
        else if (action === 'dashboard') window.navigate('Dashboard');
        else if (action === 'pricing') window.navigate('Pricing');
      });
    });

    /* Sélection du type */
    document.querySelectorAll('.selection-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        window.AppState.typeProduit = type;
        window.navigate('Submission');
      });
    });
  }
};

'use strict';

/* ===================================================
   pricing.js — Écran Pricing & Modale de Waitlist
   (Thème Dark Premium natif)
   =================================================== */

window.PricingScreen = {
  render() {
    return `
      <div class="app-layout screen-enter pricing-screen">
        ${window.renderSidebar('pricing')}

        <div class="main-content pricing-main">
          
          <!-- HERO -->
          <div class="pricing-hero">
            <h1>Commencez gratuitement</h1>
            <p>Découvrez Compl-IA sans engagement. Passez à Premium quand vous êtes prêt pour débloquer toutes les fonctionnalités avancées.</p>
          </div>

          <!-- CARDS -->
          <div class="pricing-cards-container">
            
            <!-- Plan Gratuit -->
            <div class="pricing-card plan-free">
              <div class="card-header">
                <h3>Gratuit</h3>
                <p>Pour découvrir le service</p>
              </div>
              <div class="card-price">
                <h2>0€</h2>
                <span>Toujours gratuit</span>
              </div>
              <ul class="card-features">
                <li><span class="check-icon">✓</span> 5 utilisations par mois</li>
                <li><span class="check-icon">✓</span> Accès aux fonctionnalités de base</li>
                <li><span class="check-icon">✓</span> Support communautaire</li>
                <li><span class="check-icon">✓</span> Mises à jour gratuites</li>
                <li><span class="check-icon">✓</span> Documentation complète</li>
              </ul>
              <button class="btn btn-outline-dark btn-pricing" data-plan="free">
                Commencer gratuitement
              </button>
            </div>

            <!-- Plan Premium -->
            <div class="pricing-card plan-premium">
              <div class="badge-recommended">Recommandé</div>
              <div class="card-header">
                <h3>Premium</h3>
                <p>Pour une utilisation professionnelle</p>
              </div>
              <div class="card-price">
                <h2>49€</h2>
                <span>par mois</span>
              </div>
              <ul class="card-features">
                <li><span class="check-icon">✓</span> Utilisations illimitées</li>
                <li><span class="check-icon">✓</span> Toutes les fonctionnalités avancées</li>
                <li><span class="check-icon">✓</span> Support prioritaire 24/7</li>
                <li><span class="check-icon">✓</span> Mises à jour automatiques</li>
                <li><span class="check-icon">✓</span> Analyses avancées et statistiques</li>
                <li><span class="check-icon">✓</span> Intégrations premium</li>
                <li><span class="check-icon">✓</span> API privée</li>
                <li><span class="check-icon">✓</span> Garantie de remboursement 30 jours</li>
              </ul>
              <button class="btn btn-primary btn-pricing btn-glow" data-plan="premium">
                Passer à Premium
              </button>
            </div>

          </div>

          <div class="pricing-reinsurance">
            <p>✓ Commencez gratuitement, sans carte bancaire</p>
            <p>✓ Passez à Premium à tout moment · Garantie de remboursement 30 jours</p>
          </div>

          <!-- TABLEAU COMPARATIF -->
          <div class="pricing-comparison">
            <h2>Comparaison détaillée</h2>
            <div class="comparison-table-wrapper">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Fonctionnalités</th>
                    <th>Gratuit</th>
                    <th class="th-premium">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Utilisations par mois</td>
                    <td>5</td>
                    <td class="td-premium">Illimité</td>
                  </tr>
                  <tr>
                    <td>Fonctionnalités de base</td>
                    <td>✓</td>
                    <td class="td-premium">✓</td>
                  </tr>
                  <tr>
                    <td>Fonctionnalités avancées</td>
                    <td class="text-muted">✕</td>
                    <td class="td-premium">✓</td>
                  </tr>
                  <tr>
                    <td>Analyses et statistiques</td>
                    <td class="text-muted">✕</td>
                    <td class="td-premium">✓</td>
                  </tr>
                  <tr>
                    <td>Support prioritaire 24/7</td>
                    <td class="text-muted">✕</td>
                    <td class="td-premium">✓</td>
                  </tr>
                  <tr>
                    <td>API privée</td>
                    <td class="text-muted">✕</td>
                    <td class="td-premium">✓</td>
                  </tr>
                  <tr>
                    <td>Intégrations premium</td>
                    <td class="text-muted">✕</td>
                    <td class="td-premium">✓</td>
                  </tr>
                  <tr>
                    <td>Support</td>
                    <td>Communautaire</td>
                    <td class="td-premium">Prioritaire</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- FAQ -->
          <div class="pricing-faq">
            <h2>Questions fréquentes</h2>
            <div class="faq-list">
              <div class="faq-item">
                <button class="faq-question">
                  <span>Puis-je passer de Gratuit à Premium à tout moment ?</span>
                  <span class="faq-chevron">▼</span>
                </button>
                <div class="faq-answer">
                  <p>Oui, vous pouvez upgrader à tout moment. Vos données et paramètres seront automatiquement transférés vers votre compte Premium.</p>
                </div>
              </div>
              <div class="faq-item">
                <button class="faq-question">
                  <span>Que se passe-t-il si j'atteins la limite gratuite ?</span>
                  <span class="faq-chevron">▼</span>
                </button>
                <div class="faq-answer">
                  <p>Vous recevrez une notification quand vous approchez de votre limite de 5 utilisations. Vous pourrez alors passer à Premium ou attendre le renouvellement mensuel.</p>
                </div>
              </div>
              <div class="faq-item">
                <button class="faq-question">
                  <span>Puis-je annuler mon abonnement Premium ?</span>
                  <span class="faq-chevron">▼</span>
                </button>
                <div class="faq-answer">
                  <p>Oui, vous pouvez annuler à tout moment. Vous garderez l'accès Premium jusqu'à la fin de votre période de facturation, puis repasserez automatiquement en version gratuite.</p>
                </div>
              </div>
              <div class="faq-item">
                <button class="faq-question">
                  <span>Mes données seront-elles conservées ?</span>
                  <span class="faq-chevron">▼</span>
                </button>
                <div class="faq-answer">
                  <p>Absolument. Nous respectons la confidentialité absolue de vos données (chiffrement de bout en bout). Aucun modèle public n'est entraîné sur vos analyses.</p>
                </div>
              </div>
              <div class="faq-item">
                <button class="faq-question">
                  <span>Quand Compl-IA sera-t-il officiellement disponible ?</span>
                  <span class="faq-chevron">▼</span>
                </button>
                <div class="faq-answer">
                  <p>L'application est actuellement en phase Bêta Privée. Rejoignez la liste d'attente pour être notifié de l'ouverture publique et bénéficier de tarifs préférentiels.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    /* --- Initialisation de la FAQ --- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Fermer tous les autres
        faqItems.forEach(i => i.classList.remove('active'));
        // Basculer l'état
        if (!isActive) item.classList.add('active');
      });
    });

    /* --- Initialisation Modale Waitlist --- */
    const buttons = document.querySelectorAll('.btn-pricing');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.openWaitlistModal(btn.dataset.plan);
      });
    });

    /* --- Navigation latérale --- */
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.nav;
        if (action === 'nouvelle') window.navigate('Submission');
        else if (action === 'dashboard') window.navigate('Dashboard');
        else if (action === 'pricing') window.navigate('Pricing');
      });
    });
  },

  openWaitlistModal(plan) {
    const isPremium = plan === 'premium';
    const title = isPremium ? 'Pré-inscription - Premium' : 'Pré-inscription - Gratuit';
    const planText = isPremium ? 'Premium · 49€ par mois' : 'Gratuit · 0€ Toujours gratuit';
    const offerText = isPremium ? 'Prix de lancement avec -20% : 39€/mois' : 'Gratuit, aucune carte bancaire requise';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay pricing-modal-overlay';
    overlay.innerHTML = `
      <div class="modal pricing-modal">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" id="waitlist-close">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">
            Ce plan sera bientôt disponible ! Inscrivez-vous maintenant pour bénéficier d'une réduction exclusive de 20% lors du lancement.
          </p>
          <div class="form-group">
            <label class="form-label">Adresse email</label>
            <input type="email" id="waitlist-email" class="form-input dark-input" placeholder="votre@email.com" required autocomplete="email" value="${window.AppState.currentUser?.email || ''}">
          </div>
          <div class="plan-recap">
            <div class="plan-recap-title">Votre sélection :</div>
            <div class="plan-recap-plan">${planText}</div>
            <div class="plan-recap-offer">${offerText}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-dark" id="waitlist-cancel">Annuler</button>
          <button class="btn btn-primary" id="waitlist-submit" style="min-width:180px;">S'inscrire à la liste d'attente</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animation d'entrée
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const closeModal = () => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    };

    document.getElementById('waitlist-close').addEventListener('click', closeModal);
    document.getElementById('waitlist-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    document.getElementById('waitlist-submit').addEventListener('click', async () => {
      const emailInput = document.getElementById('waitlist-email');
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        window.showToast('Veuillez entrer une adresse email valide.', 4000);
        emailInput.focus();
        return;
      }

      const btnSubmit = document.getElementById('waitlist-submit');
      const originalText = btnSubmit.textContent;
      btnSubmit.innerHTML = '<span class="spinner-small"></span> Enregistrement...';
      btnSubmit.disabled = true;

      try {
        // 1. Sauvegarde Firebase
        if (window.FirebaseService) {
          await window.FirebaseService.saveWaitlistEmail(email, plan);
        }

        // 2. Envoi Email via API Vercel
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, plan })
        });

        // Même si le mail échoue (ex: pas d'API KEY en local), on confirme si l'inscription en DB a marché
        // On ne bloque pas l'UX utilisateur.
        
        window.showToast('✅ Pré-inscription confirmée ! Consultez votre boîte de réception.', 5000);
        closeModal();
      } catch (err) {
        console.error('Erreur waitlist:', err);
        window.showToast('Erreur lors de l\'inscription. Veuillez réessayer.', 4000);
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
      }
    });
  }
};

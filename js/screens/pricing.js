'use strict';

/* ===================================================
   pricing.js — Écran Pricing 
   (Thème Dark Premium 3-columns)
   =================================================== */

window.PricingScreen = {
  render() {
    return `
      <div class="app-layout screen-enter pricing-screen">
        ${window.renderSidebar('pricing')}

        <div class="main-content">
          <div class="pricing-content-wrapper">
          
            <!-- HERO -->
            <div class="pricing-hero">
              <h1>Choisissez le plan qui vous correspond</h1>
              <p>Des solutions adaptées à chaque étape de vos validations réglementaires IA.</p>
            </div>

            <!-- CARDS -->
            <div class="pricing-cards-container">
              
              <!-- Plan GRATUIT -->
              <div class="pricing-card plan-free">
                <div>
                  <div class="plan-badge badge-decouverte">Découverte</div>
                  <div class="card-header">
                    <h3>Gratuit</h3>
                    <p>Pour tester Compl-IA avant de s'engager</p>
                  </div>
                  <div class="card-price">
                    <h2>0 €</h2>
                    <span>/ toujours</span>
                  </div>
                  <div class="plan-limits">
                    1 utilisateur · 3 analyses / mois
                  </div>
                  
                  <div class="features-section-title">INCLUS</div>
                  <ul class="card-features">
                    <li><span class="check-icon">✓</span> Analyse des risques réglementaires IA</li>
                    <li><span class="check-icon">✓</span> 1 reformulation par analyse</li>
                    <li><span class="check-icon">✓</span> Références réglementaires citées<br>(CE 1223/2009, ARPP, DGCCRF)</li>
                    <li><span class="check-icon">✓</span> Niveau de risque : OK / À risque / Non conforme</li>
                  </ul>

                  <div class="features-section-title">NON INCLUS</div>
                  <ul class="card-features">
                    <li class="not-included"><span class="minus-icon">—</span> Reformulations multiples et éditables</li>
                    <li class="not-included"><span class="minus-icon">—</span> Tableau de suivi des validations</li>
                    <li class="not-included"><span class="minus-icon">—</span> Bibliothèque de claims validés</li>
                    <li class="not-included"><span class="minus-icon">—</span> Envoi au service juridique</li>
                    <li class="not-included"><span class="minus-icon">—</span> Invitation d'un collaborateur</li>
                  </ul>
                </div>
                
                <button class="btn btn-outline-dark btn-pricing" data-plan="free" onclick="window.navigate('Submission')">
                  Commencer gratuitement
                </button>
              </div>

              <!-- Plan PRO -->
              <div class="pricing-card plan-premium">
                <div>
                  <div class="plan-badge badge-recommande">Recommandé</div>
                  <div class="card-header">
                    <h3>Pro</h3>
                    <p>Pour les équipes marketing et réglementaires en binôme</p>
                  </div>
                  <div class="card-price">
                    <h2>59,99 €</h2>
                    <span>/ mois</span>
                  </div>
                  <div class="plan-limits">
                    2 utilisateurs · Analyses illimitées
                  </div>
                  
                  <div class="features-section-title">TOUT LE GRATUIT, PLUS</div>
                  <ul class="card-features">
                    <li><span class="check-icon">✓</span> Analyses illimitées</li>
                    <li><span class="check-icon">✓</span> Reformulations multiples, éditables en direct</li>
                    <li><span class="check-icon">✓</span> Comparaison avant / après optimisation</li>
                    <li><span class="check-icon">✓</span> Tableau de suivi des validations</li>
                    <li><span class="check-icon">✓</span> Bibliothèque de claims validés réutilisables</li>
                    <li><span class="check-icon">✓</span> Envoi intégré au service juridique</li>
                    <li><span class="check-icon">✓</span> Invitation d'1 collaborateur</li>
                    <li><span class="check-icon">✓</span> Export PDF du rapport d'analyse</li>
                  </ul>

                  <div class="features-section-title">NON INCLUS</div>
                  <ul class="card-features">
                    <li class="not-included"><span class="minus-icon">—</span> Multi-utilisateurs au-delà de 2</li>
                    <li class="not-included"><span class="minus-icon">—</span> Gestion des rôles avancée</li>
                  </ul>
                </div>

                <button class="btn btn-primary btn-pricing btn-glow" data-plan="pro">
                  Essayer Pro
                </button>
              </div>

              <!-- Plan TEAM -->
              <div class="pricing-card plan-team">
                <div>
                  <div class="plan-badge badge-equipes">Équipes</div>
                  <div class="card-header">
                    <h3>Team</h3>
                    <p>Pour les marques qui déploient Compl-IA à l'échelle d'une équipe</p>
                  </div>
                  <div class="card-price">
                    <h2>149,99 €</h2>
                    <span>/ mois</span>
                  </div>
                  <div class="plan-limits">
                    10 utilisateurs · Analyses illimitées
                  </div>
                  
                  <div class="features-section-title">TOUT LE PRO, PLUS</div>
                  <ul class="card-features">
                    <li><span class="check-icon">✓</span> Jusqu'à 10 sièges</li>
                    <li><span class="check-icon">✓</span> Gestion des rôles : soumetteur / validateur / informé</li>
                    <li><span class="check-icon">✓</span> Tableau de bord multi-utilisateurs centralisé</li>
                    <li><span class="check-icon">✓</span> Distinction des dates : soumission / retour souhaité / validation définitive</li>
                    <li><span class="check-icon">✓</span> Fil de commentaires par soumission</li>
                    <li><span class="check-icon">✓</span> Vérification multi-pays simultanée</li>
                    <li><span class="star-icon">⭐</span> Intégration des guidelines internes de la marque (bêta)</li>
                    <li><span class="check-icon">✓</span> Onboarding dédié</li>
                  </ul>
                </div>

                <button class="btn btn-outline-dark btn-pricing" data-plan="team">
                  Contacter l'équipe
                </button>
              </div>

            </div>

            <!-- BOTTOM REASSURANCE -->
            <div class="reassurance-grid">
              <div class="reassurance-item">
                <div class="reassurance-icon">🛡️</div>
                <div class="reassurance-text">
                  <h4>Sécurisez vos claims</h4>
                  <p>Réduisez les risques réglementaires</p>
                </div>
              </div>
              <div class="reassurance-item">
                <div class="reassurance-icon">⏱️</div>
                <div class="reassurance-text">
                  <h4>Gagnez du temps</h4>
                  <p>Analyses IA en quelques secondes</p>
                </div>
              </div>
              <div class="reassurance-item">
                <div class="reassurance-icon">👥</div>
                <div class="reassurance-text">
                  <h4>Collaborez plus efficacement</h4>
                  <p>Partage et suivi simplifiés</p>
                </div>
              </div>
              <div class="reassurance-item">
                <div class="reassurance-icon">✅</div>
                <div class="reassurance-text">
                  <h4>Conforme & à jour</h4>
                  <p>Références réglementaires incluses</p>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="pricing-footer-contact">
              Besoin d'un plan sur-mesure ? <a href="#">Contactez-nous →</a>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  init() {
    /* --- Gestion des boutons de plans --- */
    const planButtons = document.querySelectorAll('.btn-pricing[data-plan]');
    planButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plan = btn.dataset.plan;
        if (plan === 'pro') {
          this.openWaitlistModal('Pro', '59,99€');
        } else if (plan === 'team') {
          this.openWaitlistModal('Team', '149,99€');
        }
      });
    });

    /* Navigation latérale / Mobile topbar */
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.nav;
        if (action === 'nouvelle') window.navigate('Submission');
        else if (action === 'dashboard') window.navigate('Dashboard');
        else if (action === 'pricing') window.navigate('Pricing');
      });
    });
  },

  /* --- MODALE WAITLIST / UPGRADE --- */
  openWaitlistModal(planName, price) {
    const user = window.AppState.currentUser || {};
    const email = user.email || '';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay pricing-modal-overlay';
    
    // Calcul de l'offre de lancement (-20%)
    const originalPrice = parseFloat(price.replace('€', '').replace(',', '.'));
    const discountedPrice = Math.round(originalPrice * 0.8) + '€';
    
    overlay.innerHTML = `
      <div class="modal pricing-modal" style="max-width: 480px; padding: 0;">
        <div class="modal-header" style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <h2 style="font-size: 20px; font-weight: 600;">Pré-inscription - ${planName}</h2>
          <button class="modal-close" id="waitlist-close">✕</button>
        </div>
        
        <div class="modal-body" style="padding: 24px;">
          <p class="modal-desc">
            Ce plan sera bientôt disponible ! Inscrivez-vous maintenant pour bénéficier d'une réduction exclusive de 20% lors du lancement.
          </p>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label style="color:#A1A1AA; font-size:13px; margin-bottom:8px; display:block;">Adresse email</label>
            <input type="email" id="waitlist-email" class="input-field dark-input" value="${email}" placeholder="votre@email.com" />
          </div>
          
          <div class="plan-recap">
            <div class="plan-recap-title">Votre sélection :</div>
            <div class="plan-recap-plan">${planName} · ${price} par mois</div>
            <div class="plan-recap-offer">Prix de lancement avec -20% : ${discountedPrice}/mois</div>
          </div>
        </div>
        
        <div class="modal-footer" style="padding: 24px; display: flex; justify-content: space-between; gap: 16px;">
          <button class="btn btn-outline-dark" id="waitlist-cancel" style="flex: 1;">Annuler</button>
          <button class="btn btn-primary" id="waitlist-submit" style="flex: 1;">S'inscrire à la liste d'attente</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('waitlist-close').addEventListener('click', close);
    document.getElementById('waitlist-cancel').addEventListener('click', close);

    const submitBtn = document.getElementById('waitlist-submit');
    submitBtn.addEventListener('click', async () => {
      const emailVal = document.getElementById('waitlist-email').value;
      if (!emailVal || !emailVal.includes('@')) {
        window.showToast('Veuillez entrer un email valide.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Inscription...';

      try {
        await window.FirebaseService.saveWaitlistEmail(emailVal, planName);
        
        if (!window.location.hostname.includes('localhost')) {
          await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailVal, plan: planName })
          });
        }
        
        close();
        window.showToast('🎉 Inscription confirmée ! Vous serez contacté très prochainement.');
      } catch (e) {
        console.error(e);
        window.showToast("Erreur lors de l'inscription.", 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = "S'inscrire à la liste d'attente";
      }
    });
  }
};

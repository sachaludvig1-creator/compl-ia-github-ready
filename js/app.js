'use strict';

/* ===================================================
   app.js — Routeur SPA et état global
   Ce fichier est chargé en dernier. Il initialise
   l'application et expose les fonctions partagées.
   =================================================== */


/* ----------------------------------------
   ÉTAT GLOBAL DE L'APPLICATION
   Partagé entre tous les écrans via window.AppState
   ---------------------------------------- */
window.AppState = {
  currentUser:     null,   /* Profil connecté (objet de PROFILS dans data.js) */
  currentScreen:   'Login',/* Nom de l'écran actuellement affiché */
  submissions:     [],     /* Tableau des soumissions (modifié en mémoire) */
  pendingFormData: null,   /* Données du formulaire en attente d'analyse */
  analysisResult:  null,   /* Dernier résultat d'analyse reçu */
  apiKey:          '',     /* Clé API Anthropic saisie par l'utilisateur */
};


window.navigate = function(nomEcran, params = {}) {
  const container = document.getElementById('app');

  // Résoudre l'écran dynamiquement au moment du clic
  const ECRANS = {
    Login:      window.LoginScreen,
    Dashboard:  window.DashboardScreen,
    Submission: window.SubmissionScreen,
    Results:    window.ResultsScreen,
  };

  const ecran = ECRANS[nomEcran];

  if (!ecran) {
    console.error(`[Compl-IA] Écran introuvable : "${nomEcran}"`,
      'Écrans disponibles:', Object.keys(ECRANS).filter(k => !!ECRANS[k]));
    return;
  }

  /* Fondu de sortie (120ms) */
  container.style.transition = 'opacity 120ms ease';
  container.style.opacity    = '0';

  setTimeout(() => {
    /* Injection du HTML du nouvel écran */
    container.innerHTML = ecran.render(params);

    /* Mise à jour de l'état */
    window.AppState.currentScreen = nomEcran;

    /* Fondu d'entrée */
    container.style.opacity = '1';

    /* Initialisation des gestionnaires d'événements */
    if (ecran.init) ecran.init(params);

    /* Logout (Switch Profil Global) */
    document.getElementById('btn-switch-profil')?.addEventListener('click', async () => {
      if (window.FirebaseService && window.FirebaseService.auth?.currentUser) {
        await window.FirebaseService.logout();
      } else {
        window.AppState.currentUser = null;
        window.navigate('Login');
      }
    });

    /* Notification globales */
    document.getElementById('btn-notifications')?.addEventListener('click', () => {
      if (window.openNotificationsPanel) window.openNotificationsPanel();
    });

    /* Défilement en haut de page */
    window.scrollTo({ top: 0, behavior: 'instant' });

    /* Brancher le menu global Règles internes */
    document.querySelectorAll('[data-nav="regles"]').forEach(el => {
      // On clone pour éviter les ajouts multiples ou on utilise event delegation
      el.addEventListener('click', () => {
        if (window.openReglesModal) window.openReglesModal();
      });
    });

  }, 120);
};

/* ----------------------------------------
   MODALE DES RÈGLES INTERNES (Knowledge Base)
   ---------------------------------------- */
window.openReglesModal = function() {
  const existingRules = localStorage.getItem('complia_brand_rules') || '';
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width: 600px; width: 100%;">
      <div class="modal-header">
        <h2>📘 Règles internes de la marque</h2>
        <button class="modal-close" id="modal-rules-close">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 16px;">
          Définissez ici les spécificités, mots interdits ou directives de ton de votre marque. Compl-IA les intégrera à chaque analyse comme une source de vérité supplémentaire.
        </p>
        <textarea id="modal-rules-textarea" class="form-textarea" placeholder="Exemples :
- Interdiction totale du mot 'miracle'
- Ne jamais promettre de résultats en un chiffre de jours
- Toujours évoquer la 'science de la nature' pour la gamme X..." rows="12" style="font-family: inherit;">${existingRules}</textarea>
        <div style="font-size: 12px; color: #9CA3AF; margin-top: 8px;">
          Sera injecté automatiquement dans les prompts IA.
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" id="modal-rules-cancel" style="margin-right:auto;">Annuler</button>
        <button class="btn btn-primary" id="modal-rules-save">Enregistrer la base</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();

  document.getElementById('modal-rules-close').addEventListener('click', closeModal);
  document.getElementById('modal-rules-cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.getElementById('modal-rules-save').addEventListener('click', () => {
    const text = document.getElementById('modal-rules-textarea').value;
    localStorage.setItem('complia_brand_rules', text);
    closeModal();
    window.showToast('✅ Mémorisé ! Ces règles seront appliquées aux prochaines analyses IA.');
  });
};

/* ----------------------------------------
   PANNEAU DE NOTIFICATIONS
   ---------------------------------------- */
window.updateNotificationBadge = function() {
  const badge = document.getElementById('notif-badge');
  if (!badge) return;
  const unread = (window.AppState.notifications || []).filter(n => !n.read).length;
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
};

window.openNotificationsPanel = function() {
  const notifs = window.AppState.notifications || [];
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.justifyContent = 'flex-end'; // Panel sur la droite
  
  let notifsHtml = notifs.length === 0 ? `<div style="text-align:center; padding:40px 0; color:#9CA3AF;">Aucune notification</div>` : '';
  
  notifsHtml += notifs.map(n => `
    <div style="background:${n.read ? 'white' : '#EFF6FF'}; border-bottom:1px solid #E5E7EB; padding:16px; font-size:13px; cursor:pointer;" onclick="this.style.background='white'">
      <div style="font-weight:600; color:#111827; margin-bottom:4px;">${n.title || 'Notification'}</div>
      <div style="color:#4B5563; line-height:1.4;">${n.message || ''}</div>
      <div style="color:#9CA3AF; font-size:11px; margin-top:8px;">${new Date(n.timestamp).toLocaleDateString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</div>
    </div>
  `).join('');

  overlay.innerHTML = `
    <div class="modal" style="margin: 0; height: 100vh; width: 400px; border-radius: 0; max-height: 100vh; display: flex; flex-direction: column;">
      <div class="modal-header" style="background: white; border-bottom: 1px solid #E5E7EB;">
        <h2>🔔 Notifications</h2>
        <button class="modal-close" id="modal-notif-close">✕</button>
      </div>
      <div class="modal-body" style="padding:0; overflow-y:auto; flex:1; background:#FAFAFA;">
        ${notifsHtml}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeModal = () => {
    overlay.remove();
    // Marquer comme lu
    notifs.forEach(n => n.read = true);
    window.updateNotificationBadge();
  };

  document.getElementById('modal-notif-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
};


/* ----------------------------------------
   GÉNÉRATION DE LA BARRE LATÉRALE
   Utilisée par render() de chaque écran.
   @param {string} itemActif — ID de l'item actif dans le menu
   ---------------------------------------- */
window.renderSidebar = function(itemActif) {
  const user = window.AppState.currentUser;
  if (!user) return '';

  const isJuridique = user.role === 'juridique';
  const navItems    = isJuridique ? NAV_JURIDIQUE : NAV_MARKETING;

  /* Nombre de soumissions "en cours" pour le profil Juridique */
  const nbEnAttente = window.AppState.submissions.filter(s => s.statut === 'en_cours').length;

  return `
    <aside class="sidebar">

      <!-- Logo Compl-IA -->
      <div class="sidebar-logo" style="margin-bottom: 32px;">
        <div class="login-brand" style="margin: 0; gap: 8px;">
          <div class="login-brand-mark" style="width:36px; height:36px; font-size:14px; border-radius:8px;">IA</div>
          <div>
            <div class="login-brand-name" style="font-weight: 700; font-size: 16px; color: #FFFFFF;">Compl-IA</div>
            <div class="login-brand-tagline" style="color: rgba(255,255,255,0.5); font-size: 11px;">Validation réglementaire</div>
          </div>
        </div>
      </div>

      <!-- Navigation principale -->
      <nav class="sidebar-nav">
        <div class="sidebar-nav-section-label">Navigation</div>
        ${navItems.map(item => `
          <div class="sidebar-nav-item ${item.id === itemActif ? 'active' : ''}"
               data-nav="${item.id}"
               role="button" tabindex="0">
            <span class="sidebar-nav-icon">${item.icone}</span>
            <span>${item.label}</span>
            ${item.id === 'dashboard' && isJuridique && nbEnAttente > 0
              ? `<span class="new-badge">${nbEnAttente}</span>`
              : ''
            }
            ${item.id === 'nouvelle' && !isJuridique
              ? `<span class="new-badge">+</span>`
              : ''
            }
          </div>
        `).join('')}
      </nav>

      <!-- Profil utilisateur (bas de sidebar) -->
      <div class="sidebar-user" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; margin-top: auto;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <div class="sidebar-user-card" style="margin: 0;">
            <div class="sidebar-user-avatar"
                 style="background:${user.couleurAvatar}; width: 36px; height: 36px;">
              ${user.initiales}
            </div>
            <div>
              <div class="sidebar-user-name" style="font-weight: 600; color: #FFF;">${user.prenom} ${user.nom}</div>
              <div class="sidebar-user-role" style="font-size: 12px; color: rgba(255,255,255,0.6);">${user.roleLabel}</div>
            </div>
          </div>
          
          <!-- Cloche de notification -->
          <button id="btn-notifications" style="background:transparent; border:none; cursor:pointer; font-size:20px; position:relative; padding:4px;" title="Notifications">
            🔔
            <span id="notif-badge" style="position:absolute; top:0; right:0; background:#EF4444; color:white; font-size:10px; padding:2px 5px; border-radius:10px; display:none; font-weight:700;">1</span>
          </button>
        </div>

        <button class="sidebar-switch-btn" id="btn-switch-profil" style="background: transparent; color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 4px; border: none; cursor: pointer;">
          <span style="font-size:14px; transform:translateY(1px);">⇄</span> Changer de profil
        </button>
      </div>

    </aside>
  `;
};


/* ----------------------------------------
   TOAST — Notification temporaire
   @param {string} message — Texte affiché
   @param {number} duree   — Durée en ms (défaut 4000)
   ---------------------------------------- */
window.showToast = function(message, duree = 4000) {
  /* Crée le conteneur de toasts si absent */
  let conteneur = document.getElementById('toast-container');
  if (!conteneur) {
    conteneur = document.createElement('div');
    conteneur.id        = 'toast-container';
    conteneur.className = 'toast-container';
    document.body.appendChild(conteneur);
  }

  /* Crée et anime le toast */
  const toast       = document.createElement('div');
  toast.className   = 'toast';
  toast.textContent = message;
  conteneur.appendChild(toast);

  /* Suppression après la durée définie */
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, duree);
};


/* ----------------------------------------
   DÉMARRAGE DE L'APPLICATION
   Lancé après le chargement complet du DOM
   ---------------------------------------- */
const initApp = async () => {
  /* Initialisation de Firebase */
  if (window.FirebaseService) {
    const isOk = await window.FirebaseService.init();
    
    // Fallback load
    window.AppState.submissions = JSON.parse(JSON.stringify(SOUMISSIONS_INITIALES));

    if (isOk) {
      window.FirebaseService.onAuthStateChanged(async (user) => {
        if (user) {
          const doc = await window.FirebaseService.fetchUserDoc(user.uid);
          if (doc && doc.role && doc.role_type) {
             window.AppState.currentUser = doc;
             window.AppState.notifications = await window.FirebaseService.fetchNotifications(doc.id);
             if(window.updateNotificationBadge) window.updateNotificationBadge();
             window.navigate('Dashboard');
          } else {
             window.AppState.currentUser = null;
             if (window.LoginScreen?.state) {
               window.LoginScreen.state.mode = 'signup';
               window.LoginScreen.state.step = 2; // Reprise d'onboarding
             }
             window.navigate('Login');
          }
        } else {
          window.AppState.currentUser = null;
          if (window.LoginScreen?.state) {
             window.LoginScreen.state.mode = 'signup';
             window.LoginScreen.state.step = 1;
             window.LoginScreen.state.loading = false;
          }
          if (window.AppState.currentScreen !== 'Login') {
             window.navigate('Login');
          } else if (document.getElementById('ob-container')) {
             window.LoginScreen._reRender();
          } else {
             window.navigate('Login');
          }
        }
      });
    } else {
      window.navigate('Login');
    }
  } else {
    window.AppState.submissions = JSON.parse(JSON.stringify(SOUMISSIONS_INITIALES));
    window.navigate('Login');
  }

  console.info('🚀 [Compl-IA] Application démarrée — Mode Firebase activé');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

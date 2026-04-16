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

    /* Défilement en haut de page */
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 120);
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
        <div class="sidebar-user-card" style="margin-bottom: 16px;">
          <div class="sidebar-user-avatar"
               style="background:${user.couleurAvatar}; width: 36px; height: 36px;">
            ${user.initiales}
          </div>
          <div>
            <div class="sidebar-user-name" style="font-weight: 600; color: #FFF;">${user.prenom} ${user.nom}</div>
            <div class="sidebar-user-role" style="font-size: 12px; color: rgba(255,255,255,0.6);">${user.roleLabel}</div>
          </div>
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

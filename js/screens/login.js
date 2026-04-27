'use strict';

window.LoginScreen = {
  state: {
    mode: 'signup', // 'login', 'signup', 'step2', 'step3', 'step4'
    step: 1,
    formData: {
      prenom: '', nom: '', email: '', password: '', entreprise: '',
      secteur: '', pays: '', taille_equipe: '', role: '',
      emailsMarketing: '', emailsJuridique: ''
    },
    loading: false
  },

  render() {
    const s = this.state;
    // Inject custom CSS
    const css = `
      <style>
        .onboarding-container {
          min-height: 100vh;
          background: #FAFAFA;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--font-family);
        }
        .onboarding-header {
          width: 100%;
          padding: 24px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
        }
        .onboarding-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 18px;
        }
        .brand-icon {
          background: #6B4EFF; color: white; width: 32px; height: 32px;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
        }
        .stepper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .step-pill {
          height: 6px; width: 32px; border-radius: 4px;
          background: #D1D5DB; transition: 0.3s;
        }
        .step-pill.active { background: #6B4EFF; }
        .step-pill.done { background: #16A34A; }
        
        .onboarding-card {
          background: white; border-radius: 16px; padding: 40px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          width: 100%; max-width: 480px; margin-top: 40px;
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-wide { max-width: 720px; }
        .ob-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .ob-desc { color: #6B7280; font-size: 14px; margin-bottom: 24px; }
        
        .ob-input-group { margin-bottom: 16px; }
        .ob-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
        .ob-input, .ob-select {
          width: 100%; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;
          font-size: 14px; outline: none; transition: 0.2s;
        }
        .ob-input:focus, .ob-select:focus { border-color: #6B4EFF; box-shadow: 0 0 0 3px rgba(107, 78, 255, 0.1); }
        
        .btn-purple {
          background: #6B4EFF; color: white; padding: 12px 24px; border-radius: 8px;
          font-weight: 600; font-size: 14px; border: none; cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; transition: 0.2s;
        }
        .btn-purple:hover { background: #5a41d9; }
        .btn-purple:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .btn-outline {
          background: transparent; color: #374151; padding: 12px 24px; border-radius: 8px;
          font-weight: 600; font-size: 14px; border: 1px solid #D1D5DB; cursor: pointer; margin-right: auto;
        }
        .btn-outline:hover { background: #F3F4F6; }
        
        .btn-google {
          background: white; color: #374151; border: 1px solid #D1D5DB; border-radius: 8px;
          padding: 12px; width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; margin-bottom: 16px;
        }
        .btn-google:hover { background: #F9FAFB; }
        .divider { display: flex; align-items: center; text-align: center; color: #9CA3AF; font-size: 12px; margin: 24px 0; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #E5E7EB; }
        .divider:not(:empty)::before { margin-right: .5em; }
        .divider:not(:empty)::after { margin-left: .5em; }

        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .role-card {
          border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;
          cursor: pointer; transition: 0.2s; text-align: left; background: white;
        }
        .role-card:hover { border-color: #6B4EFF; }
        .role-card.selected { border-color: #6B4EFF; background: #F5F3FF; }
        .role-icon { width: 32px; height: 32px; border-radius: 8px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        
        .footer-note { font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 32px; }
      </style>
    `;

    return css + `
      <div class="onboarding-container" id="ob-container">
        ${this._renderHeader()}
        ${this._renderBody()}
        <div class="footer-note">🔒 Vos données sont hébergées en Europe et ne sont jamais partagées avec des tiers.</div>
      </div>
    `;
  },

  _renderHeader() {
    if (this.state.mode === 'login') {
      return ``;
    }
    
    return `
      <div class="onboarding-header">
        <div class="onboarding-brand">
          <div class="brand-icon">IA</div>
          Compl-IA
        </div>
        <div>
          <span style="font-size:12px; color:#6B7280; margin-right:12px;">Étape ${this.state.step} sur 4</span>
          <div class="stepper" style="display:inline-flex;">
            <div class="step-pill ${this.state.step > 1 ? 'done' : 'active'}"></div>
            <div class="step-pill ${this.state.step > 2 ? 'done' : (this.state.step === 2 ? 'active' : '')}"></div>
            <div class="step-pill ${this.state.step > 3 ? 'done' : (this.state.step === 3 ? 'active' : '')}"></div>
            <div class="step-pill ${this.state.step === 4 ? 'active' : ''}"></div>
          </div>
        </div>
      </div>
    `;
  },

  _renderBody() {
    if (this.state.mode === 'login') return this._renderLogin();
    if (this.state.step === 1) return this._renderStep1();
    if (this.state.step === 2) return this._renderStep2();
    if (this.state.step === 3) return this._renderStep3();
    if (this.state.step === 4) return this._renderStep4();
  },

  _renderLogin() {
    return `
      <div class="onboarding-card" style="margin-top: 100px;">
        <div class="onboarding-brand" style="margin-bottom: 32px; justify-content: center;">
          <div class="brand-icon">IA</div>
          Compl-IA
        </div>
        <h2 class="ob-title" style="text-align: center;">Rebonjour !</h2>
        <p class="ob-desc" style="text-align: center;">Connectez-vous pour accéder à votre espace de validation.</p>

        <button class="btn-google" id="btn-google-login">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18"/>
          Continuer avec Google
        </button>
        
        <div class="divider">ou</div>
        
        <div class="ob-input-group">
          <label class="ob-label">Email professionnel</label>
          <input type="email" id="login-email" class="ob-input" placeholder="vous@entreprise.com"/>
        </div>
        <div class="ob-input-group" style="margin-bottom: 24px;">
          <label class="ob-label">Mot de passe</label>
          <input type="password" id="login-pwd" class="ob-input" placeholder="••••••••"/>
        </div>
        
        <button class="btn-purple" id="btn-login" ${this.state.loading ? 'disabled' : ''}>
          ${this.state.loading ? 'Patientez...' : 'Se connecter →'}
        </button>

        <div style="text-align: center; margin-top: 24px; font-size: 13px;">
          Première visite ? <a href="#" id="link-signup" style="color: #6B4EFF; text-decoration: none; font-weight: 600;">Créer un compte</a>
        </div>
      </div>
    `;
  },

  _renderStep1() {
    return `
      <div class="onboarding-card">
        <h2 class="ob-title">Créer votre espace Compl-IA</h2>
        <p class="ob-desc">Commencez à pré-valider vos contenus marketing en quelques minutes.</p>
        
        <button class="btn-google" id="btn-google-signup">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18"/>
          S'inscrire avec Google
        </button>
        
        <div class="divider">ou avec email</div>
        
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="flex:1;">
            <label class="ob-label">Prénom</label>
            <input type="text" id="ob-prenom" class="ob-input" value="${this.state.formData.prenom}"/>
          </div>
          <div style="flex:1;">
            <label class="ob-label">Nom</label>
            <input type="text" id="ob-nom" class="ob-input" value="${this.state.formData.nom}"/>
          </div>
        </div>
        
        <div class="ob-input-group">
          <label class="ob-label">Email professionnel</label>
          <input type="email" id="ob-email" class="ob-input" value="${this.state.formData.email}"/>
        </div>
        
        <div class="ob-input-group">
          <label class="ob-label">Nom de l'entreprise</label>
          <input type="text" id="ob-entreprise" class="ob-input" value="${this.state.formData.entreprise}"/>
        </div>
        
        <div class="ob-input-group" style="margin-bottom: 24px;">
          <label class="ob-label">Mot de passe</label>
          <input type="password" id="ob-pwd" class="ob-input" placeholder="Minimum 8 caractères"/>
        </div>

        <button class="btn-purple" id="btn-step1" ${this.state.loading ? 'disabled' : ''}>
          ${this.state.loading ? 'Création en cours...' : 'Continuer →'}
        </button>
        
        <div style="text-align: center; margin-top: 16px; font-size: 13px;">
          Déjà un compte ? <a href="#" id="link-login" style="color: #6B4EFF; text-decoration: none; font-weight: 600;">Se connecter</a>
        </div>
      </div>
    `;
  },

  _renderStep2() {
    return `
      <div class="onboarding-card">
        <h2 class="ob-title">Configurer votre organisation</h2>
        <p class="ob-desc">Aidez-nous à personnaliser votre expérience Compl-IA.</p>
        
        <div class="ob-input-group">
          <label class="ob-label">Secteur d'activité</label>
          <select id="ob-secteur" class="ob-select">
            <option value="">Sélectionnez...</option>
            <option value="Cosmétique" ${this.state.formData.secteur === 'Cosmétique' ? 'selected' : ''}>Cosmétique</option>
            <option value="Dermo-cosmétique" ${this.state.formData.secteur === 'Dermo-cosmétique' ? 'selected' : ''}>Dermo-cosmétique</option>
            <option value="Pharmacie" ${this.state.formData.secteur === 'Pharmacie' ? 'selected' : ''}>Pharmacie</option>
            <option value="Nutraceutique" ${this.state.formData.secteur === 'Nutraceutique' ? 'selected' : ''}>Nutraceutique</option>
            <option value="Autre" ${this.state.formData.secteur === 'Autre' ? 'selected' : ''}>Autre</option>
          </select>
        </div>
        
        <div class="ob-input-group">
          <label class="ob-label" style="display:flex; align-items:center; gap:6px;">
            Pays d'opération 
            <span title="Sélectionnez les pays où vous opérez majoritairement." style="cursor:help; color:#9CA3AF;">ⓘ</span>
          </label>
          <input type="text" id="ob-pays" class="ob-input" value="${this.state.formData.pays}" placeholder="ex: France, UE, International..."/>
        </div>
        
        <div class="ob-input-group" style="margin-bottom: 32px;">
          <label class="ob-label">Taille de l'équipe marketing</label>
          <select id="ob-taille" class="ob-select">
            <option value="">Sélectionnez...</option>
            <option value="1-5">1-5 personnes</option>
            <option value="6-20">6-20 personnes</option>
            <option value="20+">20+ personnes</option>
          </select>
        </div>

        <div style="display:flex; gap:16px;">
          <button class="btn-purple" id="btn-step2" ${this.state.loading ? 'disabled' : ''}>
            ${this.state.loading ? 'Enregistrement...' : 'Continuer →'}
          </button>
        </div>
      </div>
    `;
  },

  _renderStep3() {
    const isMarketing = this.state.formData.role_type === 'marketing';
    const isJuridique = this.state.formData.role_type === 'juridique';

    const getRoleStr = (r, type) => {
      const isSel = this.state.formData.role === r;
      return `<button class="role-card ${isSel ? 'selected' : ''}" data-role="${r}" data-type="${type}">
          <div class="role-icon">👤</div>
          <div style="font-weight:600; font-size:14px; margin-bottom:4px;">${r}</div>
          <div style="font-size:12px; color:#6B7280;">Interface personnalisée.</div>
        </button>`;
    };
    return `
      <div class="onboarding-card card-wide">
        <h2 class="ob-title" style="text-align:center;">Quel est votre rôle dans l'organisation ?</h2>
        <p class="ob-desc" style="text-align:center;">Nous personnaliserons votre interface en fonction de votre rôle.</p>
        
        <div class="role-grid" style="margin-bottom: 32px;">
          ${getRoleStr('Social Media Manager', 'marketing')}
          ${getRoleStr('Brand Content Manager', 'marketing')}
          ${getRoleStr('Responsable marketing', 'marketing')}
          ${getRoleStr('Juriste / Compliance', 'juridique')}
          ${getRoleStr('Responsable juridique', 'juridique')}
          ${getRoleStr('Administrateur', 'marketing')}
        </div>

        <div style="display:flex; gap:16px; justify-content:center; max-width: 320px; margin: 0 auto;">
          <button class="btn-outline" id="btn-back-3" style="margin-right:auto;">← Retour</button>
          <button class="btn-purple" id="btn-step3" ${this.state.loading ? 'disabled' : ''}>
            ${this.state.loading ? 'Enregistrement...' : 'Continuer →'}
          </button>
        </div>
      </div>
    `;
  },

  _renderStep4() {
    return `
      <div class="onboarding-card">
        <h2 class="ob-title">Invitez votre équipe</h2>
        <p class="ob-desc">Compl-IA fonctionne mieux lorsque les équipes marketing et juridiques collaborent dans l'outil.</p>
        
        <div class="ob-input-group">
          <label class="ob-label">Équipe marketing</label>
          <input type="email" id="ob-email-mkt" class="ob-input" placeholder="email@entreprise.com, ..." value="${this.state.formData.emailsMarketing}"/>
        </div>
        
        <div class="ob-input-group" style="margin-bottom: 32px;">
          <label class="ob-label">Équipe juridique</label>
          <input type="email" id="ob-email-jur" class="ob-input" placeholder="juridique@entreprise.com, ..." value="${this.state.formData.emailsJuridique}"/>
        </div>
        
        <div style="text-align: center; margin-bottom: 24px; font-size: 13px; color: #6B7280; padding:12px; background:#F5F3FF; border-radius:8px;">
          💡 Les invitations seront envoyées par email une fois votre compte créé. Vous pourrez aussi inviter des collaborateurs depuis les paramètres.
        </div>

        <div style="display:flex; gap:16px;">
          <button class="btn-outline" id="btn-skip">Ignorer cette étape</button>
          <button class="btn-purple" id="btn-step4" ${this.state.loading ? 'disabled' : ''}>
            Accéder à Compl-IA →
          </button>
        </div>
      </div>
    `;
  },

  _reRender() {
    const c = document.getElementById('ob-container');
    if (c) c.outerHTML = this.render();
    this.init();
  },

  init() {
    // Mode Switchers
    document.getElementById('link-login')?.addEventListener('click', (e) => { e.preventDefault(); this.state.mode = 'login'; this._reRender(); });
    document.getElementById('link-signup')?.addEventListener('click', (e) => { e.preventDefault(); this.state.mode = 'signup'; this.state.step = 1; this._reRender(); });

    // Step Back
    document.getElementById('btn-back-3')?.addEventListener('click', () => { this.state.step = 2; this._reRender(); });

    // Role Selection
    document.querySelectorAll('.role-card')?.forEach(card => {
      card.addEventListener('click', () => {
        this.state.formData.role = card.dataset.role;
        this.state.formData.role_type = card.dataset.type;
        this._reRender();
      });
    });

    // Step 1: Register Email
    document.getElementById('btn-step1')?.addEventListener('click', async () => {
      const email = document.getElementById('ob-email').value.trim();
      const pwd = document.getElementById('ob-pwd').value.trim();
      const p = document.getElementById('ob-prenom').value.trim();
      const n = document.getElementById('ob-nom').value.trim();
      const e = document.getElementById('ob-entreprise').value.trim();
      if (!email || !pwd || !p || !n || !e) return window.showToast('Veuillez remplir tous les champs.', 3000);
      
      this.state.loading = true; this._reRender();
      try {
        const user = await window.FirebaseService.registerWithEmail(email, pwd);
        await window.FirebaseService.createUserDoc(user.uid, {
          email, prenom: p, nom: n, entreprise: e
        });
        this.state.step = 2;
      } catch (err) {
        window.showToast("Erreur à la création :" + err.message);
      }
      this.state.loading = false; this._reRender();
    });

    // Step 1/Login: Google
    const doGoogle = async () => {
      this.state.loading = true; this._reRender();
      try {
        const user = await window.FirebaseService.loginWithGoogle();
        const doc = await window.FirebaseService.fetchUserDoc(user.uid);
        if (!doc) {
          // New User
          const [prenom, ...noms] = (user.displayName || "Utilisateur Anonyme").split(' ');
          await window.FirebaseService.createUserDoc(user.uid, {
            email: user.email, prenom, nom: noms.join(' '), photo_url: user.photoURL
          });
          this.state.step = 2;
          this.state.mode = 'signup';
        } else if (!doc.role) {
          // Existing but incomplete onboarding
          this.state.step = 2;
          this.state.mode = 'signup';
        } else {
          // Fully registered
          window.AppState.currentUser = doc;
          window.navigate(doc.role_type === 'juridique' ? 'Dashboard' : 'Dashboard');
          return;
        }
      } catch (err) {
        window.showToast("Annulé :" + err.message);
      }
      this.state.loading = false; this._reRender();
    };
    document.getElementById('btn-google-login')?.addEventListener('click', doGoogle);
    document.getElementById('btn-google-signup')?.addEventListener('click', doGoogle);

    // Login Email
    document.getElementById('btn-login')?.addEventListener('click', async () => {
      const email = document.getElementById('login-email').value.trim();
      const pwd = document.getElementById('login-pwd').value.trim();
      if (!email || !pwd) return;
      this.state.loading = true; this._reRender();
      try {
        const user = await window.FirebaseService.loginWithEmail(email, pwd);
        const doc = await window.FirebaseService.fetchUserDoc(user.uid);
        if (!doc) {
          this.state.step = 2; this.state.mode = 'signup';
        } else if (!doc.role) {
          this.state.step = 2; this.state.mode = 'signup';
        } else {
          window.AppState.currentUser = doc;
          window.navigate(doc.role_type === 'juridique' ? 'Dashboard' : 'Dashboard');
          return;
        }
      } catch (err) {
        window.showToast("Identifiants incorrects", 3000);
      }
      this.state.loading = false; this._reRender();
    });

    // Step 2: Org
    document.getElementById('btn-step2')?.addEventListener('click', async () => {
      const sect = document.getElementById('ob-secteur').value;
      const pays = document.getElementById('ob-pays').value.trim();
      const taille = document.getElementById('ob-taille').value;
      if (!sect || !taille) return window.showToast('Veuillez sélectionner au moins le secteur et la taille.');
      
      this.state.loading = true; this._reRender();
      if (window.FirebaseService.auth?.currentUser) {
        await window.FirebaseService.updateUserDoc(window.FirebaseService.auth.currentUser.uid, {
           secteur: sect, pays, taille_equipe: taille
        });
      }
      this.state.step = 3;
      this.state.loading = false; this._reRender();
    });

    // Step 3: Role
    document.getElementById('btn-step3')?.addEventListener('click', async () => {
      if (!this.state.formData.role) return window.showToast('Veuillez sélectionner un rôle.');
      this.state.loading = true; this._reRender();
      if (window.FirebaseService.auth?.currentUser) {
        await window.FirebaseService.updateUserDoc(window.FirebaseService.auth.currentUser.uid, {
           role: this.state.formData.role,
           roleLabel: this.state.formData.role,
           role_type: this.state.formData.role_type,
           initiales: window.FirebaseService.auth.currentUser.email.substring(0,2).toUpperCase()
        });
      }
      this.state.step = 4;
      this.state.loading = false; this._reRender();
    });

    // Step 4: Invites
    const finish = async () => {
      this.state.loading = true; this._reRender();
      const u = window.FirebaseService.auth?.currentUser;
      if (u) {
        const doc = await window.FirebaseService.fetchUserDoc(u.uid);
        if (doc) {
          window.AppState.currentUser = doc;
          window.navigate(doc.role_type === 'juridique' ? 'Dashboard' : 'Dashboard');
        }
      }
    };
    document.getElementById('btn-step4')?.addEventListener('click', finish);
    document.getElementById('btn-skip')?.addEventListener('click', finish);
  }
};

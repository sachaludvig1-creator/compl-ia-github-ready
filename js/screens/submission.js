'use strict';

/* ===================================================
   submission.js — Écran de soumission de contenu
   Deux modes : "Essai rapide" et "Mon contenu"
   =================================================== */
window.SubmissionScreen = {

  /* Mode onglet courant : 'essai' ou 'mon-contenu' */
  _modeActif: 'essai',

  /* Données du formulaire en cours de saisie */
  _formData: {
    texte: '',
    categorie: '',
    canal: '',
    imageData: null,
    estDemo: false,
  },

  /* Génère le HTML de l'écran de soumission */
  render() {
    return `
      <div class="app-layout screen-enter">
        ${window.renderSidebar('nouvelle')}

        <div class="main-content">
          <!-- En-tête -->
          <div class="page-header">
            <div class="page-header-left">
              <button class="btn btn-ghost btn-sm" id="btn-retour" style="margin-right:8px;">← Retour</button>
              <div>
                <h1>Soumettre un contenu à analyser</h1>
                <p>L'IA analyse votre contenu en quelques secondes selon les référentiels CE 1223/2009, ARPP et DGCCRF</p>
              </div>
            </div>
          </div>

          <div class="page-body">
            <div class="submission-form-wrapper">

              <!-- ===== SÉLECTEUR DE MODE ===== -->
              <div class="mode-selector">
                <button class="mode-tab active" id="tab-essai" data-mode="essai">
                  <span class="mode-tab-icon">⚡</span>
                  <span class="mode-tab-label">Essai rapide</span>
                  <span class="badge badge-demo">Recommandé pour la démo</span>
                </button>
                <button class="mode-tab" id="tab-mon-contenu" data-mode="mon-contenu">
                  <span class="mode-tab-icon">✏️</span>
                  <span class="mode-tab-label">Mon contenu</span>
                </button>
              </div>

              <!-- ===== PANNEAU ESSAI RAPIDE ===== -->
              <div class="mode-panel active" id="panel-essai">

                <!-- Description et bouton de chargement -->
                <div class="essai-hero">
                  <div class="essai-hero-text">
                    <div class="essai-hero-icon">🔒</div>
                    <div>
                      <h3>Testez sans exposer vos données réelles</h3>
                      <p>Un contenu fictif non conforme est pré-chargé (marque <strong>LumièreCosmetics</strong>). La démo complète dure moins de 3 minutes.</p>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-lg" id="btn-utiliser-exemple">
                    ✨&nbsp; Utiliser cet exemple
                  </button>
                </div>

                <!-- Aperçu du contenu de démonstration (visible après clic) -->
                <div class="demo-preview" id="demo-preview">
                  <div class="demo-preview-inner">

                    <!-- Colonne image -->
                    <div class="demo-preview-image-col">
                      <img src="assets/demo-serum.png"
                           alt="LumièreCosmetics — Sérum Anti-Âge Précieux"
                           class="demo-serum-img" />
                      <div class="demo-brand-label">LumièreCosmetics</div>
                      <div class="demo-product-label">Sérum Anti-Âge Précieux</div>
                    </div>

                    <!-- Colonne informations -->
                    <div class="demo-preview-info-col">
                      <div class="form-group">
                        <div class="form-label">Texte soumis à l'analyse</div>
                        <div class="demo-text-block">
                          <span class="demo-text-highlight-high">"Notre sérum anti-âge <mark class="mark-high">élimine définitivement</mark> les rides <mark class="mark-medium">en 7 jours</mark>. <mark class="mark-high">Résultats garantis à 100%</mark>."</span>
                        </div>
                      </div>
                      <div class="demo-meta-row">
                        <div class="demo-meta-chip">🏷 Soin anti-âge</div>
                        <div class="demo-meta-chip">📸 Instagram</div>
                      </div>
                      <div class="demo-risk-preview">
                        <div class="demo-risk-title">Aperçu des risques détectés :</div>
                        <div class="demo-risk-item demo-risk-high">🔴 <strong>"élimine définitivement"</strong> — Allégation absolue (CE 1223/2009)</div>
                        <div class="demo-risk-item demo-risk-high">🔴 <strong>"Résultats garantis à 100%"</strong> — Promesse interdite (ARPP)</div>
                        <div class="demo-risk-item demo-risk-medium">🟠 <strong>"en 7 jours"</strong> — Délai sans étude clinique (DGCCRF)</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              <!-- ===== PANNEAU MON CONTENU ===== -->
              <div class="mode-panel" id="panel-mon-contenu">
                <div class="mon-contenu-grid">

                  <!-- Selects catégorie + canal + deadline -->
                  <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <div class="form-group">
                      <label class="form-label" for="select-categorie">Catégorie produit</label>
                      <select class="form-select" id="select-categorie">
                        <option value="">— Sélectionner —</option>
                        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="select-canal">Canal de diffusion</label>
                      <select class="form-select" id="select-canal">
                        <option value="">— Sélectionner —</option>
                        ${CANAUX.map(c => `<option value="${c}">${c}</option>`).join('')}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="input-deadline">Date de retour souhaitée <span>(optionnel)</span></label>
                      <input type="date" class="form-input" id="input-deadline" style="width:100%; padding:12px; border:1px solid #D1D5DB; border-radius:8px; font-family:var(--font-family); color:#374151;">
                    </div>
                  </div>

                  <!-- Pays de diffusion ciblés -->
                  <div class="form-group" style="margin-bottom: 24px;">
                    <label class="form-label" style="display:flex; align-items:center; gap:6px;">
                      Pays de diffusion du contenu (réglementation applicable)
                      <span title="Sélectionnez les marchés où ce contenu sera publié. La réglementation de chaque marché sera appliquée à l'analyse." style="cursor:help; color:#9CA3AF;">ⓘ</span>
                    </label>
                    <div style="font-size:12px; color:#6B7280; margin-bottom:12px;">Ex : France → Règlement CE 1223/2009 + ARPP</div>
                    <div class="multi-select-tags" id="pays-tags" style="display:flex; flex-wrap:wrap; gap:8px;">
                      ${['France', 'UE', 'Royaume-Uni', 'USA', 'LATAM', 'EMEA', 'International'].map((p, i) => `
                        <label style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#F3F4F6; border:1px solid #E5E7EB; border-radius:100px; cursor:pointer; font-size:13px; font-weight:500; transition:0.2s;" class="pays-lbl">
                          <input type="checkbox" value="${p}" class="pays-chk" style="accent-color:#6B4EFF;" ${i===0 ? 'checked' : ''}>
                          ${p}
                        </label>
                      `).join('')}
                    </div>
                    <style>
                      .pays-lbl:has(input:checked) { background: #F5F3FF !important; border-color: #6B4EFF !important; color: #6B4EFF; }
                    </style>
                  </div>

                  <!-- Textarea + Zone drag & drop -->
                  <div class="form-row-two">
                    <div class="form-group">
                      <label class="form-label" for="textarea-texte">
                        Texte à analyser
                        <span>(caption, claim, description…)</span>
                      </label>
                      <textarea class="form-textarea"
                        id="textarea-texte"
                        placeholder="Collez ici votre caption Instagram, votre claim produit ou votre description e-commerce…"
                        rows="7"></textarea>
                      <div class="char-counter"><span id="char-count">0</span> caractère(s)</div>
                    </div>

                    <!-- Zone de drag & drop -->
                    <div class="form-group">
                      <label class="form-label">Visuel <span>(optionnel — PNG, JPG, WebP)</span></label>
                      <div class="drop-zone" id="drop-zone" tabindex="0" role="button"
                           aria-label="Zone de dépôt de fichier image">
                        <div class="drop-zone-inner" id="drop-zone-inner">
                          <div class="drop-zone-icon">🖼️</div>
                          <div class="drop-zone-main">Glissez votre visuel ici</div>
                          <div class="drop-zone-sub">ou cliquez pour sélectionner</div>
                          <div class="drop-zone-formats">PNG · JPG · WebP · max 5 Mo</div>
                        </div>
                        <input type="file" id="file-input" accept="image/png,image/jpeg,image/webp"
                               style="display:none;" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- ===== ACTIONS + CONFIDENTIALITÉ ===== -->
              <div class="submission-footer">
                <div class="submission-footer-btns" style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; margin-top: 16px;">
                  <button class="btn btn-primary" id="btn-lancer-audit" style="width: 100%; height: 52px; font-size: 16px; font-weight: 600;">
                    🔍&nbsp; Lancer l'analyse IA →
                  </button>
                  <button class="btn" id="btn-annuler" style="background: transparent; color: #6B7280; border: none; font-weight: 500; padding: 12px;">Annuler</button>
                  <div style="text-align: center; font-size: 12px; color: #9CA3AF; margin-top: 4px;">
                    Analyse en moins de 10 secondes · Basée sur le Règlement UE 655/2013 et l'ARPP V8
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* Initialise tous les événements de l'écran */
  init() {
    /* Réinitialise l'état du mode et du formulaire à chaque ouverture de l'écran */
    this._modeActif = 'essai';
    this._formData  = { texte: '', categorie: '', canal: '', imageData: null, estDemo: false };

    /* Retour / Annulation */
    document.getElementById('btn-retour')?.addEventListener('click', () => window.navigate('Dashboard'));
    document.getElementById('btn-annuler')?.addEventListener('click', () => window.navigate('Dashboard'));

    /* Sidebar */
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.nav === 'dashboard') window.navigate('Dashboard');
      });
    });
    document.getElementById('btn-switch-profil')?.addEventListener('click', () => window.navigate('Login'));

    /* Onglets (Essai rapide / Mon contenu) */
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => this._switchMode(tab.dataset.mode));
    });

    /* Bouton "Utiliser cet exemple" */
    document.getElementById('btn-utiliser-exemple')?.addEventListener('click', () => {
      this._chargerDemo();
    });

    /* Compteur de caractères + validation formulaire */
    document.getElementById('textarea-texte')?.addEventListener('input', e => {
      document.getElementById('char-count').textContent = e.target.value.length;
      this._validerFormulaire();
    });
    document.getElementById('select-categorie')?.addEventListener('change', () => this._validerFormulaire());
    document.getElementById('select-canal')?.addEventListener('change', () => this._validerFormulaire());

    /* Drag & Drop */
    this._initDragDrop();

    /* Lancement de l'audit */
    document.getElementById('btn-lancer-audit')?.addEventListener('click', () => {
      this._lancerAudit();
    });
  },

  /* Change l'onglet actif */
  _switchMode(mode) {
    this._modeActif = mode;
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');
    document.getElementById(`panel-${mode}`)?.classList.add('active');
    this._validerFormulaire();
  },

  /* Charge le contenu de démonstration pré-défini */
  _chargerDemo() {
    this._formData = {
      texte:      DEMO_CONTENU.texte,
      categorie:  DEMO_CONTENU.categorie,
      canal:      DEMO_CONTENU.canal,
      imageUrl:   DEMO_CONTENU.imageUrl,
      imageData:  null,
      estDemo:    true,
    };

    /* Affiche l'aperçu du contenu demo */
    const preview = document.getElementById('demo-preview');
    if (preview) {
      preview.classList.add('visible');
    }

    /* Transforme le bouton en confirmation */
    const btnEx = document.getElementById('btn-utiliser-exemple');
    if (btnEx) {
      btnEx.innerHTML = '✅&nbsp; Exemple chargé — cliquez sur "Lancer l\'audit IA"';
      btnEx.classList.remove('btn-primary');
      btnEx.classList.add('btn-success');
      btnEx.disabled = true;
    }

    /* Active le bouton d'audit */
    const btnAudit = document.getElementById('btn-lancer-audit');
    if (btnAudit) {
      btnAudit.disabled = false;
      btnAudit.classList.add('btn-ready');
    }
  },

  /* Valide si le formulaire est complet pour activer "Lancer l'audit" */
  _validerFormulaire() {
    const btnAudit = document.getElementById('btn-lancer-audit');
    if (!btnAudit) return;

    /* En mode "Essai rapide", le bouton est toujours actif (il chargera la démo au clic) */
    if (this._modeActif === 'essai') {
      btnAudit.disabled = false;
      return;
    }

    /* Mode "Mon contenu" : actif dès que texte, catégorie et canal sont remplis */
    const texte     = document.getElementById('textarea-texte')?.value?.trim();
    const categorie = document.getElementById('select-categorie')?.value;
    const canal     = document.getElementById('select-canal')?.value;
    const paysChks  = document.querySelectorAll('.pays-chk:checked');

    if (texte && categorie && canal && paysChks.length > 0) {
      btnAudit.disabled = false;
    } else {
      btnAudit.disabled = true;
    }
  },

  /* Initialise la zone de drag & drop */
  _initDragDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    if (!dropZone || !fileInput) return;

    /* Clic sur la zone → ouvre le sélecteur de fichier */
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') fileInput.click();
    });

    /* Survol avec un fichier */
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    /* Dépôt du fichier */
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this._handleImageUpload(file);
      }
    });

    /* Sélection via l'explorateur */
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) this._handleImageUpload(file);
    });
  },

  /* Lit et affiche l'image uploadée */
  _handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      this._formData.imageData = imageData;

      /* Remplace le contenu de la zone par l'aperçu de l'image */
      const inner = document.getElementById('drop-zone-inner');
      if (inner) {
        inner.innerHTML = `
          <img src="${imageData}" alt="${file.name}"
               style="max-width:100%;max-height:160px;object-fit:contain;border-radius:8px;" />
          <div style="margin-top:8px;font-size:12px;color:var(--color-text-secondary);">${file.name}</div>
          <button class="btn btn-ghost btn-sm" id="btn-remove-image" style="margin-top:4px;">
            ✕ Retirer l'image
          </button>
        `;
        
        /* Bug 5 : OCR automatique sur le visuel */
        const textArea = document.getElementById('textarea-texte');
        if (textArea && window.Tesseract) {
          try {
            window.showToast("⏳ Analyse du texte sur l'image en cours...", 2000);
            const { data: { text } } = await window.Tesseract.recognize(imageData, 'fra');
            if (text && text.trim().length > 0) {
              const cleanedText = text.trim();
              const texteExistant = textArea.value;
              const texteCombine = texteExistant
                ? texteExistant + '\n\n[Texte détecté sur le visuel :]\n' + cleanedText
                : cleanedText;
              textArea.value = texteCombine;
              
              const charCount = document.getElementById('char-count');
              if (charCount) charCount.textContent = texteCombine.length;
              
              window.showToast("✅ Texte détecté sur le visuel et ajouté à l'analyse", 4000);
              this._validerFormulaire();
            }
          } catch (err) {
            console.error("[Compl-IA] Erreur OCR Tesseract :", err);
          }
        }

        /* Bouton de suppression de l'image */
        document.getElementById('btn-remove-image')?.addEventListener('click', ev => {
          ev.stopPropagation();
          this._formData.imageData = null;
          inner.innerHTML = `
            <div class="drop-zone-icon">🖼️</div>
            <div class="drop-zone-main">Glissez votre visuel ici</div>
            <div class="drop-zone-sub">ou cliquez pour sélectionner</div>
            <div class="drop-zone-formats">PNG · JPG · WebP · max 5 Mo</div>
          `;
        });
      }
    };
    reader.readAsDataURL(file);
  },

  /* Lance l'audit et navigue vers l'écran de résultats */
  _lancerAudit() {
    let formData;

    if (this._modeActif === 'essai') {
      /* Mode demo : utilise les données de l'exemple */
      formData = {
        texte:      DEMO_CONTENU.texte,
        categorie:  DEMO_CONTENU.categorie,
        canal:      DEMO_CONTENU.canal,
        imageUrl:   DEMO_CONTENU.imageUrl,
        imageData:  null,
        estDemo:    true,
      };
    } else {
      /* Mode "Mon contenu" : récupère les valeurs du formulaire */
      const paysSelectionnes = Array.from(document.querySelectorAll('.pays-chk:checked')).map(cb => cb.value);
      
      formData = {
        texte:      document.getElementById('textarea-texte').value.trim(),
        categorie:  document.getElementById('select-categorie').value,
        canal:      document.getElementById('select-canal').value,
        pays:       paysSelectionnes.join(', '), // Envoi des pays dans la formData
        deadline:   document.getElementById('input-deadline')?.value || null,
        imageData:  this._formData.imageData,
        imageUrl:   null,
        estDemo:    false,
      };
    }

    /* Sauvegarde dans l'état global pour l'écran de résultats */
    window.AppState.pendingFormData = formData;

    console.log('Lancement audit — ResultsScreen disponible :', !!window.ResultsScreen);
    console.log('pendingFormData :', window.AppState.pendingFormData);

    /* Navigue vers l'écran de résultats qui lancera l'analyse */
    window.navigate('Results');
  },
};

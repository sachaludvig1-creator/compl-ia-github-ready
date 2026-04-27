'use strict';

/* Données fictives de fallback stricte en cas d'erreur API */
const FALLBACK_DATA = {
  score: 32,
  problemes: [
    {
      phrase: "élimine définitivement",
      severite: "Élevé",
      explication: "Le terme 'efface' constitue une allégation absolue et permanente. Aucun produit cosmétique ne peut prétendre à un effet d'effacement total des rides.",
      reglement: "Règlement UE 655/2013 — Critère 3",
      reformulations: [
        "aide à réduire l'apparence des rides dès 7 jours*",
        "atténue les signes visibles du vieillissement",
        "aide à diminuer les rides d'expression"
      ]
    },
    {
      phrase: "Résultats garantis à 100%",
      severite: "Élevé",
      explication: "Une promesse de résultats garantis est une allégation absolue interdite sans preuve clinique publiée et validée.",
      reglement: "Recommandations ARPP Beauté-Hygiène",
      reformulations: [
        "des résultats visibles dès 4 semaines*",
        "efficacité prouvée par test consommateurs",
        "testé et approuvé par un panel de 50 femmes"
      ]
    },
    {
      phrase: "en 7 jours",
      severite: "Modéré",
      explication: "Un délai d'action court sans étude clinique mentionnée contrevient à l'obligation de preuve.",
      reglement: "Règlement UE 655/2013 — Critère 3",
      reformulations: [
        "dès les premières applications*",
        "en quelques semaines d'utilisation",
        "avec une application régulière"
      ]
    }
  ],
  points_positifs: [
    "Présence d'acides hyaluroniques mentionnée comme ingrédient actif sans surpromesse.",
    "Bénéfice global d'hydratation bien cadré par sa nature cosmétique."
  ],
  temps_economise: "Env. 0.5 jour"
};

/* ===================================================
   results.js — Écran de résultats de l'analyse
   Affiche le loader puis les points de risque
   avec les reformulations conformes.
   =================================================== */
window.ResultsScreen = {

  _texteOriginal: '', /* Texte original avant modifications */

  /* Génère l'écran initial (avec loader uniquement) */
  render() {
    const formData = window.AppState.pendingFormData || {};
    const sub = window.AppState.submissions?.find(s => s.id === formData.submissionId);
    const titre = sub ? sub.titre : (formData.estDemo ? 'Exemple Sérum' : 'Nouvelle soumission');

    return `
      <div class="app-layout screen-enter">
        ${window.renderSidebar('dashboard')}

        <div class="main-content">
          <div class="page-header">
            <div class="page-header-left">
              <div class="breadcrumb">
                <a class="breadcrumb-link" id="breadcrumb-dash">Tableau de bord</a>
                <span class="breadcrumb-sep">&gt;</span>
                <a class="breadcrumb-link" id="breadcrumb-sub">${titre}</a>
                <span class="breadcrumb-sep">&gt;</span>
                <span class="breadcrumb-active">Analyse réglementaire IA</span>
              </div>
              <h1>Analyse réglementaire IA</h1>
              <p>Vérification CE 1223/2009 · ARPP Beauté-Hygiène · DGCCRF</p>
            </div>
          </div>

          <!-- Zone de résultats : loader puis rapport -->
          <div class="page-body" id="results-body">
            ${this._renderLoader()}
          </div>
        </div>
      </div>
    `;
  },

  /* HTML du loader animé */
  _renderLoader() {
    return `
      <div class="loader-screen" id="loader-screen">
        <div class="loader-ring">
          <div class="loader-icon">🔍</div>
        </div>
        <div class="loader-texts">
          <div class="loader-title">Analyse en cours…</div>
          <div class="loader-subtitle">
            L'IA consulte les référentiels réglementaires officiels et identifie
            les allégations non conformes dans votre contenu.
          </div>
        </div>
        <div class="loader-steps">
          <div class="loader-step" id="step-1">
            <div class="loader-step-dot"></div>
            <span>Lecture et découpage du contenu</span>
          </div>
          <div class="loader-step" id="step-2">
            <div class="loader-step-dot"></div>
            <span>Analyse des allégations marketing</span>
          </div>
          <div class="loader-step" id="step-3">
            <div class="loader-step-dot"></div>
            <span>Consultation CE 1223/2009, ARPP, DGCCRF</span>
          </div>
          <div class="loader-step" id="step-4">
            <div class="loader-step-dot"></div>
            <span>Génération des reformulations conformes</span>
          </div>
        </div>
      </div>
    `;
  },

  /* HTML du rapport de résultats (injecté après l'analyse) */
  _renderResults(analyse) {
    if (!analyse) {
      /* Fallback si la soumission a été corrompue en base (ex: absence de l'objet analyse) */
      analyse = { problemes: [], score: 100 };
    }
    const formData  = window.AppState.pendingFormData;
    
    /* Rétrocompatibilité momentanée si on ouvre les anciens fakes data.js */
    const problemes = analyse.problemes || analyse.points || [];
    
    const nbEleves  = problemes.filter(p => p.severite === 'Élevé' || p.niveau === 'eleve').length;
    const nbMoyens  = problemes.filter(p => p.severite === 'Modéré' || p.niveau === 'moyen').length;
    
    const score     = analyse.score ?? analyse.scoreConformite ?? 100;

    /* Nouveau spectre coloriel du score : 0-40 rouge / 41-70 orange / 71-100 vert */
    const scoreColor = score <= 40 ? 'var(--color-risk-high)'
                     : score <= 70 ? 'var(--color-risk-medium)'
                     : 'var(--color-suggestion)';
    
    const pointsPositifs = analyse.points_positifs || [];
    const tempsEconomise = analyse.temps_economise || (analyse.tempsAnalyse ? 'Env. 0.5 jour' : 'N/A');

    /* Image à afficher dans le panneau d'édition */
    const imageSource = formData.imageData || formData.imageUrl || null;

    return `
      <div class="results-layout">

        <!-- ========== COLONNE GAUCHE : rapport ========== -->
        <div class="results-left">

          <!-- Synthèse du rapport -->
          <div class="results-summary card card-padding">
            <div class="results-summary-top">
              <div class="results-score-block">
                <div class="results-score-circle" style="--score-color:${scoreColor}">
                  <span class="results-score-value" style="color:${scoreColor};">${score}</span>
                  <span class="results-score-label">/ 100</span>
                </div>
                <div style="width: 100%; height: 6px; background: #E5E7EB; border-radius: 4px; overflow: hidden; margin-top: 12px; max-width: 120px;">
                   <div style="height: 100%; width: ${score}%; background: ${scoreColor}; border-radius: 4px;"></div>
                </div>
                <div class="results-score-desc" style="margin-top: 12px;">Score de conformité réglementaire</div>
                <div style="font-size: 10px; color: var(--color-text-muted); margin-top: 4px; text-align: center; max-width: 120px; line-height: 1.3;">${score <= 40 ? 'Risque Élevé' : score <= 70 ? 'Conforme avec réserve' : 'Conforme'}</div>
              </div>
              <div class="results-summary-right">
                <div class="results-risk-chips">
                  ${nbEleves > 0 ? `<div class="risk-chip chip-high">🔴 ${nbEleves} risque${nbEleves > 1 ? 's' : ''} élevé${nbEleves > 1 ? 's' : ''}</div>` : ''}
                  ${nbMoyens > 0 ? `<div class="risk-chip chip-medium">🟠 ${nbMoyens} risque${nbMoyens > 1 ? 's' : ''} moyen${nbMoyens > 1 ? 's' : ''}</div>` : ''}
                  ${problemes.length === 0 ? `<div class="risk-chip chip-ok">✅ Aucun point problématique</div>` : ''}
                </div>
                <div class="results-refs">
                  <div class="results-ref-item">⏳ Temps économisé : <strong>${tempsEconomise}</strong></div>
                  <div class="results-ref-item">📚 ${(analyse.referentielsConsultes || ['CE 1223/2009', 'ARPP', 'DGCCRF']).join(' · ')}</div>
                  <div class="results-ref-item">🎯 Analyse basée sur le référentiel Compl-IA v1.0</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des points de risque -->
          <div class="results-points-list">
            ${problemes.length
              ? problemes.map((p, i) => this._renderRiskPoint(p, i)).join('')
              : `<div class="results-ok-card card card-padding">
                   <div class="results-ok-icon">✅</div>
                   <div class="results-ok-title">Contenu conforme</div>
                   <div class="results-ok-desc">Aucun point problématique détecté face aux référentiels consultés. Vous pouvez soumettre ce contenu au service juridique pour validation finale.</div>
                 </div>`
            }
          </div>
          
          <!-- Encart des points positifs en bas -->
          ${pointsPositifs.length > 0 ? `
            <div class="results-ok-card card card-padding" style="margin-top:24px; border-left:4px solid var(--color-suggestion);">
               <div style="font-weight:600; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
                 <span>✅</span> Ce qui est conforme dans ce contenu
               </div>
               <ul style="margin:0; padding-left:24px; color:var(--color-text-secondary); font-size:13px; line-height:1.5;">
                 ${pointsPositifs.map(pt => `<li>${pt}</li>`).join('')}
               </ul>
            </div>
          ` : ''}

        </div>

        <!-- ========== COLONNE DROITE : éditeur ========== -->
        <div class="results-right">
          <div class="editor-panel card" style="background: #FAFAFA; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px;">

            <div class="editor-panel-header" style="margin-bottom: 16px;">
              <h3 style="font-weight: 600; color: #374151;">✏️ Éditeur de contenu</h3>
              <div class="editor-header-actions">
                <button class="btn btn-ghost btn-sm" id="btn-copy-text" title="Copier le texte">📋</button>
                <button class="btn btn-ghost btn-sm" id="btn-reset-text" title="Réinitialiser">↩</button>
              </div>
            </div>

            <!-- Aperçu de l'image (si fournie) -->
            ${imageSource ? `
              <div class="editor-image-preview">
                <img src="${imageSource}" alt="Visuel du contenu" />
                <div class="editor-image-label">
                  ${formData.estDemo ? '📸 LumièreCosmetics — Sérum Anti-Âge Précieux' : '📸 Votre visuel'}
                </div>
              </div>
            ` : ''}

            <!-- Bandeau de mode retravail -->
            ${(formData.estRetravail && !formData.isJuridicalReview) ? `
              <div class="retravail-banner" style="height: 32px; font-size: 12px; background: #FEF3C7; color: #92400E; display: flex; align-items: center; border: none; border-radius: 6px; padding: 0 12px; margin-bottom: 12px;">
                <span style="margin-right: 6px;">📝</span> Version ${formData.version} — en cours de retravail
              </div>
            ` : ''}

            <!-- Zone d'édition du texte -->
            ${!formData.isJuridicalReview ? `
              <label class="form-label" style="font-size:13px; font-weight:600; color:#4B5563; margin-bottom:8px; display:block;">
                ✏️ Éditeur libre — adaptez le texte à votre marque
              </label>
            ` : ''}
            <textarea class="editor-textarea free-edit-textarea" id="editor-textarea"
              ${formData.isJuridicalReview ? 'readonly' : ''}
              placeholder="Modifiez librement ce texte pour l'adapter au tone of voice de votre marque...">${formData.texte}</textarea>

            <style>
              .free-edit-textarea:not([readonly]):focus {
                border-color: #3B82F6 !important;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
              }
            </style>

            <!-- Container pour le bouton de relance V2 (masqué par défaut) -->
            ${!formData.isJuridicalReview ? `
              <div id="v2-actions-container" style="display:none; text-align:center; padding-top: 16px; border-top: 1px solid var(--color-border); margin-top: 16px;">
                <button class="btn btn-outline-primary" id="btn-relancer-v2" style="width: 100%;">🔄 Relancer l'analyse sur la V${(formData.version || 1) + 1}</button>
              </div>
              <div style="margin-top:24px;">
                <button class="btn" id="btn-toggle-chatbot" style="width:100%; font-size:13px; font-weight:500; border:1px solid #D1D5DB; background:white; color:#374151;">
                  💬 Une question sur ce rapport ? Demander à l'IA
                </button>
              </div>
            ` : ''}

            <!-- Métadonnées -->
            <div class="editor-meta-row">
              <div class="editor-meta-chip">
                <span class="editor-meta-key">Catégorie</span>
                <span class="editor-meta-val">${formData.categorie}</span>
              </div>
              <div class="editor-meta-chip">
                <span class="editor-meta-key">Canal</span>
                <span class="editor-meta-val">${formData.canal}</span>
              </div>
            </div>

            <!-- Boutons / Footer -->
            ${formData.isJuridicalReview ? `
              <div class="form-group" style="padding: 16px 0 0; margin-bottom: 0;">
                <label class="form-label" style="font-size:13px; font-weight:500; color:#374151;" for="textarea-commentaire-juridique">
                  💬 Commentaire pour l'équipe marketing <span>(optionnel)</span>
                </label>
                <textarea id="textarea-commentaire-juridique" class="form-textarea"
                  placeholder="Précisez les points à corriger, les reformulations attendues ou toute remarque utile..."
                  rows="3" style="background:#FAFAFA; border:1px solid #D1D5DB; border-radius:8px;"></textarea>
              </div>
            ` : ''}
            <div class="editor-footer" style="padding: 16px 0 0; background: transparent; border-top: none;">
            
            <!-- Actions de clôture -->
            <div class="editor-footer-actions" style="padding-top: 16px;">
              ${formData.isJuridicalReview ? `
                <div style="margin-bottom: 12px; font-size: 13px; color: var(--color-text-secondary); text-align: center;">
                  Vous êtes en mode Service Juridique. L'édition est verrouillée. Retournez sur le tableau de bord pour apposer votre validation.
                </div>
                <button class="btn btn-outline-primary btn-block" onclick="window.navigate('Dashboard')">
                  ← Retour à la file de validation
                </button>
              ` : `
                <button class="btn btn-primary btn-block" id="btn-envoyer-juridique">
                  📨&nbsp; Envoyer au service juridique
                </button>
                <div class="editor-footer-note" style="font-size: 11px; color: var(--color-text-muted); margin-top: 8px; text-align: center;">
                  Le contenu édité et le rapport complet seront transmis au service réglementaire.
                </div>
              `}
            </div>

            <!-- Interface Chatbot (invisible par défaut) -->
            ${!formData.isJuridicalReview ? `
              <div id="chatbot-container" style="display:none; margin-top:32px; background:white; border:1px solid #E5E7EB; border-radius:12px; overflow:hidden; flex-direction:column;">
                <div style="background:#F3F4F6; padding:12px; font-weight:600; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <span>🤖 Assistant Légal Compl-IA</span>
                  <button id="btn-close-chatbot" style="background:transparent; border:none; cursor:pointer;">✕</button>
                </div>
                <div id="chatbot-messages" style="height:200px; overflow-y:auto; padding:12px; font-size:13px; background:#FAFAFA;">
                  <div style="margin-bottom:12px;"><span style="background:#E5E7EB; padding:6px 10px; border-radius:12px; display:inline-block;">Bonjour, avez-vous des questions sur un point spécifique du règlement ?</span></div>
                </div>
                <div style="border-top:1px solid #E5E7EB; border-bottom:none; padding:8px; display:flex; gap:8px;">
                  <input type="text" id="chatbot-input" placeholder="Posez votre question..." style="flex:1; padding:8px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px; outline:none;">
                  <button id="btn-chatbot-send" style="background:#6B4EFF; color:white; border:none; border-radius:6px; padding:0 12px; cursor:pointer;" title="Envoyer">➤</button>
                </div>
              </div>
            ` : ''}

          </div>
        </div>

      </div>
    `;
  },

  /* HTML d'un point de risque avec ses reformulations */
  _renderRiskPoint(point, index) {
    /* Rétrocompatibilité avec les anciens fakes data.js */
    const isEleve = point.severite === 'Élevé' || point.niveau === 'eleve';
    const isMoyen = point.severite === 'Modéré' || point.niveau === 'moyen';

    const niveauClass = isEleve ? 'risk-card-high' : isMoyen ? 'risk-card-medium' : 'risk-card-low';
    const badgeClass  = isEleve ? 'risk-badge-high' : isMoyen ? 'risk-badge-medium' : 'risk-badge-low';
    const niveauLabel = isEleve ? '🔴 À risque' : isMoyen ? '🟠 Conforme avec réserve' : '🟢 Conforme';
    const niveauTooltip = isEleve ? 'Ce claim contrevient à la réglementation et doit être modifié.' :
                          isMoyen ? 'Ce claim est acceptable sous conditions supplémentaires (ex: astérisque).' :
                          'Ce claim est publiable tel quel.';

    /* Rétrocompatibilité des clés */
    const fragment = point.phrase || point.fragment || '';
    const reference = point.reglement || point.reference || '';

    return `
      <div class="risk-card card ${niveauClass}">

        <!-- En-tête du point de risque -->
        <div class="risk-card-header">
          <span class="risk-badge ${badgeClass}" title="${niveauTooltip}" style="cursor:help;">${niveauLabel}</span>
          <div class="risk-fragment">"${fragment}"</div>
        </div>

        <!-- Explication réglementaire -->
        <div class="risk-explanation">${point.explication}</div>

        <!-- Référence réglementaire -->
        <div class="risk-reference">
          <div class="risk-reference-icon">📋</div>
          <div>
            <div class="risk-reference-main">${reference}</div>
            ${point.referenceDetail ? `<div class="risk-reference-detail">${point.referenceDetail}</div>` : ''}
          </div>
        </div>

        <!-- Reformulations conformes -->
        <div class="risk-reformulations">
          <div class="risk-reformulations-title">✏️ Reformulations conformes — cliquez pour appliquer :</div>
          <div class="risk-reformulations-list">
            ${point.reformulations && point.reformulations.length ? point.reformulations.map((r, ri) => `
              <button class="reformulation-btn"
                      data-state="normal"
                      data-point-id="risk-${point.id || index}"
                      id="ref-${point.id || index}-${ri}"
                      data-original="${fragment.replace(/"/g, '&quot;')}"
                      data-replacement="${r.replace(/"/g, '&quot;')}">
                <span class="ref-number">${ri + 1}</span>
                <span class="ref-text">${r}</span>
                <span class="ref-apply-label">← Appliquer</span>
              </button>
            `).join('') : '<div style="font-size:13px; color:var(--color-text-secondary); padding:8px;">Aucune reformulation proposée.</div>'}
          </div>
        </div>

      </div>
    `;
  },

  /* Initialisation : lance l'analyse asynchrone */
  async init() {
    /* Navigation latérale */
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.nav === 'dashboard') window.navigate('Dashboard');
        else if (el.dataset.nav === 'nouvelle') window.navigate('Submission');
      });
    });
    document.getElementById('btn-switch-profil')?.addEventListener('click', () => window.navigate('Login'));
    /* Retour via bouton ou Sidebar */
    document.getElementById('btn-retour')?.addEventListener('click', () => window.navigate('Dashboard'));
    document.getElementById('breadcrumb-dash')?.addEventListener('click', () => window.navigate('Dashboard'));
    document.getElementById('breadcrumb-sub')?.addEventListener('click', () => window.navigate('Dashboard'));

    /* Récupère les données du formulaire depuis l'état global */
    const formData = window.AppState.pendingFormData;

    /* Guard : si on arrive ici sans données, retourner au dashboard */
    if (!formData) {
      console.warn('[Compl-IA] pendingFormData absent — retour au dashboard');
      window.navigate('Dashboard');
      return;
    }

    this._texteOriginal = formData.texte;

    /* Mode Retravail / Juridique : affiche immédiatement sans loader */
    if (formData.estRetravail || formData.isJuridicalReview) {
      const analyse = formData.analyse;
      window.AppState.analysisResult = analyse;

      if (formData.isJuridicalReview) {
         formData.comments = await window.FirebaseService.fetchComments(formData.submissionId);
         console.log('[Compl-IA] Commentaires chargés :', formData.comments);
      }

      const body = document.getElementById('results-body');
      if (body) {
        body.innerHTML = this._renderResults(analyse);
        this._initResultsEvents();
      }
      return; /* Stoppe ici (pas de loader) */
    }

    /* Lance l'animation des étapes du loader (mode normal) */
    this._animateLoaderSteps();

    /* Appel à l'API Serverless */
    try {
      const paysSelectionnes = typeof formData.pays === 'string' ? formData.pays : (Array.isArray(formData.pays) ? formData.pays.join(", ") : "France");
      const brandRules = localStorage.getItem('complia_brand_rules') || '';
      const knowledgeLocal = brandRules ? `\nRègles internes de la marque (À RESPECTER STRICTEMENT) :\n${brandRules}\n` : '';
      
      const sysPrompt = `Tu es un expert en réglementation cosmétique. Analyse ce contenu pour les marchés : ${paysSelectionnes}.${knowledgeLocal} Retourne UNIQUEMENT un JSON avec {score, problemes:[{phrase, severite, explication, reglement, reformulations:[]}], points_positifs:[], temps_economise}.`;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: sysPrompt,
          messages: [{ role: "user", content: "Analyse : " + formData.texte }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(()=>({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const message = await response.json();
      const texteJson = message.content[0].text.match(/\{[\s\S]*\}/)?.[0] || message.content[0].text;
      const analyse = JSON.parse(texteJson);

      window.AppState.analysisResult = analyse;
      this._injectResults(analyse, 200);

    } catch (erreur) {
      console.warn('Erreur API Claude, activation du fallback fictif :', erreur);
      window.showToast("🛑 Blocage API : " + erreur.message, 10000);
      /* Fallback automatique et silencieux ! */
      
      /* Simule 2.4s d'attente pour que l'animation du loader se fasse */
      await new Promise(r => setTimeout(r, 2400));
      
      const analyse = { ...FALLBACK_DATA };
      window.AppState.analysisResult = analyse;
      this._injectResults(analyse, 200);
    }
  },

  /* Méthode utilitaire pour injecter les résultats dans le DOM */
  _injectResults(analyse, delay) {
      const body = document.getElementById('results-body');
      if (body) {
        body.style.opacity = '0';
        body.style.transition = `opacity ${delay}ms ease`;
        setTimeout(() => {
          body.innerHTML = this._renderResults(analyse);
          body.style.opacity = '1';
          this._initResultsEvents();
        }, delay);
      }
  },

  /* Anime les icônes de progression dans le loader */
  _animateLoaderSteps() {
    const etapes = ['step-1', 'step-2', 'step-3', 'step-4'];
    let i = 0;

    /* Active la 1ère étape immédiatement */
    const premiere = document.getElementById(etapes[0]);
    if (premiere) premiere.classList.add('active');
    i = 1;

    /* Avance toutes les 580ms */
    const interval = setInterval(() => {
      /* Marque l'étape précédente comme terminée */
      const prev = document.getElementById(etapes[i - 1]);
      if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }

      if (i < etapes.length) {
        const el = document.getElementById(etapes[i]);
        if (el) el.classList.add('active');
        i++;
      } else {
        clearInterval(interval);
      }
    }, 580);
  },

  /* Attache les événements sur les résultats affichés */
  _initResultsEvents() {
    const editorTextarea = document.getElementById('editor-textarea');
    const v2Container = document.getElementById('v2-actions-container');

    /* Afficher le bouton V2 si le texte a été modifié */
    if (editorTextarea && v2Container) {
      editorTextarea.addEventListener('input', () => {
        if (editorTextarea.value !== this._texteOriginal) {
          v2Container.style.display = 'block';
        } else {
          v2Container.style.display = 'none';
        }
        const instruction = document.getElementById('editor-instruction');
        if (instruction) instruction.style.display = 'none';
      });
    }

    /* Action au clic : Re-lancer l'analyse */
    document.getElementById('btn-relancer-v2')?.addEventListener('click', async (e) => {
      const btn = e.target;
      const formData = window.AppState.pendingFormData;
      const currentNextVersion = (formData.version || 1) + 1;
      
      btn.disabled = true;
      btn.innerHTML = `🔄 Analyse de la V${currentNextVersion} en cours...`;
      
      const newText = editorTextarea.value;
      
      /* Préservation du score V1 */
      if (formData.score_v1 === undefined) {
        formData.score_v1 = formData.analyse?.score ?? formData.analyse?.scoreConformite ?? 100;
        /* Sur mock-mode fallback pour score_v1 lors d'une démo pure: on le sauvegarde de l'état */
      }
      
      /* Loader dans la partie Résultats pour faire patienter */
      const body = document.getElementById('results-body');
      
      /* Appel de la V2 */
      try {
        const paysSelectionnes = typeof formData.pays === 'string' ? formData.pays : (Array.isArray(formData.pays) ? formData.pays.join(", ") : "France");
        const brandRules = localStorage.getItem('complia_brand_rules') || '';
        const knowledgeLocal = brandRules ? `\nRègles internes de la marque (À RESPECTER STRICTEMENT) :\n${brandRules}\n` : '';

        const sysPrompt = `Tu es un expert en réglementation cosmétique. Analyse ce contenu pour les marchés : ${paysSelectionnes}.${knowledgeLocal} Retourne UNIQUEMENT un JSON valide {score, problemes:[{phrase, severite, explication, reglement, reformulations:[]}], points_positifs:[], temps_economise}.`;
        
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: sysPrompt,
            messages: [{ role: "user", content: "Analyse v2 : " + newText }]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(()=>({}));
          throw new Error(errData?.error?.message || `HTTP ${response.status}`);
        }

        const message = await response.json();

        const texteJson = message.content[0].text.match(/\{[\s\S]*\}/)?.[0] || message.content[0].text;
        const reponseIA = JSON.parse(texteJson);
        
        /* Enregistrement de V2/V3... */
        window.AppState.analysisResult = reponseIA;
        formData.analyse = reponseIA;
        formData.score_v2 = reponseIA.score ?? reponseIA.scoreConformite ?? 100;
        formData.texte = newText;
        formData.version = currentNextVersion;
        this._texteOriginal = newText;
        
        /* Sauvegarde temporaire */
        if (!formData.estDemo && window.AppState.submissions) {
          const s = window.AppState.submissions.find(s => s.id === formData.submissionId);
          if (s) {
            const risqueTxt = formData.score_v2 <= 40 ? 'Élevé' : formData.score_v2 <= 70 ? 'Modéré' : 'Faible';
            Object.assign(s, {
              texte: newText,
              analyse: reponseIA,
              score_v1: formData.score_v1,
              score_v2: formData.score_v2,
              risque: risqueTxt
            });
            
            /* Bug 3 : Synchronisation Firestore */
            if (window.FirebaseService && typeof window.FirebaseService.updateSubmissionStatus === 'function') {
               window.FirebaseService.updateSubmissionStatus(s.id, {
                 analyse: reponseIA,
                 score_v1: formData.score_v1,
                 score_v2: formData.score_v2,
                 risque: risqueTxt,
                 texte: newText
               }).catch(e => console.error("Erreur sync V2:", e));
            }
          }
        }

        /* Refresh de la page avec la V2 */
        this._injectResults(reponseIA, 200);
        
      } catch (erreur) {
        console.warn("[Compl-IA] Erreur lors de l'analyse V2, utilisation du fallback V2", erreur);
        window.showToast("🛑 Blocage API : " + erreur.message, 10000);
        
        // Mock fallback pour la V2 (On imagine que la reco a été suivie)
        await new Promise(r => setTimeout(r, 1500));
        
        const fallbackV2 = {
          score: 85,
          problemes: [
            {
              phrase: "en 7 jours",
              severite: "Modéré",
              explication: "Ce délai d'action reste sans preuve. À justifier.",
              reglement: "Règlement UE 655/2013",
              reformulations: ["dès les premières applications"]
            }
          ],
          points_positifs: FALLBACK_DATA.points_positifs.concat("Correction des allégations absolues appliquée avec succès."),
          temps_economise: "Env. 0.5 jour"
        };
        
        window.AppState.analysisResult = fallbackV2;
        formData.analyse = fallbackV2;
        formData.score_v2 = fallbackV2.score;
        formData.texte = newText;
        formData.version = currentNextVersion;
        this._texteOriginal = newText;

        /* Sauvegarde temporaire fallback */
        if (!formData.estDemo && window.AppState.submissions) {
          const s = window.AppState.submissions.find(s => s.id === formData.submissionId);
          if (s) {
            const risqueTxt = formData.score_v2 <= 40 ? 'Élevé' : formData.score_v2 <= 70 ? 'Modéré' : 'Faible';
            Object.assign(s, {
              texte: newText,
              analyse: fallbackV2,
              score_v1: formData.score_v1,
              score_v2: formData.score_v2,
              risque: risqueTxt
            });
            
            /* Bug 3 : Synchronisation Firestore fallback */
            if (window.FirebaseService && typeof window.FirebaseService.updateSubmissionStatus === 'function') {
               window.FirebaseService.updateSubmissionStatus(s.id, {
                 analyse: fallbackV2,
                 score_v1: formData.score_v1,
                 score_v2: formData.score_v2,
                 risque: risqueTxt,
                 texte: newText
               }).catch(e => console.error("Erreur sync fallback V2:", e));
            }
          }
        }

        this._injectResults(fallbackV2, 200);
      }
    });

    /* ── Boutons de reformulation → remplacent le texte (Bug 1 - Toggle) ── */
    document.querySelectorAll('.reformulation-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!editorTextarea) return;

        const original    = btn.dataset.original;
        const replacement = btn.dataset.replacement;
        const pointId     = btn.dataset.pointId;
        const currentState = btn.dataset.state;

        let texteActuel = editorTextarea.value;

        if (currentState === 'applied') {
          /* ANNULER L'UTILISATION DU BOUTON (Toggle off) */
          if (texteActuel.includes(replacement)) {
            texteActuel = texteActuel.replace(replacement, original);
          } else {
            /* Fallback si l'utilisateur a édité manuellement entre-temps */
            window.showToast("⚠️ Impossible d'annuler automatiquement (le texte a été modifié).", 3000);
            return;
          }
          editorTextarea.value = texteActuel;
          btn.dataset.state = 'normal';
          btn.classList.remove('reformulation-applied');
          btn.style.background = '';
          const applyLabel = btn.querySelector('.ref-apply-label');
          if (applyLabel) applyLabel.textContent = '← Appliquer';
          window.showToast('↩ Reformulation annulée.');

        } else {
          /* APPLIQUER LA REFORMULATION (Toggle ON) */
          /* 1. Vérifier s'il y a déjà un bouton appliqué dans CE risk-point */
          const siblings = document.querySelectorAll(`.reformulation-btn[data-point-id="${pointId}"]`);
          for (let sib of siblings) {
            if (sib.dataset.state === 'applied') {
               const sibReplacement = sib.dataset.replacement;
               const sibOriginal    = sib.dataset.original;
               /* Annuler ce sibling d'abord */
               if (texteActuel.includes(sibReplacement)) {
                 texteActuel = texteActuel.replace(sibReplacement, sibOriginal);
               }
               sib.dataset.state = 'normal';
               sib.classList.remove('reformulation-applied');
               sib.style.background = '';
               const sLabel = sib.querySelector('.ref-apply-label');
               if (sLabel) sLabel.textContent = '← Appliquer';
            }
          }

          /* 2. Appliquer la nouvelle */
          if (texteActuel.includes(original)) {
            texteActuel = texteActuel.replace(original, replacement);
          } else {
            texteActuel = texteActuel + ' ' + replacement;
          }
          editorTextarea.value = texteActuel;

          btn.dataset.state = 'applied';
          btn.classList.add('reformulation-applied');
          btn.style.background = '#ECFDF5'; /* Vert léger explicit */
          const applyLabel = btn.querySelector('.ref-apply-label');
          if (applyLabel) applyLabel.textContent = '✓ Appliqué';
          window.showToast('✏️ Reformulation appliquée.');
        }

        /* Mettre à jour le compteur s'il y en a un sur cette page */
        const charCount = document.getElementById('char-count');
        if (charCount) charCount.textContent = editorTextarea.value.length;

        /* Trigger explicitement l'event 'input' pour le workflow V2 */
        const evt = new Event('input', { bubbles: true });
        editorTextarea.dispatchEvent(evt);

        /* Pulse sur l'éditeur */
        editorTextarea.classList.add('editor-pulse');
        setTimeout(() => editorTextarea.classList.remove('editor-pulse'), 700);
      });
    });

    /* ── Copier le texte (avec fallback pour le protocole file://) ── */
    document.getElementById('btn-copy-text')?.addEventListener('click', () => {
      if (!editorTextarea) return;
      const texte = editorTextarea.value;

      /* Tentative via l'API Clipboard moderne */
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texte)
          .then(() => window.showToast('📋 Texte copié dans le presse-papier.'))
          .catch(() => this._fallbackCopy(editorTextarea));
      } else {
        /* Fallback pour les navigateurs sans accès clipboard (file://) */
        this._fallbackCopy(editorTextarea);
      }
    });

    /* ── Réinitialiser le texte au contenu original ── */
    document.getElementById('btn-reset-text')?.addEventListener('click', () => {
      if (!editorTextarea) return;
      editorTextarea.value = this._texteOriginal;
      document.querySelectorAll('.reformulation-btn').forEach(btn => {
        btn.classList.remove('reformulation-applied');
        const applyLabel = btn.querySelector('.ref-apply-label');
        if (applyLabel) applyLabel.textContent = '← Appliquer';
      });
      window.showToast('↩ Texte réinitialisé.');
    });

    /* Bouton d'envoi = Mock d'enregistrement (Marketing) */
    document.getElementById('btn-envoyer-juridique')?.addEventListener('click', (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.innerHTML = 'Envoi en cours...';
      this._envoyerAuJuridique(editorTextarea?.value || '');
    });

    /* CTAs (Juridique) */
    document.getElementById('btn-juridique-reviser')?.addEventListener('click', async (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.innerHTML = 'En cours...';
      
      const formData = window.AppState.pendingFormData;
      const commentInput = document.getElementById('textarea-commentaire-juridique');
      const comment = commentInput ? commentInput.value.trim() : '';

      await window.FirebaseService.updateSubmissionStatus(formData.submissionId, { 
        statut: 'retravailler',
        commentaireJuridique: comment || ''
      });
      
      if (comment) {
        await window.FirebaseService.createComment({
           submission_id: formData.submissionId,
           author: window.AppState.currentUser.prenom,
           text: comment
        });
      }

      await window.FirebaseService.createNotification({
        user_id: 'camille',
        email: 'camille.fouet.pro@gmail.com',
        title: 'Révision demandée',
        message: `La soumission "${formData.titre || 'Sérum Anti-Âge'}" nécessite des corrections. \nCommentaire : ${comment}`
      });

      window.showToast('📝 Révision demandée. L\'équipe marketing est notifiée.');
      setTimeout(() => window.navigate('Dashboard'), 1400);
    });

    document.getElementById('btn-juridique-valider')?.addEventListener('click', async (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.innerHTML = 'En cours...';

      const formData = window.AppState.pendingFormData;
      const commentInput = document.getElementById('textarea-commentaire-juridique');
      const comment = commentInput ? commentInput.value.trim() : '';

      await window.FirebaseService.updateSubmissionStatus(formData.submissionId, {
        statut: 'valide',
        commentaireJuridique: comment || ''
      });
      
      if (comment) {
        await window.FirebaseService.createComment({
           submission_id: formData.submissionId,
           author: window.AppState.currentUser.prenom,
           text: comment
        });
      }

      await window.FirebaseService.createNotification({
        user_id: 'camille',
        email: 'camille.fouet.pro@gmail.com',
        title: 'Contenu validé ✅',
        message: `La soumission "${formData.titre || 'Sérum Anti-Âge'}" a été validée par le service juridique.`
      });

      window.showToast('✅ Soumission validée. L\'équipe marketing est notifiée.');
      setTimeout(() => window.navigate('Dashboard'), 1400);
    });

    /* ── Chatbot IA (Toggle et Envoi) ── */
    const cbContainer = document.getElementById('chatbot-container');
    const cbBtnToggle = document.getElementById('btn-toggle-chatbot');
    const cbBtnClose  = document.getElementById('btn-close-chatbot');
    const cbBtnSend   = document.getElementById('btn-chatbot-send');
    const cbInput     = document.getElementById('chatbot-input');
    const cbMsgs      = document.getElementById('chatbot-messages');

    if (cbContainer) {
      cbBtnToggle?.addEventListener('click', () => { cbContainer.style.display = 'flex'; cbBtnToggle.style.display = 'none'; });
      cbBtnClose?.addEventListener('click', () => { cbContainer.style.display = 'none'; cbBtnToggle.style.display = 'block'; });
      const sendCbMsg = async () => {
        const txt = cbInput.value.trim();
        if(!txt) return;
        cbMsgs.innerHTML += `<div style="margin-bottom:12px; text-align:right;"><span style="background:#6B4EFF; color:white; padding:6px 10px; border-radius:12px; display:inline-block;">${txt}</span></div>`;
        cbInput.value = '';
        cbMsgs.scrollTop = cbMsgs.scrollHeight;
        
        cbBtnSend.disabled = true;
        cbMsgs.innerHTML += `<div id="cb-loading" style="margin-bottom:12px;"><span style="background:#E5E7EB; padding:6px 10px; border-radius:12px; display:inline-block; font-size:11px;">Euh...</span></div>`;
        cbMsgs.scrollTop = cbMsgs.scrollHeight;
        
        try {
          const rep = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              promptSystem: "Tu es l'assistant Légal de Compl-IA. Sois extrèmement bref (2 lignes max) et précis sur les lois cosmétiques européennes.", 
              text: txt, pays: 'Chatbot' 
            })
          });
          document.getElementById('cb-loading')?.remove();
          if(rep.ok) {
            const data = await rep.json();
            const repTexte = data.content?.[0]?.text || "Il y a un souci avec l'API Anthropic. Je ne peux pas répondre pour le moment.";
            cbMsgs.innerHTML += `<div style="margin-bottom:12px;"><span style="background:#E5E7EB; padding:6px 10px; border-radius:12px; display:inline-block;">${repTexte}</span></div>`;
          } else {
            cbMsgs.innerHTML += `<div style="margin-bottom:12px;"><span style="background:#FEE2E2; color:#991B1B; padding:6px 10px; border-radius:12px; display:inline-block;">Désolé, le backend proxy n'est pas opérationnel (Erreur HTTP).</span></div>`;
          }
        } catch(e) {
          document.getElementById('cb-loading')?.remove();
          cbMsgs.innerHTML += `<div style="margin-bottom:12px;"><span style="background:#E5E7EB; padding:6px 10px; border-radius:12px; display:inline-block;">Désolé, en l'absence de base backend proxy configurée, l'IA ne peut pas répondre en temps réel.</span></div>`;
        }
        cbBtnSend.disabled = false;
        cbMsgs.scrollTop = cbMsgs.scrollHeight;
      };
      cbBtnSend?.addEventListener('click', sendCbMsg);
      cbInput?.addEventListener('keydown', (e) => { if(e.key === 'Enter') sendCbMsg(); });
    }
  },

  /* Copie via execCommand — fallback pour file:// */
  _fallbackCopy(textarea) {
    try {
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand('copy');
      window.showToast('📋 Texte copié dans le presse-papier.');
    } catch (e) {
      window.showToast('⚠️ Sélectionnez le texte manuellement puis Ctrl+C.');
    }
  },

  /* Crée ou met à jour une soumission, puis redirige vers le dashboard */
  async _envoyerAuJuridique(texteEdite) {
    const formData = window.AppState.pendingFormData;
    const currentUser = window.AppState.currentUser || {};

    if (formData.estRetravail) {
      /* Mode retravail : met à jour la soumission existante */
      const sub = window.AppState.submissions.find(s => s.id === formData.submissionId);
      const version = (sub?.version || 1) + 1;
      
      const calcScore = formData.score_v2 ?? window.AppState.analysisResult?.score ?? window.AppState.analysisResult?.scoreConformite ?? 100;
      const calcRisque = calcScore <= 40 ? 'Élevé' : calcScore <= 70 ? 'Modéré' : 'Faible';

      await window.FirebaseService.updateSubmissionStatus(formData.submissionId, {
        texte: texteEdite,
        statut: 'en_cours',
        commentaireJuridique: '',
        version: version,
        risque: calcRisque,
        analyse: window.AppState.analysisResult || {},
        score_v1: formData.score_v1 ?? calcScore,
        score_v2: formData.score_v2
      });
      window.showToast('📨 Version mise à jour et envoyée au juridique.');
    } else {
      /* Mode création : nouvelle soumission */
      const calcScore = formData.score_v2 ?? window.AppState.analysisResult?.score ?? window.AppState.analysisResult?.scoreConformite ?? 100;
      const calcRisque = calcScore <= 40 ? 'Élevé' : calcScore <= 70 ? 'Modéré' : 'Faible';
      
      const nouvelleSoumission = {
        titre:              formData.estDemo
                              ? 'Sérum Anti-Âge Précieux'
                              : (texteEdite.substring(0, 35) + '…'),
        texte:              texteEdite,
        categorie:          formData.categorie,
        canal:              formData.canal,
        statut:             'en_cours',
        creeLe:             new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        dateShort:          new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        marque:             formData.estDemo ? 'LumièreCosmetics' : '',
        commentaireJuridique: '',
        imageUrl:           formData.imageUrl || null,
        soumisParRole:      'marketing',
        submitted_by:       currentUser.id || 'camille',
        risque:             calcRisque,
        analyse:            window.AppState.analysisResult || {},
        score_v1:           formData.score_v1 ?? calcScore,
        score_v2:           formData.score_v2,
        version:            1
      };

      await window.FirebaseService.createSubmission(nouvelleSoumission);
      window.showToast('📨 Envoyé au service juridique. Consultez le tableau de bord pour le suivi.');
    }

    /* Notification pour le statut "A examiner" */
    await window.FirebaseService.createNotification({
      user_id: 'isabelle',
      email: 'isabelle.renard.pro@gmail.com',
      title: 'Nouvelle soumission à valider',
      message: `Le contenu ${formData.estRetravail ? `retravaillé (V${(window.AppState.submissions.find(s => s.id === formData.submissionId)?.version || 1)+1})` : 'nouvellement soumis'} est en attente de votre examen.`
    });

    /* Retour au dashboard avec un léger délai pour lire le toast */
    setTimeout(() => window.navigate('Dashboard'), 1400);
  },
};

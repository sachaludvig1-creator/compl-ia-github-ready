'use strict';

/* ===================================================
   dashboard.js — Tableau de bord (SMM / Brand Content)
   =================================================== */
window.DashboardScreen = {

  filtreActif: 'Tous',
  recherche: '',

  /* Génère le HTML brut principal, qui sera complété et hydraté par init() */
  render() {
    const user = window.AppState.currentUser;
    const isJuridique = user.role === 'juridique';

    return `
      <div class="app-layout screen-enter">
        ${window.renderSidebar('dashboard')}

        <div class="main-content">
          <!-- En-tête de page -->
          <div class="page-header">
            <div class="page-header-left">
              <h1>${isJuridique ? 'Contenus en attente de validation' : 'Tableau de bord'}</h1>
              <p>${isJuridique
                ? 'Examinez et validez les propositions de vos équipes'
                : 'Suivez vos contenus soumis et leur statut de validation.'
              }</p>
            </div>
            ${!isJuridique ? `
              <button class="btn btn-primary" id="btn-nouvelle-validation">
                ＋&nbsp; Nouvelle vérification
              </button>
            ` : ''}
          </div>

          <!-- Corps de la page -->
          <div class="page-body">
            
            <!-- Conteneur cible pour les KPIs dynamiques -->
            <div id="kpi-container"></div>

            <!-- Barre de Filtres et Recherche -->
            <div class="filters-container">
              <div class="filter-group" id="filter-group">
                <!-- Rendu dans _updateDashboard -->
              </div>
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input type="search" class="search-input" id="search-input" placeholder="Rechercher des soumissions..." autocomplete="off">
              </div>
            </div>

            <!-- Tableau -->
            <div class="dashboard-table-container">
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>Contenu & Périmètre</th>
                    <th>Soumis le</th>
                    <th>Retour souhaité</th>
                    <th>Audit IA</th>
                    <th>Statut</th>
                    <th>Validé le</th>
                    ${isJuridique ? '<th>Affecté par</th>' : ''}
                    <th style="width: 160px;"></th>
                  </tr>
                </thead>
                <tbody id="table-body">
                  <!-- Lignes générées dans _updateDashboard -->
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  /* Moteur de rafraîchissement dynamique pour filtrer les données */
  _updateDashboard() {
    const user = window.AppState.currentUser;
    const isJuridique = user.role === 'juridique';
    const toutesSoumissions = window.AppState.submissions;

    /* Filtrage dynamique selon recherche et filtres de statut */
    let submissionsFiltrees = toutesSoumissions;

    if (this.recherche.trim() !== '') {
      const query = this.recherche.toLowerCase();
      submissionsFiltrees = submissionsFiltrees.filter(sub => 
        sub.titre.toLowerCase().includes(query) || 
        sub.categorie.toLowerCase().includes(query)
      );
    }

    if (this.filtreActif !== 'Tous') {
      const mappingFiltres = {
        'Validé': 'valide',
        'En cours': 'en_cours',
        'À retravailler': 'retravailler'
      };
      const statutCible = mappingFiltres[this.filtreActif];
      submissionsFiltrees = submissionsFiltrees.filter(sub => sub.statut === statutCible);
    }

    /* 1. Mettre à jour les KPIs */
    const kpiHTML = this._renderKPIs(toutesSoumissions, isJuridique);
    document.getElementById('kpi-container').innerHTML = kpiHTML;

    /* 2. Mettre à jour la barre de filtres status */
    const filtersHTML = this._renderFiltersHTML(toutesSoumissions);
    document.getElementById('filter-group').innerHTML = filtersHTML;

    /* 3. Mettre à jour le corps du tableau */
    const tbody = document.getElementById('table-body');
    if (submissionsFiltrees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
             <div class="empty-state" style="padding: 48px 0; text-align: center; color: #6B7280;">
               <div class="empty-state-icon" style="font-size: 32px; margin-bottom: 16px;">📭</div>
               <div class="empty-state-title" style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 4px;">Aucun résultat</div>
               <div class="empty-state-desc" style="font-size: 13px;">Vous n'avez aucune soumission correspondant à ces critères.</div>
             </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = submissionsFiltrees.map(sub => this._renderTableRow(sub, isJuridique)).join('');
    }

    /* 4. Ré-attacher les événements dynamiques (Boutons filtre, KPI, Lignes tableau) */
    this._attachDynamicEvents();
  },

  _renderKPIs(submissions, isJuridique) {
    const total = submissions.length;
    const valides = submissions.filter(s => s.statut === 'valide').length;
    const enCours = submissions.filter(s => s.statut === 'en_cours').length;
    const aRetravailler = submissions.filter(s => s.statut === 'retravailler').length;

    return `
      <div class="metrics-grid" style="display: flex; gap: 16px; margin-bottom: var(--sp-6);">
        <div class="metric-card kpi-clickable" data-filter="Tous" style="cursor: pointer; flex: 1;">
          <div class="metric-icon metric-icon-primary" style="background:#F5F3FF; color:#6B4EFF; border-radius:8px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <div>
            <div class="metric-value">${total}</div>
            <div class="metric-label">Total</div>
          </div>
        </div>
        <div class="metric-card kpi-clickable" data-filter="Validé" style="cursor: pointer; flex: 1;">
          <div class="metric-icon metric-icon-success" style="background:#D1FAE5; color:#059669; border-radius:8px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <div class="metric-value">${valides}</div>
            <div class="metric-label">Validé</div>
          </div>
        </div>
        <div class="metric-card kpi-clickable" data-filter="En cours" style="cursor: pointer; flex: 1;">
          <div class="metric-icon metric-icon-warning" style="background:#FEF3C7; color:#D97706; border-radius:8px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div class="metric-value">${enCours}</div>
            <div class="metric-label">En cours</div>
          </div>
        </div>
        <div class="metric-card kpi-clickable" data-filter="À retravailler" style="cursor: pointer; flex: 1;">
          <div class="metric-icon" style="background:#FEE2E2; color:#DC2626; border-radius:8px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <div class="metric-value">${aRetravailler}</div>
            <div class="metric-label">À retravailler</div>
          </div>
        </div>
      </div>
    `;
  },

  _renderFiltersHTML(submissions) {
    const list = ['Tous', 'Validé', 'En cours', 'À retravailler'];
    const mapKeys = {
      'Validé': 'valide',
      'En cours': 'en_cours',
      'À retravailler': 'retravailler'
    };

    return list.map(f => {
      const activeClass = (this.filtreActif === f) ? 'active' : '';
      let count = submissions.length;
      if (f !== 'Tous') count = submissions.filter(s => s.statut === mapKeys[f]).length;

      return `
        <button class="filter-btn btn-filter ${activeClass}" data-val="${f}">
          ${f} <span class="filter-count">${count}</span>
        </button>
      `;
    }).join('');
  },

  _renderTableRow(sub, isJuridique) {
    const statutDef = STATUT_LABELS[sub.statut] || STATUT_LABELS['attente'];
    
    const currentScore = sub.score_v2 ?? sub.score_v1 ?? sub.analyse?.score ?? sub.analyse?.scoreConformite ?? 100;
    
    let scoreColor = 'var(--color-suggestion)';
    if (currentScore <= 40) scoreColor = 'var(--color-risk-high)';
    else if (currentScore <= 70) scoreColor = 'var(--color-risk-medium)';

    /* Formater une date YYYY-MM-DD en string FR court */
    const formatDateStr = (dateStr) => {
      if (!dateStr) return '';
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
           const mNames = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
           const d = parseInt(parts[0],10); const m = parseInt(parts[1],10); const y = parts[2];
           return `${d} ${mNames[m-1]} ${y}`;
        }
      } else if (dateStr.includes('-')) {
         const mNames = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
         const parts = dateStr.split('-');
         if (parts.length === 3) {
           const d = parseInt(parts[2],10); const m = parseInt(parts[1],10); const y = parts[0];
           return `${d} ${mNames[m-1]} ${y}`;
         }
      }
      return dateStr;
    };

    let formattedDate = formatDateStr(sub.dateShort || sub.creeLe);
    let deadlineDateStr = formatDateStr(sub.deadline);

    let submitter = sub.soumitParLabel || "Camille Fouet (Marketing)";

    return `
      <tr class="table-row-clickable" data-sub-id="${sub.id}">
        <td>
          <div class="cell-title" style="margin-bottom:4px;">
            <span class="cell-title-main" style="max-width: 250px; display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${sub.titre}</span>
            <span class="cell-title-sub">${sub.categorie} · ${sub.pays || 'France'}</span>
          </div>
        </td>
        <td><span class="cell-date">${formattedDate || 'Aujourd\'hui'}</span></td>
        <td>
          ${deadlineDateStr ? `<span style="color:#D97706; font-weight:600; font-size:12px; background:#FEF3C7; padding:4px 8px; border-radius:4px;">⏱ ${deadlineDateStr}</span>` : '<span style="color:#9CA3AF; font-size:12px;">Non précisé</span>'}
        </td>
        <td>
           <span style="display:inline-block; padding:4px 12px; border-radius:100px; background:${currentScore <= 40 ? '#FEE2E2' : currentScore <= 70 ? '#FEF3C7' : '#D1FAE5'}; color:${currentScore <= 40 ? '#991B1B' : currentScore <= 70 ? '#92400E' : '#065F46'}; font-weight:600; font-size:11px;">
             ${sub.version > 1 ? `V${sub.version} : ` : ''}${currentScore <= 40 ? 'Risque Élevé' : currentScore <= 70 ? 'Conforme avec réserve' : 'Conforme'}
           </span>
        </td>
        <td>
          <span class="badge ${statutDef.cssClass}">
             <span style="color: ${statutDef.dotColor || 'inherit'}; margin-right:4px;">●</span> ${statutDef.label}
          </span>
          ${(!isJuridique && sub.statut === 'retravailler' && sub.commentaireJuridique) ? `
            <div style="margin-top: 8px; font-size: 12px; color: var(--color-text-secondary); font-style: italic; max-width: 280px; line-height: 1.4;">
              💬 "${sub.commentaireJuridique}"
            </div>
          ` : ''}
        </td>
        <td><span class="cell-date">${sub.statut === 'valide' ? (sub.dateValidation || 'Récemment') : '-'}</span></td>
        ${isJuridique ? `
        <td>
          <span style="font-size: 13px; color: var(--color-text-secondary);">${submitter}</span>
        </td>
        ` : ''}
        <td class="cell-arrow">
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
            ${(!isJuridique && sub.statut === 'retravailler') ? `
              <button class="btn btn-outline-primary btn-sm btn-retravailler" data-sub-id="${sub.id}" style="padding: 4px 10px; font-size: 11px;">
                ✏️ Modifier et resoumettre
              </button>
            ` : ''}
            ${(isJuridique && sub.statut === 'en_cours') ? `
              <button class="btn-validate" data-sub-id="${sub.id}" style="background:transparent; border:1.5px solid #6B4EFF; color:#6B4EFF; border-radius:6px; padding:6px 14px; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s ease;" onmouseover="this.style.background='#EDE9FE'" onmouseout="this.style.background='transparent'">
                Examiner ce contenu →
              </button>
            ` : ''}
            <span style="color:#9CA3AF; margin-left:4px;">&gt;</span>
          </div>
        </td>
      </tr>
    `;
  },

  /* Initialisation principale */
  async init() {
    /* Recherche & Filtres - Hydratation initiale */
    this.recherche = '';
    this.filtreActif = 'Tous';

    const tbody = document.getElementById('table-body');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--color-text-muted);">Chargement en cours...</td></tr>`;
    }

    const { currentUser } = window.AppState;
    window.AppState.submissions = await window.FirebaseService.fetchSubmissions(currentUser);

    this._updateDashboard();

    /* Events persistants au niveau du conteneur (ne nécessitent pas de re-bind si _updateDashboard change l'HTML parent) */
    
    /* Bouton "Nouvelle validation" */
    document.getElementById('btn-nouvelle-validation')?.addEventListener('click', () => {
      window.navigate('Submission');
    });

    /* Navigation latérale */
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.nav;
        if (action === 'nouvelle') window.navigate('Submission');
        else if (action === 'dashboard') window.navigate('Dashboard');
      });
    });

    /* Input Recherche */
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.recherche = e.target.value;
      this._updateDashboard();
    });
  },

  /* Attache les événements liés aux éléments regénérés dynamiquement */
  _attachDynamicEvents() {
    /* Boutons des filtres */
    document.querySelectorAll('.btn-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filtreActif = btn.dataset.val;
        this._updateDashboard();
      });
    });

    /* Clic sur KPI pour filtrer */
    document.querySelectorAll('.kpi-clickable').forEach(kpi => {
      kpi.addEventListener('click', (e) => {
        this.filtreActif = kpi.dataset.filter;
        this._updateDashboard();
      });
    });

    /* Clic sur une ligne = Navigate vers l'analyse de cette soumission */
    document.querySelectorAll('.table-row-clickable').forEach(tr => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('.btn-retravailler')) return; // ignore si le bouton est cliqué
        
        const subId = tr.dataset.subId;
        const sub = window.AppState.submissions.find(s => s.id === subId);
        if (sub) {
          window.AppState.pendingFormData = {
             estRetravail: true,
             submissionId: sub.id,
             texte: sub.texte,
             categorie: sub.categorie,
             canal: sub.canal,
             imageUrl: sub.imageUrl,
             analyse: sub.analyse,
             version: sub.version || 1
          };
          window.navigate('Results');
        }
      });
    });

    /* Bouton spécifique « Modifier... » */
    document.querySelectorAll('.btn-retravailler').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Évite le clic sur la ligne
        const subId = btn.dataset.subId;
        const sub = window.AppState.submissions.find(s => s.id === subId);
        if (sub) {
          window.AppState.pendingFormData = {
             estRetravail: true,
             submissionId: sub.id,
             texte: sub.texte,
             categorie: sub.categorie,
             canal: sub.canal,
             imageUrl: sub.imageUrl,
             analyse: sub.analyse, /* Prétiré de la mock */
             version: sub.version || 1
          };
          window.navigate('Results');
        }
      });
    });

    /* Bouton spécifique « Valider... » (Juridique) */
    document.querySelectorAll('.btn-validate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const subId = btn.dataset.subId;
        const sub = window.AppState.submissions.find(s => s.id === subId);
        if (sub) {
          window.AppState.pendingFormData = {
             isJuridicalReview: true,
             submissionId: sub.id,
             texte: sub.texte,
             categorie: sub.categorie,
             canal: sub.canal,
             imageUrl: sub.imageUrl,
             analyse: sub.analyse,
             version: sub.version || 1
          };
          window.navigate('Results');
        }
      });
    });
  },

  /* Ouvre la modal de validation pour Isabelle (Juridique) */
  openValidationModal(sub) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>📋 Valider une soumission</h2>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-sub-info">
            <div class="modal-sub-title">${sub.titre}</div>
            <div class="modal-sub-meta">${sub.canal} · ${sub.categorie} · ${sub.dateShort || sub.creeLe}</div>
          </div>
          <div class="modal-sub-text">"${sub.texte}"</div>
          <div class="form-group" style="margin-top:16px;">
            <label class="form-label" for="modal-commentaire">
              Commentaire juridique <span>(optionnel)</span>
            </label>
            <textarea id="modal-commentaire" class="form-textarea"
              placeholder="Ex : Allégations vérifiées. Publication autorisée sous réserve de l'astérisque."
              rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger btn-sm" id="modal-btn-retravailler">⚠️ Demander révision</button>
          <button class="btn btn-success" id="modal-btn-valider">✅ Valider la soumission</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();

    document.getElementById('modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    /* Validation → passe le statut à "valide" */
    document.getElementById('modal-btn-valider').addEventListener('click', () => {
      const commentaire = document.getElementById('modal-commentaire').value.trim();
      sub.statut = 'valide';
      sub.commentaireJuridique = commentaire || '✅ Validé par le service réglementaire.';
      closeModal();
      window.showToast('✅ Soumission validée. L\'équipe marketing est notifiée.');
      this._updateDashboard();
    });

    /* Demande de révision → passe à "retravailler" */
    document.getElementById('modal-btn-retravailler').addEventListener('click', () => {
      const commentaire = document.getElementById('modal-commentaire').value.trim();
      sub.statut = 'retravailler';
      sub.commentaireJuridique = commentaire || '⚠️ Des points doivent être corrigés avant publication.';
      closeModal();
      window.showToast('📝 Révision demandée. L\'équipe marketing est notifiée.');
      this._updateDashboard();
    });
  }
};

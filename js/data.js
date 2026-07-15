'use strict';

/* ===================================================
   data.js — Données fictives réalistes pour la démo
   Toutes les données de démonstration sont centralisées
   dans ce fichier pour faciliter les modifications.
   =================================================== */

/* ----------------------------------------
   PROFILS UTILISATEURS
   Deux profils pour simuler les rôles.
   ---------------------------------------- */
const PROFILS = {
  marketing: {
    id: 'camille',
    prenom: 'Camille',
    nom: 'Fouet',
    role: 'marketing',
    roleLabel: 'Social Media Manager',
    initiales: 'CF',
    couleurAvatar: '#6B4EFF',
    entreprise: 'LumièreCosmetics',
  },
  juridique: {
    id: 'isabelle',
    prenom: 'Isabelle',
    nom: 'Renard',
    role: 'juridique',
    roleLabel: 'Resp. Affaires Réglementaires',
    initiales: 'IR',
    couleurAvatar: '#00C48C',
    entreprise: 'LumièreCosmetics',
  }
};

/* ----------------------------------------
   CATÉGORIES DE PRODUITS COSMÉTIQUES
   ---------------------------------------- */
const CATEGORIES = [
  'Soin anti-âge',
  'Soin hydratation',
  'Soin naturel/bio',
  'Soin solaire',
  'Maquillage',
  'Parfum',
  'Capillaire',
  'Corps & Bain',
  'Contour des yeux',
  'Sérum & Actifs',
];

/* ----------------------------------------
   CANAUX DE DIFFUSION
   ---------------------------------------- */
const CANAUX = [
  'Instagram',
  'TikTok',
  'Pinterest',
  'Facebook',
  'LinkedIn',
  'YouTube',
  'Site e-commerce',
  'Emailing',
  'Presse / Print',
];

/* ----------------------------------------
   SOUMISSIONS FICTIVES PRÉ-EXISTANTES
   Elles s'affichent dans le dashboard dès
   l'arrivée sur l'application.
   ---------------------------------------- */
const SOUMISSIONS_INITIALES = [
  {
    id: 'sub-001',
    titre: 'Post Instagram',
    texte: 'Sérum anti-âge. Produit miraculeux garanti à 100%.', // texte pour analyse si besoin
    categorie: 'Cosmétique',
    canal: 'Instagram', 
    statut: 'retravailler',
    risque: 'Élevé',
    pays: 'France',
    dateShort: '12 avr. 2026',
    creeLe: 'Il y a 9 jours',
    marque: 'LumièreCosmetics',
    commentaireJuridique: 'Contenu refusé suite à l\'analyse de risque élevé.',
    imageUrl: null,
    soumisParRole: 'marketing',
  },
  {
    id: 'sub-002',
    titre: 'Campagne SPF 50+',
    texte: 'Étui 2026. L\'écran solaire indispensable cet été.',
    categorie: 'Dermo-cosmétique',
    canal: 'Print',
    statut: 'valide',
    risque: 'Faible',
    pays: 'Allemagne',
    dateShort: '11 avr. 2026',
    creeLe: 'Il y a 7 jours',
    marque: 'LumièreCosmetics',
    commentaireJuridique: 'Allégations vérifiées. Publication autorisée.',
    imageUrl: null,
    soumisParRole: 'marketing',
  },
  {
    id: 'sub-003',
    titre: 'Post TikTok',
    texte: 'Crème hydratante. Un peu de texte pour l\'exemple.',
    categorie: 'Cosmétique',
    canal: 'TikTok',
    statut: 'en_cours',
    risque: 'Modéré',
    pays: 'Italie',
    dateShort: '10 avr. 2026',
    creeLe: 'Il y a 5 jours',
    marque: 'LumièreCosmetics',
    commentaireJuridique: '',
    imageUrl: null,
    soumisParRole: 'marketing',
  },
  {
    id: 'sub-004',
    titre: 'Newsletter',
    texte: 'Contour des yeux. Efface définitivement les cernes.',
    categorie: 'Dermo-cosmétique',
    canal: 'Emailing',
    statut: 'retravailler',
    risque: 'Faible',
    pays: 'Espagne',
    dateShort: '09 avr. 2026',
    creeLe: 'Il y a 3 jours',
    marque: 'LumièreCosmetics',
    commentaireJuridique: '⚠️ Reformulation nécessaire pour éviter la promesse absolue.',
    imageUrl: null,
    soumisParRole: 'marketing',
    version: 1,
    historiqueVersions: [],
  },
];

/* ----------------------------------------
   CONTENU EXEMPLE PRÉ-CHARGÉ
   Texte, catégorie et canal du mode "Essai rapide".
   L'image est chargée depuis /assets/demo-serum.png
   ---------------------------------------- */
const DEMO_CONTENU = {
  marque: 'certo',
  texte: 'Notre sérum anti-âge efface les rides en 7 jours. Résultats garantis à 100%. Rajeunit visiblement votre peau.',
  categorie: 'Soin anti-âge',
  canal: 'Instagram',
  imageUrl: 'assets/demo-serum.png',
};

/* ----------------------------------------
   ANALYSE SIMULÉE
   Utilisée lorsque le mode demo est actif
   ou si aucune clé API n'est fournie.
   ---------------------------------------- */
const ANALYSE_SIMULEE = {
  score: 32,
  problemes: [
    {
      phrase: 'efface les rides',
      severite: 'Élevé',
      explication: 'Le terme "efface" constitue une allégation absolue et permanente. Aucun produit cosmétique ne peut prétendre à un effet d’effacement total des rides.',
      reglement: 'Règlement UE 655/2013 — Critère 3',
      reformulations: [
        'aide à réduire l’apparence des rides dès 7 jours*',
        'atténue les signes visibles du vieillissement',
        'aide à diminuer les rides d’expression'
      ]
    },
    {
      phrase: 'Résultats garantis à 100%',
      severite: 'Élevé',
      explication: 'Une promesse de résultats garantis est une allégation absolue interdite sans preuve clinique publiée et validée.',
      reglement: 'Recommandations ARPP Beauté-Hygiène',
      reformulations: [
        'des résultats visibles dès 4 semaines*',
        'efficacité prouvée par test consommateurs',
        'testé et approuvé par un panel de 50 femmes'
      ]
    },
    {
      phrase: 'en 7 jours',
      severite: 'Modéré',
      explication: 'Un délai d\'action court sans étude clinique mentionnée contrevient à l’obligation de preuve.',
      reglement: 'Règlement UE 655/2013 — Critère 3',
      reformulations: [
        'dès les premières applications*',
        'en quelques semaines d\'utilisation',
        'avec une application régulière'
      ]
    }
  ],
  points_positifs: [
    "Présence d'acides hyaluroniques mentionnée comme ingrédient actif sans surpromesse.",
    "Bénéfice global d'hydratation bien cadré par sa nature cosmétique."
  ],
  temps_economise: "Env. 0.5 jour",
  tempsAnalyse: '2,4s',
  referentielsConsultes: ['CE 1223/2009', 'ARPP Beauté-Hygiène', 'DGCCRF 2023'],
};

/* Attache l'analyse fictive à toutes les soumissions initiales pour que le clic sur la ligne fonctionne partout */
SOUMISSIONS_INITIALES.forEach(s => s.analyse = ANALYSE_SIMULEE);

/* ----------------------------------------
   LABELS D'AFFICHAGE DES STATUTS
   ---------------------------------------- */
const STATUT_LABELS = {
  valide:      { label: 'Validé',         emoji: '✅', cssClass: 'status-valide',    dotColor: '#00C48C' },
  en_cours:    { label: 'En cours',       emoji: '🔵', cssClass: 'status-en-cours',  dotColor: '#FF8C00' /* Orange */ },
  refuse:      { label: 'Refusé',         emoji: '🔴', cssClass: 'status-refuse',    dotColor: '#FF4444' },
  attente:     { label: 'En attente',     emoji: '⚪', cssClass: 'status-attente',   dotColor: '#A0A0B8' /* Gris */ },
  retravailler:{ label: 'À retravailler', emoji: '🔴', cssClass: 'status-retravailler',dotColor: '#8B0000' /* Rouge foncé */ },
};

/* ----------------------------------------
   NAVIGATION LATÉRALE (items du menu)
   ---------------------------------------- */
const NAV_MARKETING = [
  { id: 'dashboard',  icone: '▦',  label: 'Tableau de bord' },
  { id: 'nouvelle',   icone: '＋',  label: 'Nouvelle validation' },
];

const NAV_JURIDIQUE = [
  { id: 'dashboard',  icone: '▦',  label: 'File de validation' },
];

/* ----------------------------------------
   MESSAGES TOAST
   Messages de retour utilisateur
   ---------------------------------------- */
const TOAST_MESSAGES = {
  envoiJuridique: '📨 Envoyé au service juridique avec succès.',
  validation:     '✅ Soumission validée et notifiée.',
  commentaire:    '💬 Commentaire ajouté.',
  copie:          '📋 Texte copié dans le presse-papier.',
};

// knowledge_base_complements.js
// Module “Compléments alimentaires” pour Compl-IA
// Ce fichier est strictement indépendant de knowledge_base.js (cosmétiques).

// =============================================================================
// 1. LEXIQUE_INTERDITS_COMPLEMENTS
// Termes et patterns à surveiller, avec gravité, règle et action.
// =============================================================================

window.LEXIQUE_INTERDITS_COMPLEMENTS = [
  // -------------------------
  // Allégations thérapeutiques (interdiction absolue)
  // -------------------------
  {
    terme: "guérit",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "soigne",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "traite",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "prévient",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "prévient le cancer",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – allégation de réduction de risque de maladie non autorisée",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "prévient les maladies cardiovasculaires",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – allégation de réduction de risque de maladie non autorisée",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "réduit le risque de diabète",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – allégation de réduction de risque de maladie non autorisée",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "réduit le risque d'hypertension",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – allégation de réduction de risque de maladie non autorisée",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "combat l'arthrose",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "lutte contre la dépression",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "protège contre les infections",
    gravite: 10,
    regle: "Règlement (CE) 1924/2006 – interdiction des allégations thérapeutiques",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },
  {
    terme: "évite la prise de poids",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – allégation de contrôle du poids non autorisée sous cette forme",
    action: "BLOQUER IMMÉDIAT",
    categorie: "therapeutique"
  },

  // -------------------------
  // Mentions de pathologies (risque fort de claim thérapeutique)
  // -------------------------
  {
    terme: "cancer",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "diabète",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "hypertension",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "cholestérol",
    gravite: 8,
    regle: "Règlement (CE) 1924/2006 – mention de facteur de risque, à reformuler avec allégation autorisée",
    action: "AVIS + REFORMULATION",
    categorie: "maladie"
  },
  {
    terme: "maladie cardiaque",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "ostéoporose",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "dépression",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "anxiété",
    gravite: 8,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "arthrose",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },
  {
    terme: "douleurs articulaires chroniques",
    gravite: 9,
    regle: "Règlement (CE) 1924/2006 – mention de pathologie, risque d'allégation thérapeutique",
    action: "BLOQUER IMMÉDIAT",
    categorie: "maladie"
  },

  // -------------------------
  // Termes vagues / marketing excessif
  // -------------------------
  {
    terme: "100% naturel",
    gravite: 6,
    regle: "DGCCRF – allégation potentiellement trompeuse si non justifiée",
    action: "AVIS + REFORMULATION",
    categorie: "trompeur"
  },
  {
    terme: "détox",
    gravite: 7,
    regle: "DGCCRF / ARPP – allégation vague et potentiellement trompeuse",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "détoxifie",
    gravite: 7,
    regle: "DGCCRF – allégation vague et potentiellement trompeuse",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "brûle-graisse",
    gravite: 7,
    regle: "DGCCRF – allégation potentiellement trompeuse sur la perte de poids",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "brûle les graisses",
    gravite: 7,
    regle: "DGCCRF – allégation potentiellement trompeuse sur la perte de poids",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "coupe-faim",
    gravite: 7,
    regle: "DGCCRF – allégation potentiellement trompeuse sur la perte de poids",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "miracle",
    gravite: 6,
    regle: "Règlement (CE) 1924/2006 – allégation exagérée et non étayée",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "résultat garanti",
    gravite: 5,
    regle: "Règlement (CE) 1924/2006 – promesse de résultat absolu non étayée",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "scientifiquement prouvé",
    gravite: 5,
    regle: "Règlement (CE) 1924/2006 – mention de preuve sans référence précise",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "cliniquement prouvé",
    gravite: 5,
    regle: "Règlement (CE) 1924/2006 – mention de preuve sans référence précise",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "perte de poids rapide",
    gravite: 7,
    regle: "DGCCRF – allégation de perte de poids potentiellement trompeuse",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },
  {
    terme: "maigrir vite",
    gravite: 7,
    regle: "DGCCRF – allégation de perte de poids potentiellement trompeuse",
    action: "AVIS + REFORMULATION",
    categorie: "vague"
  },

  // -------------------------
  // Plantes – allégations "on hold" (à vérifier)
  // -------------------------
  {
    terme: "curcuma",
    gravite: 5,
    regle: "Allégations sur plantes en statut « on hold » EFSA – à vérifier selon la formulation",
    action: "A VÉRIFIER",
    categorie: "plante_on_hold"
  },
  {
    terme: "ginseng",
    gravite: 5,
    regle: "Allégations sur plantes en statut « on hold » EFSA – à vérifier selon la formulation",
    action: "A VÉRIFIER",
    categorie: "plante_on_hold"
  },
  {
    terme: "guarana",
    gravite: 5,
    regle: "Allégations sur plantes en statut « on hold » EFSA – à vérifier selon la formulation",
    action: "A VÉRIFIER",
    categorie: "plante_on_hold"
  },
  {
    terme: "millepertuis",
    gravite: 6,
    regle: "Allégations sur plantes en statut « on hold » EFSA – à vérifier (interactions médicamenteuses)",
    action: "A VÉRIFIER",
    categorie: "plante_on_hold"
  },
  {
    terme: "garcinia cambogia",
    gravite: 8,
    regle: "DGCCRF / ANSES – ingrédient interdit en France depuis avril 2025",
    action: "BLOQUER IMMÉDIAT",
    categorie: "ingredient_interdit"
  }
];

// =============================================================================
// 2. GRILLE_SCORING_COMPLEMENTS
// Règles de calcul de criticité pour l'IA.
// =============================================================================

window.GRILLE_SCORING_COMPLEMENTS = {
  regles: {
    therapeutic_claim: {
      description: "Allégation suggérant la prévention, le traitement ou la guérison d'une maladie.",
      motsCles: [
        "guérit", "soigne", "traite", "prévient", "protège contre",
        "réduit le risque de", "évite", "combat", "lutte contre"
      ],
      score: 10,
      niveau: "CRITIQUE",
      message: "Allégation thérapeutique interdite pour les compléments alimentaires."
    },
    maladie_explicite: {
      description: "Mention directe d'une pathologie (cancer, diabète, etc.).",
      motsCles: [
        "cancer", "diabète", "hypertension", "arthrose", "dépression",
        "maladie cardiaque", "ostéoporose", "anxiété", "douleurs articulaires chroniques"
      ],
      score: 9,
      niveau: "CRITIQUE",
      message: "Mention de pathologie : risque fort d'allégation thérapeutique ou de réduction de risque de maladie non autorisée."
    },
    reduction_risque_maladie_non_autorisee: {
      description: "Allégation de réduction de risque de maladie non formulée selon le registre UE.",
      motsCles: [
        "réduit le risque de", "prévient", "évite", "protège contre"
      ],
      score: 10,
      niveau: "CRITIQUE",
      message: "Allégation de réduction de risque de maladie non autorisée sous cette forme."
    },
    plante_on_hold: {
      description: "Allégation portant sur une plante (statut « on hold » EFSA).",
      motsCles: [
        "curcuma", "ginseng", "guarana", "millepertuis", "rhodiola", "ashwagandha"
      ],
      score: 6,
      niveau: "A_VÉRIFIER",
      message: "Allégation sur plante : statut « on hold » EFSA. À faire valider par un juriste."
    },
    terme_vague: {
      description: "Terme marketing vague ou potentiellement trompeur.",
      motsCles: [
        "détox", "détoxifie", "brûle-graisse", "brûle les graisses",
        "coupe-faim", "miracle", "résultat garanti",
        "scientifiquement prouvé", "cliniquement prouvé",
        "perte de poids rapide", "maigrir vite"
      ],
      score: 5,
      niveau: "AVIS",
      message: "Terme marketing vague ou potentiellement trompeur. Vérifier la justification scientifique."
    },
    promesse_excessive: {
      description: "Promesse de résultat absolu, sans nuance.",
      motsCles: [
        "garanti", "100% efficace", "infaillible", "à tous les coups"
      ],
      score: 6,
      niveau: "AVIS",
      message: "Promesse de résultat absolu. Ajouter des nuances et des conditions d'usage."
    },
    ingredient_interdit: {
      description: "Ingrédient interdit ou fortement restreint (ex. : Garcinia cambogia).",
      motsCles: [
        "garcinia cambogia"
      ],
      score: 10,
      niveau: "CRITIQUE",
      message: "Ingrédient interdit ou fortement restreint en France / UE."
    }
  }
};

// =============================================================================
// 3. REFORMULATIONS_COMPLEMENTS
// Exemples "Avant / Après" pour guider l'IA dans ses propositions.
// =============================================================================

window.REFORMULATIONS_COMPLEMENTS = [
  {
    avant: "Ce complément guérit l'arthrose.",
    apres: "Ce complément contribue au confort articulaire.*",
    regle: "Interdiction des allégations thérapeutiques – Règlement (CE) 1924/2006"
  },
  {
    avant: "Soigne la dépression.",
    apres: "Contribue à une humeur équilibrée.*",
    regle: "Interdiction des allégations thérapeutiques – Règlement (CE) 1924/2006"
  },
  {
    avant: "Prévient les maladies cardiovasculaires.",
    apres: "Les stérols végétaux réduisent le taux de cholestérol, facteur de risque dans l'apparition de maladies cardiaques coronariennes.*",
    regle: "Utiliser uniquement les allégations autorisées du registre UE (art. 14)."
  },
  {
    avant: "Réduit le risque de diabète.",
    apres: "Contribue à maintenir une glycémie normale dans le cadre d'une alimentation équilibrée.*",
    regle: "Éviter les allégations de réduction de risque de maladie non autorisées."
  },
  {
    avant: "Brûle-graisse miracle.",
    apres: "Contribue à augmenter l'oxydation des acides gras dans le cadre d'un régime équilibré.*",
    regle: "Éviter les termes marketing excessifs ; privilégier des allégations autorisées et précises."
  },
  {
    avant: "Détoxifie votre corps.",
    apres: "Aide à soutenir les fonctions naturelles d'élimination de l'organisme.*",
    regle: "DGCCRF – éviter les allégations vagues comme « détox »."
  },
  {
    avant: "Coupe-faim puissant.",
    apres: "Contribue à augmenter la sensation de satiété dans le cadre d'un régime hypocalorique.*",
    regle: "Éviter les allégations de type « coupe-faim » ; privilégier des formulations mesurées."
  },
  {
    avant: "Perte de poids rapide garantie.",
    apres: "Peut contribuer à une perte de poids progressive dans le cadre d'un régime équilibré et d'une activité physique régulière.*",
    regle: "Éviter les promesses de résultat absolu et les formulations excessives."
  },
  {
    avant: "Combat l'anxiété.",
    apres: "Contribue à une sensation de calme et de détente.*",
    regle: "Interdiction des allégations thérapeutiques – Règlement (CE) 1924/2006"
  },
  {
    avant: "Lutte contre les douleurs articulaires chroniques.",
    apres: "Contribue au confort et à la mobilité articulaire.*",
    regle: "Interdiction des allégations thérapeutiques – Règlement (CE) 1924/2006"
  }
];

// =============================================================================
// 4. ALEGATIONS_AUTORISEES_COMPLEMENTS
// Starter pack d'allégations autorisées (Règlement (UE) 432/2012 + registre UE).
// =============================================================================

window.ALEGATIONS_AUTORISEES_COMPLEMENTS = [
  // -------------------------
  // Vitamines
  // -------------------------
  {
    substance: "vitamine A",
    claim: "contribue au maintien d'une vision normale",
    reference: "Règlement (UE) 432/2012 – liste des allégations autorisées (art. 13)"
  },
  {
    substance: "vitamine A",
    claim: "joue un rôle dans le fonctionnement normal du système immunitaire",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine C",
    claim: "contribue au fonctionnement normal du système immunitaire",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine C",
    claim: "contribue à protéger les cellules contre le stress oxydatif",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine C",
    claim: "contribue à réduire la fatigue",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine D",
    claim: "contribue au maintien d'une ossature normale",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine D",
    claim: "contribue au maintien d'une fonction musculaire normale",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine D",
    claim: "contribue au fonctionnement normal du système immunitaire",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine E",
    claim: "contribue à protéger les cellules contre le stress oxydatif",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine B1",
    claim: "contribue au fonctionnement normal du cœur",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine B6",
    claim: "contribue au fonctionnement normal du système immunitaire",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine B6",
    claim: "contribue à réguler l'activité hormonale",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine B12",
    claim: "contribue au fonctionnement normal du système nerveux",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "vitamine B12",
    claim: "contribue à réduire la fatigue",
    reference: "Règlement (UE) 432/2012"
  },

  // -------------------------
  // Minéraux
  // -------------------------
  {
    substance: "magnésium",
    claim: "contribue à réduire la fatigue",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "magnésium",
    claim: "contribue à un fonctionnement musculaire normal",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "magnésium",
    claim: "contribue à un fonctionnement normal du système nerveux",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "calcium",
    claim: "contribue au maintien d'une ossature normale",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "calcium",
    claim: "contribue au maintien d'une fonction musculaire normale",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "fer",
    claim: "contribue au fonctionnement cognitif normal",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "fer",
    claim: "contribue au fonctionnement normal du système immunitaire",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "fer",
    claim: "contribue à la formation normale de globules rouges et d'hémoglobine",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "zinc",
    claim: "contribue au fonctionnement normal du système immunitaire",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "zinc",
    claim: "contribue au maintien d'une vision normale",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "iode",
    claim: "contribue au fonctionnement normal du système nerveux",
    reference: "Règlement (UE) 432/2012"
  },
  {
    substance: "iode",
    claim: "contribue à une fonction cognitive normale",
    reference: "Règlement (UE) 432/2012"
  },

  // -------------------------
  // Autres substances / allégations art. 14 (réduction de risque)
  // -------------------------
  {
    substance: "stérols végétaux",
    claim: "réduisent le taux de cholestérol, facteur de risque dans l'apparition de maladies cardiaques coronariennes",
    reference: "Règlement (UE) 432/2012 – allégation de réduction de risque de maladie (art. 14)"
  }
];

// =============================================================================
// 5. SCORE_LEGENDE_COMPLEMENTS
// Code couleur pour l'UI (Vert / Orange / Rouge).
// =============================================================================

window.SCORE_LEGENDE_COMPLEMENTS = {
  0: { niveau: "Autorisé", couleur: "#22c55e" },
  5: { niveau: "Avis", couleur: "#f59e0b" },
  8: { niveau: "À vérifier", couleur: "#f97316" },
  10: { niveau: "Critique", couleur: "#ef4444" }
};

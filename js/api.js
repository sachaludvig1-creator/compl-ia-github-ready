'use strict';

/* ===================================================
   api.js — Connexion à l'API Anthropic Claude Pure Fetch (No Modules)
   =================================================== */

window.buildSystemPrompt = function(typeProduit, paysSelectionnes = "France", brandRules = "") {
  let prompt = "";
  const kb = window;

  if (typeProduit === "complement") {
    const lexique = kb.LEXIQUE_INTERDITS_COMPLEMENTS;
    const grille = kb.GRILLE_SCORING_COMPLEMENTS;
    const reformulations = kb.REFORMULATIONS_COMPLEMENTS;
    const alegations = kb.ALEGATIONS_AUTORISEES_COMPLEMENTS;

    prompt = `Tu es un expert en réglementation européenne des compléments alimentaires (Règlement 1924/2006, Directive 2002/46/CE, Règlement 432/2012, EU Register of Nutrition and Health Claims, cadre français DGCCRF / DGAL / ANSES).
Ta mission est d'analyser des contenus marketing pour vérifier la conformité des allégations relatives aux compléments alimentaires et proposer, si nécessaire, des reformulations conformes.

Marchés ciblés : ${paysSelectionnes}.

Contraintes fortes :
- Tu dois t'appuyer exclusivement sur le référentiel fourni dans ce prompt.
- Tu ne dois jamais inventer de règles en dehors de ce référentiel.
- En cas de doute, tu dois privilégier la prudence et signaler le claim comme "à vérifier par un juriste".\n`;

    try {
      prompt += `\nLEXIQUE DES TERMES INTERDITS :\n${JSON.stringify(lexique || {}, null, 2)}\n`;
      prompt += `\nGRILLE DE SCORING :\n${JSON.stringify(grille || {}, null, 2)}\n`;
      prompt += `\nEXEMPLES DE REFORMULATIONS :\n${JSON.stringify(reformulations || {}, null, 2)}\n`;
      prompt += `\nALLÉGATIONS AUTORISÉES :\n${JSON.stringify(alegations || {}, null, 2)}\n`;
    } catch(e) { console.warn("Erreur JSON kb compléments", e); }
  } else {
    const lexique = kb.LEXIQUE_INTERDITS;
    const grille = kb.GRILLE_SCORING;
    const reformulations = kb.REFORMULATIONS;

    prompt = `Tu es un expert en réglementation cosmétique européenne (Règlement 655/2013, Règlement 1223/2009, Recommandation ARPP v8, ISO 16128, doctrine DGCCRF).
Ta mission est d'analyser des contenus marketing pour vérifier la conformité des allégations cosmétiques et proposer, si nécessaire, des reformulations conformes.

Marchés ciblés : ${paysSelectionnes}.

Contraintes fortes :
- Tu dois t'appuyer exclusivement sur le référentiel fourni dans ce prompt.
- Tu ne dois jamais inventer de règles en dehors de ce référentiel.
- En cas de doute, tu dois privilégier la prudence et signaler le claim comme "à vérifier par un juriste".\n`;

    try {
      prompt += `\nLEXIQUE DES TERMES INTERDITS :\n${JSON.stringify(lexique || {}, null, 2)}\n`;
      prompt += `\nGRILLE DE SCORING :\n${JSON.stringify(grille || {}, null, 2)}\n`;
      prompt += `\nEXEMPLES DE REFORMULATIONS :\n${JSON.stringify(reformulations || {}, null, 2)}\n`;
    } catch(e) { console.warn("Erreur JSON kb cosmetiques", e); }
  }

  if (brandRules) {
    prompt += `\nRègles internes de la marque (À RESPECTER STRICTEMENT) :\n${brandRules}\n`;
  }

  prompt += `\nTâche à réaliser :
Pour chaque claim soumis :
1. Détecter les termes et patterns présents dans le lexique et la grille.
2. Renvoyer UNIQUEMENT un JSON valide avec cette structure exacte, sans texte avant ni après :
{
  "score": number (0-100),
  "problemes": [
    {
      "phrase": "portion de texte problématique",
      "severite": "Élevé" | "Modéré" | "Avis",
      "explication": "pourquoi c'est problématique",
      "reglement": "source réglementaire exacte",
      "reformulations": ["reformulation 1 conforme"]
    }
  ],
  "points_positifs": ["ce qui est conforme"],
  "temps_economise": "estimation"
}`;
  return prompt;
};

window.analyserClaim = async function({ texte, typeProduit, categorie, canal, pays }) {
  const paysSelectionnes = pays || "France";
  const brandRules = localStorage.getItem('complia_brand_rules') || '';
  const PROMPT_SYSTEME_DYNAMIQUE = window.buildSystemPrompt(typeProduit, paysSelectionnes, brandRules);

  const promptUtilisateur = `Analyse ce contenu :\nTexte : "${texte}"\nCatégorie produit : ${categorie || 'N/A'}\nCanal de diffusion : ${canal || 'N/A'}`;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: PROMPT_SYSTEME_DYNAMIQUE,
        messages: [{ role: "user", content: promptUtilisateur }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(()=>({}));
      throw new Error(errData?.error?.message || \`HTTP \${response.status}\`);
    }

    const data = await response.json();
    const contenuTexte = data.content[0].text;
    
    try {
      const resultat = JSON.parse(contenuTexte);
      resultat.tempsAnalyse = '~2s';
      resultat.sourceAnalyse = 'claude';
      return resultat;
    } catch(e) {
      const matchJSON = contenuTexte.match(/\\{[\\s\\S]*\\}/);
      if (matchJSON) return JSON.parse(matchJSON[0]);
      throw new Error('Impossible de parser JSON');
    }
  } catch (erreur) {
    throw erreur;
  }
};

window.simulerAnalyse = function() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
         score: 85,
         problemes: [
           { 
             phrase: "en 7 jours", 
             severite: "Modéré", 
             explication: "Délai d'action sans preuve", 
             reglement: "Règlement UE 655/2013", 
             reformulations: ["dès les premières applications"] 
           }
         ],
         points_positifs: ["Bonne structure"],
         temps_economise: "Env. 0.5 jour"
      });
    }, 1500);
  });
};

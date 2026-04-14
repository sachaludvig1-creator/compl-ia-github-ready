'use strict';

/* ===================================================
   api.js — Connexion à l'API Anthropic Claude Pure Fetch (No Modules)
   =================================================== */

window.analyserClaim = async function(texte, categorie, canal, apiKey) {
  let PROMPT_SYSTEME_DYNAMIQUE = `Tu es un expert en réglementation cosmétique européenne.\nTu analyses des contenus marketing uniquement sur la base de ce référentiel officiel Compl-IA v1.0 :\n\n`;
  try {
    const kb = window;
    PROMPT_SYSTEME_DYNAMIQUE += `LEXIQUE DES TERMES INTERDITS (détection automatique) :\n${JSON.stringify(kb.LEXIQUE_INTERDITS || {}, null, 2)}\n\n`;
    PROMPT_SYSTEME_DYNAMIQUE += `GRILLE DE SCORING (règles de calcul) :\n${JSON.stringify(kb.GRILLE_SCORING || {}, null, 2)}\n\n`;
    PROMPT_SYSTEME_DYNAMIQUE += `EXEMPLES DE REFORMULATIONS CONFORMES (few-shot) :\n${JSON.stringify(kb.REFORMULATIONS || {}, null, 2)}\n\n`;
  } catch (e) {
    console.warn('[Compl-IA] Erreur construction Knowledge Base', e);
  }

  PROMPT_SYSTEME_DYNAMIQUE += `Pour chaque analyse, retourne UNIQUEMENT un JSON valide avec cette structure exacte, sans texte avant ni après :
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

  const promptUtilisateur = `Analyse ce contenu cosmétique :\nTexte : "${texte}"\nCatégorie produit : ${categorie}\nCanal de diffusion : ${canal}`;

  try {
    // Appel sécurisé vers la Fonction Serverless interne (qui gère secrètement la clé API)
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: PROMPT_SYSTEME_DYNAMIQUE,
        messages: [{ role: "user", content: promptUtilisateur }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(()=>({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const contenuTexte = data.content[0].text;
    
    try {
      const resultat = JSON.parse(contenuTexte);
      resultat.tempsAnalyse = '~2s';
      resultat.sourceAnalyse = 'claude';
      return resultat;
    } catch(e) {
      const matchJSON = contenuTexte.match(/\{[\s\S]*\}/);
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

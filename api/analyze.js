export const config = {
  runtime: 'edge', // Déploiement optimal et plus rapide
};

export default async function handler(req) {
  // Gestion du CORS Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();

    // Lecture sécurisée de la clé depuis l'environnement serveur !
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'Clé API Anthropic non configurée sur le serveur.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Appel direct, caché et sécurisé vers Anthropic
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!anthropicResponse.ok) {
      console.warn("[Compl-IA] L'API Anthropic a échoué (Status " + anthropicResponse.status + "). Bascule automatique vers OpenAI...");
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      
      if (!OPENAI_API_KEY) {
        const errData = await anthropicResponse.json().catch(() => ({}));
        return new Response(JSON.stringify({ error: errData, message: "Fallback impossible: Clé OpenAI manquante" }), {
          status: anthropicResponse.status,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Construction du payload pour OpenAI à partir des données formatées pour Anthropic
      const openAiBody = {
        model: "gpt-5.4", // Modèle robuste 2026 pour l'analyse légale
        temperature: body.temperature || 0.1,
        messages: [
          { role: "system", content: body.system || "" },
          ...body.messages
        ],
        response_format: { type: "json_object" }
      };

      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(openAiBody)
      });

      if (!openAiResponse.ok) {
         const openAiErr = await openAiResponse.json().catch(() => ({}));
         return new Response(JSON.stringify({ error: "Les deux API (Anthropic et OpenAI) ont échoué", details: openAiErr }), {
           status: 502,
           headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
         });
      }

      const openAiData = await openAiResponse.json();
      const contentText = openAiData.choices?.[0]?.message?.content || "{}";
      
      // "Déguisement" de la réponse pour qu'elle ait la forme d'un objet Anthropic pour le Frontend
      const dataFormatAnthropic = {
        content: [
          { type: "text", text: contentText }
        ],
        fallback_used: "openai" // Petit tag pour nos logs internes
      };

      return new Response(JSON.stringify(dataFormatAnthropic), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const data = await anthropicResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (erreur) {
    console.error("Erreur Serverless API:", erreur);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur', details: erreur.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

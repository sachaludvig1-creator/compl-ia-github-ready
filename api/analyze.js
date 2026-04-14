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
      const errData = await anthropicResponse.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: errData }), {
        status: anthropicResponse.status,
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

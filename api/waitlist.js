export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, plan } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email manquant' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: 'Configuration manquante du serveur email.' });
  }

  const planName = plan === 'premium' ? 'Premium (Accès Prioritaire)' : 'Gratuit';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Compl-IA <onboarding@resend.dev>',
        to: [email],
        subject: 'Merci pour votre intérêt pour Compl-IA',
        html: `<div style="font-family:sans-serif; color:#374151; max-width:600px; margin:0 auto; padding:20px;">
                 <h2 style="color:#1A1830;">Bonjour,</h2>
                 <p>Merci pour votre intérêt pour Compl-IA et pour le plan <strong>${planName}</strong>.</p>
                 <p>Votre accès anticipé a bien été pris en compte. Nous vous contacterons dès l’ouverture officielle de la plateforme.</p>
                 <p>En attendant, nous continuons à améliorer Compl-IA afin de proposer une expérience pensée pour les équipes marketing et social media des marques cosmétiques.</p>
                 <br>
                 <p>À très bientôt,<br><strong>L’équipe Compl-IA</strong></p>
                 <hr style="border:none; border-top:1px solid #E5E7EB; margin-top:30px; margin-bottom:15px;">
                 <p style="font-size:12px; color:#9CA3AF;">Ceci est un email automatique de votre plateforme Compl-IA.</p>
               </div>`
      })
    });

    const data = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(response.status).json({ success: false, error: data });
    }
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: error.message });
  }
}

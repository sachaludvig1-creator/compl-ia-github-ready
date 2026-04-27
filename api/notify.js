export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message } = req.body;

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: 'Configuration manquante du serveur email.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Compl-IA <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: `<div style="font-family:sans-serif; color:#374151;">
                 <h2>Notification Compl-IA</h2>
                 <p>${message.replace(/\n/g, '<br>')}</p>
                 <br>
                 <hr style="border:none; border-top:1px solid #E5E7EB;">
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

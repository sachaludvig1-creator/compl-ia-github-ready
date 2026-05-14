export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, prenom, entreprise, daysSinceActive } = req.body;

  const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compl-IA vous attend</title>
</head>
<body style="margin:0; padding:0; background:#0F172A; 
  font-family: -apple-system, BlinkMacSystemFont, 
  'Segoe UI', sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" 
    style="background:#0F172A; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="max-width:560px; width:100%;">
          
          <!-- Logo -->
          <tr>
            <td style="padding-bottom: 32px; text-align: center;">
              <div style="display:inline-flex; align-items:center; 
                gap:10px; background:#1E293B; 
                border-radius:12px; padding:12px 20px;">
                <div style="width:32px; height:32px; 
                  background:#6B4EFF; border-radius:8px;
                  display:flex; align-items:center; 
                  justify-content:center; color:white; 
                  font-weight:700; font-size:14px;">IA</div>
                <span style="color:white; font-size:16px; 
                  font-weight:600;">Compl-IA</span>
              </div>
            </td>
          </tr>

          <!-- Card principale -->
          <tr>
            <td style="background:#1E293B; border-radius:16px; 
              padding:40px; border:1px solid #334155;">
              
              <!-- Headline -->
              <p style="color:#94A3B8; font-size:13px; 
                font-weight:500; letter-spacing:0.05em;
                text-transform:uppercase; margin:0 0 12px;">
                Vos analyses vous attendent
              </p>
              
              <h1 style="color:#F8FAFC; font-size:24px; 
                font-weight:700; margin:0 0 16px; 
                line-height:1.3;">
                Bonjour ${prenom} 👋<br>
                Ça fait ${daysSinceActive} jours.
              </h1>
              
              <p style="color:#94A3B8; font-size:15px; 
                line-height:1.6; margin:0 0 28px;">
                Vos contenus marketing méritent une vérification 
                réglementaire avant publication. Compl-IA analyse 
                vos claims en quelques secondes et vous évite 
                des allers-retours coûteux avec le juridique.
              </p>

              <!-- Stats visuelles -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-bottom:28px;">
                <tr>
                  <td width="33%" style="text-align:center; 
                    background:#0F172A; border-radius:10px; 
                    padding:16px 8px; border:1px solid #334155;">
                    <div style="color:#6B4EFF; font-size:22px; 
                      font-weight:700;">~8s</div>
                    <div style="color:#64748B; font-size:11px; 
                      margin-top:4px;">par analyse</div>
                  </td>
                  <td width="4%"></td>
                  <td width="33%" style="text-align:center; 
                    background:#0F172A; border-radius:10px; 
                    padding:16px 8px; border:1px solid #334155;">
                    <div style="color:#6B4EFF; font-size:22px; 
                      font-weight:700;">-80%</div>
                    <div style="color:#64748B; font-size:11px; 
                      margin-top:4px;">d'allers-retours</div>
                  </td>
                  <td width="4%"></td>
                  <td width="33%" style="text-align:center; 
                    background:#0F172A; border-radius:10px; 
                    padding:16px 8px; border:1px solid #334155;">
                    <div style="color:#6B4EFF; font-size:22px; 
                      font-weight:700;">3 ref.</div>
                    <div style="color:#64748B; font-size:11px; 
                      margin-top:4px;">réglementaires</div>
                  </td>
                </tr>
              </table>

              <!-- CTA principal -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-bottom:12px;">
                <tr>
                  <td align="center">
                    <a href="https://complai-mvp.vercel.app"
                      style="display:inline-block; 
                        background:#6B4EFF; color:white;
                        font-size:15px; font-weight:600;
                        padding:14px 32px; border-radius:10px;
                        text-decoration:none; width:100%;
                        box-sizing:border-box; text-align:center;">
                      Relancer une analyse →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- CTA secondaire -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://complai-mvp.vercel.app"
                      style="display:inline-block; 
                        background:transparent; color:#6B4EFF;
                        font-size:14px; font-weight:500;
                        padding:12px 32px; border-radius:10px;
                        text-decoration:none; width:100%;
                        box-sizing:border-box; text-align:center;
                        border:1px solid #6B4EFF;">
                      Voir mes dernières analyses
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px; text-align:center;">
              <p style="color:#475569; font-size:12px; margin:0;">
                Compl-IA · Validation réglementaire cosmétique<br>
                <a href="https://complai-mvp.vercel.app/unsubscribe"
                  style="color:#475569; text-decoration:underline;">
                  Se désabonner
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Compl-IA <noreply@complai-mvp.vercel.app>',
        to: email,
        subject: `${prenom}, vos analyses Compl-IA vous attendent`,
        html: emailHtml
      })
    });

    const data = await response.json();
    res.status(200).json({ success: true, data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

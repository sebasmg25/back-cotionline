import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    // Aquí pegas los datos que te dio Mailtrap
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '09a7fcd33828ff',
        pass: 'ba08a2e5ad8831',
      },
    });
  }

  async sendInvitationEmail(
    targetEmail: string,
    invitationId: string,
  ): Promise<void> {
    const acceptLink = `http://localhost:4200/collaborators/accept/${invitationId}`;
    const rejectLink = `http://localhost:4200/collaborators/reject/${invitationId}`;

    const mailOptions = {
      from: '"Cotionline" <no-reply@cotionline.com>',
      to: targetEmail,
      subject: '🤝 ¡Te han invitado a colaborar en Cotionline!',
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invitación a Cotionline</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:12px 28px;border-radius:50px;">
                <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">✦ Cotionline</span>
              </div>
            </td>
          </tr>

          <!-- CARD -->
          <tr>
            <td style="background-color:#1a1a24;border-radius:20px;padding:48px 48px 40px;border:1px solid #2e2e40;">

              <!-- ICON -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="width:72px;height:72px;background:linear-gradient(135deg,#6c63ff22,#a78bfa22);border:2px solid #6c63ff55;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
                      <span style="font-size:32px;">🤝</span>
                    </div>
                  </td>
                </tr>

                <!-- TITLE -->
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">¡Tienes una invitación!</h1>
                  </td>
                </tr>

                <!-- SUBTITLE -->
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;color:#8b8ba8;font-size:16px;line-height:1.7;max-width:420px;">
                      Alguien te ha invitado a unirse como <strong style="color:#a78bfa;">colaborador</strong> en su equipo dentro de la plataforma Cotionline. Revisa y decide si quieres aceptar.
                    </p>
                  </td>
                </tr>

                <!-- DIVIDER -->
                <tr>
                  <td style="padding-bottom:36px;">
                    <div style="height:1px;background:linear-gradient(to right,transparent,#2e2e40,transparent);"></div>
                  </td>
                </tr>

                <!-- BUTTONS -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- ACCEPT -->
                        <td style="padding-right:12px;">
                          <a href="${acceptLink}"
                             style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:50px;letter-spacing:0.5px;">
                            ✓ Aceptar Invitación
                          </a>
                        </td>
                        <!-- REJECT -->
                        <td>
                          <a href="${rejectLink}"
                             style="display:inline-block;padding:14px 32px;background:transparent;color:#8b8ba8;font-size:15px;font-weight:600;text-decoration:none;border-radius:50px;border:1px solid #2e2e40;letter-spacing:0.5px;">
                            ✕ Rechazar
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- FALLBACK LINK -->
                <tr>
                  <td align="center" style="padding-top:28px;">
                    <p style="margin:0;color:#55556a;font-size:12px;line-height:1.6;">
                      ¿El botón no funciona? Copia y pega este enlace:<br/>
                      <a href="${acceptLink}" style="color:#6c63ff;text-decoration:none;word-break:break-all;">${acceptLink}</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;color:#3d3d55;font-size:12px;">
                © 2025 Cotionline · Este correo fue enviado automáticamente, por favor no respondas.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado exitosamente a: ${targetEmail}`);
    } catch (error) {
      console.error('Error enviando el correo:', error);
      throw new Error('No se pudo enviar el correo de invitación');
    }
  }
}

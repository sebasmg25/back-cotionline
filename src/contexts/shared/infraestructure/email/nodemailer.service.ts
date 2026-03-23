import nodemailer from 'nodemailer';
import { EnvConfig } from '../env/envConfig';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EnvConfig.get('SMTP_HOST'),
      port: Number(EnvConfig.get('SMTP_PORT')),
      secure: false,
      auth: {
        user: EnvConfig.get('SMTP_USER'),
        pass: EnvConfig.get('SMTP_PASS'),
      },
    });
  }

  async sendInvitationEmail(
    targetEmail: string,
    invitationId: string,
  ): Promise<void> {
    const acceptLink = `${EnvConfig.get('FRONTEND_URL') || 'http://localhost:4200'}/collaborators/accept/${invitationId}`;
    const rejectLink = `${EnvConfig.get('FRONTEND_URL') || 'http://localhost:4200'}/collaborators/reject/${invitationId}`;

    const mailOptions = {
      from: '"Cotionline" <no-reply@cotionline.com>',
      to: targetEmail,
      subject: '🤝 ¡Te han invitado a colaborar en Cotionline!',
      html: this.getInvitationTemplate(acceptLink, rejectLink),
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    targetEmail: string,
    token: string,
    userId: string,
  ): Promise<void> {
    const resetLink = `${EnvConfig.get('FRONTEND_URL') || 'http://localhost:4200'}/reset-password?token=${token}&id=${userId}`;

    const mailOptions = {
      from: '"Cotionline" <no-reply@cotionline.com>',
      to: targetEmail,
      subject: '🔑 Restablece tu contraseña - Cotionline',
      html: this.getPasswordResetTemplate(resetLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error enviando el correo de recuperación:', error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }

  private getInvitationTemplate(acceptLink: string, rejectLink: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Invitación a Cotionline</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:12px 28px;border-radius:50px;">
                <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">✦ Cotionline</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1a1a24;border-radius:20px;padding:48px 48px 40px;border:1px solid #2e2e40;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="width:72px;height:72px;background:linear-gradient(135deg,#6c63ff22,#a78bfa22);border:2px solid #6c63ff55;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
                      <span style="font-size:32px;">🤝</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">¡Tienes una invitación!</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;color:#8b8ba8;font-size:16px;line-height:1.7;max-width:420px;">
                      Alguien te ha invitado a unirse como <strong style="color:#a78bfa;">colaborador</strong> en su equipo dentro de la plataforma Cotionline.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:12px;">
                          <a href="${acceptLink}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:50px;">✓ Aceptar</a>
                        </td>
                        <td>
                          <a href="${rejectLink}" style="display:inline-block;padding:14px 32px;background:transparent;color:#8b8ba8;font-size:15px;font-weight:600;text-decoration:none;border-radius:50px;border:1px solid #2e2e40;">✕ Rechazar</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private getPasswordResetTemplate(resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Restablecer Contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:12px 28px;border-radius:50px;">
                <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">✦ Cotionline</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1a1a24;border-radius:20px;padding:48px 48px 40px;border:1px solid #2e2e40;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="width:72px;height:72px;background:linear-gradient(135deg,#6c63ff22,#a78bfa22);border:2px solid #6c63ff55;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
                      <span style="font-size:32px;">🔑</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Restablecer Contraseña</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;color:#8b8ba8;font-size:16px;line-height:1.7;max-width:420px;">
                      Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar. Este enlace expirará en 15 minutos.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:50px;">RESTABLECER CONTRASEÑA</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:28px;">
                    <p style="margin:0;color:#55556a;font-size:12px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}

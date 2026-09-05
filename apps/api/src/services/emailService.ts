import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resend: Resend | null = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
}

const OTP_EXPIRY_MINUTES = 10;

function generateOTP(): string {
  // 6 digits, padded with leading zeros
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOTP(): { code: string; expiresAt: Date } {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  return { code, expiresAt };
}

export async function sendOTPEmail(
  email: string,
  name: string,
  otpCode: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.error("❌ RESEND_API_KEY non défini");
    return { success: false, error: "Service email non configuré" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: [email],
      subject: "TaskFlow — Votre code de vérification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C81;">TaskFlow</h2>
          <p>Bonjour ${name},</p>
          <p>Votre code de vérification :</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>Ce code expire dans <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          <p style="color: #666; font-size: 12px;">
            Si vous n'avez pas demandé cette inscription, ignorez cet email.
          </p>
         
         
        </div>
      `,
    });

    if (error) {
      console.error(" Erreur Resend :", error);
      return { success: false, error: error.message };
    }

    console.log(` OTP envoyé à ${email} (id: ${data?.id})`);
    return { success: true };
  } catch (err) {
    console.error(" Erreur envoi email :", err);
    return { success: false, error: "Échec de l'envoi" };
  }
}

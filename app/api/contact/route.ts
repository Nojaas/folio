export const runtime = "nodejs";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// Schéma de validation côté serveur
const contactSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  message: z
    .string()
    .min(10, "Message trop court")
    .max(1000, "Message trop long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation avec Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Données invalides",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, message } = result.data;

    const FROM =
      process.env.RESEND_FROM || "Folio Contact <onboarding@resend.dev>";
    const TO = process.env.CONTACT_TO_EMAIL || "jasonleroy.dev@gmail.com";

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: "Nouveau message du portfolio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nouveau message du portfolio</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

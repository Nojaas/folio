"use client";

import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/ui/magic-card";
import { Textarea } from "@/components/ui/textarea";
import { DATA } from "@/data/resume";
import { CheckIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Schéma de validation Zod
const contactSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  message: z
    .string()
    .min(1, "Le message est requis")
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Marquer le champ comme touché
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validation en temps réel avec Zod (seulement si le champ a été touché ET qu'il y a déjà une erreur)
    // Cela permet de corriger l'erreur en temps réel une fois qu'elle est affichée
    if (errors[name as keyof ContactFormData]) {
      const fieldSchema = contactSchema.shape[name as keyof ContactFormData];
      if (fieldSchema) {
        try {
          fieldSchema.parse(value);
          setErrors((prev) => ({
            ...prev,
            [name]: undefined,
          }));
        } catch (error) {
          if (error instanceof z.ZodError) {
            setErrors((prev) => ({
              ...prev,
              [name]: error.issues[0]?.message || "",
            }));
          }
        }
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validation au blur (quand l'utilisateur quitte le champ)
    const fieldSchema = contactSchema.shape[name as keyof ContactFormData];
    if (fieldSchema) {
      try {
        fieldSchema.parse(value);
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [name]: error.issues[0]?.message || "",
          }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation complète avec Zod
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      toast.error("Veuillez corriger les erreurs", {
        description: "Certains champs contiennent des erreurs.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("failed");

      toast.success("Message envoyé avec succès !", {
        description: "Je vous répondrai dès que possible.",
      });
      setMessageSent(true);
      setFormData({ email: "", message: "" });
      setErrors({});
      setTouched({});

      // Reset le bouton après 3 secondes
      setTimeout(() => setMessageSent(false), 3000);
    } catch {
      toast.error("Erreur lors de l'envoi", {
        description: "Merci de réessayer plus tard.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-lg">
      <Card className="p-0 shadow-none border-none">
        <MagicCard
          gradientColor={"var(--magic-card-gradient-color)"}
          gradientOpacity={0.6}
          className="p-0"
        >
          <CardHeader className="border-b border-border p-6 [.border-b]:pb-4">
            <CardTitle className="text-2xl">Contact</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-1 text-balance">
              <span>Écrivez-moi ici ou via</span>
              <a
                href={`mailto:${DATA.contact.email}`}
                className="inline-flex items-center underline hover:text-primary transition-colors break-all"
              >
                <span className="break-all">{DATA.contact.email}</span>
                <span className="ml-1">
                  <DATA.contact.social.email.icon size={16} />
                </span>
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Parlez-moi de votre projet ou de votre question..."
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={
                    errors.message && touched.message
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.message && touched.message && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.message}
                  </p>
                )}
              </div>
              <AnimatedSubscribeButton
                type="submit"
                className="w-full"
                subscribeStatus={messageSent}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={async () => {
                  // La logique de soumission est gérée par le form onSubmit
                }}
              >
                <span className="inline-flex items-center">
                  {isSubmitting ? (
                    "Envoi..."
                  ) : (
                    <>
                      Envoyer le message
                      <SendIcon
                        className={`ml-1 size-4 transition-transform duration-300 ${
                          isHovering ? "translate-x-1" : ""
                        }`}
                      />
                    </>
                  )}
                </span>
                <span className="inline-flex items-center">
                  <CheckIcon className="mr-2 size-4" />
                  Message envoyé
                </span>
              </AnimatedSubscribeButton>
            </form>
          </CardContent>
        </MagicCard>
      </Card>
    </div>
  );
}

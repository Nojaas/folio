"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import { ContentRail, Section } from "@/app/components/Section";
import { DATA } from "@/data/resume";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { toast } from "sonner";
import { ScrollItemsReveal } from "./ScrollItemsReveal";

export const Contact = () => {
  const { t } = useLocale();

  const actions = [
    {
      label: t.contact.contact,
      href: `mailto:${DATA.contact.email}`,
    },
    {
      label: t.contact.linkedin,
      href: DATA.contact.social.LinkedIn.url,
      external: true,
    },
    {
      label: t.contact.cv,
      href: "/cv.pdf",
      download: true,
    },
  ] as const;

  const handleCVDownload = () => {
    toast.success(t.contact.cvToast);
  };

  return (
    <Section
      id="contact"
      className="flex min-h-[100dvh] w-full flex-col justify-center py-24 sm:py-32"
    >
      <ContentRail>
        <ScrollItemsReveal lockWhenComplete className="flex flex-col">
          {actions.map((action) => (
            <DownFastLink
              key={action.label}
              label={action.label}
              href={action.href}
              external={"external" in action && action.external}
              download={"download" in action && action.download}
              onClick={
                "download" in action && action.download
                  ? handleCVDownload
                  : undefined
              }
              className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
            />
          ))}
        </ScrollItemsReveal>
      </ContentRail>
    </Section>
  );
};

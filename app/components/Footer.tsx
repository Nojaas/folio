import { ArrowUpToLine } from "lucide-react";
import { Section } from "./Section";

export const Footer = () => {
  return (
    <footer className="bg-card dark:bg-background">
      <Section className="py-8 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          © 2025 Jason Leroy. Tous droits réservés.
        </p>
        <div className="flex flex-row items-center gap-1">
          <a
            href="#home"
            aria-label="Revenir en haut de page"
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full group"
          >
            <ArrowUpToLine
              size={20}
              className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110"
            />
          </a>
        </div>
      </Section>
    </footer>
  );
};

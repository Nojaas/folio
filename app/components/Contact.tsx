import Fade from "@/components/magicui/fade";
import { DATA } from "@/data/resume";
import { ContactCard } from "./ContactCard";
import { ContactForm } from "./ContactForm";
import { Section } from "./Section";

interface ContactProps {
  fadeDelay?: number;
}

export const Contact = ({ fadeDelay = 0.04 }: ContactProps) => {
  const FADE_DELAY = fadeDelay;

  return (
    <Section id="contact" className="space-y-12 w-full py-12">
      <Fade delay={FADE_DELAY * 16}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Contactez moi
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Par message, téléphone ou LinkedIn : choisissez le moyen qui vous
              convient.
            </p>
          </div>
        </div>
      </Fade>

      <Fade delay={FADE_DELAY * 17}>
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 mx-auto w-full">
          <div className="space-y-4 flex-1 basis-0">
            <Fade delay={FADE_DELAY * 18}>
              <div className="flex flex-col gap-4 items-center w-full max-w-lg mx-auto">
                <ContactCard
                  image="/avatar.jpg"
                  mediumImage={<DATA.contact.social.LinkedIn.icon size={14} />}
                  name="LinkedIn"
                  description="Connectez-vous avec moi"
                  url={DATA.contact.social.LinkedIn.url}
                  className="w-full"
                />
                <ContactCard
                  image="/avatar.jpg"
                  mediumImage={<DATA.contact.social.phone.icon size={14} />}
                  name="Téléphone"
                  description="Appelez-moi directement"
                  url={`tel:${DATA.contact.social.phone.number}`}
                  className="w-full"
                />
                <ContactCard
                  image="/avatar.jpg"
                  mediumImage={<DATA.contact.social.GitHub.icon size={14} />}
                  name="Mon github"
                  description="Voir mes projets"
                  url={DATA.contact.social.GitHub.url}
                  className="w-full"
                />
              </div>
            </Fade>
          </div>

          <div className="space-y-4 flex-1 basis-0">
            <Fade delay={FADE_DELAY * 19.5}>
              <ContactForm />
            </Fade>
          </div>
        </div>
      </Fade>
    </Section>
  );
};

import { Contact } from "@/app/components/Contact";
import { ProjectCard } from "@/app/components/ProjectCard";
import { Section } from "@/app/components/Section";
import { Skills } from "@/app/components/Skills";
import { WorkTimeline } from "@/app/components/WorkTimeline";
import Fade from "@/components/magicui/fade";
import FadeText from "@/components/magicui/fade-text";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LightRays } from "@/components/ui/light-rays";
import { DATA } from "@/data/resume";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { Footer } from "./components/Footer";

const FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh]">
      <section id="home" className="min-h-screen flex items-center relative">
        {/* LightRays avec largeur 100% */}
        <div className="absolute inset-0 w-full">
          {/* Mode clair - effet plus prononcé */}
          <div className="dark:hidden">
            <LightRays
              count={9}
              color="rgba(160, 210, 255, 0.35)"
              blur={42}
              speed={12}
            />
          </div>
          {/* Mode sombre - effet réduit */}
          <div className="hidden dark:block">
            <LightRays
              count={5}
              color="rgba(160, 210, 255, 0.15)"
              blur={30}
              speed={16}
            />
          </div>
        </div>

        {/* Contenu centré avec contraintes de largeur */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 space-y-8">
          <div className="flex flex-col space-y-4 max-w-2xl mx-auto text-center">
            <Fade delay={FADE_DELAY * 0.5}>
              <Link href="#contact">
                <div className="group rounded-full border border-black/5 bg-neutral-100 text-sm sm:text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 inline-block">
                  <AnimatedShinyText className="inline-flex items-center justify-center px-3 py-1 sm:px-4 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span className="text-center">
                      🚀 Ouvert aux nouvelles opportunités
                    </span>
                    <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </div>
              </Link>
            </Fade>
            <Fade delay={FADE_DELAY} yOffset={8}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                Hello, je suis Jason – {""}
                <span className="dark:hidden">
                  <AuroraText
                    colors={["#475569", "#64748b", "#60a5fa", "#94a3b8"]}
                  >
                    Développeur Full Stack
                  </AuroraText>
                </span>
                <span className="hidden dark:inline">
                  <AuroraText
                    colors={["#94a3b8", "#a1a1aa", "#cbd5e1", "#a5b4fc"]}
                  >
                    Développeur Full Stack
                  </AuroraText>
                </span>{" "}
                depuis 2019 👋
              </h1>
            </Fade>
            <FadeText
              className="max-w-[600px] mx-auto text-sm sm:text-base md:text-lg"
              delay={FADE_DELAY}
              text={DATA.description}
            />
            <Fade
              delay={FADE_DELAY * 2}
              className="flex flex-col sm:flex-row gap-3 mt-6 justify-center items-center"
            >
              <Link href="/cv.pdf" download>
                <HoverBorderGradient
                  containerClassName="rounded-md w-full sm:w-auto"
                  as="div"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center justify-center gap-2 px-4 py-2"
                >
                  <Download size={18} />
                  <span>Télécharger mon CV</span>
                </HoverBorderGradient>
              </Link>
              <Button
                asChild
                variant="default"
                className="w-fit sm:w-auto px-4 py-2"
              >
                <Link href="#projects" className="gap-2">
                  <ArrowRight size={18} />
                  Découvrir mes réalisations
                </Link>
              </Button>
            </Fade>
          </div>
        </div>

        {/* Indicateur de scroll repositionné */}
        <Fade
          delay={FADE_DELAY * 1.5}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center space-y-2 text-muted-foreground/80 dark:text-muted-foreground/60">
            <div className="h-16 sm:h-20 w-px bg-gradient-to-b from-transparent via-current/80 to-transparent dark:via-current/60 animate-pulse" />
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-4 border border-current rounded-sm relative">
                <div className="w-0.5 h-0.5 bg-current rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
              </div>
              <span>Découvrez mon parcours</span>
            </div>
          </div>
        </Fade>
      </section>
      <Section id="about" className="space-y-12 w-full py-12">
        <Fade delay={FADE_DELAY * 3} className="mb-0">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Qui suis-je ?
            </h2>
          </div>
        </Fade>
        <Fade delay={FADE_DELAY * 4}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="prose max-w-none text-pretty font-sans text-base sm:text-[17px] leading-relaxed text-neutral-700 dark:prose-invert dark:text-neutral-300 whitespace-pre-line">
              {DATA.summary}
            </p>
          </div>
        </Fade>
      </Section>
      <Section id="projects">
        <div className="space-y-12 w-full py-12">
          <Fade delay={FADE_DELAY * 5}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Mes dernières réalisations
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Découvrez une sélection de projets qui illustrent mon approche
                  du développement web.
                </p>
              </div>
            </div>
          </Fade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[1000px] mx-auto">
            {DATA.projects.map((project, id) => (
              <Fade key={project.title} delay={FADE_DELAY * 6 + id * 0.05}>
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </Fade>
            ))}
          </div>
        </div>
      </Section>
      <Skills />
      <Section id="parcours">
        <div className="space-y-12 w-full py-12">
          {/* Timeline unifiée */}
          <Fade delay={FADE_DELAY * 8}>
            <WorkTimeline />
          </Fade>
        </div>
      </Section>
      <Contact fadeDelay={FADE_DELAY} />
      <Footer />
    </main>
  );
}

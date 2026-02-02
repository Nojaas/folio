"use client";

import Fade from "@/components/magicui/fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { Section } from "./Section";

export const Skills = () => {
  return (
    <Section className="space-y-12 w-full py-12">
      <Fade delay={0.1}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="outline" className="mb-4">
              Compétences
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Technologies & Expertise
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl">
              Technologies modernes pour des applications performantes
            </p>
          </div>
        </div>
      </Fade>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Skills */}
        <Fade delay={0.2}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">
              Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {DATA.skills.map((skill, index) => (
                <Fade key={skill} delay={0.3 + index * 0.05}>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 text-sm hover:bg-primary/10 hover:scale-105 transition-all duration-300"
                  >
                    {skill}
                  </Badge>
                </Fade>
              ))}
            </div>
          </div>
        </Fade>

        {/* Section Tools */}
        <Fade delay={0.4}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">
              Outils & Workflow
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {DATA.tools.map((tool, index) => (
                <Fade key={tool} delay={0.5 + index * 0.05}>
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm hover:bg-muted/50 hover:scale-105 transition-all duration-300"
                  >
                    {tool}
                  </Badge>
                </Fade>
              ))}
            </div>
          </div>
        </Fade>
      </div>
    </Section>
  );
};

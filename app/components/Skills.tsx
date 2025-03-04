import { Badge } from "@/components/ui/badge";
import { Section } from "./Section";
import { ReactIcon } from "./icons/ReactIcon";
import { NextJsIcon } from "./icons/NextJsIcon";
import { TailwindIcon } from "./icons/TailwindIcon";
import { Code } from "./Code";
import { OpenAiIcon } from "./icons/OpenAiIcon";

export const Skills = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"}>Skills</Badge>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        I love to work on..
      </h2>
      <div className="flex max-md:flex-col gap-4">
        <div className="flex flex-col gap-4">
          <ReactIcon
            size={42}
            className="animate-spin"
            style={{ animationDuration: "10s" }}
          />
          <h3 className="text-2xl font-semibold tracking-tight mb-2">React</h3>
          <p className="text-sm text-muted-foreground">
            I build responsive web apps with <Code>React</Code>, using
            <Code>Next.js</Code> for server-side rendering and performance
            optimization.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <TailwindIcon size={42} />
          <h3 className="text-2xl font-semibold tracking-tight mb-2">Tailwind</h3>
          <p className="text-sm text-muted-foreground">
          I design efficient, customizable UIs with <Code>TailwindCSS</Code>, ensuring a seamless and appealing user experience        </p>
        </div>
        <div className="flex flex-col gap-4">
          <OpenAiIcon size={42} />
          <h3 className="text-2xl font-semibold tracking-tight mb-2">
            AI integration
          </h3>
          <p className="text-sm text-muted-foreground">
            I integrate AI technologies into apps to enhance functionality and
            provide intelligent, user-focused solutions.
          </p>
        </div>
      </div>
    </Section>
  );
};

import { Badge } from "@/components/ui/badge";
import { Section } from "./Section";
import { ReactIcon } from "./icons/ReactIcon";
import { NextJsIcon } from "./icons/NextJsIcon";
import { TailwindIcon } from "./icons/TailwindIcon";
import { Code } from "./Code";

export const Skills = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"}>Skills</Badge>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        The People of the Kingdom
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
            Blablabla <Code>React</Code> is the best blablabla
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <NextJsIcon size={42} />
          <h3 className="text-2xl font-semibold tracking-tight mb-2">React</h3>
          <p className="text-sm text-muted-foreground">
            Blablabla <Code>React</Code> is the best blablabla
          </p>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <TailwindIcon size={42} />
          <h3 className="text-2xl font-semibold tracking-tight mb-2">React</h3>
          <p className="text-sm text-muted-foreground">
            Blablabla <Code>React</Code> is the best blablabla
          </p>
        </div>
      </div>
    </Section>
  );
};

import { buttonVariants } from "@/components/ui/button";
import { Section } from "./Section";
import { GithubIcon } from "./icons/GithubIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LinkedInIcon } from "./icons/LinkedinIcon";

export const Header = () => {
  return (
    <header className="sticky top-0 py-4">
      <Section className="flex items-baseline">
        <h1 className="text-lg font-bold text-primary">Jason Leroy</h1>
        <div className="flex-1" />
        <ul className="flex items-center gap-2 ">
          <Link
            href="https//github.com/nojaas"
            className={cn(buttonVariants({ variant: "outline" }), "size-6 p-0")}
          >
            <GithubIcon size={12} className="text-foreground" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/jason-leroy"
            className={cn(buttonVariants({ variant: "outline" }), "size-6 p-0")}
          >
            <LinkedInIcon size={12} className="text-foreground" />
          </Link>
        </ul>
      </Section>
    </header>
  );
};

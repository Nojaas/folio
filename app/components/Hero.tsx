/* eslint-disable @next/next/no-img-element */
import { Section } from "./Section";
import Link from "next/link";
import { Code } from "./Code";
import { ReactIcon } from "./icons/ReactIcon";

export const Hero = () => {
  return (
    <Section className="flex max-md:flex-col items-start gap-4">
      <div className="flex-[3] w-full flex flex-col gap-2">
        <h2 className="font-caption font-bold text-5xl text-primary">
          Jason Leroy
        </h2>
        <h3 className="text-3xl font-caption">Software developper</h3>
        <p className="text-base">
          I create front-end application with{" "}
          <Link href="https//github.com/nojaas">
            <Code className="inline-flex items-center gap-1">
              <ReactIcon size={10} className="inline" />
              React
            </Code>
            , currently looking for a job,
            Living in{" "}
            <Code className="inline-flex items-center gap-1">
              🇫🇷Paris
            </Code>
          </Link>
        </p>
      </div>
      <div className="flex-[2] max-md:m-auto ml-auto">
        <img
          src="https://avatars.githubusercontent.com/u/56931902?v=4"
          alt=""
          className="w-full h-auto max-w-sm rounded-full max-md:w-56"
        />
      </div>
    </Section>
  );
};

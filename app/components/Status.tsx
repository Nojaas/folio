/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { Code, Home } from "lucide-react";
import { ContactCard } from "./ContactCard";
import { Section } from "./Section";
import { SideProject, SideProjectProps } from "./SideProject";
import { Work, WorkProps } from "./Work";

export const Status = () => {
  return (
    <Section className="flex max-md:flex-col items-start gap-4">
      <div className="flex-[3] w-full">
        <Card className="w-full p-4 flex flex-col gap-2">
          <p className="text-lg text-muted-foreground">Side project</p>
          <div className="flex flex-col gap-4">
            {SIDE_PROJECTS.map((project, index) => (
              <SideProject key={index} {...project} />
            ))}
          </div>
        </Card>
      </div>
      <div className="flex-[2] w-full flex flex-col gap-4">
        <Card className="p-4 flex-1">
          <p className="text-lg text-muted-foreground">Work</p>
          <div className="flex flex-col gap-4">
            {WORKS.map((work, index) => (
              <Work key={index} {...work} />
            ))}
          </div>
        </Card>
        <Card className="p-4 flex-1 flex flex-col gap-2 ">
          <p className="text-lg text-muted-foreground">Contact me</p>
          <ContactCard
            url="https://"
            name="ouais"
            image="https://avatars.githubusercontent.com/u/56931902?v=4"
            mediumImage="https://avatars.githubusercontent.com/u/56931902?v=4"
            description="2139 "
          />
          <ContactCard
            url="https://"
            name="ouais"
            image="https://avatars.githubusercontent.com/u/56931902?v=4"
            mediumImage="https://avatars.githubusercontent.com/u/56931902?v=4"
            description="2139 "
          />
        </Card>
      </div>
    </Section>
  );
};

const SIDE_PROJECTS: SideProjectProps[] = [
  {
    Logo: Code,
    title: "Lucide",
    description:
      "A simply beautiful icon set designed by the community, for the community.",
    url: "https://github",
  },
  {
    Logo: Home,
    title: "Lucide",
    description:
      "A simply beautiful icon set designed by the community, for the community.",
    url: "https://github",
  },
  {
    Logo: Home,
    title: "Lucide",
    description:
      "A simply beautiful icon set designed by the community, for the community.",
    url: "https://github",
  },
];

const WORKS: WorkProps[] = [
  {
    image: "https://avatars.githubusercontent.com/u/56931902?v=4",
    title: "Lucide",
    role: "Alternship",
    date: "2022",
    url: "https://github",
  },
];

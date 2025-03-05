/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { Car, ImageUp } from "lucide-react";
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
            url="https://github.com/nojaas"
            name="@Nojaas"
            image="https://avatars.githubusercontent.com/u/56931902?v=4"
            mediumImage="https://img.icons8.com/ios11/512/FFFFFF/github.png"
            description="Github"
          />
          <ContactCard
            url="https://www.linkedin.com/in/jason-leroy"
            name="Jason Leroy"
            image="https://avatars.githubusercontent.com/u/56931902?v=4"
            mediumImage="https://store-images.s-microsoft.com/image/apps.46485.9007199266245564.44dc7699-748d-4c34-ba5e-d04eb48f7960.df3dbdf7-e6b9-4d2a-a5ad-3b91e430d172"
            description="Linkedin"
          />
        </Card>
      </div>
    </Section>
  );
};

const SIDE_PROJECTS: SideProjectProps[] = [
  {
    Logo: Car,
    title: "Garage Connect",
    description:
      "Online repair tracking 🚗",
    url: "https://garage-connect-front.vercel.app/",
  },
  {
    Logo: ImageUp,
    title: "Scaly",
    description:
      "Unleash the potential of your images with AI 🌟",
    url: "https://scaly-app.fr",
  },
];

const WORKS: WorkProps[] = [
  {
    image: "https://media.licdn.com/dms/image/v2/D4E0BAQFcG1-Gib1npg/company-logo_200_200/company-logo_200_200/0/1736418208615/myperfmaker_logo?e=2147483647&v=beta&t=qO3jJAweGMa2W6tleOFRIzHuY7G2YNv_mJi_ZwXk3eY",
    title: "Perfmaker",
    role: "Alternship",
    date: "2022 - 2024",
    url: "https://github",
  },
  {
    image: "https://immo2.pro/images/wp-images/2018/05/tylto-logo-application-gestion-immobilier.png",
    title: "Tylto",
    role: "Alternship",
    date: "2020 - 2022",
    url: "https://github",
  },
];

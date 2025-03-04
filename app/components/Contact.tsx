import { Badge } from "@/components/ui/badge";
import { Section } from "./Section";
import { ContactCard } from "./ContactCard";

export const Contact = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"}>Contact me</Badge>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        I look forward to collaborating with you.
      </h2>
      <div className="flex max-md:flex-col w-full gap-4">
        <ContactCard
          className="flex-1"
          url="https://github.com/nojaas"
          name="@Nojaas"
          image="https://avatars.githubusercontent.com/u/56931902?v=4"
          mediumImage="https://img.icons8.com/ios11/512/FFFFFF/github.png"
          description="View my projects "
        />
        <ContactCard
          className="flex-1"
          url="https://"
          name="jasonleroy.dev@gmail.com"
          image="https://avatars.githubusercontent.com/u/56931902?v=4"
          mediumImage="https://static.vecteezy.com/ti/vecteur-libre/p1/13948544-logo-gmail-sur-fond-blanc-transparent-gratuit-vectoriel.jpg"
          description="Email me for any aquiries "
        />
        <ContactCard
          className="flex-1"
          url="https://www.linkedin.com/in/jason-leroy"
          name="Jason leroy"
          image="https://avatars.githubusercontent.com/u/56931902?v=4"
          mediumImage="https://store-images.s-microsoft.com/image/apps.46485.9007199266245564.44dc7699-748d-4c34-ba5e-d04eb48f7960.df3dbdf7-e6b9-4d2a-a5ad-3b91e430d172"
          description="Connect with me "
        />
      </div>
    </Section>
  );
};

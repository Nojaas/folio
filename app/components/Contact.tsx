import { Badge } from "@/components/ui/badge";
import { Section } from "./Section";
import { ContactCard } from "./ContactCard";

export const Contact = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"}>Contact me</Badge>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        I will be happy to work with you
      </h2>
      <div className="flex max-md:flex-col w-full gap-4">
        <ContactCard
          className="flex-1"
          url="https://"
          name="ouais"
          image="https://avatars.githubusercontent.com/u/56931902?v=4"
          mediumImage="https://avatars.githubusercontent.com/u/56931902?v=4"
          description="2139 "
        />
        <ContactCard
          className="flex-1"
          url="https://"
          name="ouais"
          image="https://www.01net.com/app/uploads/2020/12/MEA-Gmail.jpg"
          mediumImage="https://avatars.githubusercontent.com/u/56931902?v=4"
          description="2139 "
        />
        <ContactCard
          className="flex-1"
          url="https://"
          name="ouais"
          image="https://avatars.githubusercontent.com/u/56931902?v=4"
          mediumImage="https://avatars.githubusercontent.com/u/56931902?v=4"
          description="2139 "
        />
      </div>
    </Section>
  );
};

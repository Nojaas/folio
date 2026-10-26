import { FooterOrbitMark } from "@/app/components/FooterOrbitMark";
import { ContentRail } from "@/app/components/Section";

export function Footer() {
  return (
    <footer className="w-full pb-2.5">
      <ContentRail>
        <div className="flex justify-center md:justify-start">
          <FooterOrbitMark />
        </div>
      </ContentRail>
    </footer>
  );
}

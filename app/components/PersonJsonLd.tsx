import { DATA } from "@/data/resume";
import { SITE_URL } from "@/lib/constants/site";

/** JSON-LD Person — server-rendered for crawlers. */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DATA.name,
    url: SITE_URL,
    email: DATA.contact.email,
    jobTitle: "Fullstack Developer",
    sameAs: [
      DATA.contact.social.GitHub.url,
      DATA.contact.social.LinkedIn.url,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import { SITE_URL } from "@/lib/constants/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: SITE_URL,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: SITE_URL,
          en: `${SITE_URL}/en`,
        },
      },
    },
  ];
}

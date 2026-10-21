export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return value === "fr" || value === "en";
}

/** FR has no prefix; EN lives under /en */
export function localePath(locale: Locale, href = "/") {
  const [pathname = "/", hash] = href.split("#");
  const normalized =
    pathname === "" || pathname === "/"
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;

  let localized = normalized;
  if (locale === "en") {
    localized = normalized === "/" ? "/en" : `/en${normalized}`;
  }

  return hash ? `${localized}#${hash}` : localized;
}

export type Dictionary = {
  nav: {
    available: string;
    projects: string;
    stack: string;
    contact: string;
    switchToEn: string;
    switchToFr: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    /** Linked word → contact (e.g. Disponible / Available) */
    p3Available: string;
    /** Rest of p3 after the linked word (leading space included) */
    p3Rest: string;
    /** Circular badge around the CV download */
    cvRing: string;
  };
  projects: {
    titleLine1: string;
    titleLine2: string;
    items: {
      pingora: string;
      krono: string;
      kanboard: string;
    };
  };
  contact: {
    contact: string;
    linkedin: string;
    cv: string;
  };
  availability: {
    label: string;
    title: string;
    status: { label: string; badge: string; detail: string };
    location: { label: string; primary: string; detail: string };
    engagement: { label: string; primary: string; detail: string };
  };
  footer: {
    orbitRing: string;
  };
  notFound: {
    title: string;
    home: string;
  };
  stack: {
    label: string;
    title: string;
    categoriesLabel: string;
    categories: {
      frontend: { label: string; description: string };
      backend: { label: string; description: string };
      product: { label: string; labelShort: string; description: string };
    };
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  fr: {
    nav: {
      available: "Disponible",
      projects: "Projets",
      stack: "Stack",
      contact: "Contact",
      switchToEn: "Passer en anglais",
      switchToFr: "Passer en français",
    },
    about: {
      title: "À propos.",
      p1: "Je développe aujourd'hui principalement en React et TypeScript, avec un vrai back NodeJS. J'ai travaillé sur des back-offices, des SaaS et des applications métier, avec une approche full-stack qui va de l'interface jusqu'à la mise en production.",
      p2: "Je ne me contente pas d'exécuter une demande. J'aime comprendre le besoin derrière une fonctionnalité pour faire des choix techniques et UI qui ont du sens.",
      p3Available: "Disponible",
      p3Rest:
        " en freelance, ou à plein temps en hybride à Paris, là où je peux voir concrètement l'impact de ce que je construis.",
      cvRing: "Voir le CV (PDF) * ",
    },
    projects: {
      titleLine1: "Sélection",
      titleLine2: "de projets.",
      items: {
        pingora:
          "Microservice de notifications multi-canal : API, queue BullMQ, worker email et webhooks signés.",
        krono:
          "Extension Chrome focus : timer, sites bloqués pendant la session, stats en local.",
        kanboard:
          "Kanban full-stack : drag-and-drop, auth, collaboration et boards partagés.",
      },
    },
    contact: {
      contact: "Contact",
      linkedin: "LinkedIn",
      cv: "CV (PDF)",
    },
    availability: {
      label: "Disponibilités",
      title: "Disponibilités.",
      status: {
        label: "Statut",
        badge: "Disponible",
        detail: "Freelance & opportunités CDI · Ouvert aux échanges",
      },
      location: {
        label: "Modalités",
        primary: "Full remote / Hybride",
        detail: "Paris & Île-de-France",
      },
      engagement: {
        label: "Engagement",
        primary: "À partir de 380€/j",
        detail: "Missions freelance · CDI frame",
      },
    },
    footer: {
      orbitRing: "© {year} Jason Leroy. Tous droits réservés. ",
    },
    notFound: {
      title: "Page introuvable.",
      home: "Accueil",
    },
    stack: {
      label: "Stack technique",
      title: "Stack.",
      categoriesLabel: "Catégories",
      categories: {
        frontend: {
          label: "Frontend",
          description: "Interfaces, UX et les détails qui font la différence.",
        },
        backend: {
          label: "Backend",
          description: "APIs, data et les systèmes derrière le produit.",
        },
        product: {
          label: "Infrastructure & Delivery",
          labelShort: "Infrastructure",
          description:
            "De la première idée à la production, avec un focus sur la fiabilité.",
        },
      },
    },
  },
  en: {
    nav: {
      available: "Available",
      projects: "Projects",
      stack: "Stack",
      contact: "Contact",
      switchToEn: "Switch to English",
      switchToFr: "Switch to French",
    },
    about: {
      title: "About.",
      p1: "These days I mainly work with React and TypeScript, backed by a real Node.js back end. I've worked on back offices, SaaS products and business applications, with a full-stack approach that runs from the interface all the way to production.",
      p2: "I don't just carry out requests. I like to understand the need behind a feature so I can make technical and UI choices that make sense.",
      p3Available: "Available",
      p3Rest:
        " for freelance work, or full time in a hybrid setup in Paris, where I can see the real impact of what I build.",
      cvRing: "RESUME (PDF) * ",
    },
    projects: {
      titleLine1: "Selected",
      titleLine2: "work.",
      items: {
        pingora:
          "Multi-channel notification microservice: API, BullMQ queue, email worker, and signed webhooks.",
        krono:
          "Chrome focus extension: timer, blocked sites during sessions, local stats.",
        kanboard:
          "Full-stack Kanban: drag-and-drop, auth, collaboration, and shared boards.",
      },
    },
    contact: {
      contact: "Contact",
      linkedin: "LinkedIn",
      cv: "Resume (PDF)",
    },
    availability: {
      label: "Availability",
      title: "Availability.",
      status: {
        label: "Status",
        badge: "Available",
        detail: "Freelance & full-time opportunities · Open to opportunities",
      },
      location: {
        label: "Setup",
        primary: "Full remote / Hybrid",
        detail: "Paris & Île-de-France",
      },
      engagement: {
        label: "Engagement",
        primary: "From €380/day",
        detail: "Freelance missions · Permanent roles",
      },
    },
    footer: {
      orbitRing: "© {year} Jason Leroy. All rights reserved. ",
    },
    notFound: {
      title: "Page not found.",
      home: "Home",
    },
    stack: {
      label: "Tech stack",
      title: "Stack.",
      categoriesLabel: "Categories",
      categories: {
        frontend: {
          label: "Frontend",
          description:
            "Interfaces, UX and the details that make them feel right.",
        },
        backend: {
          label: "Backend",
          description: "APIs, data and the systems behind the product.",
        },
        product: {
          label: "Infrastructure & Delivery",
          labelShort: "Infrastructure",
          description:
            "From first idea to production, with a focus on reliability.",
        },
      },
    },
  },
};

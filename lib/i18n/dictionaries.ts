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
    switchToEn: string;
    switchToFr: string;
  };
  about: {
    p1: string;
    p2: string;
    p3: string;
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
    cvToast: string;
  };
  footer: {
    role: string;
  };
  notFound: {
    title: string;
    back: string;
  };
  stack: {
    label: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  fr: {
    nav: {
      available: "Disponible",
      switchToEn: "Passer en anglais",
      switchToFr: "Passer en français",
    },
    about: {
      p1: "Je développe aujourd'hui principalement en React et TypeScript, avec un vrai back NodeJS. J'ai travaillé sur des back-offices, des SaaS et des applications métier, avec une approche full-stack qui va de l'interface jusqu'à la mise en production.",
      p2: "Je ne me contente pas d'exécuter une demande. J'aime comprendre le besoin derrière une fonctionnalité pour faire des choix techniques et UI qui ont du sens.",
      p3: "Disponible en freelance, ou à plein temps en hybride à Paris, là où je peux voir concrètement l'impact de ce que je construis.",
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
      cvToast: "CV téléchargé avec succès !",
    },
    footer: {
      role: "Fullstack developer",
    },
    notFound: {
      title: "Page introuvable.",
      back: "Retour à l'accueil",
    },
    stack: {
      label: "Stack technique",
    },
  },
  en: {
    nav: {
      available: "Available",
      switchToEn: "Switch to English",
      switchToFr: "Switch to French",
    },
    about: {
      p1: "These days I mainly work with React and TypeScript, backed by a real Node.js back end. I've worked on back offices, SaaS products and business applications, with a full-stack approach that runs from the interface all the way to production.",
      p2: "I don't just carry out requests. I like to understand the need behind a feature so I can make technical and UI choices that make sense.",
      p3: "Available for freelance work, or full time in a hybrid setup in Paris, where I can see the real impact of what I build.",
    },
    projects: {
      titleLine1: "Selected",
      titleLine2: "projects.",
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
      cvToast: "Resume downloaded successfully!",
    },
    footer: {
      role: "Fullstack developer",
    },
    notFound: {
      title: "Page not found.",
      back: "Back to home",
    },
    stack: {
      label: "Tech stack",
    },
  },
};

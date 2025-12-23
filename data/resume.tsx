import { Icons } from "@/public/icons";
import { Briefcase, Contact, Download, HomeIcon, Laptop } from "lucide-react";
const Scaly = "/videos/scaly.mp4";
const Kanboard = "/videos/kanboard.mp4";
const GarageConnect = "/videos/garageconnect.mp4";

export const DATA = {
  name: "Jason Leroy",
  initials: "JL",
  url: "https://jason-leroy.com", // ton futur portfolio ou site perso
  location: "Paris, France",
  locationLink: "https://www.google.com/maps/place/paris",
  description:
    "Développeur full-stack expert en React, Next.js, TypeScript et PostgreSQL. Je conçois des applications robustes et scalables en alliant expertise technique et vision produit pour créer des solutions impactantes.",
  summary: `
Passionné par l'informatique et l'innovation web depuis 2019, le développement m'offre une liberté créative unique pour résoudre tous types de problèmes et donner vie aux idées. Diplômé d'un Bachelor en développement web à HETIC et d'un Master CTO & Tech Lead à l'EEMI, j'ai acquis 4 ans d'expérience en alternance.

Ce qui me motive ? L'amélioration constante de l'expérience utilisateur et l'innovation technique. Je privilégie React et Next.js pour créer des applications web modernes dans un environnement full TypeScript, en transformant chaque défi en solution élégante et efficace.

Méthodique et organisé, j'apprécie autant le travail autonome que collaboratif. Mon objectif : créer des solutions innovantes qui font vraiment la différence pour les utilisateurs.`,

  avatarUrl: "avatar.jpg",

  skills: [
    "React",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Pinia",
    "Typescript",
    "TailwindCSS",
    "Scss",
    "Node.js",
    "Prisma",
    "SQL",
    "Firebase",
    "REST APIs",
    "AWS",
    "AI integration",
    "CI/CD",
  ],

  tools: [
    "Git",
    "GitHub",
    "Docker",
    "Postman",
    "Vercel",
    "Jira",
    "Notion",
    "Figma",
  ],

  navbar: [
    { href: "#home", icon: HomeIcon, label: "Accueil" },
    { href: "#about", icon: HomeIcon, label: "À propos" },
    { href: "#projects", icon: Laptop, label: "Projets" },
    { href: "#parcours", icon: Briefcase, label: "Parcours" },
    { href: "#contact", icon: Contact, label: "Contact" },
  ],

  contact: {
    email: "jasonleroy.dev@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Nojaas",
        icon: Icons.github,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/jason-leroy",
        icon: Icons.linkedin,
      },
      email: {
        name: "Envoyez-moi un email",
        url: "mailto:jasonleroy.dev@gmail.com",
        icon: Icons.email,
      },
      phone: {
        name: "Appelez-moi",
        number: "0787739507",
        icon: Icons.phone,
      },
      cv: {
        name: "Télécharger mon CV",
        url: "/cv.pdf",
        icon: Download,
      },
    },
  },

  work: [
    {
      company: "Perfmaker",
      badges: [],
      location: "Paris",
      title: "Développeur full-stack",
      logoUrl: Icons.perfmaker,
      start: "2022",
      end: "2024",
      technologies: ["React", "Jira", "GTM", "Postman"],
      description:
        "Développement d'applications web full-stack avec architecture moderne. Conception d'interfaces réactives intégrées à des APIs RESTful, implémentation de composants dynamiques avec gestion d'état optimisée. CI/CD et maintenance évolutive des applications.",
    },
    {
      company: "Tylto",
      badges: [],
      location: "Paris",
      title: "Développeur front-end",
      logoUrl: undefined,
      start: "2020",
      end: "2022",
      technologies: [
        "Vue.js",
        "Pinia",
        "Docker",
        "Postman",
        "Nuxt.js",
        "Notion",
        "Figma",
      ],
      description:
        "Développement de la plateforme de digitalisation immobilière : gestion des documents, signatures électroniques, dashboards et statistiques.",
    },
  ],

  education: [
    {
      school: "EEMI",
      location: "Paris",
      href: "https://www.eemi.com/",
      degree: "Master CTO & Tech Lead",
      logoUrl: Icons.eemi,
      start: "2022",
      end: "2024",
      technologies: [
        "Front-end",
        "Back-end",
        "Serverless",
        "Machine Learning",
        "DevOps",
        "Data visualisation",
      ],
      description:
        "Programme Bac+5 certifié RNCP niveau 7 combinant expertise technique et management. Approche globale couvrant le développement web et mobile, la cybersécurité, la data et le machine learning, tout en renforçant les compétences en architecture logicielle, leadership et pilotage de projets agiles.",
    },
    {
      school: "HETIC",
      location: "Montreuil",
      href: "https://www.hetic.net/",
      degree: "Bachelor Développement Web",
      logoUrl: Icons.hetic,
      start: "2019",
      end: "2022",
      technologies: ["JavaScript", "PHP", "React", "Vue.js", "SQL"],
      description:
        "Parcours axé sur la création d’applications web modernes, alliant pratique intensive et bases théoriques solides. Compétences développées en front-end, back-end, UX/UI design et gestion de projets digitaux selon les méthodes agiles.",
    },
  ],

  projects: [
    {
      title: "Garage Connect",
      href: "https://garage-connect-front.vercel.app",
      dates: "2024",
      active: true,
      description:
        "Application web pour garages : gestion des réparations, envoi de photos/vidéos pour transparence, notifications automatiques.",
      technologies: [
        "Next.js",
        "Typescript",
        "Firestore",
        "Firebase",
        "TailwindCSS",
        "Vercel",
      ],
      links: [],
      image: "",
      video: GarageConnect,
    },
    {
      title: "Kanboard.",
      href: "https://kanboardapp.vercel.app",
      dates: "2025",
      active: true,
      description:
        "Application de gestion de projet en tableaux kanban, avec glisser-déposer des tâches, duplication rapide, personnalisation par couleurs et icônes, collaboration en temps réel et interface responsive.",
      technologies: [
        "Next.js",
        "Typescript",
        "Prisma",
        "PostgreSQL",
        "TailwindCSS",
      ],
      links: [],
      image: "",
      video: Kanboard,
    },
    {
      title: "Scaly - Améliorez vos images avec l'IA",
      href: "https://scaly-fr.vercel.app",
      dates: "2024",
      active: true,
      description:
        "SaaS utilisant l'IA pour améliorer la résolution et la qualité des images. Offre des outils de mise à l'échelle, traitement par lots et édition avec garantie de confidentialité.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Stability AI API",
        "TailwindCSS",
        "SaaS",
      ],
      links: [],
      image: "",
      video: Scaly,
    },
  ],
};

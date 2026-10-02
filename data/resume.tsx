export const DATA = {
  name: "Jason Leroy",
  url: "https://jason-leroy.com",
  location: "Paris, France",

  contact: {
    email: "jasonleroy.dev@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Nojaas",
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/jason-leroy",
      },
    },
  },

  projects: [
    {
      id: "pingora" as const,
      title: "Pingora",
      href: "https://github.com/Nojaas/pingora",
    },
    {
      id: "krono" as const,
      title: "Krono",
      href: "https://krono-extension.vercel.app/",
    },
    {
      id: "kanboard" as const,
      title: "Kanboard",
      href: "https://kanboardapp.vercel.app",
    },
  ],
};

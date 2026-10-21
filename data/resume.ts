export const DATA = {
  name: "Jason Leroy",

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
      year: 2026,
      href: "https://github.com/Nojaas/pingora",
      images: ["/pingora1.png", "/pingora2.png"],
    },
    {
      id: "krono" as const,
      title: "Krono",
      year: 2026,
      href: "https://krono-extension.vercel.app/",
      images: ["/krono1.webp", "/krono2.png"],
    },
    {
      id: "kanboard" as const,
      title: "Kanboard",
      year: 2025,
      href: "https://kanboardapp.vercel.app",
      images: ["/kanboard1.png", "/kanboard2.png"],
    },
  ],
};

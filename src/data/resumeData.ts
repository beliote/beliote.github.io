export type Locale = "fr" | "en";

export const profile = {
  name: "Eliot Burgalat",
  email: "eliot.burgalat@imt-atlantique.net",
  phone: "+33 7 82 96 64 29",
  phoneHref: "tel:+33782966429",
  github: "https://github.com/beliote",
  linkedin: "https://www.linkedin.com/in/eliot-burgalat",
  fide: "https://ratings.fide.com/profile/36068659",
  fideRating: "2242",
  calendar:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Eliot%20Burgalat&add=eliot.burgalat%40imt-atlantique.net",
} as const;

export interface TimelineItem {
  period: string;
  title: string;
  place: string;
  detail?: string;
  points?: string[];
  stack?: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface ResumeContent {
  metaTitle: string;
  metaDescription: string;
  nav: { id: string; label: string }[];
  role: string;
  status: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
    cv: string;
    cvLabel: string;
  };
  education: { index: string; title: string; items: TimelineItem[] };
  experience: { index: string; title: string; items: TimelineItem[] };
  projects: { index: string; title: string; items: TimelineItem[] };
  skills: { index: string; title: string; groups: SkillGroup[] };
  hobbies: {
    index: string;
    title: string;
    sportsTitle: string;
    sports: string;
    rolesTitle: string;
    roles: string[];
    travelTitle: string;
    visited: string;
    travel: {place: string; note: string }[];
  };
  puzzle: {
    kicker: string;
    fide: string;
    loading: string;
    error: string;
    open: string;
    yourMove: string;
    white: string;
    black: string;
    wrong: string;
    solved: string;
    previewing: string;
    showLine: string;
    retry: string;
    rating: string;
    themes: string;
  };
  contact: {
    index: string;
    title: string;
    write: string;
    copy: string;
    copied: string;
    copyFailed: string;
    phone: string;
    calendar: string;
    pgp: string;
    pgpNote: string;
  };
}

const fr: ResumeContent = {
  metaTitle: "Eliot Burgalat",
  metaDescription:
    "Élève ingénieur à IMT Atlantique, échange à Polytechnique Montréal. Stage de fin d'études dès avril 2027 : IA, LLM et systèmes agentiques.",
  nav: [
    { id: "formation", label: "Formation" },
    { id: "experiences", label: "Expériences" },
    { id: "projets", label: "Projets" },
    { id: "competences", label: "Compétences" },
    { id: "tactique", label: "Hobbies" },
    { id: "contact", label: "Contact" },
  ],
  role: "Élève ingénieur en IA & Développement logiciel, IMT Atlantique",
  status: "Recherche de stage de fin d'études dès avril 2027 (IA, LLM & Systèmes Agentiques)",
  links: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    cv: "CV PDF",
    cvLabel: "Ouvrir l'impression pour enregistrer le CV en PDF",
  },
  education: {
    index: "01",
    title: "Formation",
    items: [
      {
        period: "09/2026 – 01/2027",
        title: "Échange académique, génie informatique et logiciel",
        place: "Polytechnique Montréal",
        detail: "Machine Learning, LLM et Data Science.",
      },
      {
        period: "09/2024 – 2027",
        title: "Étudiant ingénieur",
        place: "IMT Atlantique",
        detail: "Spécialisation en développement logiciel (GPA 3.61).",
      },
      {
        period: "09/2022 – 06/2024",
        title: "Classe préparatoire aux grandes écoles (CPGE) MP2I / MPI",
        place: "Lycée Pierre de Fermat, Toulouse",
        detail: "Mathématiques, physique, informatique.",
      },
    ],
  },
  experience: {
    index: "02",
    title: "Expériences",
    items: [
      {
        period: "04/2026 – 08/2026",
        title: "Stagiaire ingénieur full stack",
        place: "Notipro",
        points: [
          "Développement full stack et architecture logicielle",
          "Algorithmique et logique applicative",
          "Conception UX/UI et intégration front-end",
          "Optimisation des performances et tests",
        ],
      },
      {
        period: "06/2025 – 07/2025",
        title: "Stagiaire opérateur / Découverte industrie",
        place: "Continental Automotive",
        points: [
          "Gestion de flux de production et logistique de fin de ligne",
          "Travail d'équipe et contraintes terrain",
          "Contrôle qualité et sécurité opérationnelle",
        ],
      },
    ],
  },
  projects: {
    index: "03",
    title: "Projets",
    items: [
      {
        period: "09/2025 – 12/2025",
        title: "MeetMagnet",
        place: "Réseau professionnel, couche IA",
        detail: "Collecte de données, mise en relation, automatisation des flux.",
        stack: "Python, MongoDB, n8n, React",
      },
      {
        period: "01/2025 – 06/2025",
        title: "Pronto",
        place: "Imageur 3D low-tech",
        detail: "Reconstruction à partir de trames binaires, couple caméra et projecteur.",
        stack: "Python",
      },
      {
        period: "01/2023 – 06/2024",
        title: "TIPE, ray marching",
        place: "Rendu volumétrique en C",
        detail:
          "Fonctions de distance, multithreading, gestion de la mémoire.",
        stack: "C",
      },
    ],
  },
  skills: {
    index: "04",
    title: "Compétences",
    groups: [
      {
        name: "IA et agents",
        items: ["LLM", "Systèmes agentiques", "RAG", "PyTorch", "Hugging Face", "n8n"],
      },
      {
        name: "Langages",
        items: ["Python", "C", "C++", "C#", "Rust", "Java", "OCaml", "SQL", "JavaScript / TypeScript"],
      },
      {
        name: "Systèmes et outils",
        items: ["Git", "Docker", "CI/CD", "Linux", "REST", "PostgreSQL", "MongoDB", "React", "Node.js"],
      },
      {
        name: "Langues",
        items: ["Français", "Anglais", "Espagnol"],
      },
    ],
  },
  hobbies: {
    index: "05",
    title: "Hobbies",
    sportsTitle: "Activités",
    sports: "Échecs, Athlétisme, Tennis, Volley",
    rolesTitle: "Associations",
    roles: [
      "Responsable intégration, BDE IMT Atlantique",
      "Responsable sponsoring, Fédération des associations",
    ],
    travelTitle: "Voyages",
    visited: "Pays visités",
    travel: [
      {
        place: "Montréal",
        note: "Actuellement en échange à Polytechnique Montréal.",
      },
    ],
  },
  puzzle: {
    kicker: "Problème du jour Lichess",
    fide: "Classé 2242 FIDE",
    loading: "Chargement du problème du jour.",
    error: "Lichess ne répond pas.",
    open: "Ouvrir sur Lichess",
    yourMove: "À vous.",
    white: "Les Blancs jouent et gagnent.",
    black: "Les Noirs jouent et gagnent.",
    wrong: "Ce n'est pas le coup.",
    solved: "Résolu.",
    previewing: "Lecture de la ligne.",
    showLine: "Voir la ligne",
    retry: "Recommencer",
    rating: "Difficulté",
    themes: "Thèmes",
  },
  contact: {
    index: "06",
    title: "Contact",
    write: "Écrire",
    copy: "Copier l'adresse",
    copied: "Copié",
    copyFailed: "Copie impossible",
    phone: "Téléphone",
    calendar: "Calendrier",
    pgp: "PGP",
    pgpNote: "Clé publique non publiée.",
  },
};

const en: ResumeContent = {
  metaTitle: "Eliot Burgalat",
  metaDescription:
    "Engineering student at IMT Atlantique, exchange at Polytechnique Montréal. End-of-studies internship from April 2027: AI, LLMs and agentic systems.",
  nav: [
    { id: "formation", label: "Education" },
    { id: "experiences", label: "Experience" },
    { id: "projets", label: "Projects" },
    { id: "competences", label: "Skills" },
    { id: "tactique", label: "Hobbies" },
    { id: "contact", label: "Contact" },
  ],
  role: "Engineering student in AI & software development, IMT Atlantique",
  status: "Seeking an end-of-studies internship from April 2027 (AI, LLM & agentic systems)",
  links: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    cv: "CV PDF",
    cvLabel: "Open the print dialog to save the CV as PDF",
  },
  education: {
    index: "01",
    title: "Education",
    items: [
      {
        period: "09/2026 – 01/2027",
        title: "Academic exchange, computer and software engineering",
        place: "Polytechnique Montréal",
        detail: "Machine learning, LLMs and data science.",
      },
      {
        period: "09/2024 – 2027",
        title: "Engineering student",
        place: "IMT Atlantique",
        detail: "Specialization in software development (GPA 3.61).",
      },
      {
        period: "09/2022 – 06/2024",
        title: "Preparatory class for the grandes écoles (CPGE) MP2I / MPI",
        place: "Lycée Pierre de Fermat, Toulouse",
        detail: "Mathematics, physics, computer science.",
      },
    ],
  },
  experience: {
    index: "02",
    title: "Experience",
    items: [
      {
        period: "04/2026 – 08/2026",
        title: "Full-stack engineering intern",
        place: "Notipro",
        points: [
          "Full-stack development and software architecture",
          "Algorithms and application logic",
          "UX/UI design and front-end integration",
          "Performance optimization and testing",
        ],
      },
      {
        period: "06/2025 – 07/2025",
        title: "Operator intern / Industry discovery",
        place: "Continental Automotive",
        points: [
          "Production flow and end-of-line logistics",
          "Teamwork and shop-floor constraints",
          "Quality control and operational safety",
        ],
      },
    ],
  },
  projects: {
    index: "03",
    title: "Projects",
    items: [
      {
        period: "09/2025 – 12/2025",
        title: "MeetMagnet",
        place: "Professional network, AI layer",
        detail: "Data collection, matching, and flow automation.",
        stack: "Python, MongoDB, n8n, React",
      },
      {
        period: "01/2025 – 06/2025",
        title: "Pronto",
        place: "Low-tech 3D imager",
        detail: "Reconstruction from binary frames, camera and projector pair.",
        stack: "Python",
      },
      {
        period: "01/2023 – 06/2024",
        title: "TIPE, ray marching",
        place: "Volumetric rendering in C",
        detail: "Distance functions, multithreading, memory management.",
        stack: "C",
      },
    ],
  },
  skills: {
    index: "04",
    title: "Skills",
    groups: [
      {
        name: "AI and agents",
        items: ["LLM", "Agentic systems", "RAG", "PyTorch", "Hugging Face", "n8n"],
      },
      {
        name: "Languages",
        items: ["Python", "C", "C++", "C#", "Rust", "Java", "OCaml", "SQL", "JavaScript / TypeScript"],
      },
      {
        name: "Systems and tools",
        items: ["Git", "Docker", "CI/CD", "Linux", "REST", "PostgreSQL", "MongoDB", "React", "Node.js"],
      },
      {
        name: "Spoken languages",
        items: ["French", "English", "Spanish"],
      },
    ],
  },
  hobbies: {
    index: "05",
    title: "Hobbies",
    sportsTitle: "Activities",
    sports: "Chess, Athletics, Tennis, Volleyball",
    rolesTitle: "Student unions",
    roles: [
      "Integration lead, BDE IMT Atlantique",
      "Sponsorship lead, Fédération des associations",
    ],
    travelTitle: "Travels",
    visited: "Countries visited",
    travel: [
      {
        place: "Montréal",
        note: "Currently on exchange at Polytechnique Montréal.",
      },
    ],
  },
  puzzle: {
    kicker: "Lichess daily puzzle",
    fide: "Rated 2242 FIDE",
    loading: "Loading today's puzzle.",
    error: "Lichess did not respond.",
    open: "Open on Lichess",
    yourMove: "Your move.",
    white: "White to play and win.",
    black: "Black to play and win.",
    wrong: "Not this move.",
    solved: "Solved.",
    previewing: "Playing the line.",
    showLine: "Show the line",
    retry: "Start over",
    rating: "Rating",
    themes: "Themes",
  },
  contact: {
    index: "06",
    title: "Contact",
    write: "Write",
    copy: "Copy address",
    copied: "Copied",
    copyFailed: "Copy failed",
    phone: "Phone",
    calendar: "Calendar",
    pgp: "PGP",
    pgpNote: "Public key not published.",
  },
};

export const resume: Record<Locale, ResumeContent> = { fr, en };

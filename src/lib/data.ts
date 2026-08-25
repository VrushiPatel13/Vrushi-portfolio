/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH for every word on the site.
 *
 * RULE: real data only. Every credential below was read directly out of the
 * certificate PDF — titles, issuers, dates and verification codes transcribed,
 * not paraphrased — and carries its live verification URL. Projects come from
 * the CV. GitHub figures are fetched live, never typed in. Nothing is invented:
 * if it can't be verified, it isn't on the page.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                   PROFILE                                   */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Vrushi Patel",
  legalName: "Vrushi Jayeshbhai Patel",
  first: "VRUSHI",
  last: "PATEL",
  initials: "VP",
  role: "AI Engineer",
  roles: ["AI Engineer", "Full-Stack Developer", "Software Engineer"],
  positioning:
    "Applied AI — computer vision, retrieval systems, and the backends that carry them.",
  location: "Ahmedabad, India",
  timezone: "IST · UTC+5:30",
  email: "vruship13@gmail.com",
  phone: "+91 93131 12755",
  phoneHref: "+919313112755",
  availability: "Open to roles",
  resume: "/vrushi-patel-resume.pdf",
  githubUser: "VrushiPatel13",
  // Canonical origin resolves at build time in `src/lib/site.ts`.
} as const;

/* -------------------------------------------------------------------------- */
/*                                    ABOUT                                    */
/* -------------------------------------------------------------------------- */

export const about = {
  headline: "I build the layer between a model and something people can use.",
  paragraphs: [
    "I work on applied AI — the part after the notebook. Detection wired to an alerting pipeline. Retrieval wired to real documents. A dashboard someone can open on a Tuesday morning and act on. Most of what I know came from building a small version, breaking it, and finding out why.",
    "I started in Java, writing management systems where every state transition had to be handled by hand. That taught me schema design and defensive validation before it taught me anything about models — which is why my AI work tends to ship. I'm early in my career and comfortable saying so.",
  ],
  pullQuote: "A model that never leaves the notebook hasn't solved anything.",
};

export type Trait = { title: string; body: string };

export const traits: Trait[] = [
  {
    title: "Curiosity",
    body: "I learn a system by rebuilding a small version of it, then breaking it on purpose.",
  },
  {
    title: "Rigour",
    body: "Typed, documented, validated. I care as much about the schema as the forecast on top of it.",
  },
  {
    title: "Ownership",
    body: "I take a problem end to end — data, model, API, interface — not just the easy half.",
  },
  {
    title: "Clarity",
    body: "If I can't explain a trade-off in one sentence, I don't understand it yet.",
  },
  {
    title: "Persistence",
    body: "Most of my work is the third attempt. That's usually where it starts being good.",
  },
  {
    title: "Candour",
    body: "I'd rather ask the obvious question than quietly guess and ship the guess.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                 RUN HISTORY                                 */
/* -------------------------------------------------------------------------- */

export type RunEntry = {
  id: string;
  period: string;
  org: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
  current?: boolean;
};

export const runHistory: RunEntry[] = [
  {
    id: "independent-ai",
    period: "2026 — Present",
    org: "Independent practice",
    title: "Applied AI Systems",
    current: true,
    summary:
      "Self-directed work taking machine learning past the notebook and into services with an API, a datastore and an interface.",
    points: [
      "Built a computer-vision shelf intelligence platform: detection, planogram compliance, demand forecasting and prioritised alerting.",
      "Built a retrieval-augmented chat stack with hybrid search, reranking and citation-grounded answers.",
      "Designed an agentic assistant around tool calling, task decomposition and persistent context.",
    ],
    stack: ["Python", "PyTorch", "OpenCV", "LangChain", "FastAPI", "PostgreSQL"],
  },
  {
    id: "systems-foundation",
    period: "2025 — 2026",
    org: "Academic & personal builds",
    title: "Systems and Full-Stack Engineering",
    summary:
      "Two management systems written from first principles in Java, then a three-sided marketplace taken to live deployment.",
    points: [
      "Delivery platform with a guarded four-stage lifecycle and a normalised MySQL schema across customers, consignments and payments.",
      "Admin surfaces for cost control, monitoring and reporting, kept privilege-separated from customer modules.",
      "RentIt marketplace shipped end to end — auth, CRUD, external APIs — and deployed publicly rather than left on localhost.",
    ],
    stack: ["Java", "MySQL", "Django", "Firebase", "JavaScript", "Render"],
  },
  {
    id: "btech",
    period: "2024 — 2028",
    org: "L.J. University, Ahmedabad",
    title: "B.Tech, Computer Science Engineering (AI)",
    summary: "Core computer science with an artificial intelligence specialisation.",
    points: [
      "Algorithms, data structures and application architecture, taught through Java.",
      "Coursework across machine learning, deep learning and data science.",
      "Consistent record of taking coursework further into shipped, real-world projects.",
    ],
    stack: ["Algorithms", "Data Structures", "Machine Learning", "Databases"],
  },
];

/* -------------------------------------------------------------------------- */
/*                                 BOSS FIGHTS                                 */
/* -------------------------------------------------------------------------- */

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  oneLiner: string;
  description: string;
  /** Structural facts about the build — never unmeasured performance claims. */
  metrics: { value: string; label: string }[];
  points: string[];
  stack: string[];
  status: "Live" | "Shipped" | "In development";
  /** Empty strings hide the buttons. Add URLs when the repos go public. */
  repo: string;
  demo: string;
};

export const projects: Project[] = [
  {
    id: "retail-intelligence",
    title: "Retail Intelligence Platform",
    category: "Computer Vision",
    year: "2026",
    status: "Shipped",
    oneLiner: "Shelf monitoring that reads the cameras a store already has.",
    description:
      "Out-of-stock events are a last-mile visibility problem: nobody knows the state of a shelf until a customer complains. This reads existing camera feeds, diffs what it sees against the intended planogram, forecasts demand per SKU, and routes alerts to whoever can fix them.",
    metrics: [
      { value: "< 5 min", label: "alert target" },
      { value: "SKU-level", label: "detection" },
      { value: "3", label: "alert channels" },
    ],
    points: [
      "Detection that separates visually similar products under partial occlusion, odd angles and mixed lighting.",
      "Planogram engine scoring compliance per aisle and per shelf section against a structured layout.",
      "Demand forecasting over POS history, promotional calendars and weather, driving automated reorder points.",
    ],
    stack: ["Python", "PyTorch", "YOLO", "OpenCV", "Prophet", "PostgreSQL", "Redis"],
    repo: "",
    demo: "",
  },
  {
    id: "conversational-rag",
    title: "Conversational RAG",
    category: "AI / LLM",
    year: "2026",
    status: "In development",
    oneLiner: "A chat layer that cites its sources instead of inventing them.",
    description:
      "Most RAG demos retrieve once, fill the context window and hope. This treats retrieval as the product: structure-aware chunking, hybrid dense and keyword search, reranking before generation, and answers traceable to the passage they came from.",
    metrics: [
      { value: "Hybrid", label: "retrieval" },
      { value: "Cited", label: "every claim" },
      { value: "Streamed", label: "transport" },
    ],
    points: [
      "Ingestion pipeline with structure-aware chunking and embedding generation across mixed formats.",
      "Query rewriting so multi-turn follow-ups retrieve as well as first questions do.",
      "Abstention when retrieval confidence is low, rather than a confident guess.",
    ],
    stack: ["Python", "LangChain", "Vector DB", "Embeddings", "FastAPI", "Next.js"],
    repo: "",
    demo: "",
  },
  {
    id: "gopackage",
    title: "GoPackage Delivery System",
    category: "Backend Systems",
    year: "2025",
    status: "Shipped",
    oneLiner: "A logistics platform with every state transition written by hand.",
    description:
      "A delivery management system in the spirit of Porter, with live consignment tracking and a full operational back office. No framework doing the thinking — the state machine, schema, validation and reporting were each designed explicitly, which is why it holds under messy input.",
    metrics: [
      { value: "4-stage", label: "lifecycle" },
      { value: "2", label: "role modules" },
      { value: "Normalised", label: "schema" },
    ],
    points: [
      "Booked to Picked Up to In Transit to Delivered, with transitions guarded rather than assumed.",
      "MySQL schema spanning customers, consignments, drivers and payment history.",
      "Admin console for cost control, live monitoring and revenue reporting.",
    ],
    stack: ["Java", "MySQL", "JDBC", "OOP"],
    repo: "",
    demo: "",
  },
  {
    id: "rentit",
    title: "RentIt Marketplace",
    category: "Full Stack",
    year: "2026",
    status: "Live",
    oneLiner: "Rent a product, hire a service, book a space — one marketplace.",
    description:
      "A three-sided rental marketplace where physical products, skilled services and bookable spaces all move through one listing, availability and transaction model. Built end to end and deployed publicly.",
    metrics: [
      { value: "3", label: "listing types" },
      { value: "Live", label: "deployed" },
      { value: "Complete", label: "CRUD" },
    ],
    points: [
      "Secure authentication with session handling and protected routes across every listing type.",
      "Full CRUD over listings, bookings and profiles with realtime data updates.",
      "External API integrations, on a frontend that stays legible from 360px up.",
    ],
    stack: ["Python", "Django", "Firebase", "JavaScript", "REST APIs", "Render"],
    repo: "",
    demo: "",
  },
  {
    id: "ai-assistant",
    title: "Personal AI Assistant",
    category: "AI Agents",
    year: "2026",
    status: "In development",
    oneLiner: "An assistant that plans, calls a tool, checks the result, continues.",
    description:
      "The difference between a chatbot and an assistant is whether it can act. This runs a real agent loop — decompose, select a tool, execute, observe, iterate — with every call bounded so a bad plan cannot run away with the machine.",
    metrics: [
      { value: "Plan to act", label: "agent loop" },
      { value: "Persistent", label: "context" },
      { value: "Voice + text", label: "input" },
    ],
    points: [
      "Tool calling with structured schemas, argument validation and bounded retries.",
      "Task decomposition into verifiable steps with observable state.",
      "Local-first design, so private context never has to leave the machine.",
    ],
    stack: ["Python", "LLM APIs", "Tool Calling", "Speech", "AsyncIO"],
    repo: "",
    demo: "",
  },
];

export const archiveProjects = [
  {
    id: "park-management",
    title: "Entertainment Park Management System",
    year: "2025",
    blurb:
      "Java application for park rides and food services, with separate admin and customer modules and a validated menu-driven interface.",
    stack: ["Java", "OOP"],
  },
];

/* -------------------------------------------------------------------------- */
/*                                  INVENTORY                                  */
/* -------------------------------------------------------------------------- */

export type InventoryGroup = { title: string; items: string[] };

/** Plain lists, straight from the CV. No invented proficiency numbers. */
export const inventory: InventoryGroup[] = [
  {
    title: "Languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "C++", "SQL"],
  },
  {
    title: "AI / ML",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "OpenCV",
      "YOLO",
      "LangChain",
      "RAG",
      "Prompt Engineering",
      "AI Agents",
    ],
  },
  {
    title: "Backend",
    items: ["Django", "FastAPI", "Node.js", "REST APIs", "Auth Systems", "JDBC"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Bootstrap"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Vercel", "Render", "Streamlit"],
  },
];

export const inventoryCount = inventory.reduce((n, g) => n + g.items.length, 0);

/* -------------------------------------------------------------------------- */
/*                                 IN PROGRESS                                 */
/* -------------------------------------------------------------------------- */

export const inProgress = [
  {
    label: "Building",
    title: "Conversational RAG",
    note: "Reranking layer and evaluation harness.",
  },
  {
    label: "Building",
    title: "Personal AI Assistant",
    note: "Expanding the tool registry and voice loop.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                ACHIEVEMENTS                                 */
/* -------------------------------------------------------------------------- */

export type Achievement = {
  id: string;
  rail: string;
  title: string;
  org: string;
  note: string;
  kind: "award" | "education" | "certificate";
  /** Live verification URL, transcribed from the certificate itself. */
  url?: string;
  /** Individual courses inside a specialization, each independently verifiable. */
  parts?: { title: string; url: string }[];
};

export const achievements: Achievement[] = [
  {
    id: "google-prompting-essentials",
    rail: "Jun 2026",
    title: "Google Prompting Essentials",
    org: "Google · Specialization via Coursera",
    note: "Four-course specialization developed by Google. Designing effective prompts and applying advanced prompting techniques to complete complex tasks, analyse data and summarise information.",
    kind: "certificate",
    url: "https://coursera.org/verify/specialization/FA7UK1B7C82N",
    parts: [
      {
        title: "Start Writing Prompts like a Pro",
        url: "https://coursera.org/verify/DN2WZ5JYSHRX",
      },
      {
        title: "Design Prompts for Everyday Work Tasks",
        url: "https://coursera.org/verify/0R30P819U0V8",
      },
      {
        title: "Speed Up Data Analysis and Presentation Building",
        url: "https://coursera.org/verify/LPEAN5YXSSIU",
      },
      {
        title: "Use AI as a Creative or Expert Partner",
        url: "https://coursera.org/verify/QUIFS4OE90JW",
      },
    ],
  },
  {
    id: "ibm-eda-ml",
    rail: "Jun 2026",
    title: "Exploratory Data Analysis for Machine Learning",
    org: "IBM · Coursera",
    note: "Retrieving, cleaning and exploring data for machine learning — feature engineering, hypothesis testing and the statistics underneath model selection.",
    kind: "certificate",
    url: "https://coursera.org/verify/BGVYD98XR4EI",
  },
  {
    id: "retail-challenge",
    rail: "2026",
    title: "Smart Retail Shelf Intelligence",
    org: "AI Challenge · Retail & AI domain",
    note: "Delivered the full brief: computer-vision shelf analysis, planogram compliance, demand forecasting with reorder-point generation, a sub-five-minute alerting pipeline and a management analytics dashboard.",
    kind: "award",
  },
  {
    id: "btech-record",
    rail: "2024 — 2028",
    title: "B.Tech, Computer Science Engineering (AI)",
    org: "L.J. University, Ahmedabad",
    note: "Algorithms, systems design, machine learning and databases.",
    kind: "education",
  },
];

/* -------------------------------------------------------------------------- */
/*                                  ELSEWHERE                                  */
/* -------------------------------------------------------------------------- */

export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "phone";
};

export const socials: Social[] = [
  {
    label: "GitHub",
    handle: "@VrushiPatel13",
    href: "https://github.com/VrushiPatel13",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "in/vrushi-patel",
    href: "https://www.linkedin.com/in/vrushi-patel",
    icon: "linkedin",
  },
  {
    label: "Phone",
    handle: profile.phone,
    href: `tel:${profile.phoneHref}`,
    icon: "phone",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   LEVELS                                    */
/* -------------------------------------------------------------------------- */

export const levels = [
  { id: "about", num: "01", tag: "Origin", label: "About" },
  { id: "run", num: "02", tag: "Run History", label: "Experience" },
  { id: "work", num: "03", tag: "Boss Fights", label: "Work" },
  { id: "stats", num: "04", tag: "Stats", label: "GitHub" },
  { id: "inventory", num: "05", tag: "Inventory", label: "Skills" },
  { id: "achievements", num: "06", tag: "Achievements", label: "Awards" },
  { id: "contact", num: "07", tag: "Continue?", label: "Contact" },
] as const;

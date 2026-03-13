export type NodeType = "domain" | "project" | "experience" | "skill" | "achievement";

export interface ZettelNode {
  id: string;
  label: string;
  type: NodeType;
  isLanguage?: boolean;
  since?: number;
  subtitle?: string;
  description?: string;
  links?: { label: string; url: string }[];
  image?: string;
  detailHref?: string;
}

export interface ZettelEdge {
  source: string;
  target: string;
}

// --- Filter system ---

export type FilterGroup = "all" | "context" | "problem-space" | "maturity";

export interface SubFilter {
  id: string;
  label: string;
  color: string;
}

export const FILTER_GROUPS: { id: FilterGroup; label: string }[] = [
  { id: "all", label: "All" },
  { id: "context", label: "Context" },
  { id: "problem-space", label: "Problem Space" },
  { id: "maturity", label: "Maturity" },
];

export const SUB_FILTERS: Record<string, SubFilter[]> = {
  context: [
    { id: "ctx-professional", label: "Professional", color: "#e06c75" },
    { id: "ctx-hackathons", label: "Hackathons", color: "#d19a66" },
    { id: "ctx-personal", label: "Personal", color: "#c4b5fd" },
  ],
  "problem-space": [
    { id: "ps-dev-tooling", label: "Developer Tooling", color: "#8b8b8b" },
    { id: "ps-infra-cloud", label: "Infra & Cloud", color: "#e06c75" },
    { id: "ps-product", label: "Product Engineering", color: "#c4b5fd" },
    { id: "ps-ai", label: "AI & Automation", color: "#d19a66" },
  ],
  maturity: [
    { id: "mat-deep", label: "Deep (3+ yr)", color: "#e06c75" },
    { id: "mat-growing", label: "Growing (2 yr)", color: "#c4b5fd" },
    { id: "mat-exploring", label: "Exploring (< 1 yr)", color: "#8b8b8b" },
  ],
};

// Cluster membership maps — primary nodes for each sub-filter
export const CLUSTER_MAP: Record<string, string[]> = {
  // Context
  "ctx-professional": [
    "arrive-25", "arrive-24", "arrive-23", "surge-new",
  ],
  "ctx-hackathons": [
    "tamuhack-26", "build4good-25", "tamuhack-25",
  ],
  "ctx-personal": [
    "pupil", "aggiedine", "ima", "lloydalba-dev", "findmoto",
  ],

  // Problem Space
  "ps-dev-tooling": [
    "surge-new", "arrive-23", "findmoto", "tooling", "python",
  ],
  "ps-infra-cloud": [
    "arrive-25", "arrive-24", "devops", "cloud",
    "terraform", "azure", "docker", "new-relic",
  ],
  "ps-product": [
    "aggiedine", "ima", "lloydalba-dev", "frontend", "mobile",
    "nextjs", "typescript", "tailwind", "swift", "swiftui", "react-native", "aws-cognito",
  ],
  "ps-ai": [
    "pupil", "ai", "claude-api", "playwright",
  ],

  // Maturity (skills only, but expand to show connected work)
  "mat-deep": ["python", "cpp", "azure", "docker"],
  "mat-growing": ["typescript", "nextjs", "tailwind"],
  "mat-exploring": [
    "swift", "dotnet", "terraform", "react-native", "swiftui",
    "playwright", "claude-api", "aws-cognito", "new-relic",
  ],
};

// --- Graph data ---

export const nodes: ZettelNode[] = [
  // Domains
  { id: "devops", label: "DevOps & CI/CD", type: "domain", subtitle: "Pipelines, automation, and deployment", description: "Building and maintaining CI/CD pipelines, automating infrastructure, and streamlining deployment workflows." },
  { id: "cloud", label: "Cloud & Infra", type: "domain", subtitle: "Cloud platforms and infrastructure", description: "Designing cloud architecture, managing resources, and implementing infrastructure as code." },
  { id: "backend", label: "Backend", type: "domain", subtitle: "Server-side engineering", description: "Building APIs, microservices, and server-side systems with a focus on reliability and performance." },
  { id: "mobile", label: "Mobile", type: "domain", subtitle: "Native and cross-platform apps", description: "Developing mobile applications across iOS and cross-platform frameworks." },
  { id: "ai", label: "AI & Agents", type: "domain", subtitle: "Intelligent automation", description: "Building agentic AI systems that observe, learn, and autonomously execute tasks." },
  { id: "frontend", label: "Frontend", type: "domain", subtitle: "Web interfaces and experiences", description: "Crafting responsive, performant web interfaces with modern frameworks." },
  { id: "tooling", label: "CLI Tooling", type: "domain", subtitle: "Developer productivity tools", description: "Building command-line tools that automate workflows and reduce developer friction." },

  // Projects
  { id: "pupil", label: "Pupil", type: "project", subtitle: "Agentic AI framework", description: "Enables agents to shadow engineers during live workflows, learn patterns through observation, and autonomously execute learned tasks.", detailHref: "/projects/pupil", links: [{ label: "GitHub", url: "https://github.com/premiumfriedrice/pupil" }] },
  { id: "aggiedine", label: "AggieDine", type: "project", subtitle: "Social dining platform", description: "Social dining platform for Texas A&M students. Microservices architecture with AWS Cognito authentication and independent service scaling.", detailHref: "/projects/aggiedine" },
  { id: "ima", label: "ima", type: "project", subtitle: "iOS habit & task tracker", description: "Fully featured habit & task tracking iOS app as an alternative to subscription-based productivity tools. Custom UI/UX iterated through 5+ design revisions.", detailHref: "/projects/ima" },
  { id: "lloydalba-dev", label: "lloydalba.dev", type: "project", subtitle: "Personal portfolio", description: "This site. Built with Next.js, TypeScript, and Tailwind CSS. Features an interactive knowledge graph, thoughts feed, and live GitHub data.", detailHref: "/projects/lloydalba-dev", links: [{ label: "GitHub", url: "https://github.com/premiumfriedrice/lloydalba.dev" }] },
  { id: "findmoto", label: "findMoto", type: "project", subtitle: "Motorcycle deal finder", description: "Facebook Marketplace webscraper tailored for finding best motorcycle deals.", detailHref: "/projects/findmoto", links: [{ label: "GitHub", url: "https://github.com/amasud7/findMoto" }] },
  { id: "surge-new", label: "Surge New", type: "project", subtitle: "Internal CLI tool", description: "Automated project scaffolding — version control, .NET template creation, and CI/CD pipelines. Achieved 14% reduction in dev time, $38.4K annual savings.", detailHref: "/projects/surge-new", links: [{ label: "Demo", url: "https://drive.google.com/file/d/11D9j2wbfckiiUenRMl5at5TqRkMnPtzd/view?usp=sharing" }] },

  // Experiences
  { id: "arrive-25", label: "Arrive '25", type: "experience", subtitle: "SWE Intern, Platform", description: "Modernized company-wide services, built fault-tolerant telemetry, and engineered reusable Terraform modules for Azure resource governance.", links: [{ label: "Company", url: "https://www.arrivelogistics.com/" }] },
  { id: "arrive-24", label: "Arrive '24", type: "experience", subtitle: "SWE Intern, Platform", description: "Architected CI/CD pipelines as code, standardized deployment workflows, and mentored interns on cloud deployment strategies.", links: [{ label: "Company", url: "https://www.arrivelogistics.com/" }] },
  { id: "arrive-23", label: "Arrive '23", type: "experience", subtitle: "SWE Intern, Platform", description: "Built a Python CLI tool that automated manual workflows, reducing sprint overhead by 14%. Reduced Kubernetes app setup from 2 days to 3 minutes.", links: [{ label: "Company", url: "https://www.arrivelogistics.com/" }] },

  // Skills — Languages
  { id: "python", label: "Python", type: "skill", isLanguage: true, since: 2021, subtitle: "Primary language", description: "Used extensively across CLI tools, backend services, AI agents, and hackathon projects." },
  { id: "swift", label: "Swift", type: "skill", isLanguage: true, since: 2025, subtitle: "iOS development", description: "Building native iOS applications with Swift and SwiftUI." },
  { id: "dotnet", label: ".NET", type: "skill", isLanguage: false, since: 2025, subtitle: "Enterprise framework", description: "Migrating and modernizing .NET Core services to .NET 8 at Arrive Logistics." },
  { id: "typescript", label: "TypeScript", type: "skill", isLanguage: true, since: 2024, subtitle: "Web development", description: "Primary language for frontend and full-stack web development with Next.js and React." },
  { id: "cpp", label: "C++", type: "skill", isLanguage: true, since: 2022, subtitle: "Systems programming", description: "Used in coursework and algorithmic problem solving." },

  // Skills — Tools / Frameworks / Platforms
  { id: "terraform", label: "Terraform", type: "skill", since: 2025, subtitle: "Infrastructure as Code", description: "Engineering reusable Terraform modules for Azure resource tagging and compliance." },
  { id: "azure", label: "Azure", type: "skill", since: 2023, subtitle: "Cloud platform", description: "Deep experience with Azure DevOps, pipelines, and cloud resource management across 3 internship terms." },
  { id: "docker", label: "Docker", type: "skill", since: 2023, subtitle: "Containerization", description: "Containerizing applications for Kubernetes deployment and local development." },
  { id: "react-native", label: "React Native", type: "skill", since: 2025, subtitle: "Cross-platform mobile", description: "Building cross-platform mobile apps with React Native for AggieDine." },
  { id: "swiftui", label: "SwiftUI", type: "skill", since: 2025, subtitle: "Declarative iOS UI", description: "Building the interface for ima with SwiftUI's declarative approach." },
  { id: "playwright", label: "Playwright", type: "skill", since: 2025, subtitle: "Browser automation", description: "Powering Pupil's ability to observe and replay engineer workflows in the browser." },
  { id: "claude-api", label: "Claude API", type: "skill", since: 2025, subtitle: "AI integration", description: "Core intelligence layer for Pupil's intent recognition and task execution." },
  { id: "aws-cognito", label: "AWS Cognito", type: "skill", since: 2025, subtitle: "Authentication", description: "Managing user authentication and authorization for AggieDine's microservices." },
  { id: "nextjs", label: "Next.js", type: "skill", since: 2024, subtitle: "React framework", description: "Full-stack React framework powering this portfolio and other web projects." },
  { id: "new-relic", label: "New Relic", type: "skill", since: 2025, subtitle: "Observability", description: "Integrating telemetry and building fault-tolerant service-tagging systems." },
  { id: "tailwind", label: "Tailwind CSS", type: "skill", since: 2024, subtitle: "Utility-first CSS", description: "Styling web interfaces with Tailwind's utility-first approach." },

  // Achievements
  { id: "tamuhack-26", label: "TAMUHack '26 — 1st", type: "achievement", subtitle: "1st Place Overall", description: "Won first place at TAMUHack 2026 against 650+ competitors." },
  { id: "build4good-25", label: "Build4Good '25 — 1st", type: "achievement", subtitle: "1st Place Notion-API", description: "Won first place in the Notion API category at Texas A&M Computing Society Build4Good 2025." },
  { id: "tamuhack-25", label: "TAMUHack '25 — 2nd", type: "achievement", subtitle: "2nd Place arm-challenge", description: "Placed second in the ARM challenge at TAMUHack 2025." },
];

export const edges: ZettelEdge[] = [
  // Domain ↔ Skill
  { source: "devops", target: "terraform" },
  { source: "devops", target: "azure" },
  { source: "devops", target: "docker" },
  { source: "devops", target: "new-relic" },
  { source: "cloud", target: "terraform" },
  { source: "cloud", target: "azure" },
  { source: "cloud", target: "docker" },
  { source: "cloud", target: "aws-cognito" },
  { source: "backend", target: "python" },
  { source: "backend", target: "dotnet" },
  { source: "backend", target: "cpp" },
  { source: "mobile", target: "swift" },
  { source: "mobile", target: "swiftui" },
  { source: "mobile", target: "react-native" },
  { source: "ai", target: "claude-api" },
  { source: "ai", target: "playwright" },
  { source: "ai", target: "python" },
  { source: "frontend", target: "nextjs" },
  { source: "frontend", target: "typescript" },
  { source: "frontend", target: "tailwind" },
  { source: "frontend", target: "react-native" },
  { source: "tooling", target: "python" },

  // Project ↔ Skill
  { source: "pupil", target: "python" },
  { source: "pupil", target: "playwright" },
  { source: "pupil", target: "claude-api" },
  { source: "aggiedine", target: "python" },
  { source: "aggiedine", target: "aws-cognito" },
  { source: "aggiedine", target: "react-native" },
  { source: "ima", target: "swift" },
  { source: "ima", target: "swiftui" },
  { source: "lloydalba-dev", target: "nextjs" },
  { source: "lloydalba-dev", target: "typescript" },
  { source: "lloydalba-dev", target: "tailwind" },
  { source: "findmoto", target: "python" },
  { source: "surge-new", target: "python" },
  { source: "surge-new", target: "azure" },

  // Project ↔ Domain
  { source: "pupil", target: "ai" },
  { source: "aggiedine", target: "mobile" },
  { source: "aggiedine", target: "backend" },
  { source: "ima", target: "mobile" },
  { source: "lloydalba-dev", target: "frontend" },
  { source: "findmoto", target: "tooling" },
  { source: "surge-new", target: "tooling" },
  { source: "surge-new", target: "devops" },

  // Experience ↔ Skill
  { source: "arrive-25", target: "dotnet" },
  { source: "arrive-25", target: "new-relic" },
  { source: "arrive-25", target: "terraform" },
  { source: "arrive-25", target: "azure" },
  { source: "arrive-24", target: "azure" },
  { source: "arrive-23", target: "python" },

  // Experience ↔ Domain
  { source: "arrive-25", target: "backend" },
  { source: "arrive-25", target: "cloud" },
  { source: "arrive-25", target: "devops" },
  { source: "arrive-24", target: "devops" },
  { source: "arrive-23", target: "tooling" },
  { source: "arrive-23", target: "devops" },

  // Achievement connections
  { source: "tamuhack-26", target: "python" },
  { source: "tamuhack-26", target: "ai" },
  { source: "build4good-25", target: "python" },
  { source: "build4good-25", target: "frontend" },
  { source: "tamuhack-25", target: "python" },
  { source: "tamuhack-25", target: "backend" },
];

// --- Helpers ---

export function getNodeDegree(nodeId: string): number {
  return edges.filter((e) => e.source === nodeId || e.target === nodeId).length;
}

export function getConnectedIds(nodeId: string): Set<string> {
  const ids = new Set([nodeId]);
  for (const e of edges) {
    if (e.source === nodeId) ids.add(e.target);
    if (e.target === nodeId) ids.add(e.source);
  }
  return ids;
}

export function getClusterIds(subFilterId: string): Set<string> {
  const primaryIds = CLUSTER_MAP[subFilterId];
  if (!primaryIds) return new Set(nodes.map((n) => n.id));

  const primary = new Set(primaryIds);
  const expanded = new Set(primary);

  // Expand to direct connections
  for (const e of edges) {
    if (primary.has(e.source)) expanded.add(e.target);
    if (primary.has(e.target)) expanded.add(e.source);
  }

  return expanded;
}

// Get which cluster a node belongs to (for coloring in cluster mode)
export function getClusterColor(
  nodeId: string,
  group: FilterGroup
): string | null {
  const groupKey = group as string;
  const subFilters = SUB_FILTERS[groupKey];
  if (!subFilters) return null;

  for (const sf of subFilters) {
    const primary = CLUSTER_MAP[sf.id];
    if (primary && primary.includes(nodeId)) {
      return sf.color;
    }
  }
  return null;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  skills: string[];
  githubRepo?: string; // "owner/repo" format
  externalLink?: string;
  image?: string;
  startDate?: string; // ISO date
  featured?: boolean;
}

export interface Experience {
  time: string;
  position: string;
  company: string;
  companyUrl?: string;
  bullets: string[];
  skills: string[];
}

export interface Achievement {
  title: string;
  event: string;
}

export interface Education {
  time: string;
  degree: string;
  school: string;
  schoolUrl?: string;
}

export interface Thought {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  projectSlug?: string;
}

export interface NodeContent {
  bullets?: string[];
  skills?: string[];
  githubRepo?: string;
  relatedThoughtSlugs?: string[];
}

export interface GitHubRepoData {
  name: string;
  description: string | null;
  html_url: string;
  pushed_at: string;
  languages: Record<string, number>;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
}

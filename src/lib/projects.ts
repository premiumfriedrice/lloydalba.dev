import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "pupil",
    name: "Pupil",
    description:
      "Agentic AI framework that enables agents to shadow engineers during live workflows, learn patterns through observation, and autonomously execute learned tasks. Features intent token pipelines, adaptive maturity progression, and cost-aware compute tiers.",
    skills: ["Python", "Playwright", "Claude API"],
    githubRepo: "premiumfriedrice/pupil",
    startDate: "2025-01-01",
    featured: true,
  },
  {
    slug: "aggiedine",
    name: "AggieDine",
    description:
      "Social dining platform for Texas A&M students. Leading a team of 6 backend engineers with microservices architecture, AWS Cognito authentication, and independent scaling of core services.",
    skills: ["Python", "AWS Cognito", "React Native"],
    startDate: "2025-01-01",
    featured: true,
  },
  {
    slug: "ima",
    name: "ima",
    description:
      "Fully featured habit & task tracking iOS app as an alternative to subscription-based productivity tools. Custom UI/UX design philosophy iterated through 5+ design revisions.",
    skills: ["Swift", "SwiftUI"],
    githubRepo: "premiumfriedrice/ima",
    startDate: "2025-01-01",
    featured: true,
  },
  {
    slug: "lloydalba-dev",
    name: "lloydalba.dev",
    description:
      "My personal portfolio site. Built with Next.js, TypeScript, and Tailwind CSS. Features a thoughts feed, live GitHub data, and a status indicator.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    githubRepo: "premiumfriedrice/lloydalba.dev",
    image: "/images/PersonalWebsite.png",
    startDate: "2024-01-01",
    featured: true,
  },
  {
    slug: "findmoto",
    name: "findMoto",
    description:
      "Facebook Marketplace webscraper tailored for finding best motorcycle deals.",
    skills: ["Python", "Terminal", "Argparse"],
    githubRepo: "amasud7/findMoto",
    image: "/images/findMoto_demo.gif",
    startDate: "2023-06-01",
    featured: true,
  },
  {
    slug: "surge-new",
    name: "Surge New",
    description:
      "Internal CLI Tool feature that streamlined project scaffolding by fully automating version control, REST-API .NET template app creation, and CI/CD pipelines. Achieved a 14% reduction in development time resulting in $38,400 annual savings in engineer salary costs.",
    skills: ["Python", "Terminal", "CI/CD", "Azure DevOps", "Argparse"],
    externalLink:
      "https://drive.google.com/file/d/11D9j2wbfckiiUenRMl5at5TqRkMnPtzd/view?usp=sharing",
    image: "/images/surge_new.png",
    startDate: "2023-05-01",
    featured: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

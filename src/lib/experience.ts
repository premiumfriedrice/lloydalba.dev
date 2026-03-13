import { Experience, Education, Achievement } from "@/types";

export const experiences: Experience[] = [
  {
    time: "Summer 2025",
    position: "Software Engineer Intern, Platform",
    company: "Arrive Logistics",
    companyUrl: "https://www.arrivelogistics.com/",
    bullets: [
      "Modernized a company-wide user management service by migrating critical infrastructure from .NET Core to .NET 8, implementing centralized exception handling and integrating New Relic telemetry.",
      "Resolved CI/CD pipeline failures by building a fault-tolerant New Relic service-tagging system.",
      "Optimized Azure resource governance by engineering reusable Terraform modules for resource tagging, ensuring compliance across cloud resources and reducing configuration drift.",
    ],
    skills: ["Terraform", "HCL", ".NET", "New Relic", "CI/CD", "Azure DevOps"],
  },
  {
    time: "Summer 2024",
    position: "Software Engineer Intern, Platform",
    company: "Arrive Logistics",
    companyUrl: "https://www.arrivelogistics.com/",
    bullets: [
      "Architected CI/CD pipelines as code, migrating three services from legacy GUI configurations to YAML-based pipelines to enforce DevOps best practices.",
      "Standardized deployment workflows by engineering modular pipeline templates for diverse Git branching strategies, eliminating manual configuration effort for new services.",
      "Mentored two interns on pipeline debugging and cloud deployment strategies, enabling the team to deliver project milestones two weeks ahead of schedule.",
    ],
    skills: ["YAML", "CI/CD", "Terminal", "Azure DevOps"],
  },
  {
    time: "Summer 2023",
    position: "Software Engineer Intern, Platform",
    company: "Arrive Logistics",
    companyUrl: "https://www.arrivelogistics.com/",
    bullets: [
      "Engineered a Python-based CLI tool feature that automated high-touch manual workflows, reducing sprint overhead by 14% and generating $38,400 in annual operational savings.",
      "Significantly reduced application setup time for Kubernetes deployment from 2 days to under 3 minutes.",
      "Delivered a high-impact presentation about the project to 80+ engineers and Code2College board.",
    ],
    skills: ["Python", "Automation", "CI/CD", "Terminal", "Azure DevOps"],
  },
];

export const education: Education = {
  time: "Class of 2027",
  degree: "B.Sc. in Computer Science",
  school: "Texas A&M University",
  schoolUrl: "https://www.tamu.edu/",
};

export const achievements: Achievement[] = [
  {
    title: "1st Place Overall",
    event: "TAMUHack 2026 Hackathon (650+ Competitors)",
  },
  {
    title: "1st Place Notion-API",
    event: "Texas A&M Computing Society Build4Good 2025 Hackathon",
  },
  {
    title: "2nd Place arm-challenge",
    event: "TAMUHack 2025 Hackathon",
  },
];

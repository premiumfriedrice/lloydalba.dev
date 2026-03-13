import { NodeContent } from "@/types";
import { projects } from "@/lib/projects";
import { experiences } from "@/lib/experience";

// Map project slugs to node IDs (they match 1:1 in this codebase)
const projectContent: Record<string, NodeContent> = Object.fromEntries(
  projects.map((p) => [
    p.slug,
    {
      bullets: [p.description],
      skills: p.skills,
      githubRepo: p.githubRepo,
    },
  ])
);

// Map experience node IDs to content
const experienceNodeIds = ["arrive-25", "arrive-24", "arrive-23"] as const;
const experienceContent: Record<string, NodeContent> = Object.fromEntries(
  experienceNodeIds.map((id, i) => [
    id,
    {
      bullets: experiences[i].bullets,
      skills: experiences[i].skills,
    },
  ])
);

export const nodeContent: Record<string, NodeContent> = {
  ...projectContent,
  ...experienceContent,

  // Achievements
  "tamuhack-26": {
    skills: ["Python", "AI"],
  },
  "build4good-25": {
    skills: ["Python", "Frontend"],
  },
  "tamuhack-25": {
    skills: ["Python", "Backend"],
  },
};

export function getNodeContent(nodeId: string): NodeContent | undefined {
  return nodeContent[nodeId];
}

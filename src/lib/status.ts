import { projects } from "@/lib/projects";
import { fetchGitHubRepo } from "@/lib/github";

const FALLBACK_SLUG = "lloydalba-dev";

export interface ActiveStatus {
  slug: string;
  pushedAt: string | null;
}

export async function getActiveStatus(): Promise<ActiveStatus> {
  const reposToCheck = projects.filter((p) => p.githubRepo);

  const results = await Promise.all(
    reposToCheck.map(async (p) => {
      const data = await fetchGitHubRepo(p.githubRepo!);
      return {
        slug: p.slug,
        pushedAt: data?.pushed_at || null,
        pushedAtMs: data?.pushed_at ? new Date(data.pushed_at).getTime() : 0,
      };
    })
  );

  const mostRecent = results.sort((a, b) => b.pushedAtMs - a.pushedAtMs)[0];
  return {
    slug: mostRecent?.slug || FALLBACK_SLUG,
    pushedAt: mostRecent?.pushedAt || null,
  };
}

// Keep backward compat for project detail page
export async function getActiveProjectSlug(): Promise<string> {
  const status = await getActiveStatus();
  return status.slug;
}

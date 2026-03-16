import { projects } from "@/lib/projects";
import { fetchGitHubRepo } from "@/lib/github";

export interface ActiveStatus {
  slug: string;
  pushedAt: string | null;
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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
    slug: mostRecent?.slug || "lloydalba-dev",
    pushedAt: mostRecent?.pushedAt || null,
  };
}

export async function getActiveSlugs(): Promise<Set<string>> {
  const reposToCheck = projects.filter((p) => p.githubRepo);
  const oneWeekAgo = Date.now() - ONE_WEEK_MS;

  const results = await Promise.all(
    reposToCheck.map(async (p) => {
      const data = await fetchGitHubRepo(p.githubRepo!);
      const pushedAtMs = data?.pushed_at ? new Date(data.pushed_at).getTime() : 0;
      return { slug: p.slug, pushedAtMs };
    })
  );

  return new Set(
    results.filter((r) => r.pushedAtMs >= oneWeekAgo).map((r) => r.slug)
  );
}

// Keep backward compat for project detail page
export async function getActiveProjectSlug(): Promise<string> {
  const status = await getActiveStatus();
  return status.slug;
}

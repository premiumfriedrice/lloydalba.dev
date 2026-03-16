import { GitHubRepoData } from "@/types";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchGitHubRepo(
  repo: string
): Promise<GitHubRepoData | null> {
  try {
    const headers = getHeaders();
    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        next: { revalidate: 3600 },
        headers,
      }),
      fetch(`https://api.github.com/repos/${repo}/languages`, {
        next: { revalidate: 3600 },
        headers,
      }),
    ]);

    if (!repoRes.ok) return null;

    const repoData = await repoRes.json();
    const languages: Record<string, number> = langRes.ok
      ? await langRes.json()
      : {};

    return {
      name: repoData.name,
      description: repoData.description,
      html_url: repoData.html_url,
      pushed_at: repoData.pushed_at,
      languages,
      stargazers_count: repoData.stargazers_count,
      forks_count: repoData.forks_count,
      private: repoData.private,
    };
  } catch {
    return null;
  }
}

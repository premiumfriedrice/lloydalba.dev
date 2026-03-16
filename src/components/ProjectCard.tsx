import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project, GitHubRepoData } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface Props {
  project: Project;
  githubData?: GitHubRepoData | null;
  isActive?: boolean;
}

export default function ProjectCard({ project, githubData, isActive }: Props) {

  const totalBytes = githubData?.languages
    ? Object.values(githubData.languages).reduce((a, b) => a + b, 0)
    : 0;

  const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    "C++": "#f34b7d",
    CSS: "#563d7c",
    HTML: "#e34c26",
    HCL: "#844FBA",
    Shell: "#89e051",
    Svelte: "#ff3e00",
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div
        className={`relative backdrop-blur-sm bg-black/20 border p-6 md:p-8 transition-all h-full ${
          isActive
            ? "card-active"
            : "border-white/[0.06] card-hover"
        }`}
      >
        {isActive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-[11px] text-emerald-400 tracking-wider uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            Active
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-white font-bold text-lg tracking-tight group-hover:text-[#c4b5fd] transition-colors">
            {project.name}
          </h3>
          {!isActive && (
            <ArrowUpRight
              size={16}
              className="text-neutral-400 group-hover:text-[#c4b5fd] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1 flex-shrink-0"
            />
          )}
        </div>

        <p className="text-sm leading-relaxed line-clamp-2 text-neutral-400 mb-4">
          {project.description}
        </p>

        {githubData?.pushed_at && (
          <p className="text-[11px] text-neutral-400 tracking-wide mb-4">
            pushed{" "}
            {formatDistanceToNow(new Date(githubData.pushed_at), {
              addSuffix: true,
            })}
          </p>
        )}

        {githubData?.languages && totalBytes > 0 && (
          <div className="mb-4">
            <div className="flex h-[3px] overflow-hidden bg-white/[0.03]">
              {Object.entries(githubData.languages).map(([lang, bytes]) => (
                <div
                  key={lang}
                  style={{
                    width: `${(bytes / totalBytes) * 100}%`,
                    backgroundColor: langColors[lang] || "#52525b",
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {Object.entries(githubData.languages)
                .slice(0, 3)
                .map(([lang, bytes]) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1.5 text-[11px] text-neutral-400"
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: langColors[lang] || "#52525b" }}
                    />
                    {lang}
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 border border-white/[0.06] text-neutral-400 tracking-wide"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

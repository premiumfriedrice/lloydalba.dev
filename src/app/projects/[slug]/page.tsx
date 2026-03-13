import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import { projects, getProjectBySlug } from "@/lib/projects";
import { fetchGitHubRepo } from "@/lib/github";
import { getThoughtsByProject } from "@/lib/thoughts";
import { getActiveProjectSlug } from "@/lib/status";
import { formatDistanceToNow } from "date-fns";
import ThoughtCard from "@/components/ThoughtCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.name} — Lloyd Alba`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const activeSlug = await getActiveProjectSlug();
  const isActive = activeSlug === project.slug;
  const githubData = project.githubRepo
    ? await fetchGitHubRepo(project.githubRepo)
    : null;
  const relatedThoughts = await getThoughtsByProject(project.slug);

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
    <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
      <Link
        href="/about#projects"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#c4b5fd] transition-colors mb-12 tracking-wider uppercase"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Main content */}
        <div className="flex-1 animate-fade-up">
          <div className="flex items-center gap-4 mb-2">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500">
              Project
            </p>
            {isActive && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 tracking-wider uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Active
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
            {project.name}
            <span className="text-[#c4b5fd]">.</span>
          </h1>

          <p className="text-[15px] leading-relaxed mb-8 max-w-xl text-neutral-400">
            {project.description}
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 mb-10">
            {githubData?.html_url && (
              <a
                href={githubData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-[#c4b5fd] transition-colors tracking-wider uppercase"
              >
                <Github size={14} strokeWidth={1.5} /> Repo
              </a>
            )}
            {project.externalLink && (
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-[#c4b5fd] transition-colors tracking-wider uppercase"
              >
                <ExternalLink size={14} strokeWidth={1.5} /> Demo
              </a>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-10">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-1 border border-[#c4b5fd]/20 text-[#c4b5fd] tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* GitHub stats */}
          {githubData && (
            <div className="border border-white/[0.06] p-6 md:p-8 mb-10 animate-fade-up delay-1">
              <h3 className="text-xs font-medium text-white tracking-widest uppercase mb-4">
                GitHub
              </h3>
              {githubData.pushed_at && (
                <p className="text-[11px] text-neutral-500 tracking-wide mb-4">
                  pushed{" "}
                  {formatDistanceToNow(new Date(githubData.pushed_at), {
                    addSuffix: true,
                  })}
                </p>
              )}
              {totalBytes > 0 && (
                <>
                  <div className="flex h-[3px] overflow-hidden bg-white/[0.03] mb-3">
                    {Object.entries(githubData.languages).map(
                      ([lang, bytes]) => (
                        <div
                          key={lang}
                          style={{
                            width: `${(bytes / totalBytes) * 100}%`,
                            backgroundColor: langColors[lang] || "#52525b",
                          }}
                        />
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {Object.entries(githubData.languages).map(
                      ([lang, bytes]) => (
                        <span
                          key={lang}
                          className="flex items-center gap-1.5 text-[11px] text-neutral-500"
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: langColors[lang] || "#52525b",
                            }}
                          />
                          {lang} {((bytes / totalBytes) * 100).toFixed(1)}%
                        </span>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sidebar image */}
        {project.image && (
          <div className="lg:w-80 flex-shrink-0 animate-fade-up delay-2">
            <div className="sticky top-20">
              <Image
                src={project.image}
                alt={project.name}
                width={320}
                height={240}
                className="border border-white/[0.06] w-full"
                unoptimized={project.image.endsWith(".gif")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Related thoughts */}
      {relatedThoughts.length > 0 && (
        <section className="mt-20 animate-fade-up delay-3">
          <h2 className="section-heading text-sm font-bold text-white tracking-widest uppercase mb-10">
            Related Thoughts
          </h2>
          <div className="space-y-[1px] bg-white/[0.03]">
            {relatedThoughts.map((thought) => (
              <ThoughtCard key={thought.slug} thought={thought} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

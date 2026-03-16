import type { Metadata } from "next";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import StatusIndicator from "@/components/StatusIndicator";
import ProjectCard from "@/components/ProjectCard";
import ExperienceCard from "@/components/ExperienceCard";
import ThoughtCard from "@/components/ThoughtCard";
import { getAllThoughts } from "@/lib/thoughts";
import { getActiveStatus, getActiveSlugs } from "@/lib/status";
import GitHubHeatmap from "@/components/GitHubHeatmap";
import { projects } from "@/lib/projects";
import { experiences, education, achievements } from "@/lib/experience";
import { Trophy } from "lucide-react";
import { fetchGitHubRepo } from "@/lib/github";

export const metadata: Metadata = {
  title: "About - Lloyd Alba",
  description: "Software Engineer portfolio. Projects, experience, and thoughts.",
};

export default async function AboutPage() {
  const [thoughts, status, activeSlugs] = await Promise.all([
    getAllThoughts(),
    getActiveStatus(),
    getActiveSlugs(),
  ]);

  const githubDataMap = await Promise.all(
    projects.map(async (p) => ({
      slug: p.slug,
      data: p.githubRepo ? await fetchGitHubRepo(p.githubRepo) : null,
    }))
  );

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeProjects = projects.filter((p) => {
    if (!p.githubRepo) return true;
    const ghData = githubDataMap.find((d) => d.slug === p.slug)?.data;
    if (!ghData) return false;
    return new Date(ghData.pushed_at) >= oneWeekAgo;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      {/* Hero */}
      <section className="pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="animate-fade-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[0.9] tracking-tight mb-6 backdrop-blur-sm bg-black/20 rounded-lg inline-block px-3 py-1">
            Lloyd Alba<span className="text-[#c4b5fd]">.</span>
          </h1>
        </div>

        <div className="animate-fade-up delay-2 mb-8">
          <StatusIndicator activeSlug={status.slug} pushedAt={status.pushedAt} />
        </div>

        <div className="animate-fade-up delay-3 mb-10">
          <GitHubHeatmap username="premiumfriedrice" />
        </div>

        <div className="animate-fade-up delay-4 flex items-center gap-5">
          {[
            {
              href: "https://github.com/premiumfriedrice",
              icon: Github,
              label: "GitHub",
            },
            {
              href: "https://www.linkedin.com/in/lloydalba/",
              icon: Linkedin,
              label: "LinkedIn",
            },
            {
              href: "mailto:lloyddalba@gmail.com",
              icon: Mail,
              label: "Email",
            },
            {
              href: "/documents/LloydAlba_Resume.pdf",
              icon: FileText,
              label: "Resume",
            },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.label !== "Email" ? "_blank" : undefined}
              rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label={s.label}
            >
              <s.icon size={18} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="pb-20 scroll-mt-20 animate-fade-up delay-4">
        <h2 className="section-heading text-sm font-bold text-white tracking-widest uppercase mb-10 backdrop-blur-sm bg-black/20 rounded-md inline-block px-2 py-1">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.03]">
          {activeProjects.map((project) => {
            const ghData = githubDataMap.find((d) => d.slug === project.slug);
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                githubData={ghData?.data}
                isActive={activeSlugs.has(project.slug)}
              />
            );
          })}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="pb-20 scroll-mt-20 animate-fade-up delay-5">
        <h2 className="section-heading text-sm font-bold text-white tracking-widest uppercase mb-10 backdrop-blur-sm bg-black/20 rounded-md inline-block px-2 py-1">
          Experience
        </h2>
        <div className="mb-12">
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} />
          ))}
        </div>

        {/* Education */}
        <div className="border border-white/[0.06] p-6 md:p-8">
          <p className="text-[11px] text-neutral-400 tracking-wider uppercase mb-2">
            {education.time}
          </p>
          <h3 className="text-white text-sm font-medium mb-0.5">
            {education.degree}
          </h3>
          <a
            href={education.schoolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c4b5fd] text-xs hover:text-[#d4c8fe] transition-colors"
          >
            {education.school}
          </a>
        </div>

        {/* Achievements */}
        <div className="mt-12 border border-white/[0.06] p-6 md:p-8">
          <h3 className="text-xs font-medium text-white tracking-widest uppercase mb-6">
            Achievements
          </h3>
          <div className="space-y-4">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <Trophy size={14} className="text-[#e06c75] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">{a.title}</p>
                  <p className="text-xs text-neutral-400">{a.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/documents/LloydAlba_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-[#c4b5fd] transition-colors tracking-wider uppercase"
          >
            View full resume &rarr;
          </a>
        </div>
      </section>

      {/* Thoughts */}
      {thoughts.length > 0 && (
        <section id="thoughts" className="pb-20 scroll-mt-20 animate-fade-up delay-6">
          <h2 className="section-heading text-sm font-bold text-white tracking-widest uppercase mb-10 backdrop-blur-sm bg-black/20 rounded-md inline-block px-2 py-1">
            Thoughts
          </h2>
          <div className="space-y-[1px] bg-white/[0.03]">
            {thoughts.map((thought) => (
              <ThoughtCard key={thought.slug} thought={thought} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

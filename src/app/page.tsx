import { Suspense } from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import StatusIndicator from "@/components/StatusIndicator";
import { getActiveStatus } from "@/lib/status";
import GraphExplorer from "@/components/graph/GraphExplorer";

export default async function Home() {
  const status = await getActiveStatus();

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      {/* Hero — matches /about */}
      <section className="pt-16 pb-10 md:pt-36 md:pb-20">
        <div className="animate-fade-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[0.9] tracking-tight mb-6 backdrop-blur-sm bg-black/20 rounded-lg inline-block px-3 py-1">
            Lloyd Alba<span className="text-[#c4b5fd]">.</span>
          </h1>
        </div>

        <div className="animate-fade-up delay-2 mb-8">
          <StatusIndicator activeSlug={status.slug} pushedAt={status.pushedAt} />
        </div>

        <div className="animate-fade-up delay-3 flex items-center gap-5">
          {[
            { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
            { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
            { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
            { href: "/documents/LloydAlba_Resume.pdf", icon: FileText, label: "Resume" },
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

      {/* Graph */}
      <section className="pb-20">
        <Suspense fallback={
          <div className="border border-white/[0.04] rounded-lg bg-black h-[500px] flex items-center justify-center">
            <p className="text-xs text-neutral-400">Loading graph...</p>
          </div>
        }>
          <GraphExplorer />
        </Suspense>
      </section>
    </div>
  );
}

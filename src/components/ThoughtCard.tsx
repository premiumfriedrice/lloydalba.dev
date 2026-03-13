import Link from "next/link";
import { Thought } from "@/types";
import { format } from "date-fns";
import { projects } from "@/lib/projects";

export default function ThoughtCard({ thought }: { thought: Thought }) {
  const projectSlugs = projects.map((p) => p.slug);

  return (
    <article className="bg-black p-6 md:p-8 group">
      <div className="flex items-start gap-6">
        <div className="hidden sm:block pt-1.5">
          <time className="text-[11px] text-neutral-500 tracking-wider tabular-nums whitespace-nowrap">
            {thought.date
              ? format(new Date(thought.date), "MMM dd")
              : ""}
          </time>
        </div>

        <div className="min-w-0 flex-1">
          <div className="sm:hidden mb-2">
            <time className="text-[11px] text-neutral-500 tracking-wider">
              {thought.date
                ? format(new Date(thought.date), "MMM d, yyyy")
                : ""}
            </time>
          </div>

          {thought.title && (
            <h3 className="text-white font-medium text-sm mb-2.5 leading-snug">
              {thought.title}
            </h3>
          )}

          <div
            className="thought-content text-sm leading-relaxed text-neutral-400"
            dangerouslySetInnerHTML={{ __html: thought.content }}
          />

          {thought.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {thought.tags.map((tag) => {
                const isProject = projectSlugs.includes(tag);
                return isProject ? (
                  <Link
                    key={tag}
                    href={`/projects/${tag}`}
                    className="text-[11px] px-2 py-0.5 border border-[#c4b5fd]/20 text-[#c4b5fd] hover:bg-[#c4b5fd]/10 transition-colors tracking-wide"
                  >
                    {tag}
                  </Link>
                ) : (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 border border-white/[0.06] text-neutral-500 tracking-wide"
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

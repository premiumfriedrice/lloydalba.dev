import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { formatDistanceToNow } from "date-fns";

interface Props {
  activeSlug: string;
  pushedAt?: string | null;
}

export default function StatusIndicator({ activeSlug, pushedAt }: Props) {
  const project = getProjectBySlug(activeSlug);
  if (!project) return null;

  const timeAgo = pushedAt
    ? formatDistanceToNow(new Date(pushedAt), { addSuffix: true })
    : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="inline-flex items-center gap-2.5 text-xs text-neutral-500 hover:text-white transition-colors group"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      <span className="tracking-wide">
        <span className="text-neutral-500">last pushed</span>{" "}
        <span className="text-[#c4b5fd] group-hover:text-[#d4c8fe] transition-colors">
          {project.name}
        </span>
        {timeAgo && (
          <span className="text-neutral-600"> · {timeAgo}</span>
        )}
      </span>
    </Link>
  );
}

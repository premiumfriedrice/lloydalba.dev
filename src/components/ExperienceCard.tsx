import { Experience } from "@/types";

export default function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="timeline-line relative pl-8 pb-10 last:pb-0 group">
      {/* Timeline dot */}
      <div className="absolute left-[3px] top-1.5 w-[9px] h-[9px] border border-neutral-700 bg-black group-hover:border-[#c4b5fd] transition-colors" />

      <p className="text-[11px] text-neutral-500 tracking-wider uppercase mb-2">
        {exp.time}
      </p>
      <h3 className="text-white text-sm font-medium mb-0.5">{exp.position}</h3>
      {exp.companyUrl ? (
        <a
          href={exp.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c4b5fd] text-xs hover:text-[#d4c8fe] transition-colors inline-flex items-center gap-1"
        >
          {exp.company}
        </a>
      ) : (
        <p className="text-[#c4b5fd] text-xs">{exp.company}</p>
      )}
      <ul className="mt-3 space-y-2">
        {exp.bullets.map((bullet, i) => (
          <li key={i} className="text-sm leading-relaxed text-neutral-500 pl-3 relative before:content-['—'] before:absolute before:left-0 before:text-neutral-700">
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {exp.skills.map((skill) => (
          <span
            key={skill}
            className="text-[11px] px-2 py-0.5 border border-white/[0.06] text-neutral-500 tracking-wide"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

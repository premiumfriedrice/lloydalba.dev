import { fetchContributions } from "@/lib/contributions";

const LEVEL_COLORS = [
  "bg-white/[0.03]",
  "bg-[#c4b5fd]/25",
  "bg-[#c4b5fd]/50",
  "bg-[#d49aaa]/70",
  "bg-[#e06c75]",
];

export default async function GitHubHeatmap({
  username,
}: {
  username: string;
}) {
  const weeks = await fetchContributions(username);

  if (weeks.length === 0) return null;

  const totalContributions = weeks.reduce(
    (sum, week) => sum + week.days.reduce((s, d) => s + d.count, 0),
    0
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-[3px] w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.days.map((day) => (
                <div
                  key={day.date}
                  className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_COLORS[day.level]} transition-colors`}
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-neutral-400 tracking-wide">
        {totalContributions.toLocaleString()} contributions in the last year
      </p>
    </div>
  );
}

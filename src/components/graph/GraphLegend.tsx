import { TYPE_COLORS, TYPE_LABELS } from "./GraphSimulation";
import type { NodeType } from "@/lib/zettelkasten";

export default function GraphLegend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      {(Object.entries(TYPE_COLORS) as [NodeType, string][]).map(
        ([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] text-neutral-500 tracking-wide">
              {TYPE_LABELS[type]}
            </span>
          </div>
        )
      )}
      <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/[0.06]">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" fill="none" stroke="#8b8b8b" strokeWidth="0.8" strokeDasharray="4 2" />
        </svg>
        <span className="text-[11px] text-neutral-500 tracking-wide">
          Ring = years of exp
        </span>
      </div>
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="5" cy="10" r="3" fill="#8b8b8b" opacity="0.5" />
          <circle cx="11" cy="6" r="5" fill="#8b8b8b" opacity="0.5" />
        </svg>
        <span className="text-[11px] text-neutral-500 tracking-wide">
          Size = connections
        </span>
      </div>
      <div className="flex items-center gap-2">
        <svg width="24" height="16" viewBox="0 0 24 16">
          <circle cx="6" cy="8" r="4" fill="#8b8b8b" opacity="0.4" />
          <circle cx="18" cy="8" r="4" fill="#8b8b8b" opacity="1" />
        </svg>
        <span className="text-[11px] text-neutral-500 tracking-wide">
          Brightness = maturity
        </span>
      </div>
    </div>
  );
}

"use client";

import { List, Network } from "lucide-react";
import { FILTER_GROUPS, SUB_FILTERS, type FilterGroup } from "@/lib/zettelkasten";

interface FilterBarProps {
  filterGroup: FilterGroup;
  subFilter: string | null;
  onFilterGroupChange: (group: FilterGroup) => void;
  onSubFilterChange: (id: string | null) => void;
  listView: boolean;
  onToggleListView: () => void;
}

export default function FilterBar({
  filterGroup,
  subFilter,
  onFilterGroupChange,
  onSubFilterChange,
  listView,
  onToggleListView,
}: FilterBarProps) {
  const currentSubFilters = SUB_FILTERS[filterGroup] || [];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {FILTER_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => onFilterGroupChange(g.id)}
            className={`px-3 py-1.5 text-[11px] tracking-widest uppercase border transition-all ${
              filterGroup === g.id
                ? "border-[#c4b5fd]/40 text-[#c4b5fd] bg-[#c4b5fd]/5"
                : "border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/[0.12]"
            }`}
          >
            {g.label}
          </button>
        ))}
        <button
          onClick={onToggleListView}
          className="ml-auto p-1.5 border border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/[0.12] transition-all md:hidden"
          aria-label={listView ? "Graph view" : "List view"}
        >
          {listView ? <Network size={14} /> : <List size={14} />}
        </button>
      </div>

      {currentSubFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => onSubFilterChange(null)}
            className={`px-3 py-1.5 text-[11px] tracking-widest uppercase border transition-all ${
              subFilter === null
                ? "border-[#c4b5fd]/40 text-[#c4b5fd] bg-[#c4b5fd]/5"
                : "border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/[0.12]"
            }`}
          >
            All
          </button>
          {currentSubFilters.map((sf) => (
            <button
              key={sf.id}
              onClick={() => onSubFilterChange(subFilter === sf.id ? null : sf.id)}
              className={`px-3 py-1.5 text-[11px] tracking-widest uppercase border transition-all ${
                subFilter === sf.id
                  ? "bg-white/[0.03]"
                  : "border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/[0.12]"
              }`}
              style={
                subFilter === sf.id
                  ? { borderColor: sf.color + "66", color: sf.color }
                  : undefined
              }
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-2"
                style={{ backgroundColor: sf.color }}
              />
              {sf.label}
            </button>
          ))}
        </div>
      )}

      {filterGroup === "all" && <div className="mb-4" />}
    </div>
  );
}

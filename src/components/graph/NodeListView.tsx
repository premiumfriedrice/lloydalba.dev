"use client";

import { useMemo } from "react";
import { nodes as graphNodes } from "@/lib/zettelkasten";
import type { FilterGroup, NodeType } from "@/lib/zettelkasten";
import { type SimNode, getNodeColor, TYPE_LABELS, TYPE_COLORS } from "./GraphSimulation";

interface NodeListViewProps {
  simNodes: SimNode[];
  visibleIds: Set<string>;
  filterGroup: FilterGroup;
  subFilter: string | null;
  selectedId: string | null;
  onSelectNode: (id: string) => void;
}

const TYPE_ORDER: NodeType[] = ["project", "experience", "domain", "skill", "achievement"];

export default function NodeListView({
  simNodes,
  visibleIds,
  filterGroup,
  subFilter,
  selectedId,
  onSelectNode,
}: NodeListViewProps) {
  const grouped = useMemo(() => {
    const visible = graphNodes.filter((n) => visibleIds.has(n.id));
    const groups: Record<string, typeof visible> = {};
    for (const node of visible) {
      const type = node.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(node);
    }
    return groups;
  }, [visibleIds]);

  return (
    <div className="border border-white/[0.04] rounded-lg bg-neutral-950/50 divide-y divide-white/[0.04]">
      {TYPE_ORDER.map((type) => {
        const nodes = grouped[type];
        if (!nodes || nodes.length === 0) return null;
        return (
          <div key={type} className="p-4">
            <p className="text-[11px] text-neutral-500 tracking-wider uppercase mb-3">
              {TYPE_LABELS[type]}
            </p>
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => {
                const simNode = simNodes.find((n) => n.id === node.id);
                const color = simNode
                  ? getNodeColor(simNode, filterGroup, subFilter)
                  : TYPE_COLORS[node.type];
                const isSelected = selectedId === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-[12px] border transition-all ${
                      isSelected
                        ? "border-[#c4b5fd]/40 bg-[#c4b5fd]/5"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                    style={{ color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

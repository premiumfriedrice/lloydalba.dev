"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, X, GripHorizontal } from "lucide-react";
import { nodes as graphNodes, getConnectedIds } from "@/lib/zettelkasten";
import type { FilterGroup } from "@/lib/zettelkasten";
import { getNodeContent } from "@/lib/node-content";
import {
  type SimNode,
  getNodeColor,
  TYPE_LABELS,
  TYPE_COLORS,
  CURRENT_YEAR,
} from "./GraphSimulation";

interface NodeDetailPanelProps {
  simNodes: SimNode[];
  activeId: string | null;
  filterGroup: FilterGroup;
  subFilter: string | null;
  onSelectNode: (id: string) => void;
  onClose: () => void;
  isMobile: boolean;
}

export default function NodeDetailPanel({
  simNodes,
  activeId,
  filterGroup,
  subFilter,
  onSelectNode,
  onClose,
  isMobile,
}: NodeDetailPanelProps) {
  const activeNode = useMemo(() => {
    if (!activeId) return null;
    return simNodes.find((n) => n.id === activeId) || null;
  }, [activeId, simNodes]);

  const graphNode = useMemo(() => {
    if (!activeId) return null;
    return graphNodes.find((n) => n.id === activeId) || null;
  }, [activeId]);

  const connectedNodes = useMemo(() => {
    if (!activeId) return [];
    const ids = getConnectedIds(activeId);
    ids.delete(activeId);
    return simNodes.filter((n) => ids.has(n.id)).sort((a, b) => b.degree - a.degree);
  }, [activeId, simNodes]);

  const content = activeId ? getNodeContent(activeId) : undefined;

  if (isMobile) {
    return (
      <AnimatePresence>
        {activeNode && graphNode && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onClose}
            />
            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) onClose();
              }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-white/[0.06] rounded-t-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-neutral-950 pt-3 pb-2 flex justify-center z-10">
                <GripHorizontal size={20} className="text-neutral-400" />
              </div>
              <PanelContent
                activeNode={activeNode}
                graphNode={graphNode}
                connectedNodes={connectedNodes}
                content={content}
                filterGroup={filterGroup}
                subFilter={subFilter}
                onSelectNode={onSelectNode}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: side panel
  return (
    <AnimatePresence mode="wait">
      {activeNode && graphNode ? (
        <motion.div
          key={activeId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="w-[380px] flex-shrink-0 border border-white/[0.04] bg-neutral-950/50 overflow-y-auto max-h-[calc(100vh-12rem)] rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: getNodeColor(activeNode, filterGroup, subFilter),
                  }}
                />
                <h3 className="text-white font-medium text-sm">
                  {activeNode.label}
                </h3>
                <span className="text-[11px] text-neutral-400 tracking-wider uppercase">
                  {TYPE_LABELS[activeNode.type]}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <X size={14} />
              </button>
            </div>
            <PanelContent
              activeNode={activeNode}
              graphNode={graphNode}
              connectedNodes={connectedNodes}
              content={content}
              filterGroup={filterGroup}
              subFilter={subFilter}
              onSelectNode={onSelectNode}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-[380px] flex-shrink-0 border border-white/[0.04] rounded-lg flex items-center justify-center"
        >
          <p className="text-xs text-neutral-400 text-center px-8">
            Click a node to explore its details and connections
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Shared content between mobile sheet and desktop panel
function PanelContent({
  activeNode,
  graphNode,
  connectedNodes,
  content,
  filterGroup,
  subFilter,
  onSelectNode,
}: {
  activeNode: SimNode;
  graphNode: { subtitle?: string; description?: string; links?: { label: string; url: string }[]; detailHref?: string };
  connectedNodes: SimNode[];
  content: ReturnType<typeof getNodeContent>;
  filterGroup: FilterGroup;
  subFilter: string | null;
  onSelectNode: (id: string) => void;
}) {
  const years = activeNode.since ? CURRENT_YEAR - activeNode.since : 0;
  const color = getNodeColor(activeNode, filterGroup, subFilter);

  return (
    <div className="px-5 pb-5 space-y-4">
      {/* Mobile: show header inline */}
      <div className="md:hidden flex items-center gap-3">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-white font-medium text-sm">
          {activeNode.label}
        </h3>
        <span className="text-[11px] text-neutral-400 tracking-wider uppercase">
          {TYPE_LABELS[activeNode.type]}
        </span>
      </div>

      {/* Subtitle */}
      {graphNode.subtitle && (
        <p className="text-xs text-neutral-400">{graphNode.subtitle}</p>
      )}

      {/* Description */}
      {graphNode.description && (
        <p className="text-[13px] text-neutral-400 leading-relaxed">
          {graphNode.description}
        </p>
      )}

      {/* Years indicator */}
      {activeNode.since && years > 0 && (
        <div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span>Since {activeNode.since}</span>
            <span className="text-neutral-400">&middot;</span>
            <span className="text-[#c4b5fd]">
              {years} year{years !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-1.5 flex h-[3px] w-32 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div
              style={{
                width: `${Math.min(100, (years / 5) * 100)}%`,
                background: "linear-gradient(to right, #c4b5fd, #e06c75)",
                opacity: 0.7,
              }}
            />
          </div>
        </div>
      )}

      {/* Bullets (experience/project details) */}
      {content?.bullets && content.bullets.length > 0 && (
        <div className="space-y-2">
          {content.bullets.map((bullet, i) => (
            <p key={i} className="text-[12px] text-neutral-400 leading-relaxed pl-3 border-l border-white/[0.06]">
              {bullet}
            </p>
          ))}
        </div>
      )}

      {/* Skills */}
      {content?.skills && content.skills.length > 0 && (
        <div>
          <p className="text-[11px] text-neutral-400 tracking-wider uppercase mb-2">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {content.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 border border-[#c4b5fd]/20 text-[#c4b5fd] tracking-wide"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Connected nodes */}
      {connectedNodes.length > 0 && (
        <div>
          <p className="text-[11px] text-neutral-400 tracking-wider uppercase mb-2">
            Connected to
          </p>
          <div className="flex flex-wrap gap-1.5">
            {connectedNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNode(n.id)}
                className="text-[11px] px-2 py-0.5 border border-white/[0.06] tracking-wide hover:border-[#c4b5fd]/30 transition-colors cursor-pointer"
                style={{ color: getNodeColor(n, filterGroup, subFilter) }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {graphNode.links && graphNode.links.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {graphNode.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-[#c4b5fd] transition-colors tracking-wider uppercase"
            >
              <ExternalLink size={12} /> {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Detail page link */}
      {graphNode.detailHref && (
        <Link
          href={graphNode.detailHref}
          className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-[#c4b5fd] transition-colors tracking-wider uppercase pt-1"
        >
          View full page <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

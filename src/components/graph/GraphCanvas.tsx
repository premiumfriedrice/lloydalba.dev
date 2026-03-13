"use client";

import { useCallback, useEffect, useRef } from "react";
import { edges as graphEdges, getConnectedIds, getClusterIds } from "@/lib/zettelkasten";
import type { FilterGroup } from "@/lib/zettelkasten";
import {
  type SimNode,
  getNodeColor,
  getMaturityOpacity,
  CURRENT_YEAR,
} from "./GraphSimulation";

interface GraphCanvasProps {
  simNodes: SimNode[];
  width: number;
  height: number;
  filterGroup: FilterGroup;
  subFilter: string | null;
  activeId: string | null;
  hoveredId: string | null;
  selectedId: string | null;
  visibleIds: Set<string>;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  onPointerDown: (nodeId: string, e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onWheel: (e: WheelEvent) => void;
  zoom: number;
  pan: { x: number; y: number };
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export default function GraphCanvas({
  simNodes,
  width,
  height,
  filterGroup,
  subFilter,
  activeId,
  hoveredId,
  selectedId,
  visibleIds,
  onHover,
  onSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  zoom,
  pan,
  svgRef,
}: GraphCanvasProps) {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      onWheel(e);
    };
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, [svgRef, onWheel]);

  const highlightedIds = activeId ? getConnectedIds(activeId) : null;
  const nodeMap = new Map(simNodes.map((n) => [n.id, n]));

  return (
    <div className="border border-white/[0.04] bg-black overflow-hidden rounded-lg flex-1 min-h-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full touch-none"
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={(e) => {
          if ((e.target as Element).tagName === "svg") onSelect(null);
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-sm">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#e06c75" />
          </linearGradient>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
        {/* Edges */}
        {graphEdges.map((edge, i) => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return null;

          const bothVisible = visibleIds.has(edge.source) && visibleIds.has(edge.target);
          const isHighlighted =
            highlightedIds &&
            highlightedIds.has(edge.source) &&
            highlightedIds.has(edge.target);
          const dimmed = highlightedIds && !isHighlighted;

          return (
            <line
              key={i}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={isHighlighted ? "url(#edge-gradient)" : "rgba(255,255,255,0.06)"}
              strokeWidth={isHighlighted ? 1.5 : 1}
              opacity={!bothVisible ? 0.03 : dimmed ? 0.04 : isHighlighted ? 0.6 : 0.15}
              style={{ transition: "opacity 0.3s" }}
            />
          );
        })}

        {/* Nodes */}
        {simNodes.map((node) => {
          const isVisible = visibleIds.has(node.id);
          const isHighlighted = !highlightedIds || highlightedIds.has(node.id);
          const isActive = activeId === node.id;
          const dimmed = !isVisible || (highlightedIds && !isHighlighted);
          const years = node.since ? CURRENT_YEAR - node.since : 0;
          const showLabel =
            node.type === "domain" ||
            isActive ||
            (highlightedIds && highlightedIds.has(node.id)) ||
            (!highlightedIds && node.degree >= 6);

          const color = getNodeColor(node, filterGroup, subFilter);
          const maturityOpacity = getMaturityOpacity(node);
          const baseOpacity = dimmed ? 0.06 : isActive ? 1 : 0.85 * maturityOpacity;

          return (
            <g key={node.id}>
              {/* Age ring */}
              {node.since && years > 0 && (
                <circle
                  cx={node.x} cy={node.y}
                  r={node.radius + 3 + Math.min(years, 5) * 1.5}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.8}
                  strokeDasharray={`${years * 3} ${20 - years * 2}`}
                  opacity={dimmed ? 0.03 : isActive ? 0.5 : 0.15}
                  style={{ transition: "opacity 0.3s" }}
                />
              )}

              {/* Hover ring */}
              {isActive && (
                <circle
                  cx={node.x} cy={node.y}
                  r={node.radius + 2}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  opacity={0.4}
                  filter="url(#glow-sm)"
                />
              )}

              {/* Invisible hit area for touch */}
              <circle
                cx={node.x} cy={node.y}
                r={Math.max(20, node.radius)}
                fill="transparent"
                onMouseEnter={() => onHover(node.id)}
                onMouseLeave={() => onHover(null)}
                onPointerDown={(e) => onPointerDown(node.id, e)}
                className="cursor-grab active:cursor-grabbing"
              />

              {/* Main node */}
              <circle
                cx={node.x} cy={node.y}
                r={node.radius}
                fill={color}
                opacity={baseOpacity}
                filter={isActive ? "url(#glow)" : undefined}
                style={{ transition: "opacity 0.3s, fill 0.3s" }}
                pointerEvents="none"
              />

              {/* Label */}
              {showLabel && (
                <text
                  x={node.x} y={node.y + node.radius + 14}
                  textAnchor="middle"
                  fill={color}
                  fontSize={node.type === "domain" ? 11 : 9}
                  fontWeight={node.type === "domain" ? 600 : 400}
                  opacity={dimmed ? 0.05 : isActive ? 1 : 0.8}
                  style={{ transition: "opacity 0.3s", pointerEvents: "none" }}
                >
                  {node.label}
                </text>
              )}

              {/* Years badge */}
              {isActive && node.since && years > 0 && (
                <text
                  x={node.x} y={node.y - node.radius - 8}
                  textAnchor="middle"
                  fill={color}
                  fontSize={9}
                  opacity={0.7}
                  style={{ pointerEvents: "none" }}
                >
                  {years}yr
                </text>
              )}
            </g>
          );
        })}
        </g>
      </svg>
    </div>
  );
}

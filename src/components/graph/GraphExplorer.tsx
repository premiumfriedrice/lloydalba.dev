"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  nodes as graphNodes,
  edges as graphEdges,
  getConnectedIds,
  getClusterIds,
  type FilterGroup,
} from "@/lib/zettelkasten";
import {
  type SimNode,
  type ClusterConfig,
  step,
  computeClusterConfig,
  createSimNodes,
  getNodeColor,
  MAX_FRAMES,
  SETTLE_FRAMES,
  CLUSTER_FRAMES,
  TYPE_COLORS,
  TYPE_LABELS,
} from "./GraphSimulation";
import FilterBar from "./FilterBar";
import GraphCanvas from "./GraphCanvas";
import GraphLegend from "./GraphLegend";
import NodeDetailPanel from "./NodeDetailPanel";
import NodeListView from "./NodeListView";

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 600;

export default function GraphExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterGroup, setFilterGroup] = useState<FilterGroup>("problem-space");
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("node")
  );
  const [, setTick] = useState(0);
  const [listView, setListView] = useState(false);
  const [dimensions, setDimensions] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  const [isMobile, setIsMobile] = useState(false);

  const simRef = useRef<SimNode[]>([]);
  const rafRef = useRef(0);
  const frameCountRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ nodeId: string; dragging: boolean } | null>(null);
  const clusterRef = useRef<ClusterConfig | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          const h = Math.max(350, Math.min(600, width * 0.65));
          setDimensions({ width, height: h });
        }
      }
    });

    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", checkMobile);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // URL param sync
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId) {
      url.searchParams.set("node", selectedId);
    } else {
      url.searchParams.delete("node");
    }
    router.replace(url.pathname + url.search, { scroll: false });
  }, [selectedId, router]);

  const screenToSVG = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const startSimulation = useCallback((frames: number) => {
    cancelAnimationFrame(rafRef.current);
    frameCountRef.current = 0;
    const animate = () => {
      step(simRef.current, graphEdges, clusterRef.current, dimensions.width, dimensions.height);
      setTick((t) => t + 1);
      frameCountRef.current++;
      if (frameCountRef.current < frames) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [dimensions.width, dimensions.height]);

  // Initialize
  useEffect(() => {
    simRef.current = createSimNodes(dimensions.width, dimensions.height);
    clusterRef.current = computeClusterConfig(filterGroup, subFilter, dimensions.width, dimensions.height);
    startSimulation(MAX_FRAMES);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-cluster on filter change
  const filterRef = useRef({ filterGroup, subFilter });
  useEffect(() => {
    if (simRef.current.length === 0) return;
    const filtersChanged =
      filterRef.current.filterGroup !== filterGroup ||
      filterRef.current.subFilter !== subFilter;
    filterRef.current = { filterGroup, subFilter };

    clusterRef.current = computeClusterConfig(filterGroup, subFilter, dimensions.width, dimensions.height);
    if (filtersChanged) {
      for (const node of simRef.current) {
        if (!node.pinned) {
          node.vx += (Math.random() - 0.5) * 3;
          node.vy += (Math.random() - 0.5) * 3;
        }
      }
    }
    startSimulation(CLUSTER_FRAMES);
  }, [filterGroup, subFilter, startSimulation, dimensions.width, dimensions.height]);

  // Drag handlers
  const handlePointerDown = useCallback((nodeId: string, e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    const node = simRef.current.find((n) => n.id === nodeId);
    if (node) {
      node.pinned = true;
      dragRef.current = { nodeId, dragging: false };
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current.dragging = true;
    const { x, y } = screenToSVG(e.clientX, e.clientY);
    const node = simRef.current.find((n) => n.id === dragRef.current!.nodeId);
    if (node) {
      node.x = x;
      node.y = y;
      if (frameCountRef.current >= CLUSTER_FRAMES) startSimulation(999999);
      setTick((t) => t + 1);
    }
  }, [screenToSVG, startSimulation]);

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current) return;
    const wasDrag = dragRef.current.dragging;
    const nodeId = dragRef.current.nodeId;
    const node = simRef.current.find((n) => n.id === nodeId);
    if (node) node.pinned = false;
    if (!wasDrag) {
      setSelectedId((prev) => (prev === nodeId ? null : nodeId));
    }
    dragRef.current = null;
    startSimulation(SETTLE_FRAMES);
  }, [startSimulation]);

  const activeId = selectedId || hoveredId;

  const visibleIds = useMemo(() => {
    if (subFilter) return getClusterIds(subFilter);
    return new Set(graphNodes.map((n) => n.id));
  }, [subFilter]);

  const handleFilterGroupChange = useCallback((group: FilterGroup) => {
    setFilterGroup(group);
    setSubFilter(null);
    setSelectedId(null);
  }, []);

  const handleSubFilterChange = useCallback((id: string | null) => {
    setSubFilter(id);
    setSelectedId(null);
  }, []);

  return (
    <div ref={containerRef}>
      <FilterBar
        filterGroup={filterGroup}
        subFilter={subFilter}
        onFilterGroupChange={handleFilterGroupChange}
        onSubFilterChange={handleSubFilterChange}
        listView={listView}
        onToggleListView={() => setListView((v) => !v)}
      />

      {listView && isMobile ? (
        <NodeListView
          simNodes={simRef.current}
          visibleIds={visibleIds}
          filterGroup={filterGroup}
          subFilter={subFilter}
          selectedId={selectedId}
          onSelectNode={(id) => setSelectedId(id)}
        />
      ) : (
        <div className="flex gap-4" style={{ minHeight: dimensions.height }}>
          <GraphCanvas
            simNodes={simRef.current}
            width={dimensions.width}
            height={dimensions.height}
            filterGroup={filterGroup}
            subFilter={subFilter}
            activeId={activeId}
            hoveredId={hoveredId}
            selectedId={selectedId}
            visibleIds={visibleIds}
            onHover={setHoveredId}
            onSelect={setSelectedId}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            svgRef={svgRef}
          />

          {/* Desktop detail panel */}
          <div className="hidden md:block">
            <NodeDetailPanel
              simNodes={simRef.current}
              activeId={selectedId}
              filterGroup={filterGroup}
              subFilter={subFilter}
              onSelectNode={(id) => setSelectedId(id)}
              onClose={() => setSelectedId(null)}
              isMobile={false}
            />
          </div>
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && (
        <NodeDetailPanel
          simNodes={simRef.current}
          activeId={selectedId}
          filterGroup={filterGroup}
          subFilter={subFilter}
          onSelectNode={(id) => setSelectedId(id)}
          onClose={() => setSelectedId(null)}
          isMobile={true}
        />
      )}

      <GraphLegend />
    </div>
  );
}

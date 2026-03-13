import {
  nodes as graphNodes,
  edges as graphEdges,
  getNodeDegree,
  getClusterIds,
  CLUSTER_MAP,
  SUB_FILTERS,
  type ZettelEdge,
  type NodeType,
  type FilterGroup,
} from "@/lib/zettelkasten";

// --- Types ---

export interface SimNode {
  id: string;
  label: string;
  type: NodeType;
  isLanguage?: boolean;
  since?: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  degree: number;
  pinned: boolean;
}

export interface ClusterAttractor {
  x: number;
  y: number;
  nodeIds: Set<string>;
}

export interface ClusterConfig {
  attractors: ClusterAttractor[];
  peripheryIds: Set<string>;
  strength: number;
}

// --- Constants ---

const REPULSION = 4000;
const SPRING_STRENGTH = 0.004;
const SPRING_REST = 90;
const CENTER_GRAVITY = 0.015;
const CLUSTER_STRENGTH = 0.035;
const PERIPHERY_PUSH = 0.8;
const DAMPING = 0.82;

export const MAX_FRAMES = 180;
export const SETTLE_FRAMES = 60;
export const CLUSTER_FRAMES = 120;
export const CURRENT_YEAR = 2026;

export const TYPE_COLORS: Record<NodeType, string> = {
  domain: "#c4b5fd",
  project: "#e8e4e0",
  experience: "#e06c75",
  skill: "#8b8b8b",
  achievement: "#d19a66",
};

export const TYPE_LABELS: Record<NodeType, string> = {
  domain: "Domain",
  project: "Project",
  experience: "Professional",
  skill: "Skill",
  achievement: "Achievement",
};

// --- Cluster layout helpers ---

export function computeClusterConfig(
  filterGroup: FilterGroup,
  subFilter: string | null,
  width: number,
  height: number,
): ClusterConfig | null {
  if (filterGroup === "all") return null;

  const subs = SUB_FILTERS[filterGroup];
  if (!subs) return null;

  const allNodeIds = new Set(graphNodes.map((n) => n.id));
  const assignedIds = new Set<string>();

  if (subFilter) {
    const clusterIds = getClusterIds(subFilter);
    clusterIds.forEach((id) => assignedIds.add(id));

    const peripheryIds = new Set<string>();
    allNodeIds.forEach((id) => {
      if (!clusterIds.has(id)) peripheryIds.add(id);
    });

    return {
      attractors: [
        { x: width / 2, y: height / 2, nodeIds: clusterIds },
      ],
      peripheryIds,
      strength: CLUSTER_STRENGTH * 1.5,
    };
  }

  const attractors: ClusterAttractor[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.28;

  subs.forEach((sf, i) => {
    const angle = (i / subs.length) * Math.PI * 2 - Math.PI / 2;
    const ax = cx + Math.cos(angle) * radius;
    const ay = cy + Math.sin(angle) * radius;

    const primaryIds = CLUSTER_MAP[sf.id] || [];
    const expanded = new Set(primaryIds);
    for (const e of graphEdges) {
      if (expanded.has(e.source)) expanded.add(e.target);
      if (expanded.has(e.target)) expanded.add(e.source);
    }

    expanded.forEach((id) => assignedIds.add(id));
    attractors.push({ x: ax, y: ay, nodeIds: expanded });
  });

  const peripheryIds = new Set<string>();
  allNodeIds.forEach((id) => {
    if (!assignedIds.has(id)) peripheryIds.add(id);
  });

  return {
    attractors,
    peripheryIds,
    strength: CLUSTER_STRENGTH,
  };
}

// --- Simulation step ---

export function step(
  nodes: SimNode[],
  edges: ZettelEdge[],
  clusters: ClusterConfig | null,
  width: number,
  height: number,
) {
  const cx = width / 2;
  const cy = height / 2;

  // Node-node repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = REPULSION / (dist * dist);
      const fx = (force * dx) / dist;
      const fy = (force * dy) / dist;
      if (!nodes[i].pinned) { nodes[i].vx -= fx; nodes[i].vy -= fy; }
      if (!nodes[j].pinned) { nodes[j].vx += fx; nodes[j].vy += fy; }
    }
  }

  // Edge springs
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  for (const edge of edges) {
    const s = nodeMap.get(edge.source);
    const t = nodeMap.get(edge.target);
    if (!s || !t) continue;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = SPRING_STRENGTH * (dist - SPRING_REST);
    const fx = (force * dx) / dist;
    const fy = (force * dy) / dist;
    if (!s.pinned) { s.vx += fx; s.vy += fy; }
    if (!t.pinned) { t.vx -= fx; t.vy -= fy; }
  }

  // Center gravity
  const gravityScale = clusters ? 0.3 : 1;
  for (const node of nodes) {
    if (node.pinned) continue;
    node.vx += (cx - node.x) * CENTER_GRAVITY * gravityScale;
    node.vy += (cy - node.y) * CENTER_GRAVITY * gravityScale;
  }

  // Cluster attractor forces
  if (clusters) {
    for (const attractor of clusters.attractors) {
      for (const node of nodes) {
        if (node.pinned) continue;
        if (!attractor.nodeIds.has(node.id)) continue;
        const dx = attractor.x - node.x;
        const dy = attractor.y - node.y;
        node.vx += dx * clusters.strength;
        node.vy += dy * clusters.strength;
      }
    }

    for (const node of nodes) {
      if (node.pinned || !clusters.peripheryIds.has(node.id)) continue;
      const dx = node.x - cx;
      const dy = node.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      node.vx += (dx / dist) * PERIPHERY_PUSH;
      node.vy += (dy / dist) * PERIPHERY_PUSH;
    }
  }

  // Velocity damping + position update
  for (const node of nodes) {
    if (node.pinned) { node.vx = 0; node.vy = 0; continue; }
    node.vx *= DAMPING;
    node.vy *= DAMPING;
    node.x += node.vx;
    node.y += node.vy;
    const pad = node.radius + 20;
    node.x = Math.max(pad, Math.min(width - pad, node.x));
    node.y = Math.max(pad, Math.min(height - pad, node.y));
  }

  // Collision resolution
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = nodes[i].radius + nodes[j].radius + 4;
      if (dist < minDist) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        if (!nodes[i].pinned) { nodes[i].x -= overlap * nx; nodes[i].y -= overlap * ny; }
        if (!nodes[j].pinned) { nodes[j].x += overlap * nx; nodes[j].y += overlap * ny; }
      }
    }
  }
}

// --- Helpers ---

export function createSimNodes(width: number, height: number): SimNode[] {
  return graphNodes.map((n) => {
    const degree = getNodeDegree(n.id);
    return {
      ...n,
      x: width / 2 + (Math.random() - 0.5) * Math.min(400, width * 0.8),
      y: height / 2 + (Math.random() - 0.5) * Math.min(300, height * 0.6),
      vx: 0, vy: 0,
      radius: Math.max(2, 1.25 + Math.sqrt(degree) * 1.5),
      degree,
      pinned: false,
    };
  });
}

export function getNodeColor(
  node: SimNode,
  filterGroup: FilterGroup,
  subFilter: string | null,
): string {
  if (filterGroup !== "all" && !subFilter) {
    const clusterColor = getClusterColorForNode(node.id, filterGroup);
    if (clusterColor) return clusterColor;
  }
  if (subFilter) {
    const groupKey = filterGroup as string;
    const sf = SUB_FILTERS[groupKey]?.find((f) => f.id === subFilter);
    if (sf) {
      const clusterIds = getClusterIds(subFilter);
      if (clusterIds.has(node.id)) return sf.color;
    }
  }
  return TYPE_COLORS[node.type];
}

function getClusterColorForNode(nodeId: string, group: FilterGroup): string | null {
  const groupKey = group as string;
  const subFilters = SUB_FILTERS[groupKey];
  if (!subFilters) return null;

  for (const sf of subFilters) {
    const primary = CLUSTER_MAP[sf.id];
    if (primary && primary.includes(nodeId)) {
      return sf.color;
    }
  }
  return null;
}

export function getMaturityOpacity(node: SimNode): number {
  if (!node.since) return 1;
  const years = CURRENT_YEAR - node.since;
  return 0.4 + Math.min(years / 5, 1) * 0.6;
}

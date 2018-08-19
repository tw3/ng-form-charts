export interface ForceDirectedGraphNodePosition {
  x: number;
  y: number;
}

export interface ForceDirectedGraphNodeDimension {
  width: number;
  height: number;
}

export interface ForceDirectedGraphNode {
  id: string;
  position?: ForceDirectedGraphNodePosition;
  dimension?: ForceDirectedGraphNodeDimension;
  transform?: string;
  label?: string;
  data?: any;
}

export interface ForceDirectedGraphClusterNode extends Node {
  childNodeIds: string[];
}

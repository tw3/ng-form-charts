import { ForceDirectedGraphEdge } from './force-directed-graph-edge.model';
import { ForceDirectedGraphClusterNode, ForceDirectedGraphNode } from './force-directed-graph-node.model';

export interface ForceDirectedGraph {
  edges: ForceDirectedGraphEdge[];
  nodes: ForceDirectedGraphNode[];
  clusters?: ForceDirectedGraphClusterNode[];
  edgeLabels?: any;
}

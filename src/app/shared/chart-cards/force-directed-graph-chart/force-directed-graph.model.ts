export interface ForceDirectedGraph {
  links: {
    source: {
      name: string
    },
    target: string
  }[];
  nodes: {
    value: string
  }[];
}

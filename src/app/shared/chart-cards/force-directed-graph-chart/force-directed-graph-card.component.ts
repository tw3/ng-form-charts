import { Component, Input } from '@angular/core';

import { chartColorScheme } from '../chart-color-scheme';

import { ForceDirectedGraph } from './force-directed-graph.model';

@Component({
  selector: 'app-force-directed-graph-card',
  templateUrl: './force-directed-graph-card.component.html',
  styleUrls: ['./force-directed-graph-card.component.css']
})
export class ForceDirectedGraphCardComponent {
  @Input() title: string;
  @Input() graph: ForceDirectedGraph;

  // Options
  showLegend = true;
  animations = true;

  colorScheme = chartColorScheme;
}

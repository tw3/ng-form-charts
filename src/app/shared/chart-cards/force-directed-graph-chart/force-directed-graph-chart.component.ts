import { Component, Input } from '@angular/core';

import { ForceDirectedGraph } from './force-directed-graph.model';

@Component({
  selector: 'app-force-directed-graph-chart',
  templateUrl: './force-directed-graph-chart.component.html',
  styleUrls: ['./force-directed-graph-chart.component.css']
})
export class ForceDirectedGraphChartComponent {
  @Input() title: string;
  @Input() graph: ForceDirectedGraph;

  // Options
  showLegend = true;

}

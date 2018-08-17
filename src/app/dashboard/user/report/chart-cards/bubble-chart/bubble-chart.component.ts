import { Component, Input } from '@angular/core';

import { chartColorScheme } from '../chart-color-scheme';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent {
  @Input() title: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() results: BubbleChartDataPoint[];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showGridLines = true;

  colorScheme = chartColorScheme;
}

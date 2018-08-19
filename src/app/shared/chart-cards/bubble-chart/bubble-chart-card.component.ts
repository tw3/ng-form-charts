import { Component, Input } from '@angular/core';

import { chartColorScheme } from '../chart-color-scheme';

import { BubbleChartDataPoint } from './bubble-chart-data-point.model';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart-card.component.html',
  styleUrls: ['./bubble-chart-card.component.css']
})
export class BubbleChartCardComponent {
  @Input() title: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() results: BubbleChartDataPoint[];

  // Options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showGridLines = true;

  colorScheme = chartColorScheme;
}

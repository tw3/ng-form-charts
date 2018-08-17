import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.css']
})
export class HorizontalBarChartComponent {
  @Input() title: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() results: HorizontalBarChartDataPoint[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showGridLines = true;

  colorScheme = {
    domain: ['#3F51B5', '#FF4081', '#4E0250', '#3A3042', '#79B473']
  };
}

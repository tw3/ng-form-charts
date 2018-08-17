import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-bar-chart',
  templateUrl: './user-bar-chart.component.html',
  styleUrls: ['./user-bar-chart.component.css']
})
export class UserBarChartComponent implements OnInit {
  @Input() title: string;
  @Input() results: ChartDataPoint;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Age';
  showYAxisLabel = true;
  yAxisLabel = 'Name';
  showGridLines = true;

  colorScheme = {
    domain: ['#3F51B5', '#FF4081', '#4E0250', '#3A3042', '#79B473']
  };

  constructor() {
  }

  ngOnInit() {
  }

  onSelect(event) {
    console.log(event);
  }

}

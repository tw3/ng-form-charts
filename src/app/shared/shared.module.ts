import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from '../core/material/app-material.module';

import { BubbleChartCardComponent } from './chart-cards/bubble-chart/bubble-chart-card.component';
import { ForceDirectedGraphCardComponent } from './chart-cards/force-directed-graph-chart/force-directed-graph-card.component';
import { HorizontalBarChartCardComponent } from './chart-cards/horizontal-bar-chart/horizontal-bar-chart-card.component';
import { NoContentComponent } from './no-content/no-content.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    NgxChartsModule
  ],
  declarations: [
    NoContentComponent,
    HorizontalBarChartCardComponent,
    BubbleChartCardComponent,
    ForceDirectedGraphCardComponent
  ],
  exports: [
    NoContentComponent,
    HorizontalBarChartCardComponent,
    BubbleChartCardComponent,
    ForceDirectedGraphCardComponent
  ]
})
export class SharedModule {
}

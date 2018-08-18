import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from '../core/material/app-material.module';

import { BubbleChartCardComponent } from './chart-cards/bubble-chart/bubble-chart-card.component';
import { HorizontalBarChartCardComponent } from './chart-cards/horizontal-bar-chart/horizontal-bar-chart-card.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    NgxChartsModule
  ],
  declarations: [
    HorizontalBarChartCardComponent,
    BubbleChartCardComponent
  ],
  exports: [
    HorizontalBarChartCardComponent,
    BubbleChartCardComponent
  ]
})
export class SharedModule {
}

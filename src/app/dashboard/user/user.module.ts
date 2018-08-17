import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from '../../core/material/app-material.module';

import { BubbleChartComponent } from './report/chart-cards/bubble-chart/bubble-chart.component';
import { HorizontalBarChartComponent } from './report/chart-cards/horizontal-bar-chart/horizontal-bar-chart.component';
import { UserFormComponent } from './report/user-form/user-form.component';
import { UserReportComponent } from './report/user-report.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  declarations: [
    UserComponent,
    UserReportComponent,
    UserFormComponent,
    HorizontalBarChartComponent,
    BubbleChartComponent
  ]
})
export class UserModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from '../../core/material/app-material.module';

import { UserBarChartComponent } from './report/user-bar-chart/user-bar-chart.component';
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
    UserBarChartComponent,
    UserFormComponent
  ]
})
export class UserModule {}

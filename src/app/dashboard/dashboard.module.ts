import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from '../core/material/app-material.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    DashboardRoutingModule,
    FlexLayoutModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule {
}

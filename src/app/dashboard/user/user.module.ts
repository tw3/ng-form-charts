import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../../core/material/app-material.module';
import { SharedModule } from '../../shared/shared.module';

import { UserFormComponent } from './report/user-form/user-form.component';
import { UserReportComponent } from './report/user-report.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserComponent,
    UserReportComponent,
    UserFormComponent
  ]
})
export class UserModule {
}

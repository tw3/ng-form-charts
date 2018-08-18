import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoContentComponent } from './core/no-content/no-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NoContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

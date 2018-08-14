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
  // {
  //   path: 'login',
  //   pathMatch: 'full',
  //   loadChildren: 'app/login/login.module#LoginModule'
  // },
  // {
  //   path: 'logout',
  //   pathMatch: 'full',
  //   loadChildren: 'app/logout/logout.module#LogoutModule'
  // },
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

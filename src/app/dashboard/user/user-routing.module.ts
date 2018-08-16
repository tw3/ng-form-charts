import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserReportComponent } from './report/user-report.component';
import { UserComponent } from './user.component';

const routes: Routes = [{
  path: '',
  component: UserComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'report',
    },
    {
      path: 'report',
      component: UserReportComponent,
      data: { title: 'User Report' } // We'd use this if we had a navigation/title component
    }
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})

export class UserRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UserModule } from './user/user.module';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'user',
    },
    {
      path: 'user',
      loadChildren: () => UserModule,
      // loadChildren: 'app/dashboard/user/user.module#UserModule' // example of lazy-loading
    }
   ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})

export class DashboardRoutingModule {
}

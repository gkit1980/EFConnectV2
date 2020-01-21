import { RouterModule, Routes } from '@angular/router';
import { IceRuntimeResolver } from '@impeo/ng-ice';

import { HomeComponent } from './components/home/home.component';
import { StyleGuideComponent } from './components/styleguide/styleguide.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    resolve: { runtime: IceRuntimeResolver }
  },
  {
    path: 'styleguide',
    component: StyleGuideComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }

  /**
   * TIP: Define your routes here
   */
];
export const AppRouting = RouterModule.forRoot(routes, {
  initialNavigation: true,
  useHash: true
});

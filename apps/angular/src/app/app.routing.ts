import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StyleGuideComponent } from './components/styleguide/styleguide.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
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

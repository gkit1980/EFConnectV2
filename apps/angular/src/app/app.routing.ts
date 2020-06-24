import { RouterModule, Routes } from '@angular/router';
import { IceRuntimeResolver } from '@impeo/ng-ice';

import { HomeComponent } from './components/home/home.component';
import { StyleGuideComponent } from './components/styleguide/styleguide.component';
import { LoginComponent } from './components/login/login.component';
import { LoginAuthenticationGuard } from './guards/login-authentication.guard';
import { LoginPageGuard } from './guards/login-page.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [LoginAuthenticationGuard, RoleGuard],
    resolve: { runtime: IceRuntimeResolver },
  },
  {
    path: 'styleguide',
    component: StyleGuideComponent,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [LoginPageGuard, RoleGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
  /**
   * TIP: Define your routes here
   */
];
export const AppRouting = RouterModule.forRoot(routes, {
  initialNavigation: true,
  useHash: true,
});

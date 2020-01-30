import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

import { LoginAuthenticationGuard } from '../../guards/login-authentication.guard';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  authenticationService: AuthenticationService;

  constructor(private router: Router, public authService: AuthenticationService) {
    this.authenticationService = authService;

    this.addGuard(this.router.config, ['login', 'styleguide']);
  }

  addGuard(routes: Route[], exclude: string[]) {
    routes.forEach(route => {
      if (exclude.includes(route.path)) return;

      if (route.canActivate) {
        if (!route.canActivate.includes(LoginAuthenticationGuard)) {
          route.canActivate.push(LoginAuthenticationGuard);
        }
      } else {
        route.canActivate = [LoginAuthenticationGuard];
      }

      if (route.children) this.addGuard(route.children, exclude);
    });
  }
}

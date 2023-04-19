import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './../services/authentication.service';

@Injectable()
export class LoginAuthenticationGuard implements CanActivate {
  //
  //
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  //
  //
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authenticationService.loggedIn) return true;

    this.router.navigate(['/login']);
    return false;
  }
}

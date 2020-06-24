import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class RoleGuard implements CanActivate {
  //
  //
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  //
  //
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authenticationService.role === 'agent') {
      this.router.navigate(['/ice/insis.dashboard.home.agent/home']);
      return false;
    }

    if (this.authenticationService.role === 'customer') {
      this.router.navigate(['/ice/insis.dashboard.home.customer/home']);
      return false;
    }

    return true;
  }
}

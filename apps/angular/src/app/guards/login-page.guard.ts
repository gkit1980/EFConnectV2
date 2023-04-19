import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LoginPageGuard implements CanActivate {
  //
  //
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  //
  //
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authenticationService.loggedIn) return true;

    this.router.navigate(['/home']);
    return false;
  }
}

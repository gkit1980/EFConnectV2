import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated) {
      this.authService.redirectURL= state.url;
      //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/ice/default/customerArea.motor/home']);
    }
    return isAuthenticated;
  }
}

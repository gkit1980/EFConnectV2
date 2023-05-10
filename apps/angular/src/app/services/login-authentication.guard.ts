import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Injectable({
  providedIn: 'root',
})
export class LoginAuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService, @Inject(LOCAL_STORAGE) private storage: StorageService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {
      //console.log(" state.url "+state.url);
      if(this.authService.isLoggedIn()) {
        this.authService.redirectURL = state.url;
        return true;
      }
      else {
        //var encryptedredirectURL = encodeURIComponent(CryptoJS.AES.encrypt(state.url, environment.decryption_code).toString());
        this.authService.redirectURL = state.url;
        this.authService.isLoggedIn();
        return false;
      }

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { IcePrincipal,ClientPrincipal } from '@impeo/ice-core';
import { IcePrincipalService } from '@impeo/ng-ice';
import { LocalStorageService } from './local-storage.service';
import * as CryptoJS from 'crypto-js';
import { getDefaultLanguage } from './language.service';
import { split } from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectURL: string;

  constructor(private http: HttpClient, private localStorage: LocalStorageService, private route: Router, private icePrincipalService: IcePrincipalService) { }

  sighinUser(email: any, password: any): Observable<any> {

    let headerOptions = new HttpHeaders().append('content-type', 'application/x-www-form-urlencoded');

    var emailEncrypted = CryptoJS.AES.encrypt(email, 'ice_username');
    var passwordEncrypted = CryptoJS.AES.encrypt(password, 'ice_password');

    var postData = `username=${emailEncrypted}` + `&password=${passwordEncrypted}`;

    return this.http.post(`/api/v1/middleware/signin/login`, postData, { headers: headerOptions });
  }

  refreshToken(token: any): Observable<any> {

    var tokenEncrypted = CryptoJS.AES.encrypt(token, 'ice_token');
    var postData = { "data": { "token": `${tokenEncrypted}` } };

    return this.http.post(`/api/v1/middleware/signin/refreshToken`, postData);
  }

  isLoggedIn(): boolean {

    if (this.localStorage.getDataFromLocalStorage('token')) {
      // if (this.redirectURL) {
      //   this.route.navigate([this.redirectURL]);
      // }
      return true;
    }
    else {
      //console.log("this.redirectURL" + this.redirectURL);
      if (this.redirectURL) {
         this.route.navigate(['/login'], { queryParams: { returnUrl: this.redirectURL }});
       }
      return false;
    }
  }

  /**
   * creates an IcePrincipal having the token
   * @param token
   */
  buildPrincipal(): void {
    if (this.icePrincipalService.principal) return;
    const token = this.localStorage.getDataFromLocalStorage("token");
    // const userEmail = this.localStorage.getDataFromLocalStorage("email");
    const langCode = getDefaultLanguage();
    // const userData = { token: `${token}` };
    const principal = this.principalFromToken(token, langCode);
    this.icePrincipalService.principal = principal;
  }

    //
  //grab the JWT token payload, decode it, and create principal from it
  //
  private principalFromToken(token: string, locale: string): IcePrincipal {
    const tokenParts = split(token, '.');
    if (tokenParts.length !== 3) return null;

    const payload = JSON.parse(decodeURIComponent(escape(atob(tokenParts[1]))));

    return new ClientPrincipal(payload.id, token, locale, payload.roles, payload.data);
  }

}

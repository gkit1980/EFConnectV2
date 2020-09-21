import { Injectable } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import { IcePrincipal, ClientPrincipal } from '@impeo/ice-core';
import * as axios from 'axios';
import { split, first, isArray } from 'lodash';
import { getDefaultLanguage } from './language.service';

type Role = 'customer' | 'agent' | null;
const localStoragekey = 'insis-token';

@Injectable()
export class AuthenticationService {
  get loggedIn(): boolean {
    if (this.icePrincipalService.principal) return true;

    return false;
  }

  get name(): string {
    if (!this.loggedIn) return '';

    if (this.icePrincipalService.principal.data.firstName) {
      return `${this.icePrincipalService.principal.data.firstName} ${this.icePrincipalService.principal.data.lastName}`;
    }

    if (this.icePrincipalService.principal.data.companyName) {
      return this.icePrincipalService.principal.data.companyName;
    }
  }

  get role(): Role {
    if (!this.loggedIn) return null;

    return first(this.icePrincipalService.principal.roles) as Role;
  }

  constructor(private icePrincipalService: IcePrincipalService) {
    const principal = this.loadPrincipalFromLocalStorage();
    if (principal) this.icePrincipalService.principal = principal;

    console.log('AuthenticationService constructed - loaded form local-storage', principal != null);
  }

  async login(id: string, role: string): Promise<void> {
    try {
      const response = await axios.default.get(
        role === 'customer' ? `/api/v1/external/client/${id}` : `/api/v1/external/agent/${id}`,
        {
          timeout: 4000,
        }
      );
      const token = response.data.token;
      const langCode = getDefaultLanguage();
      const newPrincipal = this.principalFromToken(token, langCode);
      if (newPrincipal == null) throw new Error('Login failed');

      this.icePrincipalService.principal = newPrincipal;
      this.storePrincipalToLocalStorage(newPrincipal);
    } catch (error) {}
  }

  async logout(): Promise<void> {
    this.icePrincipalService.principal = null;
    localStorage.removeItem(localStoragekey);
  }

  private storePrincipalToLocalStorage(principal: IcePrincipal) {
    localStorage.setItem(localStoragekey, principal.getToken());
  }

  private loadPrincipalFromLocalStorage(): IcePrincipal {
    try {
      const token = localStorage.getItem(localStoragekey);
      const langCode = getDefaultLanguage();
      const principal = this.principalFromToken(token, langCode);
      return principal;
    } catch (error) {
      return null;
    }
  }

  //
  //grab the JWT token payload, decode it, and create principal from it
  //
  private principalFromToken(token: string, locale: string): IcePrincipal {
    const tokenParts = split(token, '.');
    if (tokenParts.length !== 3) return null;
    const payload = JSON.parse(atob(tokenParts[1]));
    return new ClientPrincipal(payload.id, token, locale, payload.roles, payload.data);
  }
}

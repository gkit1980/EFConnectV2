import { Injectable } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import { IcePrincipal, ClientPrincipal } from '@impeo/ice-core';
import * as _ from 'lodash';

import * as axios from 'axios';
import { get } from 'lodash';
import { getDefaultLanguage } from './language.service';

type Role = 'customer' | 'agent' | null;
const localStoragekey = 'insis-principal2';
const nonLoggedInPrincipalId = 'n/a';

@Injectable()
export class AuthenticationService {
  get loggedIn(): boolean {
    if (
      this.icePrincipalService.principal &&
      this.icePrincipalService.principal.id !== nonLoggedInPrincipalId
    )
      return true;

    return false;
  }

  get name(): string {
    if (!this.icePrincipalService.principal.data) {
      console.error('No name data found for current user.');
      return '';
    }

    if (this.icePrincipalService.principal.data.firstName) {
      return `${this.icePrincipalService.principal.data.firstName} ${this.icePrincipalService.principal.data.lastName}`;
    }

    if (this.icePrincipalService.principal.data.companyName) {
      return this.icePrincipalService.principal.data.companyName;
    }
  }

  get role(): Role {
    const role = _.first(this.icePrincipalService.principal.roles);
    return role as Role;
  }

  constructor(private icePrincipalService: IcePrincipalService) {
    const principal = this.loadPrincipalFromLocalStorage();
    if (principal) this.icePrincipalService.principal = principal;

    //can we move the app.module ICE principal creation in here?
    //maybe in absence of a principal in local storage, even return a default "dummy" principal
  }

  async login(id: string, role: string): Promise<void> {
    try {
      const response = await axios.default.get(
        role === 'customer' ? `/api/v1/external/client/${id}` : `/api/v1/external/agent/${id}`,
        {
          timeout: 4000,
        }
      );

      //hotfix: so that role property exists in pricipal data
      response.data['role'] = role;

      const currPrincipal = this.icePrincipalService.principal;
      const newPrincipal = new ClientPrincipal(
        response.data.pid,
        currPrincipal.locale,
        [role],
        response.data
      );


      this.icePrincipalService.principal = newPrincipal;
      this.storePrincipalToLocalStorage(newPrincipal);
    } catch (error) { }
  }

  async logout(): Promise<void> {
    const currPrincipal = this.icePrincipalService.principal;
    const newPrincipal = new ClientPrincipal(nonLoggedInPrincipalId, currPrincipal.locale, [], {});

    this.icePrincipalService.principal = newPrincipal;
    localStorage.removeItem(localStoragekey);
  }

  private storePrincipalToLocalStorage(principal: IcePrincipal) {
    const data = {
      id: principal.id,
      roles: principal.roles,
      data: principal.data,
      locale: principal.locale,
    };
    localStorage.setItem(localStoragekey, JSON.stringify(data));
  }

  private loadPrincipalFromLocalStorage(): IcePrincipal {
    try {
      const data = JSON.parse(localStorage.getItem(localStoragekey));
      const principal = new ClientPrincipal(data.id, data.locale, data.roles, data.data);
      return principal;
    } catch (error) {
      return null;
    }
  }
}

import { Injectable } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import * as axios from 'axios';

@Injectable()
export class AuthenticationService {
  get loggedIn(): boolean {
    if (!this.icePrincipalService.principal.data.pid)
      this.icePrincipalService.principal.data.pid = localStorage.getItem('pid');

    if (this.icePrincipalService.principal.data.pid) return true;

    return false;
  }

  constructor(private icePrincipalService: IcePrincipalService) {}

  async login(userData: any): Promise<void> {
    try {
      const response = await axios.default.get(`/api/v1/external/client/${userData}`, {
        timeout: 4000
      });

      localStorage.setItem('pid', JSON.stringify(response.data.pid));
      this.icePrincipalService.principal.data = response.data;
    } catch (error) {}
  }

  async logout(): Promise<void> {
    this.icePrincipalService.principal.data = {};
    localStorage.removeItem('pid');
  }
}

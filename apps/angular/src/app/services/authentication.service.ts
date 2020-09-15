import { Injectable } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import * as axios from 'axios';
import { get } from 'lodash';

type Role = 'customer' | 'agent' | null;

@Injectable()
export class AuthenticationService {
  get loggedIn(): boolean {
    if (this.icePrincipalService.principal.data && this.icePrincipalService.principal.data.pid)
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
    return get(this.icePrincipalService.principal, 'data.role', null);
  }

  constructor(private icePrincipalService: IcePrincipalService) {
    this.setPrincipalDataFromStorage();
  }

  async login(userData: any, role: string): Promise<void> {
    try {
      const response = await axios.default.get(
        role === 'customer'
          ? `/api/v1/external/client/${userData}`
          : `/api/v1/external/agent/${userData}`,
        {
          timeout: 4000,
        }
      );

      response.data['role'] = role;

      localStorage.setItem('insis-principal', JSON.stringify(response.data));
      this.icePrincipalService.principal.data = response.data;
    } catch (error) {}
  }

  async logout(): Promise<void> {
    this.icePrincipalService.principal.data = {};

    localStorage.removeItem('insis-principal');
  }

  private setPrincipalDataFromStorage(): void {
    if (!this.icePrincipalService.principal.data || !this.icePrincipalService.principal.data.pid)
      this.icePrincipalService.principal.data = JSON.parse(localStorage.getItem('insis-principal'));
  }
}

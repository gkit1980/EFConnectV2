import { Injectable } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import * as axios from 'axios';

@Injectable()
export class AuthenticationService {
  get loggedIn(): boolean {
    if (this.icePrincipalService.principal.data && this.icePrincipalService.principal.data.pid)
      return true;

    return false;
  }

  get name(): string {
    if (this.icePrincipalService.principal.data)
      return `${this.icePrincipalService.principal.data.firstName} ${this.icePrincipalService.principal.data.lastName}`;

    console.error('No name data found for current user.');
    return '';
  }

  constructor(private icePrincipalService: IcePrincipalService) {
    this.setPrincipalDataFromStorage();
  }

  async login(userData: any): Promise<void> {
    try {
      const response = await axios.default.get(`/api/v1/external/client/${userData}`, {
        timeout: 4000,
      });

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

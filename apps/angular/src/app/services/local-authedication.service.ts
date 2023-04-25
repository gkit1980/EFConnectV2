import { Injectable } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import { is } from 'bluebird';

@Injectable()
export class LocalAuthedicationService {



  constructor(private icePrincipalService: IcePrincipalService) { }

  isAuthdicated:boolean;





  setStatus(status:boolean) {

    this.isAuthdicated = status
  }

  isLoggedIn():boolean {

    return this.isAuthdicated;
  }

}

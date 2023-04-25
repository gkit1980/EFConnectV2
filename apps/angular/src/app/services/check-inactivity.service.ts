import { Injectable } from '@angular/core';
import { LogoutService } from './logout.service';
import { LocalStorageService } from './local-storage.service';
import { IcePrincipalService } from '@impeo/ng-ice';


@Injectable({
  providedIn: 'root'
})
export class CheckInactivityService {

  userActivity: boolean;
  status: boolean = true;
  constructor(private logoutService: LogoutService, private localStorage: LocalStorageService, private pricipalService: IcePrincipalService,
             ) { }



  setStatusActivity(status: boolean) {
    this.userActivity = status;
    if (this.userActivity) {
      console.info("StatusActivity:"+this.userActivity)
    }
    else {
      // console.log(this.localStorage.getDataFromLocalStorage('token'));
      if (this.localStorage.getDataFromLocalStorage('token') != undefined) {
        console.info("StatusActivity log out ativity")
        this.logoutService.logout(true);
        this.pricipalService.principal = null;
      }
    }
  }

  activityStatus(): boolean {
    if (this.userActivity) {
      return true;
    }
    else {
      console.log('user is inactive');
      return false;
    }
  }
}

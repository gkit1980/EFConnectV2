import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SignupService } from '../signup.service'

@Injectable()
export class SignUpGuard implements CanActivate {

    constructor(private router: Router, private signupService: SignupService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.router.url.replace(/\?.*$/,'') == '/signupform/form' && state.url == '/signupform/mobilevalidation' && this.signupService.stageProtection == 2) {
            return true;
        }
        if (this.router.url == '/signupform/mobilevalidation' && state.url == '/signupform/confirmation' && this.signupService.stageProtection == 3) {
            return true;
        }
        if (this.router.url == '/signupform/confirmation' && state.url == '/createaccount' && this.signupService.stageProtection == 3) {
            return true;
        }

        //new process --test purpose
        if (state.url == '/signupform/confirmation' && this.signupService.stageProtection == 1) {  
            return true;
        }
        if (state.url == '/signupform/smsvalidation' && this.signupService.stageProtection == 2) {      
            return true;
        }
        if (state.url == '/signupform/finalizeaccount' && this.signupService.stageProtection == 3) { 
            return true;
        }
        return false;
    }

}
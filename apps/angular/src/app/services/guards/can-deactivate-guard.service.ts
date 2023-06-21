import { Observable } from 'rxjs/Observable';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EclaimsPageComponent } from '@insis-portal/ice-custom-components/src/lib/components/page-components/eclaims-page/eclaims-page.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class CanDeactivateGuard implements CanDeactivate<any> {

  canDeactivate(component: any,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
                {
                  //special case for the dialog eclaims @@@@
                 if(currentState.url.includes("viewEclaimsDetails") && !nextState.url.includes("viewEclaimsDetails") &&
                  (component.iceModel.elements["eclaims.step"].getValue().forIndex(null)==3 ||  component.iceModel.elements["eclaims.step"].getValue().forIndex(null)==31))
                 {
                   component.iceModel.elements["eclaims.process.exit.trigger"].setSimpleValue(true);
                   component.iceModel.elements["eclaims.process.exit.nexturl"].setSimpleValue(nextState.url);
                   return false;
                 }
                 else
                 return true;
  }
}

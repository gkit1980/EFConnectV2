import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ResourceService } from '../services/resource.service';

//
//
@Injectable()
export class ResourceResolver implements Resolve<void> {

    //
    //
    constructor(private resourceService: ResourceService) {
    }

    //
    //
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
        return new Observable(observer => {
            this.resourceService.loadResources('default').then(() => {
                observer.next();
                observer.complete();
            }).catch(error => {
                observer.error(error);
            });
        });
    }
}

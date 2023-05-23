import { PipeTransform, Pipe } from '@angular/core';
import { ResourceService } from '../services/resource.service';
import { IcePrincipalService } from '@impeo/ng-ice';



//
//
@Pipe({
    name: 'resourcePipe'
})
export class ResourcePipe implements PipeTransform {

    private model: any;

    //
    //
    constructor(private resourceService: ResourceService, private principalService: IcePrincipalService) {
        // the model can be used as resource parameter paths - so, to be flexible in future, we will create a wrapping structure
        this.model = {
            principal: this.principalService.principal
        };
    }

    //
    //
    transform(value: string, ...args: any[]) {

    return this.resourceService.resolve(value);
    }

}


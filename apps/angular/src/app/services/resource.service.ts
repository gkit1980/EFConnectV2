import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IceResource } from '@impeo/ice-core';
import { IceRuntimeService } from '@impeo/ng-ice';

@Injectable()
export class ResourceService {

    private iceResources: IceResource = undefined;
    private locale = 'el';
    private resourceData: any;

    //
    //
    constructor(private http: HttpClient,private runtimeService: IceRuntimeService) {
        console.log('ResourceService constructed');
    }

    //
    //
    resolve(resourceKey: string, paramsOrDefaultReturn?: any, defaultReturn?: string) {
        if (!this.iceResources) {
            return `[${resourceKey}]`;
        }
        return this.iceResources.resolve(resourceKey, paramsOrDefaultReturn, defaultReturn);
    }

    //
    //
    async loadResources(repoPath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.iceResources) {
                resolve();
                return;
            }
            else
            {
                   this.runtimeService.getRuntime().then((runtime) => {
                   this.iceResources=runtime.iceResource;
                    })
                    return;
               }
        });
    }

    // changeLocale(locale: string) {
    //     if ((locale == null) || (this.resourceData == null)) return;
    //     this.locale = locale;
    //     this.iceResources = IceResource.build(this.locale, this.resourceData);
    // }
}

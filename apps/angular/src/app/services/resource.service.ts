import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IceResource } from '@impeo/ice-core';


@Injectable()
export class ResourceService {

    private iceResources: IceResource = undefined;
    private locale = 'el';
    private resourceData: any;

    //
    //
    constructor(private http: HttpClient) {
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
        return new Promise<any>((resolve, reject) => {
            if (this.iceResources) {
                resolve();
                return;
            }
            this.http.get('./api/v1/resources/' + repoPath).subscribe((resp: any) => {
                if (resp['success'] == true) {
                    this.resourceData = resp['data'];
                    this.iceResources = IceResource.build(this.locale, resp['data']);
                    resolve();
                    return;
                }
                reject(new Error(resp['message']));
            });
        });
    }

    changeLocale(locale: string) {
        if ((locale == null) || (this.resourceData == null)) return;
        this.locale = locale;
        this.iceResources = IceResource.build(this.locale, this.resourceData);
    }
}

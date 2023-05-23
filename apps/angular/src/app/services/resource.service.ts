import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IceResource } from '@impeo/ice-core';
import { IceRuntimeService } from '@impeo/ng-ice';

@Injectable()
export class ResourceService {

    private iceResources: IceResource;
    private locale = 'el';
    private resourceData: any;


    constructor(private http: HttpClient,private runtimeService: IceRuntimeService) {
        console.log('ResourceService constructed');
    }


    resolve(resourceKey: string) {
        if (!this.iceResources){
            return `[${resourceKey}]`;
        }

        if (this.iceResources!=undefined) {
          return this.iceResources.resolve(resourceKey);
      }

       // return this.iceResources.resolve(resourceKey, paramsOrDefaultReturn, defaultReturn);
       this.runtimeService.getRuntime().then(async (runtime:any) => {
      // await  runtime.iceResource.resolve(resourceKey);
        return runtime.iceResource.resolve(resourceKey);
        });

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
                   this.http.get('./api/v1/resources/' + repoPath).subscribe((resp: any) => {
                    if (resp['success'] == true)
                    {
                        this.resourceData = resp['data'];


                        this.runtimeService.getRuntime().then((runtime:any) => {
                             IceResource.build(runtime,resp['data'])
                             this.iceResources=runtime.iceResource;
                           resolve();
                           return;
                        });


                    }
                    else
                    reject(new Error(resp['message']));
                });
               }
        });
    }

    // changeLocale(locale: string) {
    //     if ((locale == null) || (this.resourceData == null)) return;
    //     this.locale = locale;
    //     this.iceResources = IceResource.build(this.locale, this.resourceData);
    // }
}

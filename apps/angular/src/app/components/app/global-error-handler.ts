import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy } from '@angular/common';


@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

constructor(private injector: Injector) {
  super()
 }

handleError(error: any) {
    //manually injector call
    // const loggingService = this.injector.get(this.errorLogService);

    const location = this.injector.get(LocationStrategy);
    //data to log
    const locationUrl = location._platformLocation.location.href;
    const errorTime = location._platformLocation._doc.lastModified;
    const message = error.message ? error.message : error.toString();


    super.handleError(error);
  }

}

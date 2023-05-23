import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy,Location,PlatformLocation } from '@angular/common';


@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

constructor(private injector: Injector) {
  super()
 }

handleError(error: any) {
    //manually injector call
    // const loggingService = this.injector.get(this.errorLogService);

    const location = this.injector.get(PlatformLocation);
    //data to log
    const locationUrl = location.href;
    const errorTime = new Date();
    const message = error.message ? error.message : error.toString();


    super.handleError(error);
  }

}

import { Component } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'insis-simple-page',
  templateUrl: './insis-simple-page.component.html',
})
export class InsisSimplePageComponent extends PageComponentImplementation {
  static componentName = 'InsisSimplePage';
}

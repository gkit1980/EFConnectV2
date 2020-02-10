import { Component } from '@angular/core';
import { IceArrayComponent } from '@impeo/ng-ice';

@Component({
  selector: 'insis-array',
  templateUrl: './insis-array.component.html'
})
export class InsisArrayComponent extends IceArrayComponent {
  static componentName = 'InsisArray';

  //
  //
  getIndexOfArrayItem(index: number): number {
    return index + 1;
  }
}

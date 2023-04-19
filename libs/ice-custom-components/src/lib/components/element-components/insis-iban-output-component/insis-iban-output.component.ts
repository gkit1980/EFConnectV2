import { Component } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { toString, split } from 'lodash';

@Component({
  selector: 'insis-iban-output',
  templateUrl: './insis-iban-output.component.html',
})
export class InsisIBANOutputComponent extends MaterialElementComponentImplementation {
  static componentName = 'InsisIBANOutput';

  get formatedIBAN() {
    const ibanCharArray = split(toString(this.value), '');
    for (let i = 4; i < ibanCharArray.length - 4; i++) {
      if (i < 8) ibanCharArray[i] = '*';
      else ibanCharArray[i] = null;
    }
    return ibanCharArray.join('');
  }
}

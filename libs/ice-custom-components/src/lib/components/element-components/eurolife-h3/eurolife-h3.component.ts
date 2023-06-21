import { ElementComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eurolife-h3',
  templateUrl: './eurolife-h3.component.html',
  styleUrls: ['./eurolife-h3.component.scss']
})
export class EurolifeH3Component extends ElementComponentImplementation {

  get headingClasses() {
    // Read first class
    let dt_name = this.getRecipeParam("headingClass");
    let dtResult = '';
    if (dt_name !== null) {
      let dt = this.page.iceModel.dts[dt_name];
      dtResult = dt.getOutputValue(null);
    }
    // Read second class
    let headingType = this.getRecipeParam("headingType");
    if (headingType == null) headingType = 'h3';

    // Return both classes
    return dtResult + ' ' + headingType;
  }

  get elementValue() {
    return this.value;
  }

}

import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as moment from "moment";

@Component({
  selector: 'app-eurolife-output-subheader',
  templateUrl: './eurolife-output-subheader.component.html',
  styleUrls: ['./eurolife-output-subheader.component.scss']
})
export class EurolifeOutputSubheaderComponent extends ElementComponentImplementation {
  get showhr() {
    // If no label then don't show horizontal line
    return this.label == "" ? false : true;
  }

  get valueClass() {
    let dt_name = this.getRecipeParam("valueClass");
    if (dt_name == null) return '';
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.getOutputValue(null);

    return result;
  }

  get labelClass() {
    let dt_name = this.getRecipeParam("labelClass");
    if (dt_name == null) return '';
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.getOutputValue(null);

    return result;
  }

  get values() {
    if (this.value instanceof Date) {
      return moment(this.value).format('DD/MM/YYYY');
    }
    return parseFloat(this.value).toFixed(2);             //decimal with 2 digits
  }


}

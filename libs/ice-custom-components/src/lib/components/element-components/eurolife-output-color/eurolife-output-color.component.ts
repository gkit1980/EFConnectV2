import { Component } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as moment from "moment";

@Component({
  selector: 'app-eurolife-output-color',
  templateUrl: './eurolife-output-color.component.html',
  styleUrls: ['./eurolife-output-color.component.css']
})
export class EurolifeOutputColorComponent extends ElementComponentImplementation {

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
    return this.value;
  }

}

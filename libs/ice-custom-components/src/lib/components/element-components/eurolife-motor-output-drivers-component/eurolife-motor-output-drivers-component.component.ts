import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as moment from "moment";


@Component({
  selector: 'app-eurolife-motor-output-drivers-component',
  templateUrl: './eurolife-motor-output-drivers-component.component.html',
  styleUrls: ['./eurolife-motor-output-drivers-component.component.scss']
})
export class EurolifeMotorOutputDriversComponentComponent extends ElementComponentImplementation {

  myclass: string = "";


  get showhr() {
    // If no label then don't show horizontal line
    return this.myclass != "" ? false : true;
  }

  get valueClass() {
    let dt_name = this.getRecipeParam("driverClass");
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      let result = dt.evaluateSync();
      this.myclass = result["elementClass"];

      return this.myclass;
    }
    return null;
  }

  get labelClass() {
    let dt_name = this.getRecipeParam("driverClass");
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      let result = dt.evaluateSync();
      this.myclass = result["elementClass"];

      return this.myclass;
    }
    return null;

  }

  get values() {
    if (this.value instanceof Date) {
      return moment(this.value).format('DD/MM/YYYY');
    }
    return this.value;
  }


}


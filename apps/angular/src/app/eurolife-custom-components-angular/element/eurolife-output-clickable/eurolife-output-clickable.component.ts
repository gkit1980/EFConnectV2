import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-eurolife-output-clickable',
  templateUrl: './eurolife-output-clickable.component.html',
  styleUrls: ['./eurolife-output-clickable.component.scss']
})
export class EurolifeOutputClickableComponent extends ElementComponentImplementation {

  get labelClass() {
    let dt_name = this.getRecipeParam("labelClass");
    if (dt_name == null) return '';
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.getOutputValue(null);

    return result;
  }

  redirectTo(): any {
    var redirectUrl = this.context.iceModel.elements["amendments.request.another.amendment"].recipe.redirectUrl;
    this.context.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(true);
    window.location.href = redirectUrl;
  }

}

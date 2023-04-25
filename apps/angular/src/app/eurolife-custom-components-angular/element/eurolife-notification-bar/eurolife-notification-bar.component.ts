import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-eurolife-notification-bar',
  templateUrl: './eurolife-notification-bar.component.html',
  styleUrls: ['./eurolife-notification-bar.component.scss']
})
export class EurolifeNotificationBarComponent extends ElementComponentImplementation implements OnInit {

  imageSource: string;
  notificationType: string;
  notificationText: string;

  ngOnInit() {
    super.ngOnInit();
    let dt_name = this.getRecipeParam("url");
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.evaluateSync();
    this.imageSource = result["svgImageValue"];
    this.notificationType = result["notificationType"];
    this.notificationText = result["notificationText"];

  }

  // get imageSource() {

  // }

  get notificationValue() {
    return this.value;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');

    return svg;
  }

  // get notificationType() {
  //   let dt_name = this.getRecipeParam("url");
  //   let dt = this.page.iceModel.dts[dt_name];
  //   let dta = new DtAccessor(dt, this.page.context.iceModel);
  //   let result = dta.getOutputValue(null);

  //   return result;
  // }

}

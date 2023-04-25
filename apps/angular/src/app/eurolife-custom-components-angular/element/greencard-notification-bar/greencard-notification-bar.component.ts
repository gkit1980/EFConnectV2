import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { RangeRule, LifecycleType, IndexedValue } from '@impeo/ice-core';

@Component({
  selector: 'app-greencard-notification-bar',
  templateUrl: './greencard-notification-bar.component.html',
  styleUrls: ['./greencard-notification-bar.component.scss']
})
export class GreencardNotificationBarComponent extends ElementComponentImplementation implements OnInit {

  notificationType: string;
  notificationText: string;
  notificationText2: string;
  imageSource: any;
  cardNumber: string;
  show: boolean = false

  ngOnInit() {
    super.ngOnInit();

    this.imageSource = this.element.recipe.imageSource
    this.notificationType = this.element.recipe.notificationType
    this.notificationText = this.element.recipe.notificationText
    if (this.element.recipe.notificationText2) {
      this.notificationText2 = this.element.recipe.notificationText2
    }
    if (this.element.recipe.step === 1) {
      if (this.context.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().forIndex(null) === "-1" || this.context.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().forIndex(null) === undefined ||
        this.context.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().forIndex(null) == null) {
        this.show = false
      } else {
        this.show = true
        this.cardNumber = this.context.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().forIndex(null)
      }
      this.context.iceModel.elements["greencard.motor.security.greenCardNo"].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === "-1" || value.element.getValue().forIndex(null) === undefined ||
          value.element.getValue().forIndex(null) == null) {
          this.show = false
        } else {
          this.show = true
          this.cardNumber = value.element.getValue().forIndex(null)
        }
      });
    } else {
      this.context.iceModel.elements["greencard.motor.security.greenCardNewNo"].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === "-1" || value.element.getValue().forIndex(null) === undefined ||
          value.element.getValue().forIndex(null) === null) {
          this.show = false
        } else {
          this.show = true
          this.cardNumber = value.element.getValue().forIndex(null)
        }
      });
    }
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');

    return svg;
  }

}

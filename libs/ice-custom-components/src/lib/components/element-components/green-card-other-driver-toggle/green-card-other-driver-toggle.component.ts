import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-green-card-other-driver-toggle',
  templateUrl: './green-card-other-driver-toggle.component.html',
  styleUrls: ['./green-card-other-driver-toggle.component.scss']
})
export class GreenCardOtherDriverToggleComponent extends ElementComponentImplementation {

  isChecked: boolean = false;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.isChecked) {
      this.context.iceModel.elements["greencard.motor.other.show.driver"].setSimpleValue(true);
    }
    else {
      this.context.iceModel.elements["greencard.motor.other.show.driver"].setSimpleValue(false);
      this.context.iceModel.elements["greencard.motor.other.drivers.number"].setSimpleValue(1);
      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue("");
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
    }
  }

  ngOnDestroy() {
    this.context.iceModel.elements["greencard.motor.other.show.driver"].setSimpleValue(true);
  }

  public toggle(event: MatSlideToggleChange) {
    if (event.checked) {
      this.context.iceModel.elements["greencard.motor.other.show.driver"].setSimpleValue(true);
    }
    else {
      this.context.iceModel.elements["greencard.motor.other.show.driver"].setSimpleValue(false);
      this.context.iceModel.elements["greencard.motor.other.drivers.number"].setSimpleValue(1);
      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue("");
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent, IceDatepickerComponent, IceCheckboxComponent, ElementComponentImplementation } from '@impeo/ng-ice';
import * as _ from 'lodash';

@Component({
  selector: 'app-gdpr-notification',
  templateUrl: './gdpr-notification.component.html',
  styleUrls: ['./gdpr-notification.component.css']
})
export class GdprNotificationComponent extends ElementComponentImplementation {

  labelPosition: string;
  text1 = 'elements.gdprNotification.text1.label';
  text2 = 'elements.gdprNotification.text2.label';

  constructor() {
    super();
  }

  ngOnInit() {
    this.labelPosition = this.getRecipeParam('labelPosition', 'after');
  }

  onChange(event: any): void {
    this.onComponentValueChange();
  }
}

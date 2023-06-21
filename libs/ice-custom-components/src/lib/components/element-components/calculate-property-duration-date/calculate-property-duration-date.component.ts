import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { IceTextInputComponent, IceElementComponent, ElementComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-calculate-property-duration-date',
  templateUrl: './calculate-property-duration-date.component.html',
  styleUrls: ['./calculate-property-duration-date.component.scss']
})
export class CalculatePropertyDurationDateComponent extends ElementComponentImplementation {

  currentContract: any;
  items: any[];
  duration: any;
  show: boolean = false;
  policy = 'elements.calculateProperty.policy.label';
  months = 'elements.calculateProperty.months.label';

  constructor(
    private localStorage: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {

    let selectedBranch = this.localStorage.getDataFromLocalStorage("selectedBranch");
    if (selectedBranch === 4) {
      this.show = true;
    }
  }


  protected calculateDiffOfDates(lastDate: any, priorDate: any) {
    let diff = Math.abs(new Date(lastDate).getTime() - new Date(priorDate).getTime());
    let diffMonths = Math.floor(diff / (1000 * 3600 * 24 * 30));
    return diffMonths;
  }

  getInsuranceDurationValue(): any {




    if (this.localStorage.getDataFromLocalStorage("refreshStatus") === 0) {
      var startDate = this.context.iceModel.elements["policies.details.StartDate"].getValue().values[0].value;
      var endDate = this.context.iceModel.elements["policies.details.ExpirationDate"].getValue().values[0].value;
      return this.calculateDiffOfDates(endDate, startDate);
    } else {
      var startDate = this.localStorage.getDataFromLocalStorage("durationStartDate");
      var endDate = this.localStorage.getDataFromLocalStorage("durationEndDate")
      // this.localStorage.setDataToLocalStorage("refreshStatus", 0);
      return this.calculateDiffOfDates(endDate, startDate);
    }





  }

}

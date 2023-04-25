import { IceTextInputComponent, ElementComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-calculate-property-payment-frequency',
  templateUrl: './calculate-property-payment-frequency.component.html',
  styleUrls: ['./calculate-property-payment-frequency.component.scss']
})
export class CalculatePropertyPaymentFrequencyComponent extends ElementComponentImplementation {

  currentContract: any;
  items: any[];
  duration: any;
  show: boolean = false;
  frequencyOfPayment = 'elements.calculatePropertyDuration.frequencyOfPayment.label';

  constructor(private localStorage: LocalStorageService) {
    super()
  }x

  ngOnInit() {
    this.addItems();
    let selectedBranch = this.localStorage.getDataFromLocalStorage('selectedBranch');
    if (selectedBranch === 4 ) {
      this.show = true;
    }
    this.context.$actionEnded.subscribe((actionName: string) => {
      if (actionName.includes("actionGetPolicies")) {
       this.addItems();
        //   this.showDafsDocs();
        this.context.$actionEnded.observers.pop();
      }

    });
  }

  private addItems(): any {


    if (this.localStorage.getDataFromLocalStorage('refreshStatus') == 0) {
      this.items = _.get(this.context.dataStore, 'clientContracts');
    } else {

      // this.localStorage.setDataToLocalStorage('refreshStatus', 0);
    }

  }

  getFrequencyOfPaymentValue(): any {

    if (this.items != undefined) {
      let indexValue = this.localStorage.getDataFromLocalStorage('index');
      this.currentContract = this.items[indexValue];

      return this.currentContract.paymentFrequencyToString;
    }


  }

}

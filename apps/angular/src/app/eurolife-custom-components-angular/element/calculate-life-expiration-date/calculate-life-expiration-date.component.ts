import { LocalStorageService } from './../../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent, IceDatepickerComponent, IceTextInputComponent, ElementComponentImplementation, IceElementComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';

@Component({
  selector: 'app-calculate-life-expiration-date',
  templateUrl: './calculate-life-expiration-date.component.html',
  styleUrls: ['./calculate-life-expiration-date.component.scss']
})
export class CalculateLifeExpirationDateComponent extends ElementComponentImplementation {

  currentContract: any;
  items: any[];
  duration: any;
  show: boolean = false;
  selectedBranch: number;

  constructor(
    private localStorage: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.addItems();
    // this.indexFunction();
    this.selectedBranch = this.localStorage.getDataFromLocalStorage("selectedBranch");
    // let selectedBranch = this.context.iceModel.elements["policy.selectedBranch"].getValue().values[0].value;
    // let selectedContractIDType = this.context.iceModel.elements["policy.selectedContractIDType"].getValue().values[0].value;
    if (this.selectedBranch === 1 || this.selectedBranch === 2 || this.selectedBranch === 15 || this.selectedBranch === 9 || this.selectedBranch === 11 || this.selectedBranch === 12 || this.selectedBranch === 14 || this.selectedBranch === 16 || this.selectedBranch === 17) {
      this.show = true;
    }
  }

  private addItems(): any {

    //dataStoreProperty comes from the page
    this.items = _.get(this.context.dataStore, 'clientContracts');

  }

  // private indexFunction(): any {
  //   let indexValue = this.context.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;

  //   this.currentContract = this.items[0][indexValue];

  //   this.duration = this.context.iceModel.elements["policies.details.InsuranceDuration"].getValue().values[0].value;
  //   this.context.iceModel.elements["policies.life.details.ExpirationDate"].setSimpleValue(this.currentContract.StartDate);

  //   return this.currentContract;

  // }

  getExpirationValue(): any {
    var newExpDate: any;
    // let indexValue = this.context.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;

    // this.currentContract = this.items[0][indexValue];
    // this.duration = this.context.iceModel.elements["policies.details.InsuranceDuration"].getValue().values[0].value;

    if (this.selectedBranch === 2 || this.selectedBranch === 11) {
      return this.getCurrentDate(this.context.iceModel.elements["policies.life.details.renewalDate"].getValue().values[0].value);
    } else {
      var startDate = this.context.iceModel.elements["policies.details.StartDate"].getValue().values[0].value;
      var duration = this.context.iceModel.elements["policies.details.InsuranceDuration"].getValue().values[0].value;
      if (startDate && duration) {
        var year = startDate.getFullYear();
        var month = startDate.getMonth() + 1;
        var day = startDate.getDate();
        if (month == 12) {
          var expirationDate = new Date(year + duration - 1, month, day);
        }
        else {
          var expirationDate = new Date(year + duration, month, day);
        }

        if (expirationDate.getMonth() < 10 && expirationDate.getDate() < 10) {
          if (expirationDate.getMonth() == 0) {
            newExpDate = '0' + expirationDate.getDate() + '/' + '12' + '/' + expirationDate.getFullYear();
          }
          else {
            newExpDate = '0' + expirationDate.getDate() + '/' + '0' + expirationDate.getMonth() + '/' + expirationDate.getFullYear();
          }

        } else if (expirationDate.getDate() < 10) {
          newExpDate = '0' + expirationDate.getDate() + '/' + expirationDate.getMonth() + '/' + expirationDate.getFullYear();
        } else if (expirationDate.getMonth() < 10) {
          if (expirationDate.getMonth() == 0) {
            newExpDate = expirationDate.getDate() + '/' + '12' + '/' + expirationDate.getFullYear();
          }
          else {
            newExpDate = expirationDate.getDate() + '/' + '0' + expirationDate.getMonth() + '/' + expirationDate.getFullYear();
          }
        } else {
          newExpDate = expirationDate.getDate() + '/' + expirationDate.getMonth() + '/' + expirationDate.getFullYear();
        }
        return newExpDate;
      }
    }



    // return expirationDate.getDate() + '/' + expirationDate.getMonth() + '/' + expirationDate.getFullYear();

  }

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

  getCurrentDate(value: any) {
    var date = new Date(value);
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }

}

import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { LocalStorageService } from '../../../services/local-storage.service';
import * as _ from 'lodash';
import { catchError, first, map, tap } from "rxjs/operators";
import {LifecycleEvent } from '@impeo/ice-core';
import { Observable, Subject, throwError} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends SectionComponentImplementation implements OnInit {
  private destroy$ = new Subject<void>();
  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService
  ) {
    super(parent);
  }

  items: any[];
  data: any[] = [];
  mySubscription: any;
  currentContract: any;
  flag: boolean = true;

  ngOnInit() {

    this.context.$lifecycle.pipe(
      //first((action) => action === 'actionWriteFromOtherForRefresh'),
      map((e:LifecycleEvent) =>
      {
      const actionName = _.get(e, ['payload', 'action']);
      if(actionName === 'actionWriteFromOtherForRefresh'&& e.type=="ACTION_FINISHED")
      return e;
      }
      ),
      catchError((err) => this.handleError(err)),
      tap((_x) => {
        //this.addItems();
        this.indexFunction();
      })
    );

    this.flag = false;
    this.addItems();
    this.indexFunction();


  }

  private handleError(err: any): Observable<never> {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
  }

  private async indexFunction(): Promise<any> {
    let indexValue = this.localStorage.getDataFromLocalStorage("index");


    if (this.items) {
      this.currentContract = this.items[indexValue];
      this.context.iceModel.elements["policy.details.booklets.exist"].setSimpleValue(null);

      if (this.currentContract.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ')
      {
        this.iceModel.elements["policy.details.booklets.Branch"].setSimpleValue('M');
        this.iceModel.elements["policy.details.booklets.contractNumber"].setSimpleValue(this.currentContract.ContractKey);
        if(this.currentContract.ContractMotorDetails!= undefined){
          this.iceModel.elements["policies.details.VehicleLicensePlate"].setSimpleValue(this.currentContract.ContractMotorDetails.VehicleLicensePlate);
          this.iceModel.elements["policies.license.plate.header-tile"].setSimpleValue(this.currentContract.ContractMotorDetails.VehicleLicensePlate);
        }
      }

      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(this.currentContract.paymentFrequencyToString);

      if(this.currentContract.ContractType!=99)
      {
      this.iceModel.elements["policies.details.LastPayment"].setSimpleValue(this.currentContract.Receipts[0].ReceiptStatusDescription);
      this.iceModel.elements["policies.details.LastPaymentEndDate"].setSimpleValue(this.compareDates(this.currentContract.Receipts[0].EndDate));
      this.iceModel.elements["policies.details.PaymentType"].setSimpleValue(this.currentContract.Receipts[0].PaymentType);
      }

      // this.iceModel.elements["policies.details.renewalDate"].setSimpleValue(this.currentContract.ExpirationDate);
      this.iceModel.elements["policies.details.ProductDescritpion"].setSimpleValue(this.currentContract.ProductDescritpion);
      this.iceModel.elements["policies.details.ContractKey"].setSimpleValue(this.currentContract.ContractKey);

      if (this.currentContract.Branch === 'ΠΕΡΙΟΥΣΙΑΣ')
      {
        this.iceModel.elements["policy.details.booklets.Branch"].setSimpleValue('P');
        this.iceModel.elements["policy.details.booklets.contractNumber"].setSimpleValue(this.currentContract.ContractKey);

        this.iceModel.elements["policies.details.EmergencyAddress"].setSimpleValue(this.currentContract.ContractPropertyCoolgenDetails.PropertyStreet + ', ' + this.currentContract.ContractPropertyCoolgenDetails.PropertyZipCode + ', ' + this.currentContract.ContractPropertyCoolgenDetails.PropertyCity);
      }

      this.iceModel.elements["policies.details.InsuredPerson"].setSimpleValue(this.currentContract.ParticipantFullName);
      this.iceModel.elements["policy.beneficiaries.length"].setSimpleValue(this.context.iceModel.elements["policy.beneficiaries"].getValue().values[0].value.length);
      if (this.currentContract.Branch === 'ΖΩΗΣ' || this.currentContract.Branch === 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ' || this.currentContract.Branch === 'ΥΓΕΙΑΣ') {
        if(this.currentContract.ContractType!=99)  //All Contracts except GROUP HEALTH
        this.iceModel.elements["policies.life.details.renewalDate"].setSimpleValue(this.currentContract.Receipts[0].EndDate);
      }
      else if (this.currentContract.Branch === 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ' || this.currentContract.Branch === 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ') {
        this.iceModel.elements['policies.P&Cdetails.Branch'].setSimpleValue(this.currentContract.Branch);

        if(this.currentContract.ContractType!=99)  //All Contracts except GROUP HEALTH
        {
        this.iceModel.elements['policies.P&Cdetails.ExpirationDate'].setSimpleValue(this.currentContract.Receipts[0].EndDate);
        this.iceModel.elements['policies.P&Cdetails.startDate'].setSimpleValue(this.currentContract.Receipts[0].StartDate);
        }

        this.iceModel.elements['policies.P&Cdetails.status'].setSimpleValue(this.currentContract.Status);
        this.iceModel.elements['policies.P&Cdetails.name'].setSimpleValue(this.currentContract.Branch);
        this.iceModel.elements['policies.P&Cdetails.number'].setSimpleValue(this.currentContract.ContractKey);
        this.iceModel.elements['policies.P&Cdetails.Duration'].setSimpleValue(this.currentContract.paymentFrequencyToString);
        this.iceModel.elements['policies.P&Cdetails.PartnersName'].setSimpleValue(this.currentContract.ContractAccidentDetails.PartnerName)
      }
      else {
        this.iceModel.elements["policies.details.renewalDate"].setSimpleValue(this.currentContract.ExpirationDate);

      }
      // this.iceModel.elements["policies.details.lifeExagora"].setSimpleValue(this.currentContract.exagora.lifeexag)
      // this.iceModel.elements["policies.details.totalExagora"].setSimpleValue(this.currentContract.exagora.totexag);
      // this.iceModel.elements["policies.details.investAmount"].setSimpleValue(this.currentContract.exagora.investamount);
      // this.iceModel.elements["policies.details.investDate"].setSimpleValue(this.currentContract.exagora.investdate);

      if (this.currentContract.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' || this.currentContract.Branch === 'ΠΕΡΙΟΥΣΙΑΣ' || this.currentContract.Branch === 'ΖΩΗΣ' || this.currentContract.Branch === 'ΥΓΕΙΑΣ' || this.currentContract.Branch === 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ' ) {
        const action = this.context.iceModel.actions['actionGetBookletsExist'];
        if (action) {
          await action.executionRules[0].execute();

        }
      }


      return this.currentContract;
    }
    else {
      return;
    }


  }



  private addItems(): any {

    if (this.recipe.dataStoreProperty == null) {
      return;
    }
    //dataStoreProperty comes from the page


    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

  }

  compareDates(date: Date) {
    if (new Date(date) < new Date()) {
      return 'bell_alert';
    } else {
      return 'info_alert';
    }
  }

  calculateDiffOfDays(ExpirationDate: any) {
    let diff = Math.abs(new Date(ExpirationDate).getTime() - new Date().getTime());
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert('Copied!')
  }

  getGridColumnClass(col: any): string {
    let css;
    if (this.recipe.componentFlag === 'policyDetails' || this.recipe.componentFlag=="amnendmentDetails" || this.recipe.coponentFlag=="amendmentHomeDetails" || this.recipe.componentFlag == "amendmentHealthDetails" || this.recipe.componentFlag == "amendmentLifeDetails" || this.recipe.componentFlag == "amendmentFinanceDetails") {
      css = col.css;
    } else {
      css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
      // if (col.css) {
      //   let dt = col.iceModel.dts["name of dt"];
      //   let dta = new DtAccessor(dt, this.iceModel);
      //   let result = dta.getOutputValue(null);
      // }
      if (col.css) {
        css = css + " " + col.css;
      }
    }


    //// Visibility Button
    if(col.element!=undefined)
    {
      if(this.context.iceModel.elements[col.element].recipe.alignmentClass!=undefined)
      {
        let alignmentClass=this.context.iceModel.elements[col.element].recipe.alignmentClass;
        let dt = this.page.iceModel.dts[alignmentClass];
        let result :any = dt.evaluateSync();
        if(result.visibilityPDFButton!=null && result.visibilityPDFButton!=undefined)
        css=css + " " + result.visibilityPDFButton;
      }
    }

    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-" + col.internalCol;
    if (col.css)
      css = css + " " + col.css;
    return css;
  }

  getElementClass(col: any): string {
    var css = col.css;
    return css;
  }

  getInternalRowClass(row: any): string {
    var css = row.css;
    return css;
  }

}

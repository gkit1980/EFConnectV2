import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { environment } from '@insis-portal/environments/environment.prod';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends SectionComponentImplementation {

  paymentCost: string;
  items: any[] = [];
  status: string;
  paymentCode: string;
  paymentAmount: string;
  paymentType: string;
  currentBranch: string;
  autoPayment: string;

  paymentComponent = 'elements.payment.paymentComponent.label';
  currentContract: any;

  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService, private router: Router) {
    super(parent);
    this.paymentType = this.localStorage.getDataFromLocalStorage('paymentType');
    this.currentBranch = this.localStorage.getDataFromLocalStorage('selectedBranchText');
  }

  ngOnInit() {

    this.addItems(); // take data from datastore and push them to items array
    this.indexFunction(); //
    this.status = this.localStorage.getDataFromLocalStorage('paymentStatus');
    this.paymentCode = this.context.iceModel.elements['policies.details.paymentCode'].getValue().values[0].value;
    this.paymentAmount = this.context.iceModel.elements['policies.details.TotalUnpaidAmount'].getValue().values[0].value;
    this.autoPayment = this.context.iceModel.elements['contract.auto.payment'].recipe.label.ResourceLabelRule.key
    this.autoPayment = this.autoPayment.substring(1);
    this.autoPayment = this.autoPayment.concat(': ' + this.context.iceModel.elements['contract.auto.payment'].getValue().values[0].value);

  }

  private indexFunction(): any {
    let indexValue = this.localStorage.getDataFromLocalStorage("index");
    this.iceModel.elements["policy.contract.general.info.indexHolder"].setSimpleValue(indexValue);
    if (this.items != undefined) {
      this.currentContract = this.items[indexValue];
      return this.currentContract;
    }
    return null;


  }


  private addItems(): any {

    if (this.recipe.dataStoreProperty == null) {
      return;
    }

    this.context.$actionEnded.subscribe((actionName: string) => {
      if (actionName.includes("actionGetPolicies")) {
        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        this.context.iceModel.elements['triggerActionGetParticipants'].setSimpleValue(1);
        this.context.iceModel.elements['triggerActionGetReceipts'].setSimpleValue(1);
        this.indexFunction();

      }
    });

    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);



  }


  copyToClipBoard(code: any) {
    const el = document.createElement('textarea');
    el.value = code;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  getGridColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
    // if (col.css) {
    //   let dt = col.iceModel.dts["name of dt"];
    //   let dta = new DtAccessor(dt, this.iceModel);
    //   let result = dta.getOutputValue(null);
    // }
    if (col.css)
      css = css + " " + col.css;
    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-" + col.internalCol;
    if (col.css)
      css = css + " " + col.css;
    return css;
  }

  getElementClass(col: any): string {
    var css = "skata";
    return css;
  }

  getInternalRowClass(row: any): string {
    var css = row.css;
    return css;
  }

  redirectToPayment() {

    this.router.navigate(['/ice/default/customerArea.motor/paymentManagement']
      , {
        queryParams: {
          paymentCode: this.context.iceModel.elements['policies.details.paymentCode'].getValue().values[0].value,
          branch: this.localStorage.getDataFromLocalStorage('selectedBranchText'),
          index:  this.context.iceModel.elements['policies.details.PolicyNumberHeader'].getValue().values[0].value    //policies.details.PolicyNumberHeader
        }
      });
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    return svg;
  }

  handleSVGPaymentCode(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }



}

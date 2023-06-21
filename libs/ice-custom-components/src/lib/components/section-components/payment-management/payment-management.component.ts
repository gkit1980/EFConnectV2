import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { IceSection } from '@impeo/ice-core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss']
})
export class PaymentManagementComponent extends SectionComponentImplementation {

  branch: string;
  productDescription: string;
  contractKey: string;
  licencePlate: string;
  paymentCode: string;
  currentPayment: string;
  isCreditCard: boolean = true;
  url: string;
  amount: string;
  items: any
  index: any;
  startDate: Date;
  endDate: Date;
  insuredPerson: string;
  dangerAddressData: string;
  vehicleLicensePlate: string;
  participantRelationship: string;
  description: any;

  mid: string;
  lang: string;
  deviceCategory: any;
  orderid: string;
  orderDesc: string;
  orderAmount: string;
  currency: string;
  payerEmail: string;
  payerPhone: string;
  extInstallmentoffset: any;
  extInstallmentperiod: any;
  confirmUrl: string;
  cancelUrl: string;
  digest: string;
  configID: number;
  sourceCategory = '';
  postFormDataToCardLink: any;

  currentPayments = 'elements.payment.paymentManagement.currentPayments.label';
  date1 = 'elements.payment.paymentManagement.date1.label';
  paymentCodes = 'elements.payment.paymentManagement.paymentCodes.label';
  typeOfCard = 'elements.payment.paymentManagement.typeOfCard.label';
  depitPrepaidCard = 'elements.payment.paymentManagement.depitPrepaidCard.label';
  creditCard = 'elements.payment.paymentManagement.creditCard.label';
  payOff = 'elements.payment.paymentManagement.payOff.label';
  onetime = 'elements.payment.paymentManagement.onetime.label';
  text1 = 'elements.payment.paymentManagement.text1.label';
  cancel = 'elements.payment.paymentManagement.cancel.label';
  continue = 'elements.payment.paymentManagement.continue.label';

  constructor(parent: IceSectionComponent, private http: HttpClient, private activateRoute: ActivatedRoute,
    private router: Router) {
    super(parent);
  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
  };



  ngOnInit() {

    this.addItems();
    let paymentAmount = this.context.iceModel.elements["policies.details.TotalUnpaidAmount"].getValue().forIndex(null);
    this.activateRoute.queryParams.subscribe((params: any) => {
      this.paymentCode = params['paymentCode'];
      this.amount = paymentAmount;
      this.branch = params['branch'].toString();
      this.contractKey = params['index'];
      this.context.iceModel.elements['contract.details.paymentCode'].setSimpleValue(this.paymentCode);
      this.context.iceModel.elements['payment.currentPayment'].setSimpleValue(this.amount);
      if(params['returnUrl'] == "deepLink"){
        this.actionGetPaymentAEGA();
        this.postFormToCardLink();
      }
    })


    this.setDataToFront();


    //action for cardlink
    this.actionGetPaymentAEGA();
  }

  onClickCheckBox(option: number) {
    console.log(option, this.isCreditCard)
    if (option === 1) {
      this.isCreditCard = true;
    } else if (option === 0) {
      this.isCreditCard = false;
    }
  }

  getHeaderComponentSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "HeaderComponent"
    );
  }

  getBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life';
      case 'ΥΓΕΙΑΣ':
        return 'health';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc';
    }
  }

  getPaymentBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life_text';
      case 'ΥΓΕΙΑΣ':
        return 'health_text';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor_text';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house_text';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings_text';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc_text';
    }
  }

  get imageSource() {
    return this.getIcon('0B8BF05BD9C54878807163B1050D5AF3');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: flex;');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  getParamsFromStringURL(url: string) {
    const urlParams = new URLSearchParams(url);
    const transactionUID = urlParams.get('u');
    this.context.iceModel.elements['payment.transactionUID'].setSimpleValue(transactionUID);
    console.log(transactionUID);
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

 //this.url=environment.payment_baseurl+'?rn='+this.paymentCode;                NEW WAY OF PAYMENT

  actionGetPaymentAEGA() {
    this.description = " Αρ. Συμβολαίου:" + this.contractKey;
    this.iceModel.elements['payment.orderDescription'].setSimpleValue(this.description);
    if (this.branch === 'ΖΩΗΣ' || this.branch === 'ΥΓΕΙΑΣ' || this.branch === 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ')
    {
      this.iceModel.elements['payment.sourceCateg'].setSimpleValue('Life');
      this.url=environment.payment_baseurl+'?rn='+this.paymentCode;               // NEW WAY OF PAYMENT




    } else if (this.branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' || this.branch === 'ΠΕΡΙΟΥΣΙΑΣ')
    {
      this.branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' ? this.iceModel.elements['payment.sourceCateg'].setSimpleValue('Motor') : this.iceModel.elements['payment.sourceCateg'].setSimpleValue('CoolgenProperty');
      this.url=environment.payment_baseurl+'?rn='+this.paymentCode;                //NEW WAY OF PAYMENT
    }

  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '67');
    svg.setAttribute('height', '67');

    return svg;
  }

  postFormToCardLink() {

    window.open(this.url, '_blank');

    this.router.navigate(['/ice/default/customerArea.motor/home']);
  }

  private addItems(): any {
    if (this.recipe.dataStoreProperty == null) {
      return;
    }
    //dataStoreProperty comes from the page
    this.context.$actionEnded.subscribe((actionName: string) => {
      if (actionName.includes("actionGetPolicies")) {
        this.context.iceModel.elements['triggerActionWriteFromOther'].setSimpleValue(1);
        //  this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        //   this.showDafsDocs();
        //  this.context.$actionEnded.observers.pop();
      }

    });

    this.context.$actionEnded.subscribe((actionName: string) => {
      if (actionName.includes("actionWriteFromOtherForRefresh")) {
        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        this.setDataToFront();

        this.context.$actionEnded.observers.pop();
      }

    });

    this.context.$actionEnded.subscribe((actionName: string) => {
      if (actionName.includes("actionGetParticipantsHomePage")) {
        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        this.setDataToFront();
        this.context.$actionEnded.observers.pop();
      }

    });





    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

  }

  formatDate(date: any) {
    return new Date(date);
  }

  setDataToFront() {
    try {

      this.index=this.items.findIndex((x:any) => x.ContractKey ===this.contractKey);

      this.contractKey = this.items[this.index].ContractKey;
      this.productDescription = this.items[this.index].ProductDescritpion.trim();
      this.startDate = this.items[this.index].Receipts[0].StartDate;
      this.endDate = this.items[this.index].Receipts[0].EndDate;


      this.insuredPerson = this.findParticipantLastName(this.index) + " " + this.findParticipantFirstName(this.index);
      if (this.items[this.index].ContractPropertyCoolgenDetails) {
        this.dangerAddressData = this.items[this.index].ContractPropertyCoolgenDetails.PropertyStreet + " " +
          this.items[this.index].ContractPropertyCoolgenDetails.PropertyZipCode + " " +
          this.items[this.index].ContractPropertyCoolgenDetails.PropertyCity;
      }
      if (this.items[this.index].ContractMotorDetails) {
        this.vehicleLicensePlate = this.items[this.index].ContractMotorDetails.VehicleLicensePlate;
      }

    } catch (error) {
      this.startDate = null;
      this.endDate = null;
    }
  }

  returnToHome() {
    this.router.navigate(['/ice/default/customerArea.motor/home'])
  }

  findParticipantFirstName(i: any): any {


    if (this.items[i].Participants.length > 0) {
      for (var j = 0; j < this.items[i].Participants.length; j++) {
        this.participantRelationship = this.items[i].Participants[j].Relationship;
        if (this.participantRelationship.startsWith('ΑΣΦ')) {
          return this.items[i].Participants[j].FirstName;
        }
      }
    }
    // else {
    //   return this.ParticipantFirstName = this.items[i].Participants[0].FirstName;
    // }



  }

  findParticipantLastName(i: any): any {




    if (this.items[i].Participants.length > 0) {
      for (var j = 0; j < this.items[i].Participants.length; j++) {
        this.participantRelationship = this.items[i].Participants[j].Relationship;
        if (this.participantRelationship.startsWith('ΑΣΦ')) {
          return this.items[i].Participants[j].LastName;
        }
      }
    }
    // else {
    //   return this.ParticipantLastName = this.items[i].Participants[0].LastName;
    // }



  }








}

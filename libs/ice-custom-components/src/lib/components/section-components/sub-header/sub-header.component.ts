import { Component } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { LifecycleEvent } from '@impeo/ice-core';
import * as _ from 'lodash';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
var ice_1 = require("@impeo/ice-core");

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent extends SectionComponentImplementation {

  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService, private router: Router) {
    super(parent);


  }
  _this = this;
  items: any[];
  data: any[] = [];
  mySubscription: any;
  currentContract: any;
  participantRelationship: string;
  participants: any[] = [];
  elementFirstName: any;
  elementLastName: any;

  private getPoliciesEndedSubs: Subscription;
  private writeFromOtherForRefreshEndedSubs: Subscription;
  private customerLastNameSubs: Subscription;
  private subscription = new Subscription();

  ngOnInit() {

    this.context.iceModel.elements['selectedcontractbranch'].setSimpleValue(this.localStorage.getDataFromLocalStorage('selectedBranch'));
    this.elementFirstName = this.iceModel.elements['policies.insured.person.header-tile~firstName'];
    this.elementLastName = this.iceModel.elements['policies.insured.person.header-tile~lastName'];

    this.writeFromOtherForRefreshEndedSubs = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {
      const actionName = _.get(e, ['payload', 'action']);

      if (actionName.includes("actionWriteFromOtherForRefresh") &&  e.type === 'ACTION_FINISHED') {
        this.addItems();
        this.findParticipants();
        this.indexFunction();
        //this.SpinnerService.stop();
      }
    });
    this.subscription.add(this.writeFromOtherForRefreshEndedSubs);

    this.findexcludedBraches(); // details navigation
    if (this.localStorage.getDataFromLocalStorage("refreshStatus") == 1) {
      this.resetValuesForRefresh(); // reset values for refresh
      this.refreshDTsIcon(); // reset values for refresh
   //   this.localStorage.setDataToLocalStorage("refreshStatus", 0);
    }
    this.addItems(); // take data from datastore and push them to items array
    this.findParticipants();

    if(this.items) {
      this.indexFunction(); //set values to necessary elements for the selected contract
    }

    this.customerLastNameSubs = this.context.iceModel.elements[
      'customer.details.LastName'
    ].$dataModelValueChange.subscribe(() => this.indexFunction());
    this.subscription.add(this.customerLastNameSubs);

  }

  private indexFunction(): any {
    let indexValue = this.localStorage.getDataFromLocalStorage("index");
    this.iceModel.elements["policy.contract.general.info.indexHolder"].setSimpleValue(indexValue);


    this.currentContract = this.items[indexValue];
    //

    //Refactor of the subheader
    if (this.currentContract.ContractMotorDetails!=undefined) {
      this.iceModel.elements["policies.details.VehicleLicensePlate"].setSimpleValue(this.currentContract.ContractMotorDetails.VehicleLicensePlate);
      this.iceModel.elements["policies.license.plate.header-tile"].setSimpleValue(this.currentContract.ContractMotorDetails.VehicleLicensePlate);
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfBirth"].setSimpleValue(this.formatDate(this.currentContract.ContractMotorDetails.DriverBirthDate));
      this.iceModel.elements["policies.CarDetails.InsuredValue"].setSimpleValue(this.getCurrencyFormat(this.currentContract.ContractMotorDetails.VehicleMarketValue));
      this.iceModel.elements["policies.details.ExpirationDate"].setSimpleValue(this.currentContract.ContractMotorDetails.ExpirationDate);
      this.localStorage.setDataToLocalStorage('durationEndDate', this.currentContract.ContractMotorDetails.ExpirationDate);
    }
    if (this.currentContract.ContractPropertyCoolgenDetails!=undefined) {
      this.iceModel.elements["policies.emergency.address.header-tile"].setSimpleValue(this.currentContract.ContractPropertyCoolgenDetails.PropertyStreet + ', ' + this.currentContract.ContractPropertyCoolgenDetails.PropertyZipCode + ', ' + this.currentContract.ContractPropertyCoolgenDetails.PropertyCity);
      this.iceModel.elements["policies.details.ExpirationDate"].setSimpleValue(this.currentContract.ContractPropertyCoolgenDetails.ExpirationDate);
      this.localStorage.setDataToLocalStorage('durationEndDate', this.currentContract.ContractPropertyCoolgenDetails.ExpirationDate);
    }
    if (this.currentContract.ContractFirePrudDetails!=undefined) {
      this.iceModel.elements["policies.emergency.address.header-tile"].setSimpleValue(this.currentContract.ContractFirePrudDetails.PropertyStreet + ', ' + this.currentContract.ContractFirePrudDetails.PropertyZipCode + ', ' + this.currentContract.ContractFirePrudDetails.PropertyCity);
    }
    const _this = this;
    if (this.currentContract.Participants && this.context.iceModel.elements['selectedcontractbranch'].getValue().forIndex(null)!=99)
    {
      for (var i = 0; i < this.currentContract.Participants.length; i++) {
        if (this.currentContract.Participants[i].Relationship.includes('ΑΣΦΑΛΙΣΜΕΝΟΣ')) {

          _this.elementFirstName.setValue(new ice_1.IndexedValue(_this.elementFirstName, this.currentContract.ContractParticipants[i].FirstName, [i], ice_1.ValueOrigin.INTERNAL));
          _this.elementLastName.setValue(new ice_1.IndexedValue(_this.elementLastName, this.currentContract.ContractParticipants[i].LastName, [i], ice_1.ValueOrigin.INTERNAL));
          // this.iceModel.elements["policies.insured.person.header-tile"].setSimpleValue(this.currentContract.ContractParticipants);
        }

      }
    }
    else
    {
      var position=0;
      this.localStorage.setDataToLocalStorage('paymentStatus',null);
      _this.elementFirstName.setValue(new ice_1.IndexedValue(_this.elementFirstName,this.context.iceModel.elements["policies.details.grouphealth.InsuredFirstName"].getValue().forIndex(null), [position], ice_1.ValueOrigin.INTERNAL));
      _this.elementLastName.setValue(new ice_1.IndexedValue(_this.elementLastName,this.context.iceModel.elements["policies.details.grouphealth.InsuredLastName"].getValue().forIndex(null), [position], ice_1.ValueOrigin.INTERNAL));
      position++;
    }
    //End Refactor of the subheader


    if(this.currentContract.ContractType!=99)    //ATOMIKA ΣΥΜΒΟΛΑΙΑ
    {
      // dc-669 start
      for (const receipt of this.currentContract.Receipts)
      {
        if (receipt.ReceiptTypeDescription.trim() === 'Δόση' || receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη')
        {
          this.iceModel.elements['policies.details.LastPayment'].setSimpleValue(receipt.ReceiptStatusDescription);
          this.localStorage.setDataToLocalStorage('paymentStatus', receipt.ReceiptStatusDescription);

          if (this.localStorage.getDataFromLocalStorage('paymentStatus') === 'Ανείσπρακτη')
          {
            this.iceModel.elements['policies.details.LastPaymentEndDate'].setSimpleValue(this.compareDates(this.unpaidReceipts(this.currentContract),this.currentContract.Branch));

           //specific rule for motor contracts


            this.iceModel.elements['policies.details.numberOfDays'].setSimpleValue(this.calculateDiffOfDays(this.unpaidReceipts(this.currentContract),this.currentContract.Branch));
          }
          else
          {
            this.iceModel.elements['policies.details.LastPaymentEndDate'].setSimpleValue(
              this.compareDates(receipt.EndDate)
            );
            this.iceModel.elements['policies.details.numberOfDays'].setSimpleValue(
              this.calculateDiffOfDays(receipt.EndDate)
            );
          }

          this.iceModel.elements['policies.details.PaymentType'].setSimpleValue(receipt.PaymentType);
          this.localStorage.setDataToLocalStorage('paymentType', receipt.PaymentType);

          break;
        }
      }
      // dc-669 start

      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(this.currentContract.paymentFrequencyToString);
      //
      this.iceModel.elements["policies.details.StartDate"].setSimpleValue(this.currentContract.StartDate);
      this.localStorage.setDataToLocalStorage('durationStartDate', this.currentContract.StartDate);
      this.iceModel.elements['policies.details.TotalUnpaidAmount'].setSimpleValue(this.currentContract.TotalUnpaidAmount);
      this.iceModel.elements['policies.details.paymentCode'].setSimpleValue(this.currentContract.Receipts[0].paymentCode);
      this.iceModel.elements['policies.details.YesterdayDate'].setSimpleValue(this.currentContract.YesterdayDate)
      this.iceModel.elements["policies.details.LastPayment"].setSimpleValue(this.currentContract.Receipts[0].ReceiptStatusDescription);
      this.localStorage.setDataToLocalStorage('paymentStatus', this.currentContract.Receipts[0].ReceiptStatusDescription);
      if (this.localStorage.getDataFromLocalStorage("paymentStatus") == "Ανείσπρακτη")
      {
        this.iceModel.elements["policies.details.LastPaymentEndDate"].setSimpleValue(this.compareDates(this.unpaidReceipts(this.currentContract),this.currentContract.Branch));
        this.iceModel.elements["policies.details.numberOfDays"].setSimpleValue(this.calculateDiffOfDays(this.unpaidReceipts(this.currentContract),this.currentContract.Branch));
      } else
      {
        this.iceModel.elements["policies.details.LastPaymentEndDate"].setSimpleValue(this.compareDates(this.currentContract.Receipts[0].EndDate));
        this.iceModel.elements["policies.details.numberOfDays"].setSimpleValue(this.calculateDiffOfDays(this.currentContract.Receipts[0].EndDate));
      }
      this.iceModel.elements["policies.details.PaymentType"].setSimpleValue(this.currentContract.Receipts[0].PaymentType);
      this.localStorage.setDataToLocalStorage('paymentType', this.currentContract.Receipts[0].PaymentType);
   }


    // this.iceModel.elements["policies.details.renewalDate"].setSimpleValue(this.currentContract.ExpirationDate);
    this.iceModel.elements["policies.details.ProductDescritpion"].setSimpleValue(this.currentContract.ProductDescritpion);
    this.iceModel.elements["policies.details.ContractKey"].setSimpleValue(this.currentContract.ContractKey);
    // this.iceModel.elements["policies.details.EmergencyAddress"].setSimpleValue(this.currentContract.ContractPropertyCoolgenDetails.PropertyStreet + ', ' + this.currentContract.ContractPropertyCoolgenDetails.PropertyZipCode + ', ' + this.currentContract.ContractPropertyCoolgenDetails.PropertyCity);
    this.iceModel.elements["policies.details.InsuredPerson"].setSimpleValue(this.currentContract.ParticipantFullName);
    this.iceModel.elements["policy.beneficiaries.length"].setSimpleValue(this.context.iceModel.elements["policy.beneficiaries"].getValue().values[0].value.length);
    this.iceModel.elements["customer.details.FullName"].setSimpleValue(this.context.iceModel.elements["customer.details.FirstName"].getValue().values[0].value + " " + this.context.iceModel.elements["customer.details.LastName"].getValue().values[0].value);

    // if (this.currentContract.Branch === 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ') {
    //   if (this.currentContract.Receipts[0].EndDate === this.currentContract.NextPaymentDate) {
    //     this.iceModel.elements["sameRenewalAndExpiration"].setSimpleValue(true);
    //     this.iceModel.elements["policies.life.details.renewalDate"].setSimpleValue(this.currentContract.Receipts[0].EndDate);
    //   }
    // }
    // else
    if (this.currentContract.Branch === 'ΖΩΗΣ' || this.currentContract.Branch === 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ' || this.currentContract.Branch === 'ΥΓΕΙΑΣ')
    {
      if(this.currentContract.ContractType!=99)   //Group Health
      {
        if (this.currentContract.Receipts[0].ReceiptStatusDescription === 'Ανείσπρακτη')
          this.iceModel.elements["policies.life.details.renewalDate"].setSimpleValue(this.unpaidReceipts(this.currentContract));
        else
          this.iceModel.elements["policies.life.details.renewalDate"].setSimpleValue(this.currentContract.Receipts[0].EndDate);

      }

      this.iceModel.elements['policies.details.PolicyNumberHeader'].setSimpleValue(this.currentContract.ContractKey);
      this.iceModel.elements['policies.details.ProductName'].setSimpleValue(this.currentContract.ProductDescritpion.trim());
    }
    else if (this.currentContract.Branch === 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ' || this.currentContract.Branch === 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ') {
      this.iceModel.elements['policies.P&Cdetails.Branch'].setSimpleValue(this.currentContract.Branch);
      this.iceModel.elements['policies.P&Cdetails.new.ExpirationDate'].setSimpleValue(this.currentContract.Receipts[0].EndDate);
      this.iceModel.elements['policies.P&Cdetails.ExpirationDate'].setSimpleValue(this.currentContract.Receipts[0].EndDate);
      this.iceModel.elements['policies.P&Cdetails.startDate'].setSimpleValue(this.currentContract.Receipts[0].StartDate);
      this.iceModel.elements['policies.P&Cdetails.status'].setSimpleValue(this.currentContract.Status);
      this.iceModel.elements['policies.P&Cdetails.name'].setSimpleValue(this.currentContract.Branch);
      this.iceModel.elements['policies.P&Cdetails.number'].setSimpleValue(this.currentContract.ContractKey);
      this.iceModel.elements['policies.P&Cdetails.Duration'].setSimpleValue(this.currentContract.paymentFrequencyToString);
      this.iceModel.elements['policies.P&Cdetails.PartnersName'].setSimpleValue(this.currentContract.ContractAccidentDetails.PartnerName);
      this.iceModel.elements['policies.details.PolicyNumberHeader'].setSimpleValue(this.currentContract.ContractKey);
      this.iceModel.elements['policies.details.ProductName'].setSimpleValue('Λοιποί Κλάδοι Γενικών Ασφαλειών');
    }
    else {
      this.iceModel.elements["policies.details.renewalDate"].setSimpleValue(this.currentContract.ExpirationDate);

    }
    // if (this.currentContract.exagora) {
    //   this.iceModel.elements["policies.details.lifeExagora"].setSimpleValue(this.currentContract.exagora.lifeexag)
    //   this.iceModel.elements["policies.details.totalExagora"].setSimpleValue(this.currentContract.exagora.totexag);
    //   this.iceModel.elements["policies.details.investAmount"].setSimpleValue(this.currentContract.exagora.investamount);
    //   this.iceModel.elements["policies.details.investDate"].setSimpleValue(this.currentContract.exagora.investdate);

    // }

    if(this.currentContract.ContractType!=99)   //Exclude Group Health Details
    {

        if (this.currentContract.Receipts[0].PaymentType == 'ΠΑΓΙΑ ΕΝΤΟΛΗ')
        {
          if (this.currentContract.Receipts[0].StandingOrderNumber != '')
            this.iceModel.elements["contract.auto.payment"].setSimpleValue(this.currentContract.Receipts[0].StandingOrderNumber);
           else
            this.iceModel.elements["contract.auto.payment"].setSimpleValue(this.currentContract.Receipts[0].CreditCardNumber);

        }
    }
    try {
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfBirth"].setSimpleValue(this.getYear(this.currentContract.ContractMotorDetails.DriverBirthDate));
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfBirthBdriver"].setSimpleValue(this.getYear(this.currentContract.ContractMotorDetails.Driver2BirthDate));
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfBirthCdriver"].setSimpleValue(this.getYear(this.currentContract.ContractMotorDetails.Driver3BirthDate));
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfDrivingLicence"].setSimpleValue(this.getYear(this.currentContract.ContractMotorDetails.DriverPermitYear));
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfDrivingLicenceBdriver"].setSimpleValue(this.getYear(this.currentContract.ContractMotorDetails.Driver2PermitYear));
      this.iceModel.elements["policies.DetailsOfInsuredCustomer.YearOfDrivingLicenceCdriver"].setSimpleValue(this.getYear(this.currentContract.ContractMotorDetails.Driver3PermitYear));

    } catch (error) {
      console.log("undefined date in driver details")
    }


    return this.currentContract;

  }




  private addItems(): any {

    if (this.recipe.dataStoreProperty == null) {
      return;
    }

    this.getPoliciesEndedSubs = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

      const actionName = _.get(e, ['payload', 'action']);

      if (actionName.includes("actionGetPolicies") && e.type === 'ACTION_FINISHED') {
        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        this.context.iceModel.elements['triggerActionGetParticipants'].setSimpleValue(1);
        this.context.iceModel.elements['triggerActionGetReceipts'].setSimpleValue(1);
        this.context.iceModel.elements['triggerActionWriteFromOther'].setSimpleValue(1);
        this.findParticipants();
        this.indexFunction();


      }
    });
    this.subscription.add(this.getPoliciesEndedSubs);
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    // this.findParticipants();



  }

  compareDates(date: Date, branch?:any)
  {

    if(branch=="ΑΥΤΟΚΙΝΗΤΩΝ")
    {
      let diff = Math.abs(new Date(date).getTime() - new Date().getTime());
      let diffDays = Math.floor(diff / (1000 * 3600 * 24));
      if(diffDays<30 && diffDays>5)
      return 'info_alert';
      else if(diffDays<=5)
      return 'bell_alert';

    }
    else
    {
        if (new Date(date) < new Date()) {
          return 'bell_alert';
        } else {
          return 'info_alert';
        }
    }
  }

  calculateDiffOfDays(ExpirationDate: any,branch?:any) {
    let diff = Math.abs(new Date(ExpirationDate).getTime() - new Date().getTime());
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));

    if(branch!="ΑΥΤΟΚΙΝΗΤΩΝ")
    {

      if (diffDays > 30) {
        return "over30Days"
      }
      if(diffDays < 30) {
        return "under30Days";
      }
    }
    else
    {

        if (diffDays < 30 && diffDays>5)
        {
          return "under30over5Days"
        }
        if (diffDays<=5)
        {
          return "under5Days"
        }
    }


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
    var css = "element-class";
    return css;
  }

  getInternalRowClass(row: any): string {
    // var css = row.css;
    // var css = row;
    // return css;
    //Get the background-color from the dt
    // if (this.context.iceModel.elements['policy.selectedBranch'].getValue().forIndex(null) === null) {
    //   this.context.iceModel.elements['policy.selectedBranch'].setSimpleValue(this.localStorage.getDataFromLocalStorage('selectedBranch'));
    // }
    this.context.iceModel.elements['selectedcontractbranch'].setSimpleValue(this.localStorage.getDataFromLocalStorage('selectedBranch'));

    var dt_Name = this.iceModel.elements[row].recipe.dtName;
    var dt = this.page.iceModel.dts[dt_Name];
    if (dt) {
      var result = dt.evaluateSync();
      return result["defaultValue"];
    }
    return null;

  }

  refreshDTsIcon() {

    this.iceModel.elements["policies.details.LastPayment"].setSimpleValue(this.localStorage.getDataFromLocalStorage('paymentStatus'));
    this.iceModel.elements["policies.details.PaymentType"].setSimpleValue(this.localStorage.getDataFromLocalStorage('paymentType'));
  }

  findexcludedBraches() {
    let elementNavigationPage: any;
    let elementNavigationBranch: any;
    elementNavigationPage = this.iceModel.elements['exclude.Navigation.Tab~page'];
    elementNavigationBranch = this.iceModel.elements['exclude.Navigation.Tab~excludebranch'];
    var position = 0;
    let elementNameForExcludedTabNavigation: any;
    for (let i = 0; i < this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages.length; i++) {
      if (this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs) {
        for (let j = 0; j < this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.length; j++) {
          if (this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].excludedBranch) {
            elementNameForExcludedTabNavigation = this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].excludedBranch;
            elementNavigationPage.setValue(new ice_1.IndexedValue(elementNavigationPage, this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].tab, [position], ice_1.ValueOrigin.INTERNAL));
            elementNavigationBranch.setValue(new ice_1.IndexedValue(elementNavigationBranch, this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].excludedBranch, [position], ice_1.ValueOrigin.INTERNAL));
            position++;
          }
        }
      }


    }
  }

  resetValuesForRefresh() {
    this.context.iceModel.elements['policy.selectedBranch'].setSimpleValue(this.localStorage.getDataFromLocalStorage('selectedBranch'));
    // this.context.iceModel.elements['policy.selectedContractIDType'].setSimpleValue(this.localStorage.getDataFromLocalStorage('selectedContractIDType'));
    this.context.iceModel.elements['policy.contract.general.info.ContractID'].setSimpleValue(this.localStorage.getDataFromLocalStorage('contractID'));
    this.context.iceModel.elements['policy.contractKey'].setSimpleValue(this.localStorage.getDataFromLocalStorage('contractKey'));
  }

  getYear(elementDate: any) {
    var date = new Date(elementDate);
    return date.getFullYear();
  }

  getCurrencyFormat(value: number) {

    let currencySign: string = '€ ';
    let amount = Intl.NumberFormat('EUR').format(value);
    let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))

    return currencySign + amountFixed;
  }

  unpaidReceipts(item: any): any {

    let arrayFilterReceiptStatus = item.Receipts.filter((x: any) => x.ReceiptStatusDescription.trim() == 'Ανείσπρακτη');

    return arrayFilterReceiptStatus.length > 1 ? arrayFilterReceiptStatus[arrayFilterReceiptStatus.length - 1].StartDate : arrayFilterReceiptStatus[0].StartDate;
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }

  private findParticipants(): any
  {
    if (this.items != undefined) {
      if (this.items.length > 0) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Participants) {
            this.participants = [];
            if (this.items[i].Participants.length > 0) {
              for (let j = 0; j < this.items[i].Participants.length; j++) {
                this.participantRelationship = this.items[i].Participants[j].Relationship;
                if (this.participantRelationship.startsWith('ΑΣΦ')) {
                  this.participants.push({ LastName: this.items[i].Participants[j].LastName, FirstName: this.items[i].Participants[j].FirstName })
                  this.items[i].ContractParticipants = this.participants;
                }
              }
            }
          }

        }
      }
    }

  }

  ngOnDestroy()
  {
    this.localStorage.setDataToLocalStorage("refreshStatus", 0);
    this.subscription.unsubscribe();
  }


}

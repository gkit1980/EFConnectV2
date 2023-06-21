import { environment } from '@insis-portal/environments/environment';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { LifecycleType } from '@impeo/ice-core';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { catchError, filter, first, map, tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';

@Component({
  selector: 'app-sales-channel-details',
  templateUrl: './sales-channel-details.component.html',
  styleUrls: ['./sales-channel-details.component.scss']
})

export class SalesChannelDetailsComponent extends SectionComponentImplementation implements OnInit, OnDestroy {
  items: any[] = [];
  broker: boolean = false;
  bank: boolean = false;
  eurolife: boolean = false;
  hideSection: boolean = false;
  participantRelationship: string;
  refreshStatus: any;
  contentLoaded: boolean = false;
  salesChannel: string;

  private lifecycleSubs: Subscription;
  private getPoliciesEndedSubs: Subscription;
  private subscription = new Subscription();

  title = 'sections.communication.service.sales.title.label';
  additionalContactDetailsText = 'sections.communication.service.sales.additionalContactDetailsText.label';
  numberContract = 'sections.communication.service.sales.numberContract.label';
  communicationPlateNumber = 'sections.communication.service.sales.communicationPlateNumber.label';
  riskAddress = 'sections.communication.service.sales.riskAddress.label';
  insured = 'sections.communication.service.sales.insured.label';
  insuranceInter = 'sections.communication.service.sales.insuranceInter.label';
  telephone = 'sections.communication.service.sales.telephone.label';
  mobileTelephone = 'sections.communication.service.sales.mobileTelephone.label';
  mail = 'sections.communication.service.sales.mail.label';
  riskAddress2 = 'sections.communication.service.sales.riskAddress2.label';
  insuredPerson2 = 'sections.communication.service.sales.insuredPerson2.label';
  communicationPlateNumber2 = 'sections.communication.service.sales.communicationPlateNumber2.label';
  branchStore = 'sections.communication.service.sales.branchStore.label';
  eurobank = 'sections.communication.service.sales.eurobank.label';
  supportPoints = 'sections.communication.service.sales.supportPoints.label';
  hours1 = 'sections.communication.service.sales.hours1.label';
  hours2 = 'sections.communication.service.sales.hours2.label';
  hours3 = 'sections.communication.service.sales.hours3.label';
  numberContract2 = 'sections.communication.service.sales.numberContract2.label';


  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService
    ) {
    super(parent);
  }

  ngOnInit() {
    super.ngOnInit();

    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");

    this.addItems();

    const clientContracts: any[] = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    const hasAgentInfo = !!clientContracts && !!clientContracts.length && clientContracts[0].hasOwnProperty('AgentInfo');

    if (!hasAgentInfo) {
      const lifecycle$ = this.context.$lifecycle.pipe(
        filter((evt) => evt.payload.hasOwnProperty(this.recipe.dataStoreProperty)),
        map((res) => res.payload[this.recipe.dataStoreProperty]),
        first((items: any[]) => !!items && !!items.length && items[0].hasOwnProperty('AgentInfo')),
        catchError((err) => this.handleError(err)),
        tap((_) => this.addItems())
      );

      this.lifecycleSubs = lifecycle$.subscribe(
        (_) => {},
        (err) => console.error(err)
      );
      this.subscription.add(this.lifecycleSubs);
    }

    const getPoliciesEnded$ = this.context.$actionEnded.pipe(
      first((action) => action === 'actionGetPolicies'),
      catchError((err) => this.handleError(err)),
      tap((_) => this.execActionsForRefresh())
    );

    this.getPoliciesEndedSubs = getPoliciesEnded$.subscribe(
      (_) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.getPoliciesEndedSubs);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ngAfterViewChecked(){
  //   //your code to update the model
  //   this.cdr.detectChanges();
  // }

  private async execActionsForRefresh() {
    this.localStorage.setDataToLocalStorage('refreshStatus', 0);
    const actName1 = 'actionWriteFromOtherForRefresh';
    const actName2 = 'actionGetAgentInfoForRefresh';
    const action1 = this.context.iceModel.actions[actName1];
    const action2 = this.context.iceModel.actions[actName2];
    if (!!action1 && !!action2) {
      try {
        await this.context.iceModel.executeAction(actName1);
        await this.context.iceModel.executeAction(actName2);
      } catch(err) {
        console.error('execActionsForRefresh', err);
      }
    }
  }

  private handleError(err: any) {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }

  private addItems() {
    if (!this.recipe.dataStoreProperty) {
      return;
    }

    const hasDafs = !!this.localStorage.getDataFromLocalStorage('showDaf');

    if (hasDafs) {
      this.contentLoaded = true;
    }

    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

    if (!!this.items && !!this.items.length && this.items[0].hasOwnProperty('AgentInfo')) {

      this.checkSalesChannelPerContract();

      this.items = [...this.items];
      this.contentLoaded = true;
    }
  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
  };

  getBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life-text';
      case 'ΥΓΕΙΑΣ':
        return 'health-text';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor-text';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house-text';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings-text';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc-text';
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc-text';
    }
  }

  getSalesBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life-bg-color';
      case 'ΥΓΕΙΑΣ':
        return 'health-bg-color';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor-bg-color';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house-bg-color';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings-bg-color';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc-bg-color';
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc-bg-color';
    }
  }

  getSalesChannelClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life-text';
      case 'ΥΓΕΙΑΣ':
        return 'health-text';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor-text';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house-text';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings-text';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc-text';
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc-text';
    }
  }

  findParticipantFirstName(item: any): any {


    if (item.Participants.length > 0) {
      for (var j = 0; j < item.Participants.length; j++) {
        this.participantRelationship = item.Participants[j].Relationship;
        if (this.participantRelationship.startsWith('ΑΣΦ')) {
          return item.Participants[j].FirstName;
        }
      }
    }

  }

  findParticipantLastName(item: any): any {

    if (item.Participants.length > 0) {
      for (var j = 0; j < item.Participants.length; j++) {
        this.participantRelationship = item.Participants[j].Relationship;
        if (this.participantRelationship.startsWith('ΑΣΦ')) {
          return item.Participants[j].LastName;
        }
      }
    }

  }

  getLicensePlate(index: number): any {
    return this.items[index].ContractMotorDetails.VehicleLicensePlate;
  }

  getBrokersName(index: number): any {
    if (this.items[index].Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ') {
      return this.items[index].ContractMotorDetails.PartnerName;
    }
    else if (this.items[index].Branch == 'ΖΩΗΣ' || this.items[index].Branch == 'ΥΓΕΙΑΣ' || this.items[index].Branch == 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ') {
      if (this.items[index].ContractType === 6) {
        return this.items[index].DeathContractDetails.PartnerName;
      }
      else if (this.items[index].ContractType === 7) {
        return this.items[index].ContractConsumerDetails.PartnerName;
      }
      else if (this.items[index].ContractType === 3) {
        return this.items[index].ContractMortgageDetails.PartnerName;
      }
      else if (this.items[index].ContractType === 4) {
        return this.items[index].HealthContractDetails.PartnerName;
      }
      else if (this.items[index].ContractType === 2) {
        return this.items[index].PensionContractDetails.PartnerName;
      }
      else {
        return this.items[index].ContractIndividualDetails.PartnerName;
      }
    }
    else {
      if (this.items[index].ContractType === 9) {
        return this.items[index].ContractAccidentDetails.PartnerName;
      }
      else {
        return this.items[index].ContractPropertyCoolgenDetails.PartnerName;
      }

    }

  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  // getBranchKey(index: number): any {
  //     return this.items[index].ContractPropertyCoolgenDetails.PartnerName;
  // }

  findSalesChannel(index: number): any {
    //conditional check
    if (this.items[index].hasOwnProperty("AgentInfo") == false) return '';    //add
    if (this.items[index].AgentInfo.hasOwnProperty("ChannelDescription") == false) return '';    //add


    if (this.items[index].AgentInfo.ChannelDescription === SalesChannel.BrokerAgent || this.items[index].AgentInfo.ChannelDescription === SalesChannel.CaptiveBroker || this.items[index].AgentInfo.ChannelDescription === SalesChannel.CDU || this.items[index].AgentInfo.ChannelDescription === SalesChannel.DSF) {
      return 'broker';
    }
    else if (this.items[index].AgentInfo.ChannelDescription === SalesChannel.HHLMortgage || this.items[index].AgentInfo.ChannelDescription === SalesChannel.HHLConsumer || this.items[index].AgentInfo.ChannelDescription === SalesChannel.Network || this.items[index].AgentInfo.ChannelDescription === SalesChannel.Open24Branches || this.items[index].AgentInfo.ChannelDescription === SalesChannel.Open24Europhone || this.items[index].AgentInfo.ChannelDescription === SalesChannel.Open24Telemarketing || this.items[index].AgentInfo.ChannelDescription === SalesChannel.SBB || this.items[index].AgentInfo.ChannelDescription === SalesChannel.TOKA) {
      return 'bank';
    }
    else {
      return 'eurolife';
    }
  }

  checkSalesChannelPerContract(): void {
    if (!!this.items) {
      let j = 0;
      for (var i = 0; i < this.items.length; i++) {
        if (j == 0) {
          if (!this.items[i].hasOwnProperty('AgentInfo')) {
            this.salesChannel = '';
          }

          if (!this.items[i].AgentInfo.hasOwnProperty('ChannelDescription')) {
            this.salesChannel = '';
          }

          if (
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.BrokerAgent ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.CaptiveBroker ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.CDU ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.DSF
          ) {
            j++;
          } else if (
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.HHLMortgage ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.HHLConsumer ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.Network ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.Open24Branches ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.Open24Europhone ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.Open24Telemarketing ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.SBB ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.TOKA
          ) {
            j++;
          } else {
          }
        }
      }
      if (j == 0) {
        this.iceModel.elements['showSalesChannelSection'].setSimpleValue(false);
        this.salesChannel = 'eurolife';
      } else {
        this.iceModel.elements['showSalesChannelSection'].setSimpleValue(true);
        this.salesChannel = 'others';
      }
    }
  }

  getBrokersDetails(index: number): any {
    let phoneNumber1 = '';
    let phoneNumber2 = '';
    let mobile = '';
    let email = '';

    if (this.items[index].AgentInfo.Telephone1 != undefined) {
      phoneNumber1 = this.items[index].AgentInfo.Telephone1;
    }
    if (this.items[index].AgentInfo.Telephone2 != undefined) {
      phoneNumber2 = this.items[index].AgentInfo.Telephone2;
    }
    if (this.items[index].AgentInfo.Mobile != undefined) {
      mobile = this.items[index].AgentInfo.Mobile;
    }
    if (this.items[index].AgentInfo.Email != undefined) {
      email = this.items[index].AgentInfo.Email;
    }

    // return phoneNumber1.trim() + ", " + phoneNumber2.trim() + ", " + mobile.trim() + ", " + email.trim();
    return { phoneNumber1: phoneNumber1.trim(), phoneNumber2: phoneNumber2.trim(), mobile: mobile.trim(), email: email.trim() };
  }

  getAddress(index: number): any {
    return this.items[index].ContractPropertyCoolgenDetails.PropertyStreet + ", " + this.items[index].ContractPropertyCoolgenDetails.PropertyZipCode + ", " + this.items[index].ContractPropertyCoolgenDetails.PropertyCity;
  }

  handleSVGSecondRow(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '40');
    svg.setAttribute('height', '40');

    return svg;
  }



  icon():string
  {

      let icon = environment.sitecore_media + "C8705EB508D542E59548EF002F938768" + ".ashx";
      return icon;

  }

  handleSVGIndexIcon(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }

}



export enum SalesChannel {
  BrokerAgent = 'Broker/Agent',
  CDU = 'CDU',
  DSF = 'DSF',
  EurolifeTeam = 'Eurolife Team',
  HQEurolife = 'H/Q Eurolife',
  HHLMortgage = 'HHL Mortgage',
  HHLConsumer = 'HHL Consumer',
  Network = 'Network',
  Open24Branches = 'Open24 Branches',
  Open24Europhone = 'Open24 Europhone',
  Open24Telemarketing = 'Open24 Telemarketing',
  SBB = 'SBB',
  CaptiveBroker = 'Captive Broker',
  InwardsCoolgen = 'Inwards/Coolgen',
  VIPUnit = 'VIP Unit',
  InwardsLife = 'Inwards/Life',
  PolicyFeeLife = 'Policy Fee/ife',
  TOKA = 'TO.KA.',
  ΣτερείταιΧαρακτηρισμόΚαναλιού = 'Στερείται Χαρακτηρισμό Καναλιού'
}

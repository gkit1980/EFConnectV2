import { environment } from '../../../../environments/environment';
import { Component } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { LifecycleType,LifecycleEvent } from '@impeo/ice-core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-home-agent-info',
  templateUrl: './home-agent-info.component.html',
  styleUrls: ['./home-agent-info.component.scss'],
})
export class HomeAgentInfoComponent extends SectionComponentImplementation {
  participantRelationship: string;
  myContracts: any[] = [];
  counter: number = 0;
  showMyAgents: boolean = false;
  private refreshStatus: number;
  private myDataStoreObject: any[] = [];
  items: any[] = [];
  myAgents: any[] = [];
  private itemsSub: Subscription;
  private refreshSub: Subscription;

  title = 'sections.homeAgentInfo.title.label';
  phones = 'sections.homeAgentInfo.phones.label';
  subject = 'sections.homeAgentInfo.subject.label';

  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService) {
    super(parent);
  }

  ngOnInit() {
    super.ngOnInit();

    this.myDataStoreObject = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

    if (
      this.myDataStoreObject != undefined &&
      (this.myDataStoreObject.length == 0 || !this.myDataStoreObject[0].hasOwnProperty('AgentInfo') ||  this.myDataStoreObject[0].AgentInfo.Email == undefined)
    )
    {
      this.execRules();
    }

    this.addItems();
    this.itemsSub = this.context.$lifecycle.subscribe(
      (event) => {
        if (event.type == LifecycleType.ICE_MODEL_READY) {
          if (!this.showMyAgents) {

            this.myDataStoreObject = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
            if (this.myDataStoreObject != undefined && !this.myDataStoreObject[0].hasOwnProperty('AgentInfo'))
            {
              this.execRules();
            }

            this.addItems();
          }
        }
      },
      (error) => console.log(error)
    );

    this.refreshStatus = this.localStorage.getDataFromLocalStorage('refreshStatus');
    if (this.refreshStatus == 1) {
      this.refreshSub = this.context.$lifecycle.subscribe(
        (e: LifecycleEvent) => {

          const actionName = _.get(e, ['payload', 'action']);


          if (actionName.includes('actionGetPolicies') && e.type==='ACTION_FINISHED') {
            this.execRules();
          }
        },
        (error) => console.log(error)
      );
    }
  }

  ngOnDestroy() {
    if (this.itemsSub != undefined) {
      this.itemsSub.unsubscribe();
    }
    if (this.refreshSub != undefined) {
      this.refreshSub.unsubscribe();
    }
  }

  private async execRules() {
    let action = this.context.iceModel.actions['actionGetAgentInfo'];
    if (action != undefined) {

      try {
        await  action.executionRules[0].execute();
      await action.executionRules[1].execute();
      } catch (error) {
        console.log(error);
      }
    }
  }

  private addItems(): any {
    if (_.get(this.context.dataStore, this.recipe.dataStoreProperty) == undefined) {
      return;
    }

    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

    if (
      this.items.length > 0 &&
      this.items[0].hasOwnProperty('AgentInfo') &&
      this.items[0].AgentInfo.Email != undefined
    ) {
      this.showMyAgents = true;
    }
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  handleSVGAgent(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '70');
    svg.setAttribute('height', '70');

    return svg;
  }

  getAgentName(index: number): any {
    if (this.showMyAgents) {
      if (this.items[index].Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ') {
        return this.items[index].ContractMotorDetails.PartnerName;
      } else if (
        this.items[index].Branch == 'ΖΩΗΣ' ||
        this.items[index].Branch == 'ΥΓΕΙΑΣ' ||
        this.items[index].Branch == 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ'
      ) {
        if (this.items[index].ContractType === 6) {
          return this.items[index].DeathContractDetails.PartnerName;
        } else if (this.items[index].ContractType === 7) {
          return this.items[index].ContractConsumerDetails.PartnerName;
        } else if (this.items[index].ContractType === 3) {
          return this.items[index].ContractMortgageDetails.PartnerName;
        } else if (this.items[index].ContractType === 4) {
          return this.items[index].HealthContractDetails.PartnerName;
        } else if (this.items[index].ContractType === 2) {
          return this.items[index].PensionContractDetails.PartnerName;
        } else {
          return this.items[index].ContractIndividualDetails.PartnerName;
        }
      } else {
        if (this.items[index].ContractType === 9) {
          return this.items[index].ContractAccidentDetails.PartnerName;
        } else {
          return this.items[index].ContractPropertyCoolgenDetails.PartnerName;
        }
      }
    } else {
      return '';
    }
  }

  getAgentDetails(index: number): any {
    let phoneNumber1 = '';
    let phoneNumber2 = '';
    let mobile = '';
    let email = '';

    if (this.showMyAgents) {
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

      return {
        phoneNumber1: phoneNumber1.trim(),
        phoneNumber2: phoneNumber2.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
      };
    } else {
      return '';
    }
  }

  filterContractStatus(
    firststatus: any,
    secondStatus: any,
    thirdStatus: any,
    fourthStatus: any,
    fifthStatus: any,
    sixthStatus: any
  ) {
    if (this.items == null) {
      return;
    } else {
      return this.items.filter(
        (x: any) =>
          x.Status.trim() == firststatus ||
          x.Status.trim() == secondStatus ||
          x.Status.trim() == thirdStatus ||
          x.Status.trim() == fourthStatus ||
          x.Status.trim() == fifthStatus ||
          x.Status.trim() == sixthStatus
      );
    }
  }

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

  getAgentBranchClass(branch: any): string {
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

  findSalesChannel(index: number): any {
    if (this.items[index].hasOwnProperty('AgentInfo') == false) return '';
    if (this.items[index].AgentInfo.hasOwnProperty('ChannelDescription') == false) return '';

    if (
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.BrokerAgent ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.CaptiveBroker ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.CDU ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.DSF
    ) {
      return 'broker';
    } else if (
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.HHLMortgage ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.HHLConsumer ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.Network ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.Open24Branches ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.Open24Europhone ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.Open24Telemarketing ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.SBB ||
      this.items[index].AgentInfo.ChannelDescription === SalesChannel.TOKA
    ) {
      return 'bank';
    } else {
      return 'eurolife';
    }
  }

  checkSalesChannelPerContract(
    firstStatus: any,
    secondStatus: any,
    thirdStatus: any,
    fourthStatus: any,
    fifthStatus: any,
    sixthStatus: any,
    seventhStatus: any
  ): any {
    if (this.items) {
      this.myContracts = this.items.filter(
        (x: any) =>
          x.Status.trim() == firstStatus ||
          x.Status.trim() == secondStatus ||
          x.Status.trim() == thirdStatus ||
          x.Status.trim() == fourthStatus ||
          x.Status.trim() == fifthStatus ||
          x.Status.trim() == sixthStatus ||
          x.Status.trim() == seventhStatus
      );

      let j = 0;
      for (var i = 0; i < this.myContracts.length; i++) {
        if (j == 0) {
          if (this.myContracts[i].hasOwnProperty('AgentInfo') == false) return ''; //add

          if (this.myContracts[i].AgentInfo.hasOwnProperty('ChannelDescription') == false) return ''; //add

          if (
            this.myContracts[i].AgentInfo.ChannelDescription === SalesChannel.BrokerAgent ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.CaptiveBroker ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.CDU ||
            this.items[i].AgentInfo.ChannelDescription === SalesChannel.DSF
          ) {
            j++;
          } else if (
            this.myContracts[i].AgentInfo.ChannelDescription === SalesChannel.HHLMortgage ||
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
        return 'eurolife';
      } else {
        this.iceModel.elements['showSalesChannelSection'].setSimpleValue(true);
        return 'others';
      }
    }
  }

  getAddress(index: number): any {
    return (
      this.items[index].ContractPropertyCoolgenDetails.PropertyStreet +
      ', ' +
      this.items[index].ContractPropertyCoolgenDetails.PropertyZipCode +
      ', ' +
      this.items[index].ContractPropertyCoolgenDetails.PropertyCity
    );
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
  ΣτερείταιΧαρακτηρισμόΚαναλιού = 'Στερείται Χαρακτηρισμό Καναλιού',
}

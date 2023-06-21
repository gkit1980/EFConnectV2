import { environment } from '@insis-portal/environments/environment';
import { Component } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { FormBuilder } from '@angular/forms';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';


@Component({
  selector: 'app-subheader-stepper',
  templateUrl: './subheader-stepper.component.html',
  styleUrls: ['./subheader-stepper.component.scss']
})
export class SubheaderStepperComponent extends SectionComponentImplementation {

  constructor(parent: IceSectionComponent, private _formBuilder: FormBuilder, private localStorage: LocalStorageService) {
    super(parent);
  }


  items: any[];
  data: any[] = [];
  currentClaim: any;
  currentContract: any;
  friendlySettlementIndicator: boolean;
  showAmount: boolean;

  incidentDetails1 = 'elements.claims.subheaderStepper.incidentDetails1.label';
  incidentDetails2 = 'elements.claims.subheaderStepper.incidentDetails2.label';
  incidentDetails3 = 'elements.claims.subheaderStepper.incidentDetails3.label';
  carDetails = 'elements.claims.subheaderStepper.carDetails.label';
  compliantSettlement = 'elements.claims.subheaderStepper.compliantSettlement.label';


  isLinear = true;
  contractSelectedIndex: number;
  //this is the default date year that comes if the accident closing date is not present
  defaultDateYear = 70;

  stepperState: any = {
    step: 0,    //steps 0-1-2 states active-inactive-done
    stepsState: [
      { state: 'inactive', title: '', content: '' },
      { state: 'inactive', title: '', content: '' },
      { state: 'inactive', title: '', content: '' }
    ]
  };


  ngOnInit() {
    super.ngOnInit();
    this.localStorage.setDataToLocalStorage("refreshStatus", 0);
    this.resetValuesForRefresh()
    this.addItems();
    this.getContractData();
    this.claimsFilter();
    this.getCurrentClaimData();

    this.friendlySettlementIndicator = false;     //Initially
  }

  checkIfCompensationExists(): any {
    let elementValue = this.iceModel.elements["claims.CompensationAmount"].getValue().values[0].value;
    if (elementValue != null) { return true; }
    else return false;
  }

  checkLifeClosingDate(): any {
    let elementValue = this.iceModel.elements["claims.AccidentClosingDate"].getValue().values[0].value;
    if (elementValue.getYear() != this.defaultDateYear) { return true; }
    else return false;
  }

  checkPropertyClosingDate(): any {
    let elementValue = this.iceModel.elements["claims.ClosingClaimDateCA"].getValue().values[0].value;
    if (elementValue.getYear() != this.defaultDateYear) { return true; }
    else return false;
  }

  //Data from contract
  private getContractData(): any {

    this.iceModel.elements["policies.details.ProductDescritpion"].setSimpleValue(this.items[this.contractSelectedIndex].ProductDescritpion);
    this.iceModel.elements["policies.details.ContractKey"].setSimpleValue(this.items[this.contractSelectedIndex].ContractKey);
    this.iceModel.elements["policies.details.InsuredPerson"].setSimpleValue(this.items[this.contractSelectedIndex].ParticipantFullName);


    //this.items[index].ContractPropertyCoolgenDetails.PropertyStreet + ", " + this.items[index].ContractPropertyCoolgenDetails.PropertyZipCode + ", " + this.items[index].ContractPropertyCoolgenDetails.PropertyCity

  }

  //Data from current claim
  private getCurrentClaimData(): any {

    let indexValue = this.localStorage.getDataFromLocalStorage('claimIndexHolder');
    this.currentClaim = this.items[this.contractSelectedIndex].Claims[indexValue];

    ///ΑΥΤΟΚΙΝΗΤΩΝ
    if (this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ') {

      this.iceModel.elements["claims.motor.folderID"].setSimpleValue(this.currentClaim.ClaimKey + '/' + this.currentClaim.ClaimYear);

      if (this.currentClaim.ClaimEventDate != null &&
        this.currentClaim.ClaimEventDate != "1900-01-01T00:00:00Z")
        {
        this.stepperState.step = 0;
        this.stepperState.stepsState[0].title = "Ημερομηνία Συμβάντος";
        this.stepperState.stepsState[0].state = "done";
        this.stepperState.stepsState[0].content = this.currentClaim.ClaimEventDate;
        //this.getLabelName("claims.claimDate");
         }
         else
         {
        this.stepperState.step = 0;
        this.stepperState.stepsState[0].title = "Ημερομηνία Συμβάντος";
        this.stepperState.stepsState[0].state = "inactive";
        this.stepperState.stepsState[0].content = null;
         }

      if (this.currentClaim.ClaimAnnouncementDate != null &&
        this.currentClaim.ClaimAnnouncementDate != "1900-01-01T00:00:00Z")
        {
        this.stepperState.step = 1;
        this.stepperState.stepsState[1].state = "done";
        this.stepperState.stepsState[1].title = "Ημερομηνία Καταχώρησης";
        this.stepperState.stepsState[1].content = this.currentClaim.ClaimAnnouncementDate;
        //this.getLabelName("claims.motor.ClaimAnnouncementDate ");
         }
         else
         {
        this.stepperState.step = 0;
        this.stepperState.stepsState[1].title = "Ημερομηνία Καταχώρησης";
        this.stepperState.stepsState[1].state = "inactive";
        this.stepperState.stepsState[1].content = null;
         }

      if (this.currentClaim.ClosingClaimDate != "1900-01-01T00:00:00Z" &&
        this.currentClaim.ClosingClaimDate != "1900-01-01T00:00:00Z")
        {
        this.stepperState.step = 2;
        this.stepperState.stepsState[2].state = "done";
        this.stepperState.stepsState[2].title = "Ολοκλήρωση";
        this.stepperState.stepsState[2].content = this.currentClaim.ClosingClaimDate;
        //this.getLabelName("claims.motor.ClaimAssignmentDate");
        }
        else
        {
        this.stepperState.step = 2;
        this.stepperState.stepsState[2].state = "inactive";
        this.stepperState.stepsState[2].title = "Ολοκλήρωση";
        this.stepperState.stepsState[2].content = null;
        }

      // End New Code
      this.iceModel.elements["claims.motor.Model"].setSimpleValue(this.items[this.contractSelectedIndex].ContractMotorDetails.VehicleMake);
      this.iceModel.elements["claims.motor.Brand"].setSimpleValue(this.items[this.contractSelectedIndex].ContractMotorDetails.VehicleModel);
  //    this.friendlySettlementIndicator = this.iceModel.elements["claims.motor.FriendlySettlementIndicator"].getValue().forIndex(null);



      if (this.iceModel.elements["claims.Amount"].getValue().forIndex(null) > 0) {
        this.showAmount = true;
      }


    }

    ///ΠΕΡΙΟΥΣΙΑΣ
    if (this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ') {

      this.iceModel.elements["claims.property.folderID"].setSimpleValue(this.currentClaim.ClaimKey + '/' + this.currentClaim.ClaimYear);

      if (this.currentClaim.ClaimEventDate != null &&
        this.currentClaim.ClaimEventDate != "1900-01-01T00:00:00Z")
      {
        this.stepperState.step = 0;
        this.stepperState.stepsState[0].title = "Ημερομηνία Συμβάντος";
        this.stepperState.stepsState[0].state = "done";
        this.stepperState.stepsState[0].content = this.currentClaim.ClaimEventDate;
        //this.getLabelName("claims.claimDate");
      }
      else
      {
        this.stepperState.step = 0;
        this.stepperState.stepsState[0].title = "Ημερομηνία Συμβάντος";
        this.stepperState.stepsState[0].state = "inactive";
        this.stepperState.stepsState[0].content = null;
      }

      if (this.currentClaim.ClaimAnnouncementDate != null &&
        this.currentClaim.ClaimAnnouncementDate != "1900-01-01T00:00:00Z")
        {
        this.stepperState.step = 1;
        this.stepperState.stepsState[1].state = "done";
        this.stepperState.stepsState[1].title = "Ημερομηνία Καταχώρησης";
        this.stepperState.stepsState[1].content = this.currentClaim.ClaimAnnouncementDate;
        //this.getLabelName("claims.motor.ClaimAnnouncementDate ");
        }
        else
        {
        this.stepperState.step = 1;
        this.stepperState.stepsState[1].state = "inactive";
        this.stepperState.stepsState[1].title = "Ανοιγμα φακέλου";
        this.stepperState.stepsState[1].content = null;
        }


       if (this.currentClaim.ClosingClaimDate != "1900-01-01T00:00:00Z" &&
         this.currentClaim.ClosingClaimDate != "1900-01-01T00:00:00Z")
        {
        this.stepperState.step = 2;
        this.stepperState.stepsState[2].state = "done";
        this.stepperState.stepsState[2].title = "Ολοκλήρωση";
        this.stepperState.stepsState[2].content = this.currentClaim.ClosingClaimDate;
        //this.getLabelName("claims.motor.ClaimAssignmentDate");
        }
        else
        {
         this.stepperState.step = 2;
         this.stepperState.stepsState[2].state = "inactive";
         this.stepperState.stepsState[2].title = "Ολοκλήρωση";
         this.stepperState.stepsState[2].content = null;
        }

      if (this.iceModel.elements["claims.Amount"].getValue().forIndex(null) > 0) {
        this.showAmount = true;
        }

      this.iceModel.elements["claims.property.folderID"].setSimpleValue(this.currentClaim.ClaimKey + '/' + this.currentClaim.ClaimYear);
      this.iceModel.elements["claims.property.Address"].setSimpleValue(this.items[this.contractSelectedIndex].ContractPropertyCoolgenDetails.PropertyStreet + ", " + this.items[this.contractSelectedIndex].ContractPropertyCoolgenDetails.PropertyZipCode + ", " + this.items[this.contractSelectedIndex].ContractPropertyCoolgenDetails.PropertyCity);
      this.iceModel.elements["claims.property.AddressForHeader"].setSimpleValue(this.items[this.contractSelectedIndex].ContractPropertyCoolgenDetails.PropertyStreet + ", " + this.items[this.contractSelectedIndex].ContractPropertyCoolgenDetails.PropertyZipCode + ", " + this.items[this.contractSelectedIndex].ContractPropertyCoolgenDetails.PropertyCity);

    }

    // ΖΩΗΣ/ΥΓΕΙΑΣ
    if (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ') {
      this.iceModel.elements["life.claims.contractId"].setSimpleValue(this.currentClaim.ContractID);
      this.iceModel.elements["policy.contract.general.info.indexHolder"].setSimpleValue(this.contractSelectedIndex);
      this.iceModel.elements["claims.life.folderID"].setSimpleValue(this.currentClaim.ClaimKey);
      this.iceModel.elements["claims.life.InsuredPerson"].setSimpleValue(this.currentClaim.FullName);
      this.iceModel.elements["claims.life.InsuredPersonForHeader"].setSimpleValue(this.currentClaim.FullName);

      //New Code
      if (this.currentClaim.ClaimEventDate != null &&
        this.currentClaim.ClaimEventDate != "1900-01-01T00:00:00Z")
        {
        this.stepperState.step = 0;
        this.stepperState.stepsState[0].title = "Ημερομηνία Συμβάντος";
        this.stepperState.stepsState[0].state = "done";
        this.stepperState.stepsState[0].content = this.currentClaim.ClaimEventDate;
        //this.getLabelName("claims.claimDate");
        }
        else
        {
        this.stepperState.step = 0;
        this.stepperState.stepsState[0].title = "Ημερομηνία Συμβάντος";
        this.stepperState.stepsState[0].state = "inactive";
        this.stepperState.stepsState[0].content = null;
        }

      if (this.currentClaim.ClaimAnnouncementDate != null &&
        this.currentClaim.ClaimAnnouncementDate != "1900-01-01T00:00:00Z")
      {
        this.stepperState.step = 1;
        this.stepperState.stepsState[1].state = "done";
        this.stepperState.stepsState[1].title = "Ανοιγμα φακέλου";
        this.stepperState.stepsState[1].content = this.currentClaim.ClaimAnnouncementDate;
        //this.getLabelName("claims.motor.ClaimAnnouncementDate ");
      }
      else
      {
        this.stepperState.step = 1;
        this.stepperState.stepsState[1].state = "inactive";
        this.stepperState.stepsState[1].title = "Ανοιγμα φακέλου";
        this.stepperState.stepsState[1].content = null;
      }

      if (this.iceModel.elements["claims.AccidentClosingDate"].getValue().forIndex(null) != "1900-01-01T00:00:00Z" &&
        this.currentClaim.ClaimsStatusDescription.includes('Κλειστή')) {

        this.stepperState.step = 2;
        this.stepperState.stepsState[2].state = "done";
        this.stepperState.stepsState[2].title = "Ολοκλήρωση";
        this.stepperState.stepsState[2].content = this.iceModel.elements["claims.AccidentClosingDate"].getValue().forIndex(null);

      }
      else
      {
        this.stepperState.step = 2;
        this.stepperState.stepsState[2].state = "inactive";
        this.stepperState.stepsState[2].title = "Ολοκλήρωση";
        this.stepperState.stepsState[2].content =null;
      }

      if (this.iceModel.elements["claims.life.CompensationAmount"].getValue().forIndex(null) > 0)
        this.showAmount = true;

    }
    else {
      this.iceModel.elements["claims.folderID"].setSimpleValue(this.currentClaim.ClaimKey + '/' + this.currentClaim.ClaimYear);
    }


    this.iceModel.elements["claims.claimDate"].setSimpleValue(this.currentClaim.ClaimEventDate);
    this.iceModel.elements["claims.DateOpenFolder"].setSimpleValue(this.currentClaim.ClaimAnnouncementDate);
    return this.currentClaim;

  }



  private addItems(): any {

    if (this.recipe.dataStoreProperty == null) {
      return;
    }
    //dataStoreProperty comes from the page
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if (this.items == undefined) {
      this.context.$actionEnded.subscribe((actionName: string) => {
        if (actionName.includes("actionGetPolicies")) {
          this.context.iceModel.elements['triggerActionWriteFromOther'].setSimpleValue(1);
        }
      });
    } else {
      this.contractSelectedIndex = this.localStorage.getDataFromLocalStorage('generalIndexHolder')
      this.currentContract = this.items[this.contractSelectedIndex];
      this.setBranch();
    }


    this.context.$actionEnded.subscribe((actionName: string) => {
      if (actionName.includes("actionWriteFromOtherForRefresh")) {
        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        this.contractSelectedIndex = this.localStorage.getDataFromLocalStorage('generalIndexHolder')
        this.currentContract = this.items[this.contractSelectedIndex];
        this.setBranch();
        this.iceModel.elements['policy.contract.general.info.ClaimID'].setSimpleValue(this.localStorage.getDataFromLocalStorage('claimID')); // in order to get participants
        this.claimsFilter();
        this.getCurrentClaimData();
        this.context.$actionEnded.observers.pop();

        // this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        // this.setBranch();
        // this.context.$actionEnded.observers.pop();
      }
    });

  }



  get svgIcon() {
    return this.getIcon('F7877569C4C74C9F9D432D5A01DDC0A0');
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  getfriendlySettlementIndicator() :boolean
  {
    if (this.iceModel.elements["claims.motor.FriendlySettlementIndicator"].getValue().forIndex(null) == 1)
     return true;
     else
     return false;

  }


  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    // console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', '21');
    svg.setAttribute('height', '21');
    return svg;
  }

  checkActive(step: number): string {
    return this.stepperState.stepsState[step].state;
  }

  checkActiveLine(step: number): string {

    if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ')
      return this.stepperState.stepsState[step].state + " motor_done";

    if (this.stepperState.stepsState[step].state == "done" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
      return this.stepperState.stepsState[step].state + " life_done";

    if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ')
      return this.stepperState.stepsState[step].state + " home_done";

    if (this.stepperState.stepsState[step].state == "active" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
      return this.stepperState.stepsState[step].state + + " life_done";

  }

  checkActiveLeftLine(step: number): string {

    switch (step) {
      case 0:
        {
          return this.stepperState.stepsState[step].state;
          break;
        }
      case 1:
        {
          if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ')
            return this.stepperState.stepsState[step].state + " motor_done";


          if (this.stepperState.stepsState[step].state == "done" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
            return this.stepperState.stepsState[step].state + " life_done";


          if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ')
            return this.stepperState.stepsState[step].state + " home_done";

          return this.stepperState.stepsState[step].state

          break;
        }
      case 2: {
        if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ')
          return this.stepperState.stepsState[step].state + " motor_done";

        if (this.stepperState.stepsState[step].state == "done" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
          return this.stepperState.stepsState[step].state + " life_done";


        if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ')
          return this.stepperState.stepsState[step].state + " home_done";

        return this.stepperState.stepsState[step].state
        break;
      }
      default: {

        break;
      }
    }

  }

  checkActiveRightLine(step: number): string {

    switch (step) {
      case 0:
        {
          if (this.stepperState.stepsState[step+1].state == "done" && this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ')
            return this.stepperState.stepsState[step].state + " motor_done";

          if (this.stepperState.stepsState[step+1].state == "done" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
            return this.stepperState.stepsState[step].state + " life_done";


          if (this.stepperState.stepsState[step+1].state == "done" && this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ')
            return this.stepperState.stepsState[step].state + " home_done";

          return this.stepperState.stepsState[step].state;
          break;
        }
      case 1:
        {
          if (this.stepperState.stepsState[step+1].state == "done" && this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ')
            return this.stepperState.stepsState[step].state + " motor_done";


          if (this.stepperState.stepsState[step+1].state == "done" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
            return this.stepperState.stepsState[step].state + " life_done";


          if (this.stepperState.stepsState[step+1].state == "done" && this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ')
            return this.stepperState.stepsState[step].state + " home_done";

          return this.stepperState.stepsState[step].state;

          break;
        }
      case 2: {
          return this.stepperState.stepsState[step].state;
        break;
      }
      default: {
        break;
      }
    }

  }


  checkOuterCircle(step: number): string {
    if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΑΥΤΟΚΙΝΗΤΩΝ')
      return this.stepperState.stepsState[step].state + " motor_outer_circle";
    if (this.stepperState.stepsState[step].state == "done" && (this.currentClaim.Branch == 'ΖΩΗΣ' || this.currentClaim.Branch == 'ΥΓΕΙΑΣ'))
      return this.stepperState.stepsState[step].state + " life_outer_circle";
    if (this.stepperState.stepsState[step].state == "done" && this.currentClaim.Branch == 'ΠΕΡΙΟΥΣΙΑΣ')
      return this.stepperState.stepsState[step].state + " home_outer_circle";
      else
      return this.stepperState.stepsState[step].state;
  }

  getLabelName(col: string): string {
    // var name=this.context.iceResource.resolve("sections.home." + this.section.name + "." + col, "[" + col + "]")
    var name = this.resource.resolve("elements." + col, col);
    return name;
  }

  calculateDate(date: Date): string {
   if(date==null)
   return "";


    var d = new Date(date);
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    if (mm < 10 && dd < 10) {
      return '0' + dd + '-' + '0' + mm + '-' + yyyy;
    } else if (dd < 10) {
      return '0' + dd + '-' + mm + '-' + yyyy;
    } else if (mm < 10) {
      return dd + '-' + '0' + mm + '-' + yyyy;
    } else {
      return dd + '-' + mm + '-' + yyyy;
    }

  }
  resetValuesForRefresh() {

    this.iceModel.elements['policy.claims.selectedBranch'].setSimpleValue(this.localStorage.getDataFromLocalStorage('selectedClaimsBranch'));
    this.iceModel.elements["policy.contract.general.info.indexHolder"].setSimpleValue(this.localStorage.getDataFromLocalStorage('generalIndexHolder'));

  }

  setBranch() {
    for (let i = 0; i < this.items.length; i++) {
      for (let j = 0; j < this.items[i].Claims.length; j++) {
        _.set(this.context.dataStore.clientContracts[i].Claims[j], 'Branch', this.context.dataStore.clientContracts[i].Branch);
      }
    }
  }


  getClassStepperState(step:number): string
      {
      if(this.stepperState.step === 0 && step === 1)
        return 'step-overextend-right';
      if(this.stepperState.step === 1 && step === 0)
        return 'step-overextend-left';
      if(this.stepperState.step === 1 && step === 2)
        return 'step-overextend-right';
      if(this.stepperState.step === 2 && step === 0)
      return 'step-overextend-left';
      else return null;
      }

  getClassDotItemActive1():string
    {
      if (this.stepperState.step == 0)
      {
        return "dot-item-active";
      }
      else
      return "";
    }
  getClassDotItemActive2(): string {
    if (this.stepperState.step == 1) {
      return "dot-item-active";
    }
    else
      return "";
  }
  getClassDotItemActive3(): string {
    if (this.stepperState.step == 2) {
      return "dot-item-active";
    }
    else
      return "";
  }

  private claimsFilter() {
    for (let policy of this.items) {
      const indexPol: number = this.items.findIndex((item) => item === policy);

      let claimsPerPolicy: any[] = policy.Claims.filter((x: any) => x.ClaimsStatusDescription.trim() !== 'Άκυρη');

      if (!claimsPerPolicy) {
        return;
      }

      if (claimsPerPolicy.length > 0) {
        if (
          policy.Branch === 'ΖΩΗΣ' ||
          policy.Branch === 'ΥΓΕΙΑΣ' ||
          policy.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' ||
          policy.Branch === 'ΠΕΡΙΟΥΣΙΑΣ'
        ) {

          for (let claim of claimsPerPolicy) {
            const indexCl: number = claimsPerPolicy.findIndex((cl) => cl === claim);
            claim = { ...claim, Branch: policy.Branch };
            claimsPerPolicy = [
              ...claimsPerPolicy.slice(0, indexCl),
              claim,
              ...claimsPerPolicy.slice(indexCl + 1)
            ];
          }

          policy = { ...policy, Claims: [...claimsPerPolicy] };

          this.items = [
            ...this.items.slice(0, indexPol),
            policy,
            ...this.items.slice(indexPol + 1)
          ];
        }
      }
    }
  }

  ngOnDestroy(){

    this.iceModel.elements["claims.Amount"].setSimpleValue(0);
  }


  }



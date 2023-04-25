import { Component, OnDestroy, OnInit } from "@angular/core";
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { IndexedValue } from '@impeo/ice-core';
import * as _ from "lodash";
import { LocalStorageService } from "../../../services/local-storage.service";
import { catchError, first, tap,takeUntil } from "rxjs/operators";
import { Subscription, throwError,Subject } from "rxjs";
import { SpinnerService } from "../../../services/spinner.service";
import { PassManagementService } from '../../../services/pass-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';



export interface RequestClosed {
  PaymentAmount:string;
}

@Component({
  selector: "app-claims-card",
  templateUrl: "./claims-card.component.html",
  styleUrls: ["./claims-card.component.scss"]
})
export class ClaimsCardComponent extends SectionComponentImplementation implements OnInit, OnDestroy {
  [x: string]: any;
  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private passManagement: PassManagementService
  ) {
    super(parent);
  }

  items: any[] = [];
  receipts: any[] = [];
  claimItems: any[] = [];
  unPaidReceipts: any;
  paymentFrequency = new Map();
  currentContract: any;
  currentClaim: any;
  claimsExist: boolean = false;
  claimsPropertyExist:boolean=false;
  ClosingClaimDatePerClaim: any[] = [];
  defaultDateYear = 70;
  claimsMessage = 'Δεν υπάρχουν ενεργά αιτήματα';
  claimsPropertyMessage='Δεν υπάρχουν ενεργά αιτήματα';
  contentLoaded: boolean = false;
  contentLoadedProperties: boolean = false;
  refreshStatus: any;
  policiesList: any[] = [];
  returnUrl: String;
  decryprionCode: string;

  private getPoliciesEndedSubs: Subscription;
  private writeFromOtherForRefreshEndedSubs: Subscription;
  private subscription = new Subscription();
  private destroy$ = new Subject<void>();

  hasContractPropertyCoolgenDetails=false;
  dataToShow: any[] = [];
  inProgressEmpty: boolean = false;

  hasHealthContract=false;

  numberOfFolderDamage1 = "pages.viewClaims.numberOfFolderDamage1.label";
  viewClaimsNumberContract1 =
    "pages.viewClaims.viewClaimsNumberContract1.label";
  numberOfFolderDamage2 = "pages.viewClaims.numberOfFolderDamage2.label";
  viewClaimsNumberContract2 =
    "pages.viewClaims.viewClaimsNumberContract2.label";
  licencePlate = "pages.viewClaims.licencePlate.label";
  incidentDate1 = "pages.viewClaims.incidentDate1.label";
  involvedIncurance = "pages.viewClaims.involvedIncurance.label";
  na = "pages.viewClaims.na.label";
  dangerAdrress = "pages.viewClaims.dangerAdrress.label";
  insuredPerson = "pages.viewClaims.insuredPerson.label";
  incidentDate2 = "pages.viewClaims.incidentDate2.label";
  amountOfCompensation = "pages.viewClaims.amountOfCompensation.label";

  getBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'health';
      case 'ΥΓΕΙΑΣ':
        return 'health';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house';
    }
  }

  ngOnInit() {
    super.ngOnInit();

    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");

    //if action of open Properties has run then disable spinner
    if(this.iceModel.elements['property.claims.valuation.inprogress.requests'].getValue().forIndex(null))
    this.contentLoadedProperties=true;

    this.getHealthText();
    console.log('health text', this.getHealthText);
    console.log('value', this.hasHealthContract);

    this.getData();

    const getPoliciesEnded$ = this.context.$actionEnded.pipe(
      first((action) => action === 'actionGetPolicies'),
      catchError((err) => this.handleError(err)),
      tap((_) => this.execActionWriteFromOtherForRefresh())
    );

    this.getPoliciesEndedSubs = getPoliciesEnded$.subscribe(
      (_) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.getPoliciesEndedSubs);

    const writeFromOtherForRefreshEnded$ = this.context.$actionEnded.pipe(
      first((action) => action === 'actionWriteFromOtherForRefresh'),
      catchError((err) => this.handleError(err)),
      tap((_) => this.getData())
    );

    this.writeFromOtherForRefreshEndedSubs = writeFromOtherForRefreshEnded$.subscribe(
      (_) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.writeFromOtherForRefreshEndedSubs);


    if (_.get(this.context.dataStore, 'clientContracts'))
    {
      _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
        if (contract.ContractType === 14)
        {
          this.context.iceModel.elements["selectedcontractbranch"].setSimpleValue(14);
          this.hasContractPropertyCoolgenDetails = true;

        }
        if (contract.ContractType === 1)
        {
          //this.context.iceModel.elements["selectedcontractbranch"].setSimpleValue(14);
          this.hasHealthContract = true;
          //console.log('contractType', this.contract.ContractType);

        }

      });
    }

    //This has to do with Property Claims
    const hasRequestEnded = this.iceModel.elements[
      'eclaims.valuation.inprogress.requests'
    ]
      .getValue()
      .forIndex(null) as boolean;

      hasRequestEnded ? (this.contentLoaded = true) : (this.contentLoaded = false);

    this.iceModel.elements['property.claims.valuation.inprogress.requests'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {
        this.getData();
        this.contentLoadedProperties = true;
        //Deeplinks
        this.route.queryParams.subscribe((params: any) => {
          this.returnUrl = params["returnUrl"] || '//';
          if(this.returnUrl != '//' && this.returnUrl != undefined){
            var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
            var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
            if(decodedQuery.contractTypeDeepLink == undefined){
              this.redirectIndividualDetailsDeepLink();
          }
          }
        })
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '//';
        // if(this.returnUrl !=='//' && this.returnUrl != undefined){
        //   var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
        //   var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
        //   if(decodedQuery.contractTypeDeepLink == undefined){
        //       this.redirectIndividualDetails();
        //   }
        // }
      } else {
        this.contentLoadedProperties = false;
      }
    });


  }

  getPropertyContentLoaded()
  {
    return this.contentLoadedProperties;
  }

  //Individual part
  async redirectIndividualDetails(): Promise<void> {
    this.localStorage.setDataToLocalStorage('refreshStatus',0);
    console.info("click to individual Deep link claims!")
    this.context.iceModel.elements['property.claim.step'].setSimpleValue(1);
    this.router.navigate(['/ice/default/customerArea.motor/viewPropertyNotificationDetails']);
  }


  async redirectIndividualDetailsDeepLink(): Promise<void> {
    this.localStorage.setDataToLocalStorage('refreshStatus',0);
    console.info("click to individual Deep link claims!")
    this.context.iceModel.elements['property.claim.step'].setSimpleValue(1);
    this.router.navigate(['/ice/default/customerArea.motor/viewPropertyNotificationDetails'] , {
      queryParams: {
        returnUrl:  this.returnUrl,
      }});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.spinnerService.loadingOff();
  }


  private handleError(err: any) {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }

  private async execActionWriteFromOtherForRefresh() {
    this.localStorage.setDataToLocalStorage('refreshStatus', 0);
    const actName = 'actionWriteFromOtherForRefresh';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch(err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  private getData() {
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    //this.data = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if (!!this.items) {
      //Functionality transformed and moved inside claimsFilter()
      this.claimsFilter();
      this.policiesList = [...this.items];
      this.contentLoaded = true;
    }


    //Property claims

    this.iceModel.elements["property.notification.step2"].setSimpleValue(false);   //imitialize the notiification

    this.dataToShow=this.iceModel.elements["property.claims.requests.inprogress"].getValue().values[0].value;
    if( this.dataToShow.length>0)
    {
    this.claimsPropertyExist=true;
    this.contentLoadedProperties=true;
    this.claimsPropertyMessage='';
    }

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

          this.claimsExist = true;
          this.claimsMessage = '';

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

  // When clicking on the card, we add the value of the selected claimID in the selectedClaim
  onClick(item: any) {
    //this.iceModel.elements["claims.claimresponsibilityindicator"].setSimpleValue(item.claimresponsibilityindicator);
    //if it is responsible for the claim....do not pass...as Gandalf
    if (item.ClaimresponsibilityIndicator == "1") return;

    if (
      this.recipe.selectedClaim == null ||
      this.recipe.selectedElementNameType == null ||
      this.recipe.selectedElementNameKey == null
    ) {
      return;
    }

    this.spinnerService.loadingOn();

    if (
      item != null &&
      this.iceModel.elements[this.recipe.selectedClaim].getValue().values[0]
        .value === item.ClaimID
    ) {
      this.iceModel.elements[this.recipe.selectedClaim].setSimpleValue(null);
    }

    this.iceModel.elements[this.recipe.selectedClaim].setSimpleValue(
      item.ClaimID
    );

    //take the value from the dataModel---claimId maps to specific contract
    let contractIndex = this.mapContractFromClaim(item.ClaimID);
    this.iceModel.elements[this.recipe.selectedContractIndex].setSimpleValue(
      contractIndex
    );
    this.iceModel.elements[
      "policy.contract.general.info.indexHolder"
    ].setSimpleValue(contractIndex); //for get-participant-rule

    this.iceModel.elements[this.recipe.indexElement].setSimpleValue(
      this.items[contractIndex].Claims.indexOf(item)
    );

    if (item.Branch == "ΥΓΕΙΑΣ") {
      this.iceModel.elements["policy.claims.selectedBranch"].setSimpleValue(9);
      this.iceModel.elements["life.claims.contractId"].setSimpleValue(
        this.context.dataStore.data.clientContracts[contractIndex].ContractID
      );
    } else if (item.Branch == "ΖΩΗΣ") {
      this.iceModel.elements["policy.claims.selectedBranch"].setSimpleValue(1);
      this.iceModel.elements["life.claims.contractId"].setSimpleValue(
        this.context.dataStore.data.clientContracts[contractIndex].ContractID
      );
    }
    else if (item.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      this.iceModel.elements["policy.claims.selectedBranch"].setSimpleValue(3);
      this.iceModel.elements["life.claims.contractId"].setSimpleValue(
        this.context.dataStore.data.clientContracts[contractIndex].ContractID
      );
    } else {
      this.iceModel.elements["policy.claims.selectedBranch"].setSimpleValue(4);
    }

    this.localStorage.setDataToLocalStorage("claimID", item.ClaimID);
    this.localStorage.setDataToLocalStorage(
      "generalIndexHolder",
      contractIndex
    );
    this.localStorage.setDataToLocalStorage(
      "claimIndexHolder",
      this.items[contractIndex].Claims.indexOf(item)
    );
    this.localStorage.setDataToLocalStorage(
      "selectedClaimsBranch",
      this.iceModel.elements["policy.claims.selectedBranch"].getValue()
        .values[0].value
    );
  }

  // Check the status of the claim
  ClosedStatusDesc(item: any): string {
    if (item.Branch == "ΖΩΗΣ" || item.Branch == "ΥΓΕΙΑΣ") {
      //life/health
      if (item.ClaimsStatusDescription != undefined) {
        if (!this.getClaimStatus(item))
          return "Ολοκληρωμένο";
        else
          return "Σε εκκρεμότητα";
      }
    } else if (item.Branch == "ΠΕΡΙΟΥΣΙΑΣ" || item.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      if (
        item.ClosingClaimDate != "" &&
        item.ClosingClaimDate != "1900-01-01T00:00:00Z"
      )
        return "Ολοκληρωμένο";
      else return "Σε εκκρεμότητα";
    }
    return "";
  }

  // Check the status of the claim
  ClosedStatus(item: any): boolean {
    if (item.Branch == "ΖΩΗΣ" || item.Branch == "ΥΓΕΙΑΣ") {
      //life/health
      if (item.ClaimsStatusDescription != undefined) {
        if (item.ClaimsStatusDescription.includes("Κλειστή") || item.ClaimsStatusDescription.includes("Απορριφθείσα") || item.ClaimsStatusDescription.includes("Απόρριψη") || item.ClaimsStatusDescription.includes("Άκυρη")) {
          return false;
        } else return true;
      }
    } else if (item.Branch == "ΠΕΡΙΟΥΣΙΑΣ" || item.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      if (
        item.ClosingClaimDate != "" &&
        item.ClosingClaimDate != "1900-01-01T00:00:00Z"
      )
        return false;
      else return true;
    }
    return false;
  }

  policyItemsFunction(arg: any): any {
    if (this.items == null) return;
    return this.items;
  }

  getClaimStatus(item: any): boolean {

    switch (item.ClaimsStatusDescription.trim()) {
      case "Ανοικτή":
        return true;      //opened
      case "Προς Πληρωμή":
        return true;     //opened
      case "Απορριφθείσα":
        return false;      //closed
      case "Κλειστή (Ζημ)":
        return false;      //closed
      case "Κλειστή (Λογ)":
        return false;      //closed
      case "Κλειστή 'Ανευ Συν.":
        return false;     //closed
      case "Εκκρεμότητα":
        return true;      //opened
      case "Εγκεκριμένη (Ζημ)":
        return true;      // opened
      case "Άκυρη":
        return false;      //closed
      case "Κλειστή (Επιστρ. Δικ)":
        return false;      // closed
      case "Απόρριψη λόγω Εκπιπτομένου":
        return false;      //closed
      case "Ανοικτή λόγω Αγωγής":
        return true;      // opened
      case "Απορριφθείσα με Καταγγελία Ασφ":
        return false;      // closed
      case "Απορριφθείσα λόγω Προΰπαρξης":
        return false;      // closed
      case "Απορριφθείσα λόγω Αναμονών":
        return false;      // closed
      default:
        return false;
    }


  }



  getClassClosedStatus(item: any): string {
    if (this.ClosedStatus(item))
      return "open";
    else
      return "closed";
  }



  getAddress(index: number): any {
    if (this.items[index].ContractPropertyCoolgenDetails != undefined) {
      return (
        this.items[index].ContractPropertyCoolgenDetails.PropertyStreet +
        ", " +
        this.items[index].ContractPropertyCoolgenDetails.PropertyZipCode +
        ", " +
        this.items[index].ContractPropertyCoolgenDetails.PropertyCity
      );
    }
  }

  getInsuredPerson([i, j]: number[]): any {
    if (this.items[i].Claims != undefined) {
      return this.items[i].Claims[j].FullName;
    }
  }


  getLicensePlate(index: number): any {
    return (this.items[index].ContractMotorDetails ? this.items[index].ContractMotorDetails.VehicleLicensePlate : "");
  }

  getHealthText(){
    if ( this.branch == "ΥΓΕΙΑΣ"){
      this.hasHealthContract =true;
    }else{
      this.hasHealthContract =false;
    }
  }

  filterClaims() {
    //
    var filtered: any[] = [];
    for (let item of this.items) {
      if (item.hasOwnProperty("Claims")) filtered.push(item);
    }
    // return this.items[0].filter((x:any) => x.Claims.ClaimID>=0);
    return filtered;
  }

  mapContractFromClaim(ClaimId: any): number {
    var index = -1;
    for (let item of this.items) {
      if (item.hasOwnProperty("Claims")) {
        for (let itemClaim of item.Claims) {
          if (itemClaim.ClaimID == ClaimId) return this.items.indexOf(item);
        }
      }
    }
    return index;
  }

  generalFilter(filterObject: any, field: any, disiredFilter: any) {
    return filterObject.filter((x: any) => x.field == disiredFilter);
  }

  calculateDiffOfDates(lastDate: any, priorDate: any): number {
    let diff = Math.abs(
      new Date(lastDate).getTime() - new Date(priorDate).getTime()
    );
    let diffMonths = Math.floor(diff / (1000 * 3600 * 24 * 30));
    return diffMonths;
  }

  calculateDiffOfDays(renewalDate: any) {
    let diff = Math.abs(new Date(renewalDate).getTime() - new Date().getTime());
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  paymentFrequencyToString(frequency: any) {
    this.paymentFrequency.set(1, "ΜΗΝΙΑΙΑ");
    this.paymentFrequency.set(3, "ΤΡΙΜΗΝΗ");
    this.paymentFrequency.set(6, "ΕΞΑΜΗΝΗ");
    this.paymentFrequency.set(12, "ΕΤΗΣΙΑ");
    return this.paymentFrequency.get(frequency);
  }

  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate() - 1;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }

  formatDate(date: any) {
    return new Date(date);
  }

  compareDates(date: Date) {
    if (new Date(date) < new Date()) {
      return "bell-alert";
    } else {
      return "info-alert";
    }
  }

  copyText(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    alert("Copied!");
  }


  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '51');
    svg.setAttribute('height', '51');

    return svg;
  }

  getIcon(iconID: string): string {
    const icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }


  getColor(item: any): string {
    switch (item.Branch) {
      case "ΑΥΤΟΚΙΝΗΤΩΝ": {
        return "#479463";
        break;
      }
      case "ΠΕΡΙΟΥΣΙΑΣ": {
        return "#F2B100";
        break;
      }
      case "ΖΩΗΣ": {
        return "#ef3340";
        break;
      }
      case "ΥΓΕΙΑΣ": {
        return "#ef3340";
        break;
      }
      default: {
        break;
      }
    }
  }
}

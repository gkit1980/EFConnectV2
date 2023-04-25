import { environment } from './../../../../environments/environment';
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  SectionComponentImplementation,
  IceSectionComponent
} from "@impeo/ng-ice";
import * as _ from "lodash";
import { LocalStorageService } from '../../../services/local-storage.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PassManagementService } from '../../../services/pass-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../services/spinner.service';
import { DecodeJWTService } from '../../../services/decode-jwt.service';
import { BranchClassService } from '../../../services/branch-class.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewConfirmComponent } from '../../page/review-confirm/review-confirm.component';
import { Subscription, throwError } from 'rxjs';
import { catchError, filter, first, map, tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { IndexedValue } from '@impeo/ice-core';

const fs = require('fs');


@Component({
  selector: "app-motor-covers-card-section",
  templateUrl: "./motor-covers-card.section.component.html",
  styleUrls: ["./motor-covers-card.section.component.scss"]
})
export class MotorCoversEditorCardComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService,
    private passManagement: PassManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private decodeJWT: DecodeJWTService,
    private branchClass: BranchClassService,
    private modalService: NgbModal,
    private deviceService: DeviceDetectorService
  ) {
    super(parent);
  }
  items: any[] = [];
  receipts: any[] = [];
  unPaidReceipts: any;
  paymentFrequency = new Map();
  amount: number;
  showDafSection: boolean = false;
  showGroupHealthSection: boolean = false;
  noData: boolean = false;
  receiptsShown = false;
  ammountOfPaymentCodes: number = 0;
  insuredName: string;
  refreshStatus: number;
  ParticipantLastName: any;
  ParticipantFirstName: any;
  participantRelationship: string;
  arrayFilterStatus: any[] = [];
  arrayFilterStatusFree: any[] = [];
  arrayFilterGroupHealth: any[] = [];
  counter: number = 0;
  groupCounter: number = 0;
  passParams: string ="";
  // envBaseUrl: string = environment.baseurl;
  // prod check
  envBaseUrl: string = environment.baseurl == "http://localhost:4200" ? "http://localhost:4200":'https://connect.eurolife.gr';
  arrayWithGoogleButtonsJWT: {} = {};
  arrayWithGooglePassesPayload: {} = {};

  contentLoaded: boolean = false;
  showSpinnerBtn: boolean = false;
  showGoogleBtn: boolean = false;
  contractsLength: number = 0;
  goldenRecordId: string ="";
  goldenRecordId_InsuredId: string ="";
  runGroupCoverages: boolean=false;
  startEclaimsCoveragesTime: number=0;
  endEclaimsCoveragesTime:number=0;
  durationTime:number=0;
  mobilePhone:string ="";

  private getPoliciesEndedSubs: Subscription;
  private lifecycleSubs: Subscription;
  private subscription = new Subscription();
  private destroy$ = new Subject<void>();


  contractNumber = 'pages.viewMyPolicies.contractNumber.label';
  name = 'pages.viewMyPolicies.name.label';
  viewMyPoliciesPlatenumber = 'pages.viewMyPolicies.viewMyPoliciesPlatenumber.label';
  dangerAdrress = 'pages.viewMyPolicies.dangerAdrress.label';
  renewalDate = 'pages.viewMyPolicies.renewalDate.label';
  frequencyOfPayment = 'pages.viewMyPolicies.frequencyOfPayment.label';
  viewMyPoliciesCurrentPayment = 'pages.viewMyPolicies.viewMyPoliciesCurrentPayment.label';
  nextPayment = 'pages.viewMyPolicies.nextPayment.label';
  autoPayment = 'pages.viewMyPolicies.autoPayment.label';
  eurobank1 = 'pages.viewMyPolicies.eurobank1.label';
  eurobank2 = 'pages.viewMyPolicies.eurobank2.label';
  contractPaid = 'pages.viewMyPolicies.contractPaid.label';
  overThreeUnpaidReceipts = 'pages.viewMyPolicies.overThreeUnpaidReceipts.label';
  unsuccessfullBilling1 = 'pages.viewMyPolicies.unsuccessfullBilling1.label';
  unsuccessfullBilling2 = 'pages.viewMyPolicies.unsuccessfullBilling2.label';
  unsuccessfullBilling3 = 'pages.viewMyPolicies.unsuccessfullBilling3.label';
  contractNoPayment = 'pages.viewMyPolicies.contractNoPayment.label';
  contractRenewal = 'pages.viewMyPolicies.contractRenewal.label';
  contractRenewalValueContracts = 'pages.viewMyPolicies.contractRenewalValueContracts.label';
  viewMyPoliciesCurrentPayment2 = 'pages.viewMyPolicies.viewMyPoliciesCurrentPayment2.label';
  paynow = 'pages.viewMyPolicies.paynow.label';
  viewMyPoliciesPaymentCode = 'pages.viewMyPolicies.viewMyPoliciesPaymentCode.label';
  unpaid = 'pages.viewMyPolicies.unpaid.label';
  inactive = 'pages.viewMyPolicies.inactive.label';
  inactiveStatus = 'pages.viewMyPolicies.inactiveStatus.label'
  paid = 'pages.viewMyPolicies.paid.label';
  payment1 = 'pages.viewMyPolicies.payment1.label';
  payment2 = 'pages.viewMyPolicies.payment2.label';
  dateStart = 'pages.viewMyPolicies.dateStart.label';
  viewMyPoliciesPaymentCode2 = 'pages.viewMyPolicies.viewMyPoliciesPaymentCode2.label';
  payment3 = 'pages.viewMyPolicies.payment3.label';
  endDate = 'pages.viewMyPolicies.endDate.label';
  index: number;
  dataWithNoteURLs: any[] = []
  status: string[] = ["Εν Ισχύ", "Ελεύθερο (Λήξη Πληρωμών)", "Μερική Εξαγορά Μεριδίων Α/Κ",
    "Αλλαγή επενδυτικού σεναρίου", "Μερική Εξαγορά", "Επαναφορά"];

  typeOfContract: number[] = [99];

  ///Wallet
  deviceInfo: any = null;
  isIOSDevice: boolean = false;
  isAndroidDevice: boolean = false;
  height = 'small';
  size = '';
  textsize = '';
  theme = 'dark';
  jwt: string = '';
  timer: any;
  remainAmount:string ="";
  returnUrl:String;
  targetSystem:string = "_self";
  visible: boolean =false;



  ngOnInit() {

    super.ngOnInit();

    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");

    //ios Chrome download pass
    if( window.navigator.vendor.indexOf("Google") == -1){
      this.targetSystem = "_self";
    }else{
      this.targetSystem = "_system";
    }

    //Decode Token-take insured name, golden record id
    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    this.insuredName = this.decodeJWT.decodedToken.name;
    this.mobilePhone = this.decodeJWT.decodedToken.extension_Mobile;
    this.goldenRecordId = this.decodeJWT.decodedToken.extension_CustomerCode as string;
    this.goldenRecordId=this.goldenRecordId.toString();
    //end

    this.setMobileOperatingSystem();    //Wallet check

    this.addItems();

    const getPoliciesEnded$ = this.context.$actionEnded.pipe(
      first((action) => action === 'actionGetPolicies'),
      catchError((err) => this.handleError(err)),
      tap((_) => this.execActionWriteFromOtherForRefresh())
    );

    this.getPoliciesEndedSubs = getPoliciesEnded$.subscribe(
      (_) => { },
      (err) => console.error(err)
    );
    this.subscription.add(this.getPoliciesEndedSubs);

    const lifecycle$ = this.context.$lifecycle.pipe(
      filter((evt) => evt.payload.hasOwnProperty(this.recipe.dataStoreProperty)),
      map((res) => res.payload[this.recipe.dataStoreProperty]),
      catchError((err) => this.handleError(err)),
      tap((_) => this.addItems()),
    );

    this.lifecycleSubs = lifecycle$.subscribe(
      (_) => { },
      (err) => console.error(err)
    );
    this.subscription.add(this.lifecycleSubs);


    this.context.$actionEnded
    .pipe(takeUntil(this.destroy$))
    .subscribe((actionName: string) => {
      if (actionName.includes("actionGetParticipantsHomePage")) {
      //the last action is being executed
     this.spinnerService.loadingOff();
      }
    });

    this.showDafsDocs();
    this.showGroupHealthDocs();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

    this.spinnerService.loadingOff();

    this.destroy$.next();
    this.destroy$.complete();


  }

  //This is for Group Health Policies
  showGroupHealthDocs() {
    this.showGroupHealthSection = this.localStorage.getDataFromLocalStorage("showGroupHealth");
    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    if (this.showGroupHealthSection) {
      this.insuredName = this.decodeJWT.decodedToken.name;
    }
  }

  private async execActionWriteFromOtherForRefresh() {
    this.localStorage.setDataToLocalStorage('refreshStatus', 0);
    const actName = 'actionWriteFromOtherForRefresh';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      // When we use 'executeExecutionRule' the action is not dispatched and so
      // we cannot observe it via 'this.context.$actionEnded' .
      // const executionRule0 = action.executionRules[0];
      // await this.context.executeExecutionRule(executionRule0);
      try {
        await this.context.iceModel.executeAction(actName);
      } catch (err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  private handleError(err: any) {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }


  //NEW findParticipants
  findParticipants(){
    if (!!this.items) {
      if (this.items.length > 0)
      {
        for (let i = 0; i < this.items.length; i++)
        {
          if (this.items[i].Participants!=undefined && this.items[i].Participants.length > 0)
          {
              for (let j = 0; j < this.items[i].Participants.length; j++)
              {
                  this.participantRelationship = this.items[i].Participants[j].Relationship;
                  if (this.participantRelationship.startsWith('ΑΣΦ'))
                  {
                      this.items[i].ContractParticipants =
                      [
                        {
                        LastName: this.items[i].Participants[j].LastName,
                        FirstName: this.items[i].Participants[j].FirstName,
                      }
                       ];
                  }
              }

          }
        }
      }
    }
  }

  getMainInsureFullName(item:any): string
    {
    let Contract=this.items.filter((c:any)=>c.ContractID==item.ContractID)[0];
    if(Contract.Participants!=undefined)
    {
    let specificParticipant=Contract.Participants.filter((x:any)=> x.Relationship.startsWith('ΑΣΦ'))[0];
    return specificParticipant.LastName+" "+specificParticipant.FirstName
    }
    else
    return "";
  }

  getIconClass(branch: string): string {
    return this.branchClass.iconClass(branch);
  }

  getTextClass(branch: string): string {
    return this.branchClass.textClass(branch);
  }

  // When clicking on the card, we add the value of the selected contractID in the selectedElementName
  onClick(item: any, dlink?:string) {

    this.visible = true;

    // this.showDropdown(item);

    //set value in \ element for Dafs
    if (item === 'daf') {
      let name: string;
      this.iceModel.elements[this.recipe.branchElement].setSimpleValue(10);
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(10);
      this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
      name = this.decodeJWT.decodedToken.name;
      this.iceModel.elements["dafs.insured.name"].setSimpleValue(name);
      this.iceModel.elements["dafs.product.name"].setSimpleValue('Ομαδικό Ασφαλιστήριο Διαχείρισης Κεφαλαίου');
      return;
    }

    if (
      this.recipe.selectedElementName == null ||
      this.recipe.selectedElementNameType == null ||
      this.recipe.selectedElementNameKey == null
    ) {
      return;
    }

    this.spinnerService.loadingOn();

    if (
      item != null &&
      this.iceModel.elements[this.recipe.selectedElementName].getValue()
        .values[0].value === item.ContractID
    ) {
      this.iceModel.elements[this.recipe.selectedElementName].setSimpleValue(
        null
      );
    }

    this.iceModel.elements[this.recipe.selectedElementName].setSimpleValue(
      item.ContractID
    );
    this.iceModel.elements[this.recipe.selectedElementNameType].setSimpleValue(
      item.ContractType
    );
    this.iceModel.elements[this.recipe.selectedElementNameKey].setSimpleValue(
      item.ContractKey
    );



    let SourceSystemID = (+item.ContractType);

    if (item.ContractType != 99)
      SourceSystemID = item.Receipts[0].SourceSystemID;
    else
     this.context.iceModel.elements["policies.details.grouphealth.CustomerName"].setSimpleValue(item.CustomerName);

    this.iceModel.elements["policy.selectedSourceSystemID"].setSimpleValue(SourceSystemID);


    var indexOfContractIDType: any;

    // this.iceModel.elements["policy.selectedContractIDType"].setSimpleValue(null);
    if (item.Branch == "ΥΓΕΙΑΣ" || item.Branch == "ΖΩΗΣ") {
      indexOfContractIDType = item.ContractIDType.indexOf('_');
      // this.iceModel.elements["policy.selectedContractIDType"].setSimpleValue(item.ContractIDType.substr(indexOfContractIDType + 1));
      if (item.Branch == "ΥΓΕΙΑΣ") {
        this.iceModel.elements[this.recipe.branchElement].setSimpleValue(1);
      } else {
        if (item.ContractIDType.substr(indexOfContractIDType + 1) === "6") {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(12);
        }
        else if (item.ContractIDType.substr(indexOfContractIDType + 1) === "7") {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(14);
        }
        else if (item.ContractIDType.substr(indexOfContractIDType + 1) === "3") {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(15);
        }
        else if (item.ContractIDType.substr(indexOfContractIDType + 1) === "4") {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(16);
        }
        else if (item.ContractIDType.substr(indexOfContractIDType + 1) === "5") {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(17);
        }
        //This is for Group Health
        else if (item.ContractIDType.substr(indexOfContractIDType + 1) === "99") {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(99);
        }
        else {
          this.iceModel.elements[this.recipe.branchElement].setSimpleValue(9);
        }
      }
    } else if (item.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
      indexOfContractIDType = item.ContractIDType.indexOf('_');
      if (item.ContractIDType.substr(indexOfContractIDType + 1) == 2) {
        this.iceModel.elements[this.recipe.branchElement].setSimpleValue(11);
      }
      else {
        this.iceModel.elements[this.recipe.branchElement].setSimpleValue(2);
      }
    } else if (item.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ")
    {
      this.iceModel.elements[this.recipe.branchElement].setSimpleValue(3);
      this.iceModel.elements["policies.details.RenewalNumber"].setSimpleValue(item.Renewal);  //DC-856
    } else if (item.Branch == "ΠΕΡΙΟΥΣΙΑΣ") {
      indexOfContractIDType = item.ContractIDType.indexOf('_');
      if (item.ContractIDType.substr(indexOfContractIDType + 1) == 13) {
        this.iceModel.elements[this.recipe.branchElement].setSimpleValue(13);
      }
      else {
        this.iceModel.elements[this.recipe.branchElement].setSimpleValue(4);
      }
    } else if (item.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ") {
      this.iceModel.elements[this.recipe.branchElement].setSimpleValue(6);
    } else if (item.Branch == "ΣΚΑΦΩΝ") {
      this.iceModel.elements[this.recipe.branchElement].setSimpleValue(7);
    } else if (item.Branch == "ΑΣΤΙΚΗ ΕΥΘΥΝΗ") {
      this.iceModel.elements[this.recipe.branchElement].setSimpleValue(8);
    }
    else {
      this.iceModel.elements[this.recipe.branchElement].setSimpleValue(5);
    }


    //set data to localStorage
    this.localStorage.setDataToLocalStorage("index", this.items.indexOf(item));
    this.localStorage.setDataToLocalStorage("selectedBranch", this.context.iceModel.elements['policy.selectedBranch'].getValue().values[0].value)
    this.localStorage.setDataToLocalStorage("contractID", this.context.iceModel.elements['policy.contract.general.info.ContractID'].getValue().values[0].value)
    this.localStorage.setDataToLocalStorage("contractKey", this.context.iceModel.elements['policy.contractKey'].getValue().values[0].value)
    // this.localStorage.setDataToLocalStorage("selectedContractIDType", this.context.iceModel.elements['policy.selectedContractIDType'].getValue().values[0].value)
    this.localStorage.setDataToLocalStorage('selectedBranchText', item.Branch);


    //take the value from the dataModel
    this.iceModel.elements[this.recipe.indexElement].setSimpleValue(
      this.items.indexOf(item)
    );


    //Add in local storage the navigation info
    this.localStorage.setDataToLocalStorage("navigation", this.iceModel.elements["exclude.Navigation.Tab"].getValue().values[0].value);
    if(dlink == "downloadPdf"){
      // const actName = 'actionGetReprintedPDF';
      // const action = this.context.iceModel.actions[actName];
      // this.context.iceModel.executeAction(actName);
      // this.spinnerService.loadingOff();
      this.iceModel.elements["deeplink.contract.downloadpdf"].setSimpleValue(true);

    }

  }

  private addItems() {

    if (!this.recipe.dataStoreProperty) {
      return;
    }
    if(!this.showGoogleBtn){
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);


    if(this.contractsLength ==0 && this.items != undefined){
      this.contractsLength = this.items.length;
    }

    if (!!this.items) {
      this.filterContractStatus();
      // this.showDafsDocs();
      this.findParticipants();



      let noDatatemp = true;
      this.items.forEach((item: any) => {
        if (
          item.Status.trim() === 'Εν Ισχύ' ||
          item.Status.trim() === 'Ελεύθερο' ||
          item.Status.trim() === 'Επαναφορά' ||
          item.Status.trim() === 'Ελεύθερο (Λήξη Πληρωμών)' ||
          item.Status.trim() === 'Μερική Εξαγορά Μεριδίων Α/Κ' ||
          item.Status.trim() === 'Αλλαγή επενδυτικού σεναρίου' ||
          item.Status.trim() === 'Μερική Εξαγορά' || item.ContractType != 99
        ) {
          noDatatemp = false;
        }
        //Wallet Purpose
        if (this.isAndroidDevice &&  item.jwt == undefined && ((item.Branch === 'ΠΕΡΙΟΥΣΙΑΣ' && item.ContractPropertyCoolgenDetails != undefined)||
        (item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' && item.ContractMotorDetails != undefined) ||
        (item.Branch !== 'ΠΕΡΙΟΥΣΙΑΣ' &&  item.Branch !== 'ΑΥΤΟΚΙΝΗΤΩΝ' && item.Participants !== undefined)) ) {

           this.addToGoogleWallet(item);
        }
        if(this.isIOSDevice && item.passParams == undefined && item.Participants != undefined){
          this.addToAppleWallet(item)
        }
        //end Wallet purpose

      });

      if (noDatatemp) {
        this.noData = true;

      }

      this.contentLoaded = true;
      var existAllDetails =true;
      this.items.forEach((item: any) => {
        if (!item.ContractDetails){
          existAllDetails=false;
        }
        // if(this.isAndroidDevice && this.arrayWithGoogleButtonsJWT[item.ContractKey] == undefined ){
        //   existAllDetails=false;
        // }
        //wait coverages for group contracts
        if(item.ContractType === 99 )
        {
          if(item.Coverages==undefined ){
            existAllDetails=false;
          }
          if(item.Coverages!=undefined ){
           if(item.Coverages.length==0)
            existAllDetails=false;
          }
        }
      })
      if(existAllDetails){
        this.showGoogleBtn= true;
      }
      //Deeplinks
      this.route.queryParams.subscribe((params: any) => {
        this.returnUrl = params["returnUrl"] || '//';
        if(this.returnUrl != '//' && this.returnUrl != undefined){
          var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
          var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
          if(decodedQuery.nextLink=='/ice/default/customerArea.motor/paymentManagement'){
            this.items.forEach((i: any) => {
              if(i.ContractKey == decodedQuery.contractKeyDeepLink){
                this.redirectToPayment(i,"deepLink");
              }
            });
          }else if(decodedQuery.nextLink=='/ice/default/customerArea.motor/policyDetails'){
            this.items.forEach((i: any) => {
              if(i.ContractKey == decodedQuery.contractKeyDeepLink){
                this.onClick(i, "downloadPdf");
              }
            });
          }
        }
      })

    }
  }

  }

  contractIncludePass(branch: any): boolean{
    switch (branch) {
      case 'ΖΩΗΣ':
        return true;
      case 'ΥΓΕΙΑΣ':
        return true;
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return true;
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return true;
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return true;
      default:
        return false;
    }
  }

  getBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life_svg';
      case 'ΥΓΕΙΑΣ':
        return 'health_svg';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor_svg';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house_svg';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings_svg';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc_svg';
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc_svg';
    }
  }

  getMyPoliciesClass(branch: any): string {
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
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc';
    }
  }

  getMyContractsClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life';
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
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc_svg';
    }
  }

  private showDafsDocs() {
    this.showDafSection = this.localStorage.getDataFromLocalStorage("showDaf");
    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    if (this.showDafSection) {
      this.contentLoaded = true;

      this.insuredName = this.decodeJWT.decodedToken.name;
      let action = this.context.iceModel.actions["actionGetDafs"];
      if (action != null) {
        action.executionRules[0].execute();

      }
    }
  }

  getShowDafSection() {
    if (this.showDafSection)
      //   this.openDialogNotification();

      return this.showDafSection;
  }

  //This is for Group Health Policies
  getShowGroupHealthSection() {
    //This is for Group Health
    if (this.items) {
      this.showGroupHealthSection = this.items.some((contract: any) => {
        if (contract.ContractType === 99) {
          this.localStorage.setDataToLocalStorage("showGroupHealth", true);
          this.showGroupHealthSection = this.localStorage.getDataFromLocalStorage("showGroupHealth");
          this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
          this.insuredName = this.decodeJWT.decodedToken.name;

          return true;
        }
        else
          return false;
      });
    }

    return this.showGroupHealthSection;
  }

  openDialogNotification() {
    if (this.counter == 0 && this.page.name == "viewMyPolicies" && this.getCurrentDate() <= "29/02/2020") {
      this.modalService.open(ReviewConfirmComponent, { windowClass: 'notModal', backdropClass: "popupMultiContractClass" });
      this.counter++;
    }

  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  findexcludedBraches(): any {
    var updatedArray: any = [];
    var mytest: any = [];
    let elementNameForExcludedTabNavigation: any;

    this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages = this.localStorage.getDataFromLocalStorage('initialNavigation');

    for (let i = 0; i < this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages.length; i++) {
      if (this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs) {
        for (let j = 0; j <= this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.length; j++) {
          if (this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.length < parseInt(localStorage.getItem("tabLength"))) {
            this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.splice(localStorage.indexOfExcludedTab, 0, JSON.parse(localStorage.excludedTab)[0]);
          }

          if (this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j] != undefined)
            elementNameForExcludedTabNavigation = this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].excludedBranch;
          //Check if the same tab should be excluded from multiple branches
          if (elementNameForExcludedTabNavigation) {
            for (var z = 0; z < elementNameForExcludedTabNavigation.split(",").length; z++) {
              if (elementNameForExcludedTabNavigation.split(",")[z] === localStorage.getItem("selectedBranch")) {

                this.localStorage.setDataToLocalStorage("tabLength", this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.length);
                //  updatedArray = this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.splice(j, 1);
                if (j === 4) {
                  mytest = this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.splice(j, 1);
                  this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.splice(j - 1, 1);
                }
                else {
                  updatedArray = this.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.splice(j, 1);
                }

                if (mytest.length > 0) {
                  updatedArray = updatedArray.concat(mytest);
                }
                this.localStorage.setDataToLocalStorage("excludedTab", updatedArray);
                this.localStorage.setDataToLocalStorage("indexOfExcludedTab", j);
                this.localStorage.setDataToLocalStorage("excludeTab", 1);

                //  return null;
              }
            }
          }
          else {
            this.localStorage.setDataToLocalStorage("excludeTab", 0);
          }

        }
      }


    }
  }


  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');

    return svg;
  }

  private filterContractStatus() {


    if (!this.items) {
      return;
    } else {

      try {

        this.arrayFilterStatus = this.items.filter((x: any) => (this.status.includes(x.Status.trim()) && !this.typeOfContract.includes(x.ContractType)));

        this.arrayFilterStatusFree = this.items.filter((x: any) => x.Status.trim() == 'Ελεύθερο');


        ////add coverages to Group Health
        this.items.forEach(async (contract: any) => {

        if(contract.ContractType === 99)
        {
         let coverages=contract.Coverages;
           if(coverages.length==0 && !this.runGroupCoverages)
            {
                this.startEclaimsCoveragesTime = new Date().getTime();
                this.addGroupCoverages(contract);
                this.runGroupCoverages=true;
            }
            else
            {
          //    contract.Coverages=this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;
            }
        }
        });
        this.arrayFilterGroupHealth = this.items.filter((x: any) => this.typeOfContract.includes(x.ContractType));
        //end




        for (var i = 0; i < this.arrayFilterGroupHealth.length; i++) {
          if (this.isAndroidDevice && ( this.arrayFilterGroupHealth[i].jwt == undefined || this.arrayFilterGroupHealth[i].jwt == "") && this.arrayFilterGroupHealth[i].Participants != undefined && this.arrayFilterGroupHealth[i].Coverages){
            if( this.arrayFilterGroupHealth[i].Coverages.length>0){
              this.addToGoogleWallet(this.arrayFilterGroupHealth[i]);
            }
          }
          if(this.isIOSDevice && this.arrayFilterGroupHealth[i].passParams == undefined && this.arrayFilterGroupHealth[i].Participants != undefined && this.arrayFilterGroupHealth[i].Coverages != undefined ){
            if( this.arrayFilterGroupHealth[i].Coverages.length>0){
              this.addToAppleWallet(this.arrayFilterGroupHealth[i]);
            }
          }
        }

      } catch (error) {
      }

    }
  }


   async addGroupCoverages(item:any)
  {
    this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(item.ContractID);

    //* Remove action-eclaims-coverages */

    // const actName = 'action-eclaims-coverages';
    // const action = this.context.iceModel.actions[actName];
    // if (!!action) {
    // {
    // let executionRule1= action.executionRules[0];
    // await this.context.executeExecutionRule(executionRule1);

    // let executionRule2= action.executionRules[1];
    // await this.context.executeExecutionRule(executionRule2);

    // }

    // }
  }

  showDropdown(item: any) {
    item.map((Contracts: any) => {
      Contracts.Receipts.map((receipts: any) => {
        if (receipts.paymentCode) {
          this.ammountOfPaymentCodes++;
        }
      })
    })
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



  compareDates(date: Date, branch?: any) {

    if (branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      let diff = Math.abs(new Date(date).getTime() - new Date().getTime());
      let diffDays = Math.floor(diff / (1000 * 3600 * 24));
      if (diffDays < 30 && diffDays > 5)
        return 'info-alert';
      else if (diffDays <= 5)
        return 'bell-alert';

    }
    else {
      if (new Date(date) < new Date()) {
        return 'bell-alert';
      } else {
        return 'info-alert';
      }
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

  showBranch(item: any): string {
    if (
      item.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ" ||
      item.Branch == "ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ"
    ) {
      return "Λοιποί Κλάδοι Γενικών Ασφαλειών";
    } else {
      return item.Branch;
    }
  }
  showProductDescription(item: any): string {
    if (
      item.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ" ||
      item.Branch == "ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ"
    ) {
      return item.Branch;
    } else {
      return item.ProductDescritpion;
    }
  }

  showReceipts() {
    this.receiptsShown = !this.receiptsShown;

  }

  paymentCodeExists(i: string): boolean {
    //  && this.items[i].Receipts[0].PaymentType == 'ΕΛΤΑ'
    if (this.arrayFilterStatus[i].Receipts[0].ReceiptStatusDescription == 'Ανείσπρακτη' && this.arrayFilterStatus[i].Receipts[0].paymentCode != null) return true;
    return false;
  }

  redirectToPayment(i: any, index: any) {
    //returnUrl is for deep links
    this.context.iceModel.elements["policies.details.TotalUnpaidAmount"].setSimpleValue(i.Receipts[0].GrossPremium);
    this.router.navigate(['/ice/default/customerArea.motor/paymentManagement']
      , {
        queryParams: {
          paymentCode: i.Receipts[0].paymentCode,
          branch: i.Branch,
          index: i.ContractKey,
          returnUrl: index
        }
      });

  }

  get arrow() {
    return this.receiptsShown ? 'fa-angle-down' : 'fa-angle-up';
  }

  //Wallet implementation

  setMobileOperatingSystem() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (this.refreshStatus == 1) {
      ///Device Info

      if (this.deviceService.os == "mac" && !this.deviceService.isDesktop())
        this.context.iceModel.elements['is.ios.device'].setSimpleValue(true);

      if (this.deviceService.os == "android" && !this.deviceService.isDesktop())
        this.context.iceModel.elements['is.android.device'].setSimpleValue(true);
      ///salesforce issue for Mac devices
      if (this.deviceService.os == "mac" && this.deviceService.isMobile())
        this.context.iceModel.elements['eclaims.salesforce.script.error'].setSimpleValue(true);

      else if (this.deviceService.os == "mac" && this.deviceService.browser == "safari" && !this.deviceService.isMobile())
        this.context.iceModel.elements['eclaims.salesforce.script.error'].setSimpleValue(true);
    }

    this.isIOSDevice = this.context.iceModel.elements["is.ios.device"].getValue().forIndex(null);
    this.isAndroidDevice = this.context.iceModel.elements["is.android.device"].getValue().forIndex(null);

  }


  getPaymentTypeDescription(item: any): string {
    if (item.Receipts[0].PaymentType === "ΠΑΓΙΑ ΕΝΤΟΛΗ") {
        return item.Receipts[0].PaymentType + ' ***' + item.Receipts[0].AccountNumber;
    } else if (item.Receipts[0].PaymentType === "ΕΛΤΑ" || item.Receipts[0].PaymentType === "ΜΕΤΡΗΤΑ") {
        return "ΜΕΤΡΗΤΑ";
    } else if (item.Receipts[0].PaymentType === "ΛΟΓΑΡΙΑΣΜΟΣ ΔΑΝΕΙΟΥ") {
        return item.Receipts[0].PaymentType + ' ***' + item.Receipts[0].AccountNumber;
    } else if (item.Receipts[0].PaymentType === "ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ") {
        return item.Receipts[0].PaymentType + ' ***' + item.Receipts[0].CreditCardNumber;
    }
  }

  async addToAppleWallet(item: any): Promise<any> {
    this.passParams="";
    var passId = "";
    var paidPass = "";
    var paymentCode= "";
    var paymentDescription = "";
    var passStatus = item.Status.trim();
    if(item.IsInforce){
      passStatus="Εν Ισχύ";
    }else if(item.IsInforce == false){
      passStatus="Άκυρο";
    }
    if (item.ContractType != undefined && item.ContractType !== 99) {
      paymentDescription= this.getPaymentTypeDescription(item);
      var passRenwalDate = this.getNewDateFormat(this.getRenewalDate(item));
      var exiredDate = this.getRenewalDate(item);
      let unpaidPass = this.showUnpaidContractStatus(item);
      if (unpaidPass) {
        paidPass = "Ανεξόφλητο"
      } else {
        paidPass = this.showPaidContractStatus(item) ? "Εξοφλημένο" : "Ανεξόφλητο";
      }
      if(item.Receipts){
        if(item.Receipts[0].paymentCode){
          paymentCode = item.Receipts[0].paymentCode;
        }
      }
    }


    if (item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ') {

      if (item.ContractMotorDetails != undefined) {
        if(item.ContractKey && this.goldenRecordId != ""){
          this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, item.ContractMotorDetails.InsuredFullName, exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, "", item.ContractMotorDetails.VehicleLicensePlate, item.ContractKey, item.ContractIDType, JSON.stringify({}), this.goldenRecordId, "", paymentCode, this.mobilePhone);
        }else{
          item.passParams = "";
        }
        // this.passManagement.createApplePass(item.ContractID, item.ProductDescritpion.trim(), item.Branch, this.insuredName, item.ExpirationDate, passRenwalDate, item.paymentFrequencyToString, item.Status.trim(), paidPass, item.Receipts[0].PaymentType, this.dangerAdrress, item.ContractMotorDetails.VehicleLicensePlate, item.ContractKey, item.ContractIDType, JSON.stringify({}))
        //   .subscribe(response => {
        //     // let data = response.GeneratedToken;
        //     // //convert to blob
        //     // let blob: Blob = this.base64StringToBlob(data);
        //     // console.log(response);
        //     this.save(response);
        //     //open or download
        //     //this.open(blob, data);
        //     // this.save(blob);
        //   });
      }
    } else if (item.Branch === 'ΠΕΡΙΟΥΣΙΑΣ') {
      if (item.ContractPropertyCoolgenDetails != undefined) {
        if(item.ContractKey && this.goldenRecordId != ""){
          let address = item.ContractPropertyCoolgenDetails.PropertyStreet + "," + item.ContractPropertyCoolgenDetails.PropertyZipCode + "," + item.ContractPropertyCoolgenDetails.PropertyCity;
          this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, "", exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, address, "", item.ContractKey, item.ContractIDType, JSON.stringify({}), this.goldenRecordId, "", paymentCode, this.mobilePhone)
        }else{
          item.passParams = "";
        }
        // this.passManagement.createApplePass(item.ContractID, item.ProductDescritpion.trim(), item.Branch, this.insuredName, item.ExpirationDate, passRenwalDate, item.paymentFrequencyToString, item.Status.trim(), paidPass, item.Receipts[0].PaymentType, address, "-", item.ContractKey, item.ContractIDType, JSON.stringify({}))
        //   .subscribe(response => {
        //     // let data = response.GeneratedToken;
        //     // //convert to blob
        //     // let blob: Blob = this.base64StringToBlob(data);
        //     // console.log(response);
        //     this.save(response);
        //     //open or download
        //     //this.open(blob, data);
        //     // this.save(blob);
        //   });
      }
    } else if (item.Branch === 'ΥΓΕΙΑΣ' && item.Participants != undefined) {
      if(item.ContractKey && this.goldenRecordId != ""){
        this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch,item.ContractParticipants[0].LastName +" "+ item.ContractParticipants[0].FirstName, exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, "", "", item.ContractKey, item.ContractIDType, JSON.stringify(item.Participants), this.goldenRecordId, "", paymentCode, this.mobilePhone)
      }else{
        item.passParams = "";
      }
      // this.passManagement.createApplePass(item.ContractID, item.ProductDescritpion.trim(), item.Branch,item.ContractParticipants[0].LastName +" "+ item.ContractParticipants[0].FirstName, item.ExpirationDate, passRenwalDate, item.paymentFrequencyToString, item.Status.trim(), paidPass, item.Receipts[0].PaymentType, "-", "-", item.ContractKey, item.ContractIDType, JSON.stringify(item.Participants))
      //   .subscribe(response => {
      //     // let data = response.GeneratedToken;
      //     // //convert to blob
      //     // let blob: Blob = this.base64StringToBlob(data);
      //     // console.log(response);
      //     this.save(response);
      //     //open or download
      //     //this.open(blob, data);
      //     // this.save(blob);
      //   })
    } else if (item.ContractType === 99) {
      if (item.Participants != undefined && item.Coverages!=undefined) {
          //var resData = this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;
          if( item.Coverages.length>0)
        {
          //*** goldenRecordId=InsuredId from Kivos  *///
          item.Coverages.forEach((coverage: any) => {
            //ομαδικα Συμβολαια
                switch (coverage.CalculationMethodDescription) {
                  case "Ανάλωση":
                    if(coverage.InsuredId!=undefined && coverage.DependantRelation==undefined && this.goldenRecordId.indexOf('_') == -1)
                    {
                      this.goldenRecordId_InsuredId=this.goldenRecordId+"_"+coverage.InsuredId;
                      this.remainAmount = coverage.RemainingAmount;
                    }
                    if(coverage.DependantRelation != undefined && (coverage.DependantRelation.trim()=="Σύζυγος"|| coverage.DependantRelation.trim() =="ΣΥΖΥΓΟΣ" ||coverage.DependantRelation.trim() =="Τέκνο" || coverage.DependantRelation.trim() =="ΤΕΚΝΟ")){
                      item.Participants.forEach((participant: any) => {
                        if(participant.InsuredId != undefined){
                          if(participant.InsuredId == coverage.InsuredId){
                            participant.remainAmount= coverage.RemainingAmount;
                          }
                        }
                      })
                    }
                    break;
                  default:
                    break;
                }
              })
          if(item.ContractKey && this.goldenRecordId != "" && this.goldenRecordId_InsuredId != ""){
            this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, this.insuredName, item.ExpirationDate, item.NextPaymentDate, item.paymentFrequencyToString, passStatus, "", paymentDescription, "", "", item.ContractKey, item.ContractIDType, JSON.stringify(item.Participants), this.goldenRecordId_InsuredId, this.remainAmount, paymentCode, this.mobilePhone);
          }else{
            item.passParams = "";
          }
          // this.passManagement.createApplePass(item.ContractID, item.ProductDescritpion.trim(), item.Branch, this.insuredName, item.ExpirationDate, item.NextPaymentDate, item.paymentFrequencyToString, item.Status.trim(), "-", "-", "-", "99", item.ContractKey, item.ContractIDType, JSON.stringify(item.Participants))
          //   .subscribe(response => {
          //     // let data = response.GeneratedToken;
          //     // //convert to blob
          //     // let blob: Blob = this.base64StringToBlob(data);
          //     // console.log(response);
          //     this.save(response);
          //     //open or download
          //     //this.open(blob, data);
          //     // this.save(blob);
          //   })
      }
    }
    } else {
      if(item.ContractKey && this.goldenRecordId != ""){
        this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, item.ContractParticipants[0].LastName +" "+ item.ContractParticipants[0].FirstName, exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, "", "", item.ContractKey, item.ContractIDType, JSON.stringify({}), this.goldenRecordId, "", paymentCode, this.mobilePhone)
      }else{
        item.passParams = "";
      }
      // this.passManagement.createApplePass(item.ContractID, item.ProductDescritpion.trim(), item.Branch, item.ContractParticipants[0].LastName +" "+ item.ContractParticipants[0].FirstName, item.ExpirationDate, passRenwalDate, item.paymentFrequencyToString, item.Status.trim(), paidPass, item.Receipts[0].PaymentType, this.dangerAdrress, "-", item.ContractKey, item.ContractIDType, JSON.stringify({}))
      //   .subscribe(response => {
      //     // let data = response.GeneratedToken;
      //     // //convert to blob
      //     // let blob: Blob = this.base64StringToBlob(data);
      //     // console.log(response);
      //     this.save(response);
      //     //open or download
      //     //this.open(blob, data);
      //     // this.save(blob);
      //   })
    }

    //   this.passManagement.readApplePass()
    //   .subscribe(response=>{

    //   	let data = response.GeneratedToken;
    // 	  //convert to blob
    // 		let blob: Blob = this.base64StringToBlob(data);

    // 		//open or download
    // 	  //	this.open(blob, data);
    //    this.save(blob);

    //  });

  }






downloadPass(event: any){

  const target = event.target || event.srcElement || event.currentTarget;
  let box = target.parentElement.getBoundingClientRect();

  const pos= {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };

 this.spinnerService.loadingOn();
 this.spinnerService.setMessage('Δημιουργία Πάσου...');
 this.spinnerService.setTopPosition(pos.top);
 //this.spinnerService.setLeftPosition(pos.left);


  setTimeout(async () => {
    this.spinnerService.loadingOff();
    this.spinnerService.setMessage('');
  },4000);

 }


  open(blob: Blob, data: string) {
    let linkData = window.URL.createObjectURL(blob);
    window.open(linkData);
    setTimeout(function () { window.URL.revokeObjectURL(data), 100 });
  }

  private base64StringToBlob(data: string): Blob {
    if (data == undefined)
      throw new Error("Base 64 data is undefined");

    var binary = atob(data.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }

    return new Blob([view], { type: "application/vnd.apple.pkpass" });
  }

  async addToGoogleWallet(item: any): Promise<any> {
    // this.jwt = this.signToken();
    //item.jwt="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJodHRwOi8vbG9jYWxob3N0OjEzMzciLCJodHRwczovL3NhdmUtdG8tZ29vZ2xlLXBheS5zdGFja2JsaXR6LmlvIiwiaHR0cHM6Ly9ncGF5LWxpdmUtZGVtby1zdGFnaW5nLndlYi5hcHAiXSwiaXNzIjoic29jLWxveWFsdHlhcGktZGVtb0BhcHBzcG90LmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImxveWFsdHlPYmplY3RzIjpbeyJpZCI6IjMzODgwMDAwMDAwMTAwNDg2NjguYWxleF9hdF9leGFtcGxlLmNvbS1ncGF5LXJld2FyZHMifV19LCJpYXQiOjE2MTU1OTQ2NTF9.ZbEvdvkRh5nCuBq85bBEjR6216L7j6W10nyVWpPSAZlaSe8O6hJ_Ig-TrrvFtn7aHucMZr4cTmttONrlaFU-gFKMYHMEJFiZ-qv58sE9dNUdgUwTJWWzH8aukltM0pCBLHcpvLXTCpGk4PoXWM4q5H6WIjP1Jem8v1_YGdV6J_UBNyAGqJUE5XJnDgHl2qGFilTmF0el6EBFQLnF2PuIvyZcWXgbXgJLZfx-opepVAgODW5BQjQ7li8QoDl3ffdESO2-7qWVm-VoxLb8eDh3z3gRktPb8APh_VsaAb8mjvNCLk_SOPrQhpuph4b0Rg4xnt59u5c87_eD2kT3_IuHxw";
    var paidPass = "";
    var paymentCode = "";
    var paymentDescription = "";
    var passStatus = item.Status.trim();
    if(item.IsInforce){
      passStatus="Εν Ισχύ";
    }else if(item.IsInforce == false){
      passStatus="Άκυρο";
    }
    if (item.ContractType !== 99) {
      paymentDescription= this.getPaymentTypeDescription(item);
      var passRenwalDate = this.getNewDateFormat(this.getRenewalDate(item));
      var exiredDate = this.getRenewalDate(item);
      let unpaidPass = this.showUnpaidContractStatus(item);
      if (unpaidPass) {
        paidPass = "Ανεξόφλητο"
      } else {
        paidPass = this.showPaidContractStatus(item) ? "Εξοφλημένο" : "Ανεξόφλητο";
      }
      if(item.Receipts){
        if(item.Receipts[0].paymentCode){
          paymentCode = item.Receipts[0].paymentCode;
        }
      }
    }
    if (item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ') {

      if (item.ContractMotorDetails != undefined) {
        if(item.ContractKey && this.goldenRecordId != ""){
          this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, item.ContractMotorDetails.InsuredFullName, exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, "", item.ContractMotorDetails.VehicleLicensePlate, item.ContractKey, item.ContractIDType, JSON.stringify({}), this.goldenRecordId, "", paymentCode, this.mobilePhone)
        }else{
          this.arrayWithGoogleButtonsJWT[item.ContractKey] = "";
          this.arrayWithGooglePassesPayload[item.ContractKey] = "";
        }
        if(item.passParams){
        this.passManagement.oauth2GoogleAccess(item.passParams)
          .subscribe(response => {
            //item.jwt = response.GeneratedToken;
            if(this.arrayWithGoogleButtonsJWT[item.ContractKey] == undefined ){
              this.arrayWithGoogleButtonsJWT[item.ContractKey] = response.GeneratedToken;
              this.arrayWithGooglePassesPayload[item.ContractKey] = response.GeneratedPayload;
             // this.displayGoogleButtonsIfAllExist();
             }

          });
        }
      }


    } else if (item.Branch === 'ΠΕΡΙΟΥΣΙΑΣ') {
      if (item.ContractPropertyCoolgenDetails != undefined) {
        let address = item.ContractPropertyCoolgenDetails.PropertyStreet + "," + item.ContractPropertyCoolgenDetails.PropertyZipCode + "," + item.ContractPropertyCoolgenDetails.PropertyCity;
        if(item.ContractKey && this.goldenRecordId != ""){
          this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, "", exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, address, "", item.ContractKey, item.ContractIDType, JSON.stringify({}), this.goldenRecordId, "", paymentCode, this.mobilePhone)
        }else{
          this.arrayWithGoogleButtonsJWT[item.ContractKey] = "";
          this.arrayWithGooglePassesPayload[item.ContractKey] = "";
        }
        if(item.passParams){
        this.passManagement.oauth2GoogleAccess(item.passParams)
          .subscribe(response => {
           // item.jwt = response.GeneratedToken;
            if(this.arrayWithGoogleButtonsJWT[item.ContractKey] == undefined ){
              this.arrayWithGoogleButtonsJWT[item.ContractKey] = response.GeneratedToken;
              this.arrayWithGooglePassesPayload[item.ContractKey] = response.GeneratedPayload;
              //this.displayGoogleButtonsIfAllExist();
             }
          });
        }
      }

    } else if (item.Branch === 'ΥΓΕΙΑΣ' && item.Participants != undefined) {
      if(item.ContractKey && this.goldenRecordId != ""){
        this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch,item.ContractParticipants[0].LastName +" "+ item.ContractParticipants[0].FirstName, exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, "", "", item.ContractKey, item.ContractIDType, JSON.stringify(item.Participants), this.goldenRecordId, "", paymentCode, this.mobilePhone)
      }else{
        this.arrayWithGoogleButtonsJWT[item.ContractKey] = "";
        this.arrayWithGooglePassesPayload[item.ContractKey] = "";
      }
      if(item.passParams){
      this.passManagement.oauth2GoogleAccess(item.passParams)
        .subscribe(response => {
        //  item.jwt = response.GeneratedToken;
         if(this.arrayWithGoogleButtonsJWT[item.ContractKey] == undefined ){
          this.arrayWithGoogleButtonsJWT[item.ContractKey] = response.GeneratedToken;
          this.arrayWithGooglePassesPayload[item.ContractKey] = response.GeneratedPayload;
          //this.displayGoogleButtonsIfAllExist();
         }
        })
      }
      } else if (item.ContractType === 99) {

        if (item.Participants != undefined && item.Coverages!=undefined) {
         // var resData = this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;
          //console.log("item.GroupHealthRemainingValue"+ resData);
          if( item.Coverages.length>0)
          {
            item.Coverages.forEach((coverage: any) => {
              //ομαδικα Συμβολαια
                  switch (coverage.CalculationMethodDescription) {
                    case "Ανάλωση":
                      if(coverage.InsuredId!=undefined && coverage.DependantRelation==undefined && this.goldenRecordId.indexOf('_') == -1)
                      {
                        this.goldenRecordId_InsuredId = this.goldenRecordId+"_"+coverage.InsuredId;
                        this.remainAmount = coverage.RemainingAmount;
                      }
                      if(coverage.DependantRelation != undefined && (coverage.DependantRelation.trim()=="Σύζυγος"|| coverage.DependantRelation.trim() =="ΣΥΖΥΓΟΣ" ||coverage.DependantRelation.trim() =="Τέκνο" || coverage.DependantRelation.trim() =="ΤΕΚΝΟ")){
                        item.Participants.forEach((participant: any) => {
                          if(participant.InsuredId != undefined){
                            if(participant.InsuredId == coverage.InsuredId){
                              participant.remainAmount= coverage.RemainingAmount;
                            }
                          }
                        })
                      }
                      break;
                    default:
                      break;8
                  }
            })
            if(item.ContractKey && this.goldenRecordId != "" && this.goldenRecordId_InsuredId != ""){
              this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, this.insuredName, item.ExpirationDate, item.NextPaymentDate, item.paymentFrequencyToString, passStatus, "", "", "", "", item.ContractKey, item.ContractIDType, JSON.stringify(item.Participants),  this.goldenRecordId_InsuredId, this.remainAmount, paymentCode, this.mobilePhone);
            }else{
              this.arrayWithGoogleButtonsJWT[item.ContractKey] = "";
              this.arrayWithGooglePassesPayload[item.ContractKey] = "";
            }
            if(item.passParams){
            this.passManagement.oauth2GoogleAccess(item.passParams)
             .subscribe(response => {
                // item.jwt = response.GeneratedToken;
                if(this.arrayWithGoogleButtonsJWT[item.ContractKey] == undefined ){
                  this.arrayWithGoogleButtonsJWT[item.ContractKey] = response.GeneratedToken;
                  this.arrayWithGooglePassesPayload[item.ContractKey] = response.GeneratedPayload;
                  //this.displayGoogleButtonsIfAllExist();
                }
            })
          }
          }
      }

      } else {
        if(item.ContractKey && this.goldenRecordId != ""){
          this.setPassParams(item, item.ContractID, item.ProductDescritpion.trim(), item.Branch, item.ContractParticipants[0].LastName +" "+ item.ContractParticipants[0].FirstName, exiredDate, passRenwalDate, item.paymentFrequencyToString, passStatus, paidPass, paymentDescription, "", "", item.ContractKey, item.ContractIDType, JSON.stringify({}), this.goldenRecordId, "", paymentCode, this.mobilePhone)
        }else{
          this.arrayWithGoogleButtonsJWT[item.ContractKey] = "";
          this.arrayWithGooglePassesPayload[item.ContractKey] = "";
        }
        if(item.passParams){
        this.passManagement.oauth2GoogleAccess(item.passParams)
          .subscribe(response => {
          // item.jwt = response.GeneratedToken;

            if(this.arrayWithGoogleButtonsJWT[item.ContractKey] == undefined){
              this.arrayWithGoogleButtonsJWT[item.ContractKey] =response.GeneratedToken;
              this.arrayWithGooglePassesPayload[item.ContractKey] = response.GeneratedPayload;
              //this.displayGoogleButtonsIfAllExist();
            }
          })
        }
    }

  }

  onSuccess = (event: CustomEvent, item: any): void => {
    this.passManagement.googlePassUpdate( this.arrayWithGooglePassesPayload[item.ContractKey]).subscribe(response => {
     console.log("update " + response.update);

    });;
    console.log('success');


  };

  onFailure = (event: CustomEvent<Error>): void => {
    console.error('failure', event.detail);
  };

  private async setPassParams(item:any, ContractId: string, ProductDescription: string, Branch: string, insuredName: string, ExpirationDate: string, NextPaymentDate: string, paymentFrequencyToString: string, Status: string, paymentStatus: string, PaymentType: string, dangerAdrress: any, VehicleLicensePlate: string, ContractKey: string, ContractIDType: string, participants: any, GoldenRecordId: string, remainAmount: string, paymentCode: any, mobilePhone: string) {

    item.passParams=  encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify({
        ContractId,
        ProductDescription,
        Branch,
        insuredName,
        ExpirationDate,
        NextPaymentDate,
        paymentFrequencyToString,
        Status,
        paymentStatus,
        PaymentType,
        dangerAdrress,
        VehicleLicensePlate,
        ContractKey,
        ContractIDType,
        participants,
        GoldenRecordId,
        remainAmount,
        paymentCode,
        mobilePhone
      }),  environment.decryption_code).toString());


  }

//   displayGoogleButtonsIfAllExist(){
//   let counter =0
//   for(let key in this.arrayWithGoogleButtonsJWT){
//     counter++;
//   }
//   if(counter == this.contractsLength){
//    // this.showGoogleBtn = true;
//   }
// }



 ///end Wallet


  //This is for greenCard
  async goToGreenCard(plate: any) {

    this.router.navigate(['/ice/default/customerArea.motor/greenCard']
      , {
        queryParams: {
          plate: plate,
        }
      });

    // this.context.iceModel.elements['greencard.refresh.status'].setSimpleValue(false);  //trigger the action for green card
    let action = this.context.iceModel.actions['action-greencard-get-token'];
    for (let i = 0; i < action.executionRules.length; i++) {
      await action.executionRules[i].execute();

    }

  }

  async getPdfLink() {
    try {
      this.showSpinnerBtn = true;
      this.context.iceModel.elements['statement.pdf.base64'].setSimpleValue(null);
      this.context.iceModel.elements['daf.url'].setSimpleValue(this.context.dataStore.data.Dafs[this.context.dataStore.data.Dafs.length - 1].url);
      const action = this.context.iceModel.actions['actionGetDafPdf'];
      if (action) {
        await action.executionRules[0].execute();
         await action.executionRules[1].execute();

        this.showSpinnerBtn = false;
      }
    } catch (error) {
      this.showSpinnerBtn = false;
      console.error('MotorCoversEditorCardComponent getPdfLink', error);
    }

  }

  getRenewalDate(item: any): any {
    if (item.Receipts[0].ReceiptStatusDescription === 'Ανείσπρακτη') {
      let arrayFilterReceiptStatus = item.Receipts.filter((x: any) => x.ReceiptStatusDescription.trim() == 'Ανείσπρακτη' && x.GrossPremium > 0);
      let date;
      if (arrayFilterReceiptStatus.length == 0)     //bypass in case unpaid receipts
        date = new Date();

      date = arrayFilterReceiptStatus.length > 1 ? arrayFilterReceiptStatus[arrayFilterReceiptStatus.length - 1].StartDate : arrayFilterReceiptStatus[0].StartDate;
      //return this.getNewDateFormat(date);
      return date;
    }
   // return this.getNewDateFormat(item.Receipts[0].EndDate);
   return item.Receipts[0].EndDate;
  }

  getNewDateFormat = (date: any): string => {

    var oldDateFormat = new Date(date);
    var dd = oldDateFormat.getDate();
    var mm = oldDateFormat.getMonth() + 1;
    var yyyy = oldDateFormat.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }


  unpaidReceipts(item: any): any {
    let sum = 0

    let arrayFilterReceiptStatus = item.Receipts.filter((x: any) => x.ReceiptStatusDescription.trim() == 'Ανείσπρακτη' && x.GrossPremium > 0);

    if (arrayFilterReceiptStatus.length == 0)     //bypass in case unpaid receipts
      return new Date();

    return arrayFilterReceiptStatus.length > 1 ? arrayFilterReceiptStatus[arrayFilterReceiptStatus.length - 1].StartDate : arrayFilterReceiptStatus[0].StartDate;
  }



  showUnpaidContractStatus(item: any): boolean {
    for (const receipt of item.Receipts.filter((x: any) => x.GrossPremium > 0)) {
      if (
        receipt.ReceiptTypeDescription.trim() === 'Δόση' ||
        receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη'
      ) {
        if (
          (
            receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
            item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' &&
            (receipt.PaymentType == 'ΜΕΤΡΗΤΑ' || receipt.PaymentType == 'ΕΛΤΑ') &&
            this.calculateDiffOfDays(receipt.StartDate) <= 5) ||
          (receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
            item.Branch !== 'AΥΤΟΚΙΝΗΤΩΝ' &&
            this.compareDates(this.unpaidReceipts(item)) == 'bell-alert' &&
            (receipt.PaymentType == 'ΜΕΤΡΗΤΑ' || receipt.PaymentType == 'ΕΛΤΑ')) ||
          (receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
            this.compareDates(this.unpaidReceipts(item)) == 'bell-alert' &&
            (receipt.PaymentType == 'ΠΑΓΙΑ ΕΝΤΟΛΗ' ||
              receipt.PaymentType == 'ΛΟΓΑΡΙΑΣΜΟΣ ΔΑΝΕΙΟΥ' ||
              receipt.PaymentType == 'ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ'))
        ) {
          return true;
        } else {
          return false;
        }

        break;
      }
    }
  }

  showPaidContractStatus(item: any): boolean {
    for (const receipt of item.Receipts.filter((x: any) => x.GrossPremium > 0)) {
      if (
        receipt.ReceiptTypeDescription.trim() === 'Δόση' ||
        receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη'
      ) {
        if (
          (receipt.ReceiptStatusDescription == 'Εξοφλημένη' &&
            (this.calculateDiffOfDays(receipt.EndDate) > 30 || this.calculateDiffOfDays(receipt.EndDate) < 30)) ||
          (receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
            item.Branch !== 'ΑΥΤΟΚΙΝΗΤΩΝ' &&
            this.compareDates(this.unpaidReceipts(item)) == 'info-alert' &&
            this.calculateDiffOfDays(this.unpaidReceipts(item)) <= 30) ||
          (this.calculateDiffOfDays(receipt.StartDate) > 30 &&
            this.compareDates(this.unpaidReceipts(item)) == 'info-alert') ||
          ((
            item.Branch === 'ΠΕΡΙΟΥΣΙΑΣ' ||
            item.Branch === 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ' ||
            item.Branch === 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ') &&
            this.compareDates(this.unpaidReceipts(item)) == 'info-alert' &&
            this.calculateDiffOfDays(receipt.EndDate) < 30) ||
          (
            receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
            item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' &&
            this.calculateDiffOfDays(receipt.StartDate) < 30 &&
            this.calculateDiffOfDays(receipt.StartDate) > 5)
        ) {
          return true;
        } else {
          return false;
        }

        break;
      }
    }
  }

  contactPaidMessage(item: any): string {
    for (const receipt of item.Receipts.filter((x: any) => x.GrossPremium > 0)) {
      if (
        receipt.ReceiptTypeDescription.trim() === 'Δόση' ||
        receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη'
      ) {
        if (receipt.ReceiptStatusDescription == 'Εξοφλημένη' && this.calculateDiffOfDays(receipt.EndDate) > 30) {
          return 'paidRule1';
        } else if (
          receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
          this.compareDates(this.unpaidReceipts(item)) == 'info-alert' &&
          this.calculateDiffOfDays(this.unpaidReceipts(item)) > 30
        ) {
          return 'paidRule2';
        }

        break;
      }
    }
  }

  contractRenewalMessage(item: any): string {
    for (const receipt of item.Receipts.filter((x: any) => x.GrossPremium > 0)) {
      if (receipt.ReceiptTypeDescription.trim() === 'Δόση' || receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη') {
        if (
          receipt.ReceiptStatusDescription == 'Εξοφλημένη' &&
          this.calculateDiffOfDays(receipt.EndDate) < 30 &&
          !(
            item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' ||
            item.Branch === 'ΠΕΡΙΟΥΣΙΑΣ' ||
            item.Branch === 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ' ||
            item.Branch === 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ'
          )
        ) {
          return 'contractRenewalRule1';
        }

        else if (
          item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' &&                                       ///specific addition for Renewals in Motor branch
          receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
          this.compareDates(receipt.EndDate) == 'info-alert' &&
          this.calculateDiffOfDays(receipt.StartDate) < 30 &&
          this.calculateDiffOfDays(receipt.StartDate) > 5
        ) {
          return 'contractRenewalRule3';
        }

        else if (
          item.Branch != 'ΑΥΤΟΚΙΝΗΤΩΝ' &&
          receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
          this.compareDates(this.unpaidReceipts(item)) == 'info-alert' &&
          this.calculateDiffOfDays(this.unpaidReceipts(item)) < 30
        ) {
          return 'contractRenewalRule2';
        }

        else if (
          (
            item.Branch === 'ΠΕΡΙΟΥΣΙΑΣ' ||
            item.Branch === 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ' ||
            item.Branch === 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ') &&
          this.compareDates(receipt.EndDate) == 'info-alert' &&
          this.calculateDiffOfDays(receipt.EndDate) < 30
        ) {
          return 'contractRenewalRule3';
        }



        break;
      }
    }
  }

  unsuccessfullBillingMessage(item: any): string {
    for (const receipt of item.Receipts.filter((x: any) => x.GrossPremium > 0)) {
      if (
        receipt.ReceiptTypeDescription.trim() === 'Δόση' ||
        receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη'
      ) {
        if (
          receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
          this.compareDates(this.unpaidReceipts(item)) == 'bell-alert' &&
          (receipt.PaymentType == 'ΠΑΓΙΑ ΕΝΤΟΛΗ' ||
            receipt.PaymentType == 'ΛΟΓΑΡΙΑΣΜΟΣ ΔΑΝΕΙΟΥ' ||
            receipt.PaymentType == 'ΠΙΣΤΩΤΙΚΗ ΚΑΡΤΑ')
        ) {
          return 'unsuccessfullBilling';
        }

        break;
      }
    }
  }

  contractNoPaymentMessage(item: any): string {
    for (const receipt of item.Receipts.filter((x: any) => x.GrossPremium > 0)) {
      if (
        receipt.ReceiptTypeDescription.trim() === 'Δόση' ||
        receipt.ReceiptTypeDescription.trim() === 'Πρώτη Απόδειξη'
      ) {

        ///case motor
        if (
          receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
          (receipt.PaymentType == 'ΜΕΤΡΗΤΑ' || receipt.PaymentType == 'ΕΛΤΑ') &&
          this.calculateDiffOfDays(this.unpaidReceipts(item)) <= 5 &&
          item.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ'
        ) {
          return 'contractNoPayment';
        }


        if (
          receipt.ReceiptStatusDescription == 'Ανείσπρακτη' &&
          this.compareDates(this.unpaidReceipts(item)) == 'bell-alert' &&
          (receipt.PaymentType == 'ΜΕΤΡΗΤΑ' || receipt.PaymentType == 'ΕΛΤΑ')
        ) {
          return 'contractNoPayment';
        }

        break;
      }
    }
  }
}

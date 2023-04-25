import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  IceSectionComponent,
  SectionComponentImplementation
} from "@impeo/ng-ice";
import * as _ from "lodash";
import { environment } from "../../../../environments/environment";
import { LocalStorageService } from "../../../services/local-storage.service";
import { PassManagementService } from '../../../services/pass-management.service';
import { catchError, first, takeUntil, tap } from "rxjs/operators";
import { Subject, Subscription, throwError } from "rxjs";
import { IndexedValue } from '@impeo/ice-core';
import { ActivatedRoute, RouterEvent } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { DecodeJWTService } from '../../../services/decode-jwt.service';


@Component({
  selector: "app-amendments-requests",
  templateUrl: "./amendments-requests.component.html",
  styleUrls: ["./amendments-requests.component.scss"]
})
export class AmendmentsRequestsComponent extends SectionComponentImplementation implements OnInit, OnDestroy {
  header: string;
  innerheader: string;
  data: any[] = [];
  filteredData: any[] = [];
  isLooped: boolean;
  showData: any;
  dataWithNoteURLs: any[] = [];
  refreshStatus: any;
  showRequests: boolean = false;
  returnUrl: string;
  insuredName: string;
  partnerName: boolean;

  contentMotorLoaded: boolean = false;
  contentPropertyLoaded: boolean = false;
  contentLifeLoaded: boolean =false;
  contentHealthLoaded: boolean =false;
  contentFinanceLoaded: boolean =false;

  contentPropertyData: any[] = [];
  contentMotorData: any[] = [];
  contentHealthData: any[] = [];
  contentLifeData: any[] = [];
  contentFinanceData: any[] = [];

  //showExtraPaymentField: boolean =false;
  codes: any[] = [];
  paymentType: string;

  items: any[] = [];

  private destroy$ = new Subject<void>();
  private writeFromOtherForRefreshEndedSubs: Subscription;
  private subscription = new Subscription();


  timer: NodeJS.Timeout;

  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private passManagement: PassManagementService,
    private decodeJWT: DecodeJWTService
  ) {
    super(parent);
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; float: right; fill: #383b38");
    svg.setAttribute("width", "29");
    svg.setAttribute("height", "30");

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    return svg;
  }

  ngOnInit() {

    this.showRequests = true;
    this.context.iceModel.elements["skeleton.show"].setSimpleValue(true);   //init

    this.context.iceModel.elements["skeleton.show"].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe((value: IndexedValue) => {
      if (!value.element.getValue().forIndex(null))
      {
        this.contentMotorLoaded = true;
        this.contentPropertyLoaded = true;
        this.contentHealthLoaded = true;
        this.contentLifeLoaded= true;
        this.contentFinanceLoaded= true;
      }
    },
    (err: any) =>
    console.error(
      'AmendmentsRequestsComponent:skeleton.show',
      err
    )
    );

    this.getData();

    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");

    this.context.$actionEnded
    .pipe(takeUntil(this.destroy$))
    .subscribe((actionName: string) => {
      if (actionName.includes("actionGetParticipantsHomePage")) {
        this.getData();
        ///Finalize
        this.contentMotorLoaded = true;
        this.contentPropertyLoaded = true;
        this.contentHealthLoaded = true;
        this.contentLifeLoaded= true;
        this.contentFinanceLoaded= true;
      }

    });



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


    this.header = this.iceModel.elements[this.recipe["header"]].recipe.label.ResourceLabelRule.key.slice(
      1,
      this.iceModel.elements[this.recipe["header"]].recipe.label.ResourceLabelRule.key.length
    );


    this.innerheader = this.iceModel.elements[this.recipe["innerheader"]].recipe.label.ResourceLabelRule.key.slice(
      1,
      this.iceModel.elements[this.recipe["innerheader"]].recipe.label.ResourceLabelRule.key.length
    );


    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    this.insuredName = this.decodeJWT.decodedToken.name;
  }

  ngOnDestroy() {

    this.destroy$.next();
    this.destroy$.complete();
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
      } catch(err)
      {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  private getData() {
    this.data = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    //Set

    if (!!this.data)
    {

      this.contentMotorData=this.contentPropertyData=this.contentLifeData=this.contentHealthData=this.contentFinanceData=[];

      for (const contract of this.data)
      {
        if (contract.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ' && !!contract.ContractMotorDetails)
        {

            this.contentMotorData=[...this.contentMotorData,contract];
            this.context.iceModel.elements["skeleton.show"].setSimpleValue(false);
            //Deeplinks
            this.route.queryParams.subscribe((params: any) => {
              this.returnUrl = params["returnUrl"] || '//';
              if(this.returnUrl != '//' && this.returnUrl != undefined){
                var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
                var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
                if(decodedQuery.contractKeyDeepLink == contract.ContractKey){
                  this.requestAmendment(contract);
                };
              }
            })
            // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '//';
            // if(this.returnUrl !=='//' && this.returnUrl != undefined){
            //   var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
            //   var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
            //   if(decodedQuery.contractKeyDeepLink == contract.ContractKey){
            //     this.requestAmendment(contract);
            //   };
            // }
        }
        else if (contract.Branch === 'ΠΕΡΙΟΥΣΙΑΣ')
        {
          if(!!contract.ContractPropertyCoolgenDetails)
          {
           this.contentPropertyData=[...this.contentPropertyData,contract];
           this.context.iceModel.elements["skeleton.show"].setSimpleValue(false);
           //Deeplinks
           this.route.queryParams.subscribe((params: any) => {
            this.returnUrl = params["returnUrl"] || '//';
            if(this.returnUrl != '//' && this.returnUrl != undefined){
                var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
                var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
                if(decodedQuery.contractKeyDeepLink == contract.ContractKey){
                  this.requestAmendment(contract);
                };
              }
            })
          }
        }else if(contract.Branch === 'ΖΩΗΣ' && (contract.ContractType == 3 || contract.ContractType == 1)){

            this.contentLifeData=[...this.contentLifeData,contract];
            this.context.iceModel.elements["skeleton.show"].setSimpleValue(false);
            //Deeplinks
            this.route.queryParams.subscribe((params: any) => {
             this.returnUrl = params["returnUrl"] || '//';
             if(this.returnUrl != '//' && this.returnUrl != undefined){
                 var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
                 var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
                 if(decodedQuery.contractKeyDeepLink == contract.ContractKey){
                   this.requestAmendment(contract);
                 };
               }
             })

      }else if(contract.Branch === 'ΥΓΕΙΑΣ' && contract.ContractType == 1){

          this.contentHealthData=[...this.contentHealthData,contract];
          this.context.iceModel.elements["skeleton.show"].setSimpleValue(false);
          //Deeplinks
          this.route.queryParams.subscribe((params: any) => {
           this.returnUrl = params["returnUrl"] || '//';
           if(this.returnUrl != '//' && this.returnUrl != undefined){
               var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
               var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
               if(decodedQuery.contractKeyDeepLink == contract.ContractKey){
                 this.requestAmendment(contract);
               };
             }
           })

        }else if(contract.Branch === 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ' && (contract.ContractType == 1 || contract.ContractType == 2)){

          this.contentFinanceData=[...this.contentFinanceData,contract];
          this.context.iceModel.elements["skeleton.show"].setSimpleValue(false);
          //Deeplinks
          this.route.queryParams.subscribe((params: any) => {
           this.returnUrl = params["returnUrl"] || '//';
           if(this.returnUrl != '//' && this.returnUrl != undefined){
               var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
               var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
               if(decodedQuery.contractKeyDeepLink == contract.ContractKey){
                 this.requestAmendment(contract);
               };
             }
           })

        }

      }

    }

  }

  getMotorContentLoaded(){
    return this.contentMotorLoaded;
  }
  getPropertyContentLoaded(){
    return this.contentPropertyLoaded;
  }
  getLifeContentLoaded(){
    return this.contentLifeLoaded;
  }
  getHealthContentLoaded(){
    return this.contentHealthLoaded;
  }
  getFinanceContentLoaded(){
    return this.contentFinanceLoaded;
  }


  async requestAmendment(row: any) {



      //AgentInfo part for SalesChannel Condition
      for (var i = 0; i < this.data.length; i++) {
        if(this.data[i].AgentInfo != undefined ){
          if (
            this.data[i].AgentInfo.ChannelDescription === SalesChannel.HHLMortgage ||
            this.data[i].AgentInfo.ChannelDescription === SalesChannel.HHLConsumer ||
            this.data[i].AgentInfo.ChannelDescription === SalesChannel.Network ||
            this.data[i].AgentInfo.ChannelDescription === SalesChannel.Open24Branches ||
            this.data[i].AgentInfo.ChannelDescription === SalesChannel.Open24Europhone ||
            this.data[i].AgentInfo.ChannelDescription === SalesChannel.Open24Telemarketing
          ) {
            this.partnerName = true;
          }else{
            this.partnerName = false;
          }
        }else
        {
         this.partnerName = true;
        }
      }
    ///find selected contract branch....it should be placed in home
    ////////////////////
    if (row.Branch == "ΥΓΕΙΑΣ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(1);

      this.iceModel.elements["amendments.step2"].setSimpleValue(false);
      this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);    //trigger

      this.iceModel.elements["amendments.health.category.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.health.subcategory.dropdown"].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
      this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
      this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
      this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractIndividualDetails.PaymentType);
      this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
      this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
      this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);

      for(let participant of row.Participants){
        if(participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
          console.log("payment type = " , row.ContractIndividualDetails.PaymentType)
          if(row.ContractIndividualDetails.PaymentType === "ΕΛΤΑ"){
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) {
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else{
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

            }
          }else if( row.ContractIndividualDetails.PaymentType === "ΜΕΤΡΗΤΑ"){
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) {
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);


            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);


            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else{
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
            }
          }else{
            if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) {
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else{
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
            }
          }

        }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
          if( row.ContractIndividualDetails.PaymentType === "ΕΛΤΑ" ){
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName == false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);

            }
          }else if(row.ContractIndividualDetails.PaymentType === "ΜΕΤΡΗΤΑ"){
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName == false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);

            }
          }else{
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName == false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);

            }
          }

        }
      }

    }
    else if (row.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ")
    {
      let indexOfContractIDType = row.ContractType
      if (indexOfContractIDType == "2")
      {

        /// start-contract cover ....run action for contract covers
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(11);
        this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);
        ///end

        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
        if(row.ContractIndividualDetails != undefined){
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractIndividualDetails.PaymentType);
          this.paymentType = row.ContractIndividualDetails.PaymentType;
        }else{
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.PensionContractDetails.PaymentType);
          this.paymentType = row.PensionContractDetails.PaymentType;
        }
        this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);


        let showExtraPaymentField = await this.showExtraPaymentField();
        for(let participant of row.Participants){
          if(participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" )
            {
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }

            }else if(this.paymentType === "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{

              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }


          }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" ){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else if(this.paymentType === "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }

          }
        }
      }
      else
      {
        /// start-contract cover ....run action for contract covers
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(2);
        this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);
        ///end

        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
        if(row.ContractIndividualDetails != undefined){
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractIndividualDetails.PaymentType);
          this.paymentType = row.ContractIndividualDetails.PaymentType;

        }else{
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.PensionContractDetails.PaymentType);
          this.paymentType = row.PensionContractDetails.PaymentType;
        }
        this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);

        let showExtraPaymentField = await this.showExtraPaymentField();
        for(let participant of row.Participants){
          if(participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" )
            {
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }

            }else if(this.paymentType === "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{

              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }


          }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" ){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else if(this.paymentType === "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }

          }
        }
      }
    }
    else if (row.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      //Initialize the related elements
      this.iceModel.elements["amendments.step2"].setSimpleValue(false);
      this.iceModel.elements["amendments.motor.category.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.motor.subcategory.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.mileage.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
      this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
       this.iceModel.elements["amendments.upload.file"].setSimpleValue(false);

      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(3);
      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString);
      this.iceModel.elements["amendments.plate.id.value"].setSimpleValue(row.ContractMotorDetails.VehicleLicensePlate);
      this.iceModel.elements["amendments.frequencyOfPayment.current.value"].setSimpleValue(row.paymentFrequencyToString);
      this.iceModel.elements["amendments.capital.current.value"].setSimpleValue(this.getCurrencyFormat(row.ContractMotorDetails.VehicleMarketValue));
      this.iceModel.elements["amendments.largest.capital.current.value"].setSimpleValue(this.getCurrencyFormat(row.ContractMotorDetails.VehicleMarketValue));
      this.iceModel.elements["amendments.driver.current.dob.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverBirthDate));
      this.iceModel.elements["amendments.intermediate.dob"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverBirthDate));
      this.iceModel.elements["amendments.driver.licence.current.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverPermitYear));
      this.iceModel.elements["amendments.intermediate.licence"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverPermitYear));
      this.iceModel.elements["policies.details.Bdriver"].setSimpleValue(row.ContractMotorDetails.DriverBYearsOfLicence);
      this.iceModel.elements["policies.details.Cdriver"].setSimpleValue(row.ContractMotorDetails.DriverCYearsOfLicence);
      //This is for second driver if exists
      if (row.ContractMotorDetails.DriverBYearsOfLicence != 0) {
        this.iceModel.elements["amendments.second.driver.dob.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver2BirthDate));
        this.iceModel.elements["amendments.second.driver.date.licence.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver2PermitYear));
      }
      //This is for third driver if exists
      if (row.ContractMotorDetails.DriverCYearsOfLicence != 0) {
        this.iceModel.elements["amendments.third.driver.dob.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver3BirthDate));
        this.iceModel.elements["amendments.third.driver.date.licence.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver3PermitYear));
      }
      var renewalDate = row.ExpirationDate;
      if (renewalDate != null && this.calculateDiffOfDays(renewalDate)) {
        this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
      }
    }
    else if (row.Branch == "ΠΕΡΙΟΥΣΙΑΣ") {
      this.iceModel.elements["amendments.step2"].setSimpleValue(false);
      this.iceModel.elements["amendments.property.category.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.subcategory.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(null);
      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString);
      this.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
      this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
      this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(13);
      var renewalDate = row.ExpirationDate;
      if (renewalDate != null && this.calculateDiffOfDays(renewalDate)) {
        this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
      }


    }
    else if (row.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(6);
    }
    else if (row.Branch == "ΣΚΑΦΩΝ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(7);
    }
    else if (row.Branch == "ΑΣΤΙΚΗ ΕΥΘΥΝΗ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(8);
    }
    else if (row.Branch == "ΖΩΗΣ") {
      let indexOfContractIDType = row.ContractType;
      if (indexOfContractIDType == "6") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(12);
      }
      else if (indexOfContractIDType == "3") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(15);

        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);
        this.iceModel.elements["amendments.life.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.life.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractMortgageDetails.PaymentType);
        this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
        for(let participant of row.Participants){
          if( participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(row.ContractMortgageDetails.PaymentType === "ΕΛΤΑ" ){
              if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4)
              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }

            }else if(row.ContractMortgageDetails.PaymentType === "ΜΕΤΡΗΤΑ"){
              if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5)
              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }
            }else{
              if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5)
              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }
            }

          }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(row.ContractMortgageDetails.PaymentType === "ΕΛΤΑ"){
              if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }

            }else if(row.ContractMortgageDetails.PaymentType === "ΜΕΤΡΗΤΑ"){
              if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }
            }else{
              if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }
            }

          }

        }

      }
      else if (indexOfContractIDType == "7") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(14);
      }
      else if (indexOfContractIDType == "4") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(16);
      }
      else if (indexOfContractIDType == "5") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(17);
      }
      else {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(9);
      }
    }
    else {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(5);
    }

    /////////////////////// End
    this.iceModel.elements['amendments.details.ProductName'].setSimpleValue(row.ProductDescritpion);
    this.iceModel.elements['amendments.details.PolicyNumberHeader'].setSimpleValue(row.ContractKey);
    let action = this.context.iceModel.actions['actionRedirectToAmendmentDetails'];
    if (action != null && row.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
     action.executionRules[0].execute();
    }
    let actionHome =  this.context.iceModel.actions['actionRedirectToAmendmentHomeDetails'];
    if (actionHome != null && row.Branch == "ΠΕΡΙΟΥΣΙΑΣ" ){
      actionHome.executionRules[0].execute();
    }
    let actionHealth =  this.context.iceModel.actions['actionRedirectToAmendmentHealthDetails'];
    if (actionHealth != null && row.Branch == "ΥΓΕΙΑΣ"){
      actionHealth.executionRules[0].execute();
    }
    let actionLife =  this.context.iceModel.actions['actionRedirectToAmendmentLifeDetails'];
    if (actionLife != null &&  row.Branch == "ΖΩΗΣ"){
      actionLife.executionRules[0].execute();
    }
    let actionFinance =  this.context.iceModel.actions['actionRedirectToAmendmentFinanceDetails'];
    if (actionFinance != null &&  row.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"){
       actionFinance.executionRules[0].execute();
    }

    //let partnerName = false;


  }

  getYear(elementDate: any) {
    var date = new Date(elementDate);
    return date.getFullYear();
  }

  calculateDiffOfDays(renewalDate: any) {
    var showInput: boolean = false;
    let diff = Math.abs(new Date(renewalDate).getTime() - new Date().getTime());
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));
    console.log("Diff days", diffDays);
    if (diffDays > 10 && diffDays < 60) {
      showInput = true;
    }
    return showInput;
  }

  getCurrencyFormat(value: number) {
    let currencySign: string = '€ ';
    let amount = Intl.NumberFormat('EUR').format(value);
    let amountFixed = amount.replace(/[,.]/g, m => (m === ',' ? '.' : ','))
    return currencySign + amountFixed;
  }

  async showExtraPaymentField(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
    let showExtraPaymentValue =false;
      ////SOS!!!!!!!!!! Bug fix
    this.timer = setInterval(() => {
    this.codes = this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;
      if(this.codes != undefined && this.codes.length>0)
      {
        let basicCoverages = ['10403', '10406', '10407', '10433', '10434', '10436', '10437', '10443', '10451', '10522', '10532', '10541', '10549', '70036', '70037', '70056', '70059', '70065' , '70066' , '70069' , '70070'];
        for(let coverage of  this.codes){
          if(basicCoverages.includes(coverage.coverKey)){
            showExtraPaymentValue = true;
          }
        }
        clearInterval(this.timer)
        resolve(showExtraPaymentValue);
        return;
      }
      else if(this.codes.length==0)
      {
        clearInterval(this.timer)
        resolve(showExtraPaymentValue);
        return;
      }
    }, 100)
    });
    ////End SOS

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

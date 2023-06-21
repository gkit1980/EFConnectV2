import { environment } from "@insis-portal/environments/environment";
import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { PageComponentImplementation } from "@impeo/ng-ice";
import { IceSection } from "@impeo/ice-core";
import { CommunicationService } from "@insis-portal/services/communication.service";
import { IndexedValue } from "@impeo/ice-core";
import { ModalService } from "@insis-portal/services/modal.service";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { PassManagementService } from '@insis-portal/services/pass-management.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LifecycleType,LifecycleEvent } from '@impeo/ice-core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from "lodash";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import * as CryptoJS from 'crypto-js';


@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent extends PageComponentImplementation
  implements OnInit, OnDestroy, AfterViewInit {


  showDocs: boolean = false;
  modalOpen: boolean = false;
  hasGreenCard: boolean = false;
  hasGroupHealthPolicies: boolean = false; //This is for Group Health

  static componentName = "HomePageComponent";
  links = "pages.homepage.links.label";
  certificates = "pages.homepage.certificates.label";
  text1 = "pages.homepage.text1.label";
  profile = "pages.homepage.profile.label";
  text2 = "pages.homepage.text2.label";
  text3 = "pages.homepage.text3.label";
  files = "pages.homepage.files.label";
  categoryMotor = "pages.homepage.categoryMotor.label";
  health = "pages.homepage.health.label";
  health2 = "pages.homepage.health2.label";
  collaborating = "pages.homepage.collaborating.label";
  categoryHealth = "pages.homepage.categoryHealth.label";
  hospital = "pages.homepage.hospital.label";
  mondial = "pages.homepage.mondial.label";
  greencard = "pages.homepage.greencard.label";
  communication1 = "pages.homepage.communication1.label";
  communication2 = "pages.homepage.communication2.label";
  mondialLimit = "pages.homepage.mondialLimit.label";
  refreshStatus: number;
  private subscription1$: Subscription;
  private subscription2$: Subscription;
  private subscription3$: Subscription;
  private subscription4$: Subscription;
  private subscription5$: Subscription;
  private subscription6$: Subscription;
  private subscriptions: Subscription[];
  regexp: RegExp = undefined;
  letsTalkData: any[] = [];
  showAmendments = false;
  deviceInfo:any = null;
  showMotorAmendments = false;

  returnUrl: string;

  private token: string;
  private jwtData: any;
  private goldenRecordId = '';
  private email='';

  constructor(
    private communicationService: CommunicationService,
    public ngbModal: NgbModal, public modalService: ModalService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    private router: Router,
    private passManagement: PassManagementService
  ) {
    super();
    this.subscriptions = [];

  }

  ngOnInit() {
    super.ngOnInit();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    ///Device Info
    this.deviceInfo = this.deviceService.getDeviceInfo();


    if(this.deviceService.os=="mac" &&  !this.deviceService.isDesktop())
     this.context.iceModel.elements['is.ios.device'].setSimpleValue(true);


    if(this.deviceService.os=="android" && !this.deviceService.isDesktop())
     this.context.iceModel.elements['is.android.device'].setSimpleValue(true);

    ///salesforce issue for Mac devices
    if(this.deviceService.os=="mac" && this.deviceService.isMobile())
     this.context.iceModel.elements['eclaims.salesforce.script.error'].setSimpleValue(true);

    else if(this.deviceService.os=="mac" && this.deviceService.browser=="safari" && !this.deviceService.isMobile())
     this.context.iceModel.elements['eclaims.salesforce.script.error'].setSimpleValue(true);
   //end saleforce issue
   //End Device Info


    const token = localStorage.getItem('token');
    if (token) {
      this.jwtData = jwt_token(token);
      this.goldenRecordId = this.jwtData.extension_CustomerCode as string;
      this.email = this.jwtData.emails[0] as string;
      this.context.iceModel.elements['eclaims.customerID'].setSimpleValue(this.goldenRecordId);
      this.context.iceModel.elements['eclaims.salesforce.email'].setSimpleValue(this.email);


    }


    //This is for Group Health
    if(this.localStorage.getDataFromLocalStorage('initialNavigation')==undefined)
    this.localStorage.setDataToLocalStorage("initialNavigation", this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages);


    this.subscription1$ = this.communicationService.changeEmitted.subscribe((data: any) => {
      this.showDocs = data;
    });
    this.subscriptions.push(this.subscription1$);

    this.showAmendments = this.context.iceModel.elements["amendments.showAmendments"]
      .getValue()
      .forIndex(null);

    this.subscription2$ = this.context.iceModel.elements["amendments.showAmendments"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) === true) {
        this.showAmendments = true;
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(this.subscription2$);


    //check if the device is  mobile/or desktop

    const isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;

    if (isMobile) {
      this.context.iceModel.elements['home.isMobileDevice'].setSimpleValue(true);
    } else {
      this.context.iceModel.elements['home.isMobileDevice'].setSimpleValue(false);
    }




    //there is bug here...while you refresh the page the actionAmendmentsOnInit is being executed first and then the WriteFromMultiple...so we check the refresh status
    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");
    if (this.refreshStatus == 1) {
      this.subscription3$ = this.context.$lifecycle.subscribe(async (e: LifecycleEvent) => {

        const actionName = _.get(e, ['payload', 'action']);


        if (actionName.includes("actionGetPolicies") && e.type==='ACTION_FINISHED') {
          let action = this.context.iceModel.actions['actionAmendmentsOnInit'];
          if (action != null) {
            await action.executionRules[1].execute();
            await action.executionRules[2].execute();
          }
        }
      });
      this.subscriptions.push(this.subscription3$);
    }




    this.subscription4$ = this.context.iceModel.elements["adv.toload"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true) {
        this.context.iceModel.elements["walkthrough.page.index.home"].setSimpleValue(0);

        if (this.localStorage.getDataFromLocalStorage('walkthrough') == undefined)
          this.context.iceModel.elements["walkthrough.page.index.home"].setSimpleValue(1); //trigger the walkthrough

        // appoGlobals.loader.reload();
      }


    });
    this.subscriptions.push(this.subscription4$);


    this.subscription5$ = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

      const actionName = _.get(e, ['payload', 'action']);


      if (actionName.includes("actionGetBlogInfo")) {
        if (_.get(this.context.dataStore, 'blogInfo') != undefined) {
          this.letsTalkData = _.get(this.context.dataStore, 'blogInfo');
        }
      }
      if (actionName.includes("actionGetPolicies")) {
        let contracts = _.get(this.context.dataStore, 'clientContracts');
        if (contracts != undefined)
        {
          this.hasGreenCard = contracts.some((contract: any) => {
            if (contract.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ') {
              return true;
            }
          });

             //This is for Group Health
             this.hasGroupHealthPolicies = contracts.some((contract: any) => {
              if (contract.ContractType === 99) {
              this.localStorage.setDataToLocalStorage("showGroupHealth", true);
              this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(contract.ContractID);
              this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(contract.ContractKey);
              this.context.iceModel.elements["eclaims.contract.exist"].setSimpleValue(true);
              if(contract.ContractGroupHealthDetails){
                this.context.iceModel.elements["eclaims.groupDetails.exist"].setSimpleValue(true);
              }
              //this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);

               return true;
               }
            });


        }
      }
    });
    this.subscriptions.push(this.subscription5$);

    this.subscription6$ = this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.ICE_MODEL_READY) {
        if (_.get(this.context.dataStore, 'blogInfo') != undefined) {
          this.letsTalkData = _.get(this.context.dataStore, 'blogInfo');
        }

        let contracts = _.get(this.context.dataStore, 'clientContracts');
        if (contracts != undefined)
        {
            this.showMotorAmendments = this.hasGreenCard = contracts.some((contract: any) => {
              if (contract.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ') {
                return true
              }
            });


              //This is for Group Health
           this.hasGroupHealthPolicies = contracts.some((contract: any) => {
              if (contract.ContractType === 99) {
                this.localStorage.setDataToLocalStorage("showGroupHealth", true);
                this.context.iceModel.elements["eclaims.contract.exist"].setSimpleValue(true);
                this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(contract.ContractID);
                this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(contract.ContractKey);
                //this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);
                if(contract.ContractGroupHealthDetails){
                  this.context.iceModel.elements["eclaims.groupDetails.exist"].setSimpleValue(true);
                }
                return true;
               }
            });


        }
      }
    });
    this.subscriptions.push(this.subscription6$);

    if (_.get(this.context.dataStore, 'clientContracts'))
    {
        this.hasGreenCard = _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
          if (contract.Branch === 'ΑΥΤΟΚΙΝΗΤΩΝ') {
            return true;
          }
        });

         //This is for Group Health
      this.hasGroupHealthPolicies = _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
        if (contract.ContractType === 99) {
          this.localStorage.setDataToLocalStorage("showGroupHealth", true);
          this.context.iceModel.elements["eclaims.contract.exist"].setSimpleValue(true);
          this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(contract.ContractID);
          this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(contract.ContractKey);
          //this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);
          if(contract.ContractGroupHealthDetails){
            this.context.iceModel.elements["eclaims.groupDetails.exist"].setSimpleValue(true);
          }
          return true;
        }
      });


    }
    this.route.queryParams.subscribe((params: any) => {
      this.returnUrl = params["returnUrl"] || '//';
      if(this.returnUrl != '//' && this.returnUrl != undefined)
      {
        this.context.iceModel.elements["wallet.deeplink.return.url"].setSimpleValue(this.returnUrl.toString());   //save to element
        var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
        var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
        if(decodedQuery.nextLink=='/ice/default/customerArea.motor/policyDetails'){
          this.router.navigate(['/ice/default/customerArea.motor/viewMyPolicies'], {
            queryParams: {
              returnUrl:  this.returnUrl
            }});
        }else if(decodedQuery.nextLink=='/ice/default/customerArea.motor/viewAmendments'){
          this.router.navigate(['/ice/default/customerArea.motor/viewAmendments'], {
            queryParams: {
              returnUrl:  this.returnUrl
            }});
        }else if(decodedQuery.nextLink=='/ice/default/customerArea.motor/viewClaims'){
          this.router.navigate([decodedQuery.nextLink], {
            queryParams: {
              returnUrl:  this.returnUrl
            }});
        }
      }
    })
  }

  private async execActionGetBlogInfo() {
    const action = this.context.iceModel.actions['actionGetBlogInfo'];
    if (action != undefined) {
      try {
        await action.executionRules[0].execute()
      } catch (error) {
        console.log('Error in execActionGetBlogInfo: ' + error);
      }
    }
  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? "col-sm-12" : "col-sm-" + col.col;
  }

  getImgSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "FlatSectionComponent"
    );
  }



  getMainCardsSection(): IceSection {
    return this.page.sections.find(
      section => (section.component === "HomeCardContainerAmendmentComponent")
    );
  }

  getSecondCardsSection(): IceSection {
    return this.page.sections.find(
      section => (section.component === "HomeCardContainerComponent")
    );
  }



  getPendingPayments():IceSection {
      return this.page.sections.find(
        section => section.component === "PendingPaymentComponent"
      );
    }


  getAgentInfoSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "HomeAgentInfoComponent"
    );
  }

  getLastSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "HomePageMainSectionComponent"
    );
  }

  getPromoArea(): IceSection {
    return this.page.sections.find(
      section => section.component === "HomePageMainSectionComponent"
    );
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "50");
    svg.setAttribute("height", "50");

    return svg;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto; fill: #485294");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");

    return svg;
  }

  handleSVGUsefull(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto; fill: #383b38");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "17");

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }


  onHealthBenefitsMotor() {
    window.open(
      environment.sitecore_media +
      this.context.iceModel.elements["home.page.health.benefits.motor.id"]
        .getValue()
        .forIndex(null),
      "_blank"
    );
  }

  onGarages() {
    window.open("https://www.eurolife.gr/exipiretisi/sinergazomena-sinergeia");
  }

  onHealthBenefits() {
    window.open(
      environment.sitecore_media +
      this.context.iceModel.elements["home.page.health.benefits.id"]
        .getValue()
        .forIndex(null),
      "_blank"
    );
  }

  onSeeMoreClick() {
    window.open(
      "https://www.eurolife.gr/el-GR/exipiretisi/#eurolife-pass",
      "_blank"
    );
  }

  ngAfterViewInit() {

    //**Bug fix: only ios devices...trigger the card for amendments to retrieve data
    //  this.regexp= new RegExp('/iPad|iPhone|iPod/');
    //  var iOS =  !!navigator.platform &&  this.regexp.test(navigator.platform);
    //  console.log("ios flag:"+iOS);
    //  if(iOS)
    //  {
    //   let action = this.context.iceModel.actions['actionMessage1'];
    //   if (action != null)
    //   {
    //   let executionRule1 = action.executionRules[0];
    //   await  this.context.executeExecutionRule(executionRule1);
    //   }
    //  this.context.iceModel.elements["trigger.card.amendments"].setSimpleValue(true);
    //  }

    if (_.get(this.context.dataStore, 'blogInfo') != undefined) {
      this.letsTalkData = _.get(this.context.dataStore, 'blogInfo');
    } else {
      this.execActionGetBlogInfo();
    }


  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  icon(): string {
    let icon = environment.sitecore_media + "C8705EB508D542E59548EF002F938768" + ".ashx";
    return icon;
  }

  handleSVGIndexIcon(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }


  closeDialog() {
    this.modalOpen = !this.modalOpen;
    this.modalService.isModalClosed();
    this.ngbModal.dismissAll();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  // Widget 'as milhsoume'
  getThemeColor(item: any): string {
    if(item.Tags.length>0)
    return item.Tags[0].Color;
    else
    return '';
  }


  onClick(item: any) {
    window.open(item.URL, '_blank');
    //window.location.href=item.URL;
  }


  async triggerGreenCard() {
    //this.context.iceModel.elements["greencard.refresh.status"].setSimpleValue(false);
    let action = this.context.iceModel.actions['action-greencard-get-token'];
    for (let i = 0; i < action.executionRules.length; i++)
    {
      await action.executionRules[i].execute();
   }

  }

  async execActionGetMondialPdf(): Promise<void> {
    const actName = 'actionGetMondialPDF';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch (err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  async execModificationLiabilityInsuranceLimitPdf(): Promise<void> {
    const actName = 'modificationLiabilityInsuranceLimitPDF';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch (err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  async execActionGetHealthMondialPdf(): Promise<void> {
    const actName = 'actionGetHealthMondialPDF';
    const action = this.context.iceModel.actions[actName];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch (err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

 async execActionGetHealthHospitalsPdf(): Promise<void>{
  const actName = 'actionGetHealthHospitalPDF';
  const action = this.context.iceModel.actions[actName];
  if (!!action) {
    try {
      await this.context.iceModel.executeAction(actName);
    } catch (err) {
      console.error(`exec ${actName}`, err);
    }
  }


 }
}

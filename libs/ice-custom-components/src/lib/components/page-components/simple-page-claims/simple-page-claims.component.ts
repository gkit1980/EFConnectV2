import { Component, OnInit, ElementRef, AfterViewInit } from "@angular/core";
import { PageComponentImplementation } from "@impeo/ng-ice";
import { IceSection,IndexedValue,LifecycleEvent } from "@impeo/ice-core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "@insis-portal/services/modal.service";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { PassManagementService } from '@insis-portal/services/pass-management.service';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from  "@insis-portal/environments/environment";
import { SpinnerService } from '@insis-portal/services/spinner.service';
import { takeUntil } from "rxjs/operators";
import * as _ from "lodash";
import * as jwt_token from 'jwt-decode';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: "app-simple-page-claims",
  templateUrl: "./simple-page-claims.component.html",
  styleUrls: ["./simple-page-claims.component.scss"]
})
export class SimplePageClaimsComponent extends PageComponentImplementation
  implements OnInit,AfterViewInit {
  static componentName = "SimplePage";
  sectionToShow: any[] = [];
  navigateToPreferences: any;
  tabName: any = [];
  activeIndex = 0;
  showHeader = true;
  showTitle = true;
  flag = '';
  tabs :any;
  elementContract:any;
  returnUrl: string;

  modalOpen: boolean = false;
  hasGroupHealthPolicies:boolean=false;
  hasGroupHealthPolicyDetails=false;
  openEclaimsRequests:boolean=false;
  refreshStatus: number;

  private token: string;
  private jwtData: any;
  private goldenRecordId = '';
  private email='';
  regexp: RegExp = undefined;

  private  eclaimsRequestsOpen: Subscription;
  private subscription2$: Subscription = new Subscription();
  private subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  private  requestsOpen: Subscription;
  private subscription3$: Subscription = new Subscription();
  timer2: NodeJS.Timeout;


  constructor(
    public ngbModal: NgbModal,
    public modalService: ModalService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private passManagement: PassManagementService
  ) {
    super();
  }


  ngOnInit() {
    console.info("SimplePageClaims ngOnoinit")

    super.ngOnInit();
    this.flag = this.page.recipe['flag']

    this.showHeader = this.page.recipe['showHeader'];
    this.showTitle = this.page.recipe['showTitle'];
    this.refreshStatus=this.localStorage.getDataFromLocalStorage('refreshStatus');


    //When you start the eclaims flow you should have email and gId
    const token = localStorage.getItem('token');
    this.jwtData = jwt_token(token);
    this.goldenRecordId = this.jwtData.extension_CustomerCode as string;
    this.email = this.jwtData.emails[0] as string;
    this.context.iceModel.elements['eclaims.customerID'].setSimpleValue(this.goldenRecordId);
    this.context.iceModel.elements['eclaims.salesforce.email'].setSimpleValue(this.email);



    this.context.$lifecycle
    .pipe(takeUntil(this.destroy$))
    .subscribe((e: LifecycleEvent) => {

      const actionName =_.get(e, ['payload', 'action']);

      if (actionName.includes("action-eclaims-requests-closed") &&  e.type === 'ACTION_FINISHED') {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '//';
      }
    });

    ///Individual Property Claims
    this.context.iceModel.elements['property.claim.step'].setSimpleValue(0);

    this.context.iceModel.elements[
      'eclaims.valuation.open.requests'
    ].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {
        if (_.get(this.context.dataStore, 'clientContracts'))
        {
            //This is for Group Health
          _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
            if (contract.ContractType === 99)
            {
              this.hasGroupHealthPolicies=true;
              if(contract.ContractGroupHealthDetails)
              {
               this.hasGroupHealthPolicyDetails=true;
              }
            }
          });
        }
      }});

    this.context.$lifecycle
    .pipe(takeUntil(this.destroy$))
    .subscribe((e: LifecycleEvent) => {

      const actionName = _.get(e, ['payload', 'action']);

      if (actionName.includes("actionGetParticipantsHomePage") && e.type === 'ACTION_FINISHED') {

        if (_.get(this.context.dataStore, 'clientContracts'))
        {
            //This is for Group Health
          _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
            if (contract.ContractType === 99)
            {
              this.hasGroupHealthPolicies=true;
              if(contract.ContractGroupHealthDetails)
              {
               this.hasGroupHealthPolicyDetails=true;
              // this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);
              }

            }
          });
        }
      }
    });



    if (this.refreshStatus == 1)   //Refresh state
    {
      const token = localStorage.getItem('token');
      if (token)
      {
          this.jwtData = jwt_token(token);
          this.goldenRecordId = this.jwtData.extension_CustomerCode as string;
          this.email = this.jwtData.emails[0] as string;
          this.context.iceModel.elements['eclaims.customerID'].setSimpleValue(this.goldenRecordId);
          this.context.iceModel.elements['eclaims.salesforce.email'].setSimpleValue(this.email);
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);

      }

        this.subscription2$ = this.context.$lifecycle
        .pipe(takeUntil(this.destroy$))
        .subscribe( (e: LifecycleEvent) => {

          const actionName = _.get(e, ['payload', 'action']);



          if (actionName.includes("actionGetPolicies") && e.type==='ACTION_FINISHED') {

            if (_.get(this.context.dataStore, 'clientContracts'))
            {
                //This is for Group Health
              _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
                if (contract.ContractType === 99)
                {
                  this.localStorage.setDataToLocalStorage("showGroupHealth", true);
                  this.context.iceModel.elements["eclaims.contract.exist"].setSimpleValue(true);
                  this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(contract.ContractID);
                  this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(contract.ContractKey);
                  this.hasGroupHealthPolicies=true;
                  this.context.iceModel.elements["selectedcontractbranch"].setSimpleValue(99);
                //  this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);


                  if(contract.CountOpenEclaims>0)
                  {
                  this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(true);
                  this.openEclaimsRequests= this.context.iceModel.elements["eclaims.notification.icon.flag"].getValue().forIndex(null);
                  }
                }
              });
            }


            ///refresh reasons...re-invoke once the datastore is loaded
            const actName = 'action-eclaims-requests-open';
            const action = this.context.iceModel.actions[actName];
            if (!!action) {
              this.context.iceModel.executeAction(actName);
            }

          }
        });

        this.context.$lifecycle
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: LifecycleEvent) => {

          const actionName = _.get(e, ['payload', 'action']);

          if (actionName.includes("actionGetParticipantsHomePage") && e.type === 'ACTION_FINISHED') {

            if (_.get(this.context.dataStore, 'clientContracts'))
            {
                //This is for Group Health
              _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
                if (contract.ContractType === 99)
                {
                  this.localStorage.setDataToLocalStorage("showGroupHealth", true);
                  this.context.iceModel.elements["eclaims.contract.exist"].setSimpleValue(true);
                  this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(contract.ContractID);
                  this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(contract.ContractKey);
                  this.hasGroupHealthPolicies=true;
                  this.context.iceModel.elements["selectedcontractbranch"].setSimpleValue(99);
               //   this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);


                  if(contract.ContractGroupHealthDetails)
                  this.hasGroupHealthPolicyDetails=true;
                }
              });

              //DeepLinks

              this.route.queryParams.subscribe((params: any) => {
                this.returnUrl = params["returnUrl"] || '//';
                if(this.returnUrl != '//' && this.returnUrl != undefined){
                  var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
                  var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
                  if(decodedQuery.contractTypeDeepLink == "99"){
                    this.sectionToShow = [{ section: 'Group Claims' }];
                    this.toggleSection(this.sectionToShow);
                    this.setActiveLinkIndex(1)
                    this.openEclaimsRequests=true;
                  }
                }
              })
              if(this.returnUrl !=='//' && this.returnUrl != undefined){
                var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
                var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
                if(decodedQuery.contractTypeDeepLink == undefined){
                  this.sectionToShow = [{ section: 'Group Claims' }];
                  this.toggleSection(this.sectionToShow);
                  this.setActiveLinkIndex(1)
                  this.sectionToShow = [{ section: 'Individual Claims' }];
                  this.toggleSection(this.sectionToShow);
                  this.setActiveLinkIndex(0)
                  this.openEclaimsRequests=true;
                }
            }
          }
        }
        });





    }


    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params.get('section'))
       {
        console.log("Section:"+params.get('section'))
        this.regexp= new RegExp('/iPad|iPhone|iPod|Mac/');
        var iOS =  !!navigator.userAgent &&  this.regexp.test(navigator.userAgent);
        if(iOS)
        {
          const actName1 = 'action-eclaims-requests-inprogress';
          const actName2 = 'action-eclaims-requests-open';
          const actName3 = 'action-eclaims-requests-closed';
          const action1 = this.context.iceModel.actions[actName1];
          const action2 = this.context.iceModel.actions[actName2];
          const action3 = this.context.iceModel.actions[actName3];
          if (!!action1 && !!action2 && !!action3 ) {
            try {
              this.context.iceModel.executeAction(actName1);
              this.context.iceModel.executeAction(actName2);
              this.context.iceModel.executeAction(actName3);
            } catch (err) {
              console.error(`exec $actions`, err);
            }
          }
        }


          this.sectionToShow = [{ section: 'Group Claims' }];
          this.toggleSection(this.sectionToShow);
          this.setActiveLinkIndex(1);

         //Flag for open requests
         this.requestsOpen = this.context.iceModel.elements['eclaims.valuation.open.requests'].$dataModelValueChange.
           subscribe((value: IndexedValue) => {
            if (value.element.getValue().forIndex(null))
            {
              if(value.element.iceModel.elements["eclaims.requests.open.array"].getValue().forIndex(null).length>0)
              {
              this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(true);
              this.openEclaimsRequests=true;
              }

            else
            {
              this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(false);
              this.openEclaimsRequests=false;
            }
            }
        });
        this.subscription3$.add(this.requestsOpen);


        }
      });

      this.openEclaimsRequests= this.context.iceModel.elements["eclaims.notification.icon.flag"].getValue().forIndex(null);

      this.eclaimsRequestsOpen= this.context.iceModel.elements['eclaims.notification.icon.flag'].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null)) {
          this.openEclaimsRequests=true;
        } else
        {

        }
      });
      this.subscription.add(this.eclaimsRequestsOpen);



    // TODO GKIT-what happened with 2 group health contracts??

    this.context.iceModel.elements["eclaims.details.close.dialog.status"].setSimpleValue(false);
    this.context.iceModel.elements['eclaims.update.request.flag'].setSimpleValue(false);


    if (_.get(this.context.dataStore, 'clientContracts'))
      {

          //This is for Group Health
        _.get(this.context.dataStore, 'clientContracts').some((contract: any) => {
          if (contract.ContractType === 99)
          {
            this.localStorage.setDataToLocalStorage("showGroupHealth", true);
            this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(contract.ContractID);
            this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(contract.ContractKey);
            this.hasGroupHealthPolicies=true;
            this.context.iceModel.elements["selectedcontractbranch"].setSimpleValue(99);
          //  this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);

            //
            if(contract.ContractGroupHealthDetails)
             this.hasGroupHealthPolicyDetails=true;
          }
        });
      }

    this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
  }


  getTopPageSection(): IceSection[] {
    var sectionLabel: IceSection[] = this.page.sections.filter((section) => {
      return section.name == "Label Component"
    });
    return sectionLabel;
  }

  getMainPageSection(): IceSection[] {


    if(this.sectionToShow.length==0)
    {
      var sectionsWithoutSubheader = this.page.sections.filter(section => (section.name.includes("Individual Claims")));
      return sectionsWithoutSubheader;
    }
     else
    {
      var sectionsName = this.sectionToShow[0].section.slice(0, this.sectionToShow[0].section.lastIndexOf(' '));
      return this.page.sections.filter(sections => sections.name.includes(sectionsName));
    }

  }

  getColorBackground(): string {
    if (this.page.recipe['backColor'] == undefined || this.page.recipe['backColor'] == null)
      return 'grey-background';

    if (this.page.recipe['backColor'] == 'white')
      return 'white-background';

    if (this.page.recipe['backColor'] == 'unset')
      return 'background-unset';

  }



  getColorClass(i: number) {
    if (this.activeIndex === i) {
      let dt_name = this.page.recipe.navigationClass;
      let dt = this.page.iceModel.dts[dt_name];
      if (dt) {
        let result = dt.evaluateSync();
        if (result["classes"] == null) return 'health_navigation';
        return result["classes"];
      }
      return 'health_navigation';
    }
  }

  getTabs(): any {

     var filteredtabs = this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRuleForClaims.pages.filter((page: any) => page.pages[0].page != 'viewMyPolicies');
     this.tabs=filteredtabs[0].pages[0].tabs;

     //if has Group health policies
     if(this.hasGroupHealthPolicies)
     return this.tabs;
     else
     return this.tabs[0];
    }



  getActiveIndex(i: number): boolean {
    if (this.activeIndex === i) { return true; }
    return false;
  }

  getOpenRequestsExist() :boolean
  {
   return this.openEclaimsRequests;
  }


  toggleSection(sectionNumber: string[]) {
    this.sectionToShow = sectionNumber;
  }

  setActiveLinkIndex(i: number) {

    this.activeIndex = i;

  }


  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '70');
    svg.setAttribute('height', '70');

    return svg;
  }

  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }

  handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');

    return svg;
  }


  async redirectEclaimsDirective (decodedQuery : any): Promise<void>{
    await _.get(this.context.dataStore, 'clientContracts');
    const clientContracts = _.get(this.context.dataStore, 'clientContracts');


    this.context.iceModel.elements['eclaims.details.close.dialog.status'].setSimpleValue(false);
    this.context.iceModel.elements['eclaims.update.request.flag'].setSimpleValue(false);


    this.localStorage.setDataToLocalStorage('showGroupHealth', true);
    this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(decodedQuery.contractIdDeepLink);
    this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(decodedQuery.contractKeyDeepLink);
    this.context.iceModel.elements['selectedcontractbranch'].setSimpleValue(99);

     this.hasGroupHealthPolicies=true;
     this.hasGroupHealthPolicyDetails=true;
   //  this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(this.goldenRecordId);


    try {

        this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);

      }
     catch (err) {
      console.error(err);
      this.spinnerService.loadingOff();
    }
    this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsDetails']);

}

ngAfterViewInit(): void {
this.timer2=setInterval(() => {

   this.returnUrl = this.context.iceModel.elements["wallet.deeplink.return.url"].getValue().forIndex(null) || '//';
   if(this.returnUrl != "//" && this.returnUrl != undefined && this.context.dataStore.data.clientContracts!=undefined)
   {
      var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
      var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
      var indexOfContracts=this.context.dataStore.data.clientContracts.findIndex((x:any)=>x.ContractKey==decodedQuery.contractKeyDeepLink)

      if(decodedQuery.contractTypeDeepLink == "99" && this.context.dataStore.data.clientContracts[indexOfContracts].ContractGroupHealthDetails!=undefined)
      {

        this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
        this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(decodedQuery.contractIdDeepLink);
        this.context.iceModel.elements['eclaims.contractKey'].setSimpleValue(decodedQuery.contractKeyDeepLink);
        this.context.iceModel.elements['selectedcontractbranch'].setSimpleValue(99);

        clearInterval(this.timer2);
        this.context.iceModel.elements["wallet.deeplink.return.url"].setSimpleValue(undefined);
        console.log('Clear!')
        this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsDetails'], {
          queryParams: {
            returnUrl:  this.returnUrl
          }});
      }
   }

},500)

}


    ngOnDestroy()
    {

       this.subscription2$.unsubscribe();
       this.subscription3$.unsubscribe();

      this.subscription.unsubscribe();

      this.destroy$.next();
      this.destroy$.complete();
    }

}



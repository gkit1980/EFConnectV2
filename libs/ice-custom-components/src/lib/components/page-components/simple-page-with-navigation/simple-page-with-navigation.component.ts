import { IceSection } from "@impeo/ice-core";
import { Component, ElementRef, ChangeDetectorRef, OnInit, AfterViewInit } from "@angular/core";
import { PageComponentImplementation } from "@impeo/ng-ice";
import { LifecycleEvent } from "@impeo/ice-core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "@insis-portal/services/modal.service";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { Subscription, throwError } from "rxjs";
import { catchError, first, tap,map } from "rxjs/operators";
import { SpinnerService } from '@insis-portal/services/spinner.service';
import * as _ from "lodash";



@Component({
  selector: "app-simple-page-with-navigation",
  templateUrl: "./simple-page-with-navigation.component.html",
  styleUrls: ["./simple-page-with-navigation.component.scss"]
})
export class SimplePageWithNavigationComponent extends PageComponentImplementation implements OnInit, AfterViewInit {



  modalOpen: boolean = false;
  sectionToShow: any[] = [];
  tabName: any = [];
  activeIndex = 0;
  navigateToPreferences: any;
  private isInvestmentProduct: boolean = false;
  private clientContracts: any[] = [];

  private writeFromOtherForRefreshEndedSubs: Subscription;
  private queryParamMapSubs: Subscription;
  private walkthroughPolDetSubs: Subscription;
  private subscription = new Subscription();


  constructor(private route: ActivatedRoute, public ngbModal: NgbModal, public modalService: ModalService, private elementRef: ElementRef, private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private spinnerService: SpinnerService
  ) {
    super();
  }


  ngOnInit() {
    super.ngOnInit();




    this.clientContracts = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

    if(this.clientContracts!=undefined)
    {
    ///SOS!!!!!!  -- there is no Product Descriptionfrom te service  --Bug!!!
    if (this.clientContracts[parseInt(localStorage.getItem('index'))].Branch === 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ' || this.clientContracts[parseInt(localStorage.getItem('index'))].Branch === 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ')
        {
          this.clientContracts[parseInt(localStorage.getItem('index'))].ProductDescritpion="Λοιποί Κλάδοι Γενικών Ασφαλειών";
        }
    this.excludedTabsFromNavigation();
    }

    if (!!this.clientContracts) {
      this.chkInvetsmentProduct();
    }

    const writeFromOtherForRefreshEnded$ = this.context.$lifecycle.pipe(
        map((e:LifecycleEvent) =>
        {
        const actionName = _.get(e, ['payload', 'action']);

        if(actionName === 'actionWriteFromOtherForRefresh'&& e.type=="ACTION_FINISHED")
        return e;
        }),
      catchError((err) => this.handleError(err)),
      tap((_x) => {
        this.localStorage.setDataToLocalStorage('refreshStatus', 0);
        this.clientContracts = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        this.excludedTabsFromNavigation();
        this.chkInvetsmentProduct();
    //    this.chkUlPlainVanilla();
      })
    );

    this.writeFromOtherForRefreshEndedSubs = writeFromOtherForRefreshEnded$.subscribe(
      (_x) => {},
      (err) => console.error(err)
    );
    this.subscription.add(this.writeFromOtherForRefreshEndedSubs);

  }


  closeDialog() {
    this.modalOpen = !this.modalOpen;
    this.modalService.isModalClosed();
    this.ngbModal.dismissAll();
  }


  getTopSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "SubHeaderComponent"
    );
  }

  getTopTopSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "HeaderComponent"
    );
  }

  getPaymentSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "PaymentComponent"
    );
  }


  getGreenCardRedirectionSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "RedirectionGreenCardComponent"
    );
  }

  getEclaimsRedirectionSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "RedirectionEclaimsComponent"
    );
  }

  getMainPageSection(): IceSection[] {

    // this.setActiveLinkIndexFromNavigation();
    try {
      this.queryParamMapSubs = this.route.queryParamMap.subscribe(params => { this.navigateToPreferences = params.get("id") });
      this.subscription.add(this.queryParamMapSubs);
    } catch (error) {
      console.log(error);
    }

    var sectionsWithoutSubheader = this.page.sections.filter(
      (section) =>
        section.component.includes('SubHeaderComponent') == false &&
        section.component.includes('PaymentComponent') == false &&
        section.component.includes('HeaderComponent') == false &&
        section.component.includes('RedirectionGreenCardComponent') == false &&
        section.component.includes('RedirectionEclaimsComponent') == false
    );

    if (this.sectionToShow.length > 0) {

      var sectionsName = this.sectionToShow[0].section.slice(0, this.sectionToShow[0].section.lastIndexOf(' '));
      return sectionsWithoutSubheader.filter(sections => sections.name.includes(sectionsName));

    }
    else if (this.navigateToPreferences == '1') {
      this.activeIndex = 1;
      return sectionsWithoutSubheader.filter(sections => sections.name.includes("Preferences"));
    }
    else if (this.navigateToPreferences == '4') {
      this.activeIndex = 4;
      return sectionsWithoutSubheader.filter(sections => sections.name.includes("Receipts"));
    } else {
      return sectionsWithoutSubheader.filter(sections => sections.name.includes('Details'));
    }

  }

  excludedTabsFromNavigation(): any {
    let elementNameForExcludedTabNavigation: any;
    let elementNameForExcludedInvestmentProduct:any;
    let properNavigationPages:any =[];
  //   var pageSections: any;


    if(this.clientContracts)
    {

          this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages = this.localStorage.getDataFromLocalStorage('initialNavigation');
          properNavigationPages=this.localStorage.getDataFromLocalStorage('initialNavigation');

          for (let i = 0; i < this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages.length; i++)
          {
            if (this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs)
            {
              for (let j = 0; j < this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs.length; j++)
              {

                if (this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j] != undefined)
                {
                elementNameForExcludedTabNavigation = this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].excludedBranch;
                elementNameForExcludedInvestmentProduct=(this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].tabProductName
                                                      == this.clientContracts[parseInt(localStorage.getItem('index'))].ProductDescritpion.trim())
                                                      ? undefined
                                                      : this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].tabProductName  ;
                }
                //Check if the same tab should be excluded from multiple branches
                if (elementNameForExcludedTabNavigation)
                {
                  for (var z = 0; z < elementNameForExcludedTabNavigation.split(",").length; z++)
                  {
                    if (elementNameForExcludedTabNavigation.split(",")[z] === localStorage.getItem("selectedBranch"))
                     properNavigationPages[i].pages[0].tabs.splice(properNavigationPages[i].pages[0].tabs.findIndex((e:any) => e.tab ===this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages[i].pages[0].tabs[j].tab),1);
                  }
                }  //remove the tab for the other investment products
                else if(elementNameForExcludedInvestmentProduct)
                  properNavigationPages[i].pages[0].tabs.splice(properNavigationPages[i].pages[0].tabs.findIndex((e:any) => e.tabProductName === elementNameForExcludedInvestmentProduct),1);

              }
            }
          }


          this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages=properNavigationPages;
    }


  }



  getTabs(): any {

    var filteredtabs: any;
    var pageSections: any;

    pageSections = this.getCustomerProfileSections();

    if (pageSections[0].name.includes("Customer Profile")) {
      filteredtabs = this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRuleForCustomerProfile.pages;
      this.tabName = filteredtabs[0].pages[0].tabs;
      return this.tabName;
    }
    else {
      filteredtabs = this.context.iceModel.recipe.navigation.pages.DynamicNavigationPagesRule.pages.filter((page: any) => page.pages[0].page != 'viewMyPolicies');
      this.tabName = filteredtabs[0].pages[0].tabs;
    }

    return this.tabName;

  }





  toggleSection(sectionNumber: string[]) {
    this.sectionToShow = sectionNumber;
  }

  getActiveIndex(i: number): boolean {
    if (this.activeIndex === i) { return true; }
    return false;
  }

  setActiveLinkIndex(i: number) {

    this.activeIndex = i;

  }

  // setActiveLinkIndexFromNavigation() {
  //   try {
  //     this.route.queryParamMap.subscribe(params => { this.navigateToPreferences = params.get("id") });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   if (this.navigateToPreferences == '1') {
  //     this.activeIndex == 1
  //   }
  // }

  getCustomerProfileSections(): IceSection[] {
    var customerProfileSections = this.page.sections;
    return customerProfileSections;
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


  private async fundsEval() {
   // this.findExcludedTab();
    this.excludedTabsFromNavigation();
    const actName = 'actionGetLifeContractFundsValuation';
    const action = this.context.iceModel.actions['actionGetLifeContractFundsValuation'];
    if (!!action) {
      try {
        await this.context.iceModel.executeAction(actName);
      } catch (err) {
        console.error(`exec ${actName}`, err);
      }
    }
  }

  private chkInvetsmentProduct() {
    const selectedBranch = parseInt(localStorage.getItem('selectedBranch'));
    const index = parseInt(localStorage.getItem('index'));
    const branchArr: number[] = [1,2,11];
    const prodInvestArray = ['My Investment Plan','Εξασφαλίζω επένδυση με Δυναμική Προστασία',"Εξασφαλίζω επένδυση για το μέλλον II"];

    // const prodInvestPlan = 'Greek Top 20'; // for localhost testing
   const prodInvestPlan = this.context.iceModel.elements["policies.details.ProductName"].getValue().forIndex(null);

    if (branchArr.includes(selectedBranch)) {
      if (this.clientContracts[index].ProductDescritpion.trim() === prodInvestPlan.trim() && prodInvestArray.includes(prodInvestPlan.trim())) {
        this.isInvestmentProduct = true;
        this.fundsEval();
      }
    }
  }

  private handleError(err: any) {
    const message = 'Error in Observable';
    console.error(message, err);
    return throwError(err);
  }


  ngAfterViewInit() {

    if(this.context.iceModel.elements["deeplink.contract.downloadpdf"].getValue().forIndex(null)){
      const actName = 'actionGetReprintedPDF';
      this.context.iceModel.executeAction(actName);
      this.context.iceModel.elements["deeplink.contract.downloadpdf"].setSimpleValue(false);
    }


  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  ngOnDestroy() {


    this.subscription.unsubscribe();
  }




}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
} from '@impeo/ng-ice';
import { Subject, Subscription } from 'rxjs';
import { SpinnerService } from '../../../services/spinner.service';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { IndexedValue,LifecycleEvent} from '@impeo/ice-core';
import { takeUntil } from "rxjs/operators";
import { LocalStorageService } from "../../../services/local-storage.service";
import * as _ from "lodash";
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';

//eclaims case type
export enum ExpenseCategory  {
  doctors_and_medicines = 'Doctors and Medicines',
  hospital  ="Hospital",
  loss_of_income ="Loss of income"
}

@Component({
  selector: 'app-eclaims-requests-open',
  templateUrl: './eclaims-requests-open.component.html',
  styleUrls: ['./eclaims-requests-open.component.scss'],
})


export class EclaimsRequestsOpenComponent
  extends SectionComponentImplementation
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<void>();
  private  requestsOpen: Subscription;
  private subscription: Subscription = new Subscription();
  docText = 'Έγγραφα';
  visible: boolean =false;
  dialogRef: NgbModalRef;

  Requests: any[] = [];
  ownerId = environment.salesforce_ownerid; // test:00G7Y0000056OjPUAU    --prod:00G2o000009f7ilEAA
  groupClaimsMessage = 'Δεν υπάρχουν αιτήματα σε εκκρεμότητα';
  groupClaimsExist = false;
  contentLoaded = false;
  hasGroupHealthPolicyDetails=false;
  hasGroupHealthPolicies:boolean=false;
  returnUrl: string;

  constructor(
    parent: IceSectionComponent,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private localStorage: LocalStorageService,
    public modalserv: ModalService,
    public ngbModal: NgbModal
  ) {
    super(parent);
  }

  ngOnInit(): void {
    this.addItems();

    const hasRequestEnded = this.iceModel.elements[
      'eclaims.valuation.open.requests'
    ]
      .getValue()
      .forIndex(null) as boolean;

      hasRequestEnded ? (this.contentLoaded = true) : (this.contentLoaded = false);

    this.requestsOpen = this.iceModel.elements[
      'eclaims.valuation.open.requests'
    ].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {
        this.addItems();
        this.contentLoaded = true;
      } else {
        this.contentLoaded = false;
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

              if(contract.ContractGroupHealthDetails)
              {
               this.hasGroupHealthPolicyDetails=true;
            //   this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);
              }

            }
          });
        }
      }
    });


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
           // this.context.iceModel.elements["policies.details.grouphealth.CustomerCode"].setSimpleValue(contract.CustomerCode);

            //
            if(contract.ContractGroupHealthDetails)
             this.hasGroupHealthPolicyDetails=true;
          }
        });
      }

    this.subscription.add(this.requestsOpen);
    //Deeplinks
    // this.route.queryParams.subscribe((params: any) => {
    //   this.returnUrl = params["returnUrl"] || '//';
    //   if(this.returnUrl != '//' && this.returnUrl != undefined){
    //     this.redirectGroupDetails();
    //   }
    // })

  }

  async redirectGroupDetails(): Promise<void> {

    try {
    this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsDetails']);
    console.log("1.After:redirectGroupDetails");
    } catch (err) {
      console.error(err);
      this.spinnerService.loadingOff();
    }



  }

  async DocumentsPopUp(item : any) {
    this.visible = true;
    this.context.iceModel.elements['eclaims.request.caseId'].setSimpleValue(item.CaseId);
    let action = this.context.iceModel.actions["action-request-getallfiles"];
    if(action){
      action.executionRules[0].execute();

      //open Dialog
      let popupPageName = "viewEclaimsDocumentsDialog";
      //this.iceModel.elements["eclaims.documents.dialog.close.status"].setSimpleValue(false);
      if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
      //this.modalserv.ismodalOpened();
      this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'documentModal', centered: true });
      this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalserv.isModalClosed(); })
      this.visible = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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

  addItems()
  {
    this.Requests= this.iceModel.elements["eclaims.requests.open.array"].getValue().values[0].value;

    if (this.Requests.length > 0) {
      this.groupClaimsExist = true;
      this.hasGroupHealthPolicyDetails=true;
    }
  }



  goToUpload(item: any, idx: number) {
    this.context.iceModel.elements['eclaims.salesforce.caseNumber'].setSimpleValue(item.CaseNumber);
    this.context.iceModel.elements['eclaims.salesforce.caseId'].setSimpleValue(item.CaseId);
    this.context.iceModel.elements['eclaims.category.choice.flag'].setSimpleValue(item.ExpenseCategory);

    ////eclaims set request type
    if(item.ExpenseCategory==ExpenseCategory.doctors_and_medicines)
    this.context.iceModel.elements['eclaims.selected.requestType'].setSimpleValue("1");
    else if(item.ExpenseCategory==ExpenseCategory.hospital)
    this.context.iceModel.elements['eclaims.selected.requestType'].setSimpleValue("2");
    else if(item.ExpenseCategory==ExpenseCategory.loss_of_income)
    this.context.iceModel.elements['eclaims.selected.requestType'].setSimpleValue("3");

    //end


    this.context.iceModel.elements['eclaims.category.choice.flag'].setSimpleValue(item.ExpenseCategory);
    this.context.iceModel.elements['eclaims.step'].setSimpleValue(3);
    this.context.iceModel.elements['eclaims.update.request.flag'].setSimpleValue(true);


    this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsDetails']);


  }

  formatDate(date: any) {
    if (date == null) return null;
    else {
      return new Date(date);
    }
  }
}

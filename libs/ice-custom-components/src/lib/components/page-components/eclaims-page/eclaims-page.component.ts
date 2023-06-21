import { Component, NgZone, OnInit } from '@angular/core';
import { IceSection,IndexedValue,LifecycleEvent } from '@impeo/ice-core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { ModalService } from '@insis-portal/services/modal.service';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import { PopUpPageComponent } from '../pop-up-page/pop-up-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutService } from '@insis-portal/services/logout.service';
import * as _ from "lodash";
import * as CryptoJS from 'crypto-js';
import { environment } from  "@insis-portal/environments/environment";
import { Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';
import { get } from 'lodash';


@Component({
  selector: 'app-eclaims-page',
  templateUrl: './eclaims-page.component.html',
  styleUrls: ['./eclaims-page.component.scss'],
})


export class EclaimsPageComponent extends PageComponentImplementation implements OnInit
{
  flag: string = '';
  refreshStatus: number;
  NgdialogRef: NgbModalRef;
  redirectUrl:string= String.toString();
  personalContracts: any[] =[];
  status: number = 0;
  dialogRef: NgbModalRef;
  returnUrl: string;
  private renderer: Renderer2;

  private destroy$ = new Subject<void>();


  constructor(
    private localStorage: LocalStorageService,
    private logoutService: LogoutService,
    public ngbModal: NgbModal,
    public modalService: ModalService,
    private spinnerService: SpinnerService,
    private router:Router,
    private zone:NgZone,
    private route: ActivatedRoute,
    private rendererFactory: RendererFactory2
  ) {
    super();
    this.renderer = rendererFactory.createRenderer(null, null)
    this.zone.run(() => { console.log('Do change detection here'); });
  }

  ngOnInit() {
    super.ngOnInit();

    this.context.iceModel.elements["eclaims.process.exit.redirecturl.trigger"].setSimpleValue(false);


    this.flag = this.page.recipe['componentFlag'];
    this.localStorage.setDataToLocalStorage('selectedBranchText',this.page.recipe['selectedBranch']);
    this.refreshStatus=this.localStorage.getDataFromLocalStorage('refreshStatus');

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === 2 || valElem === 3 || valElem ===31) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      },
      (err: any) =>
        console.error('EclaimsGridViewComponent eclaims.step', err)
    );
    this.route.queryParams.subscribe((params: any) => {
      this.returnUrl = params["returnUrl"] || '//';
    })
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '//';
    if (this.refreshStatus == 1) {
      if(this.returnUrl !='//' && this.returnUrl != undefined){
        var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
        var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery, environment.decryption_code).toString(CryptoJS.enc.Utf8));
        if(decodedQuery.contractTypeDeepLink != "99"){
          this.context.iceModel.elements['property.claim.step'].setSimpleValue(1);
          this.router.navigate(['/ice/default/customerArea.motor/viewPropertyNotificationDetails'], {
            queryParams: {
              returnUrl:  this.returnUrl
            }});
        }
      }else{
        this.router.navigate(['/ice/default/customerArea.motor/viewClaims']);
        this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
      }

    }

    this.context.$lifecycle
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: LifecycleEvent) => {
        const action = get(e, ['payload', 'action']);
        if (action === 'action-eclaims-uploadfiles') {
          this.spinnerService.setMessage('Ανέβασμα αρχείων...');
          this.spinnerService.loadingOn();
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      });

    this.context.$lifecycle
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: LifecycleEvent) => {
        const action = get(e, ['payload', 'action']);
        if (action === 'action-eclaims-uploadfiles') {
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);   ///

           //new eclaim....not from update process
          if(!this.context.iceModel.elements['eclaims.update.request.flag'].getValue().forIndex(null))
          this.context.iceModel.elements['eclaims.additional.request']
          .setSimpleValue(this.context.iceModel.elements['eclaims.additional.request'].getValue().forIndex(null)+1);   //using for Home page -Card Claims

          this.spinnerService.loadingOff();
          this.spinnerService.setMessage('');
        }
      });

     this.context.iceModel.elements["eclaims.process.exit.trigger"].$dataModelValueChange
       .pipe(takeUntil(this.destroy$))
       .subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true)
        {

          const popupPageName = 'viewEclaimsLeaveDocsDialog';
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName]))
          return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, {
          windowClass: 'eclaimsModal',
          centered:true,
          backdrop  : 'static',
          keyboard  : false
        });
          this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
        }


      });


      ////Redirect Url when you press 'EXIT'
      this.redirectUrl=this.context.iceModel.elements["eclaims.process.exit.nexturl"].getValue().forIndex(null);
      this.context.iceModel.elements["eclaims.process.exit.redirecturl.trigger"].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: IndexedValue) => {
       if (value.element.getValue().forIndex(null) === true)
       {
         //new eclaim....not from update process
        if(!this.context.iceModel.elements['eclaims.update.request.flag'].getValue().forIndex(null))
          this.context.iceModel.elements['eclaims.additional.request']
          .setSimpleValue(this.context.iceModel.elements['eclaims.additional.request'].getValue().forIndex(null)+1);

        this.redirectUrl=this.context.iceModel.elements["eclaims.process.exit.nexturl"].getValue().forIndex(null);
        if(this.redirectUrl==null)   ///close tab or window case
        {
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
          this.logoutService.logout(true);

        }
        else
        this.router.navigate([this.redirectUrl]);

       }

     });


       ///Close dialog
       this.context.iceModel.elements['eclaims.details.close.dialog.status'].$dataModelValueChange
       .pipe(takeUntil(this.destroy$))
       .subscribe(
         (value: IndexedValue) => {
           const valElem = value.element.getValue().forIndex(null) as boolean;

           if (valElem) {

             this.ngbModal.dismissAll();
             this.context.iceModel.elements['eclaims.details.close.dialog.status'].setSimpleValue(false);

           }
           else
           {


           }
         },
         (err: any) => console.error('eclaims.salesforce.success', err)
       );

    ///personal contracts fill to post salesforce
    let contracts = _.get(this.context.dataStore, 'clientContracts');
    if(contracts)
    {
     for(let item of contracts)
     {
      if (item.Branch === "ΥΓΕΙΑΣ")
      this.personalContracts= [... this.personalContracts,item.ContractKey];
     }
     this.context.iceModel.elements["eclaims.salesforce.personalContracts"].setSimpleValue(this.personalContracts.join());
    }




    //PropertyClaimNotification page !!!!
    this.context.$lifecycle
    .pipe(takeUntil(this.destroy$))
    .subscribe((e: LifecycleEvent) => {
      const action = get(e, ['payload', 'action']);
      if (action === 'action-property-notification-create-case') {
        this.spinnerService.setMessage('Δημιουργία Ticket');
        this.spinnerService.loadingOn();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    });


    this.context.iceModel.elements["property.claims.salesforce.success"].$dataModelValueChange.pipe(takeUntil(this.destroy$)).subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null)==true) {
          this.spinnerService.loadingOff();


          let counter:number= this.context.iceModel.elements['property.claim.additional.request'].getValue().forIndex(null);
          this.context.iceModel.elements['property.claim.additional.request'].setSimpleValue(counter+1);

          const popupPageName = 'viewPropertyClaimNotificationSuccessDialog';
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName]))
          return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, {
          windowClass: 'eclaimsModal',
          centered:true,
          backdrop  : 'static',
          keyboard  : false
        });
          this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          this.context.iceModel.elements["property.claims.salesforce.success"].setSimpleValue(null);
        }
        else if(value.element.getValue().forIndex(null)==false)
        {
           const  popupPageName = "viewPropertyClaimsNotificationFailDialog";
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.modalService.ismodalOpened();
          this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
          this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          this.context.iceModel.elements["property.claims.salesforce.success"].setSimpleValue(null);
        }
      })


    this.context.iceModel.elements["property.claims.close.dialog.status"].$dataModelValueChange.pipe(takeUntil(this.destroy$)).subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) == true) {
          this.spinnerService.loadingOff();
          this.ngbModal.dismissAll();
          this.context.iceModel.elements['property.claims.close.dialog.status'].setSimpleValue(false);
        }
      })




  }



  ngOnDestroy(): void {

    this.context.iceModel.elements["eclaims.process.exit.trigger"].setSimpleValue(false);

    this.destroy$.next();
    this.destroy$.complete();
  }

  getTopSection(): IceSection {
    return this.page.sections.find(
      (section) => section.component === 'EclaimsStepperComponent'
    );
  }

  getGreySections(): IceSection {
    return this.page.sections.find(
      (section) => section.component === 'EclaimsStepperComponent'
    );
  }

  getClassSection(section: IceSection): string {
    switch (section.recipe.cssClass) {
      case 'with-padding':
        return 'with-padding';
      case 'no-padding':
        return 'no-padding';
      case 'regular-padding':
        return 'regular-padding';
    }
  }

  openDialog(): void {
    this.modalService.ismodalOpened();

    const popupPageName = 'eclaimsCoveragesPopUp';
    if (!popupPageName || !this.context.iceModel.pages[popupPageName])
      return console.error(
        `Page ${popupPageName} does not exists, dialog will not be displayed`
      );
    PopUpPageComponent.pageToDisplay =
      this.context.iceModel.pages[popupPageName];

    this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, {
      windowClass: 'xxxlModal',
      centered: true,
    });
    this.NgdialogRef.result.then(
      () => {
        console.log('When user closes');
      },
      () => {
        this.modalService.isModalClosed();
      }
    );
  }

  showCoverages(): boolean {
    const eclaimsStep: number = this.context.iceModel.elements['eclaims.step']
      .getValue()
      .forIndex(null);

    if (eclaimsStep === 2 || eclaimsStep === 3) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit(){

    const importantFlag = RendererStyleFlags2.Important;
    this.renderer.setStyle(document.body, 'height', 'unset', importantFlag);

  }


}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../../section-components/motor-custom-table/motor-custom-table.section.component';
import { Overlay } from '@angular/cdk/overlay';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from  '../../page-components/pop-up-page/pop-up-page.component';
import { ModalService } from  '@insis-portal/services/modal.service';
import { IndexedValue } from '@impeo/ice-core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SalesforceChatComponent } from '@insis-portal/external-components/salesforce-chat/salesforce-chat.component';
import { CommunicationService } from '@insis-portal/services/communication.service';

@Component({
  selector: 'app-eurolife-button',
  templateUrl: './eurolife-button.component.html',
  styleUrls: ['./eurolife-button.component.scss']
})
export class EurolifeButtonComponent extends IceButtonComponent implements OnInit, OnDestroy {
  buttonClass: string;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;
  NgdialogRef: NgbModalRef;
  labelAmendment: any = '';
  labelAmendmentHome: any = '';
  amendment: boolean = false;
  amendmentHome: boolean = false;
  selectedBranch: string;
  bookletsExist: boolean = false;
  typeScope: any;
  private bookletsExistSubs: Subscription;
  private printBookletsSubs: Subscription;
  private printProposalSubs: Subscription;
  private stepStatusSubs: Subscription;
  private errFlagSubs: Subscription;
  private subscriptionArray: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  showSpinnerBtn: boolean = false;
  items: any[] = [];

  loadingButton = 'sections.pendingPayment.loadingButton.label';
  dialogRef2: MatDialogRef<SalesforceChatComponent>;

  constructor(public dialog: MatDialog, private overlay: Overlay, public ngbModal: NgbModal, public modalService: ModalService,
              public communicationService:CommunicationService) {
                super();
              }

  ngOnInit() {
    super.ngOnInit();

    this.selectedBranch = localStorage.getItem('selectedBranch');
    this.typeScope = this.element.recipe['typeScope'];

    if (this.page.name === 'viewAmendmentDetails' || this.page.name === 'viewAmendmentHomeDetails' || this.page.name === 'viewAmendmentLifeDetails' || this.page.name === 'viewAmendmentHealthDetails' || this.page.name === 'viewAmendmentFinanceDetails') {
      this.amendment = true;
      this.labelAmendment = 'ΕΠΟΜΕΝΟ'
    }

     //show the spinner if the flow comes up from Wallet deep link
     if(this.context.iceModel.elements['deeplink.contract.downloadpdf'].getValue().forIndex(null) && this.typeScope === 'contract-pdf-motor')
     this.showSpinnerBtn=true;

    this.stepStatusSubs = this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) === 1 ) {
        this.labelAmendment = 'ΕΠΟΜΕΝΟ'
      }
      if(value.element.getValue().forIndex(null) === 10 || value.element.getValue().forIndex(null)===11) {
        this.showSpinnerBtn=false;
      }
    });
    this.subscriptionArray.add(this.stepStatusSubs);

    this.bookletsExistSubs = this.context.iceModel.elements[
      'policy.details.booklets.exist'
    ].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === '200') {
          this.bookletsExist = true;
        } else if (valElem === '400') {
          this.bookletsExist = false;
        } else {
          this.bookletsExist = false;
          console.error('Error policy.details.booklets.exist', valElem);
        }
      },
      (error) => console.error('EurolifeButtonComponent bookletsExistSubs', error)
    );
    this.subscriptionArray.add(this.bookletsExistSubs);


    //close dialogref2

    this.communicationService.changeEmitted
    .pipe(takeUntil(this.destroy$))
    .subscribe((response:any) =>
      {
        if(response === true && this.dialogRef2!=undefined) {
          this.dialogRef2.close();
         }else{

         }
      })





  }

  get additionalClasses() {
    let additionalClasses = this.element.recipe['additionalClasses'];

    //Booklet
    if (additionalClasses === 'booklets-css') {
      let bookletsCls = 'eurolife_btn-default btn-minw';
      if (this.selectedBranch === '3') {
        bookletsCls += ' eurolife_btn-stroke-green';
      }
      if (this.selectedBranch === '4') {
        bookletsCls += ' eurolife_btn-stroke-home';
      }
      if (this.selectedBranch === '13') {
        bookletsCls += ' eurolife_btn-stroke-home';
      }


      return bookletsCls;
    }


   // Digital Card
   if (additionalClasses === 'digital-card-css')
   {
    let digitalCls = 'eurolife_btn-default btn-minw';
    if (this.selectedBranch === '1' || this.selectedBranch === '99')
    digitalCls += ' eurolife_btn-stroke-red';

    return digitalCls;
  }


    // getRecipeParam('additionalClasses');
    if (additionalClasses == null) return '';
    return additionalClasses;
  }

  get imageSource() {
    let imageSource = this.element.recipe['buttonIcon'];
    if (imageSource == null) return '';
    return imageSource;
  }

  get alignmentClass(): string {
    let dt_name = this.element.recipe['alignmentClass'];
    let dt = this.page.iceModel.dts[dt_name];
    if (dt && (dt.name === 'dt_greencard_download_btn' || dt.name === 'dt_greencard_cancel_btn')) {

      if (this.context.iceModel.elements["greencard.motor.security.greenCardNewNo"].getValue().forIndex(null) == -1)
        this.context.iceModel.elements["greencard.motor.security.greenCardNewNo"].setSimpleValue(null);


      let result = dt.evaluateSync();
      this.buttonClass = result["viewmode"];
      return this.buttonClass
    }
    if (dt) {
      let result = dt.evaluateSync();
      this.buttonClass = result["visibilityPDFButton"];
      return this.buttonClass
    }
    return null;
    // let alignmentClass = this.element.recipe['alignmentClass'];
    // if (alignmentClass == null) return '';
    // return alignmentClass;
  }

  async onClick() {
    this.context.iceModel.elements['policy.details.printBookletsPDFDocument'].setSimpleValue(null);
    this.context.iceModel.elements['policy.details.printProposalPDFDocument'].setSimpleValue(null);
    this.context.iceModel.elements['policy.documents.errFlag'].setSimpleValue(null);

    let dialog = this.element.recipe['modalDialog'];
    if (dialog == null || dialog == undefined)
    {
      this.element.setSimpleValue(this.element.recipe['defaultValue'].StaticValueRule.value);
      //motor part
      if (this.amendment && this.page.name === 'viewAmendmentDetails')
      {
        if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 1)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
        }
        else if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 2)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
          if (this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[1] != undefined) {
            for (var i = 0; i < 2; i++) {
              if (this.context.iceModel.elements["amendments.motor.subcategory.dropdown"].getValue().values[0].value === this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[i].value.toString()) {
                this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[i].label);
              }
            }
          }
          else {
            this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[0].label);
          }
          // this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[0].label);
          this.showSpinnerBtn=true;
          let action = this.context.iceModel.actions["action-amendments-changestep"];
          await action.executionRules[0].execute();
        }
        else {
          this.labelAmendment = 'ΕΠΟΜΕΝΟ';
        }
      }
      //property part
      if (this.amendment && this.page.name === 'viewAmendmentHomeDetails')
      {
        if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 1)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
        }
        else if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 2)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
          if (this.context.iceModel.dts["dt_amendments_dropdown_property_subcategory"].evaluateSync()[1] != undefined) {
            for (var i = 0; i < 2; i++) {
              if (this.context.iceModel.elements["amendments.property.subcategory.dropdown"].getValue().values[0].value === this.context.iceModel.dts["dt_amendments_dropdown_property_subcategory"].evaluateSync()[i].value.toString()) {
                this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_property_subcategory"].evaluateSync()[i].label);
              }
            }
          }
          else {
            this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_property_subcategory"].evaluateSync()[0].label);
          }
          // this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[0].label);
          this.showSpinnerBtn=true;
          let action = this.context.iceModel.actions["action-amendments-changestep"];
          await action.executionRules[0].execute();

        }
        else {
          this.labelAmendment = 'ΕΠΟΜΕΝΟ';
        }
      }

      //health part
      if (this.amendment && this.page.name === 'viewAmendmentHealthDetails')
      {
        if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 1)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
        }
        else if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 2)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
          if (this.context.iceModel.dts["dt_amendments_dropdown_health_subcategory"].evaluateSync()[1] != undefined) {
            for (var i = 0; i < 2; i++) {
              if (this.context.iceModel.elements["amendments.health.subcategory.dropdown"].getValue().values[0].value === this.context.iceModel.dts["dt_amendments_dropdown_health_subcategory"].evaluateSync()[i].value.toString()) {
                this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_health_subcategory"].evaluateSync()[i].label);
              }
            }
          }
          else {
            this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_health_subcategory"].evaluateSync()[0].label);
          }
          // this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[0].label);
          this.showSpinnerBtn=true;
          let action = this.context.iceModel.actions["action-amendments-changestep"];
          await action.executionRules[0].execute();

        }
        else {
          //enable next button with no required filed
          if(this.context.iceModel.elements["amendments.health.subcategory.dropdown"].getValue().forIndex(null) == 3){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else if(this.context.iceModel.elements["amendments.health.subcategory.dropdown"].getValue().forIndex(null) == 4){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else if(this.context.iceModel.elements["amendments.health.subcategory.dropdown"].getValue().forIndex(null) == 7){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else {
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
          }
          this.labelAmendment = 'ΕΠΟΜΕΝΟ';
        }
      }

       //life part
      if (this.amendment && this.page.name === 'viewAmendmentLifeDetails')
      {
        if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 1)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
        }
        else if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 2)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
          if (this.context.iceModel.dts["dt_amendments_dropdown_life_subcategory"].evaluateSync()[1] != undefined) {
            for (var i = 0; i < 2; i++) {
              if (this.context.iceModel.elements["amendments.life.subcategory.dropdown"].getValue().values[0].value === this.context.iceModel.dts["dt_amendments_dropdown_life_subcategory"].evaluateSync()[i].value.toString()) {
                this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_life_subcategory"].evaluateSync()[i].label);
              }
            }
          }
          else {
            this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_life_subcategory"].evaluateSync()[0].label);
          }
          // this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[0].label);
          this.showSpinnerBtn=true;
          let action = this.context.iceModel.actions["action-amendments-changestep"];
          await action.executionRules[0].execute();

        }
        else {
          //enable next button with no required filed
          if(this.context.iceModel.elements["amendments.life.subcategory.dropdown"].getValue().forIndex(null) == 3){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else if(this.context.iceModel.elements["amendments.life.subcategory.dropdown"].getValue().forIndex(null) == 4){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else{
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
          }
          this.labelAmendment = 'ΕΠΟΜΕΝΟ';
        }
      }

      //finance part
      if (this.amendment && this.page.name === 'viewAmendmentFinanceDetails')
      {
        if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 1)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
        }
        else if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 2)
        {
          this.labelAmendment = "ΚΑΤΑΧΩΡΙΣΗ ΑΙΤΗΜΑΤΟΣ";
          if (this.context.iceModel.dts["dt_amendments_dropdown_finance_subcategory"].evaluateSync()[1] != undefined) {
            for (var i = 0; i < 2; i++) {
              if (this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].getValue().values[0].value === this.context.iceModel.dts["dt_amendments_dropdown_finance_subcategory"].evaluateSync()[i].value.toString()) {
                this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_finance_subcategory"].evaluateSync()[i].label);
              }
            }
          }
          else {
            this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_finance_subcategory"].evaluateSync()[0].label);
          }
          // this.context.iceModel.elements["amendments.success.subcategory"].setSimpleValue(this.context.iceModel.dts["dt_amendments_dropdown_motor_subcategory"].evaluateSync()[0].label);
          this.showSpinnerBtn=true;
          let action = this.context.iceModel.actions["action-amendments-changestep"];
          await action.executionRules[0].execute();

        }
        else {
         //enable next button with no required filed
          if(this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].getValue().forIndex(null) == 3){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else if(this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].getValue().forIndex(null) == 4){
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(true);
          }else{
            this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
          }
          this.labelAmendment = 'ΕΠΟΜΕΝΟ';
        }
      }

      super.onClick();

      if (this.typeScope === 'booklets-guide')
      {
        this.showSpinnerBtn = true;
        this.printBookletsSubs = this.context.iceModel.elements[
          'policy.details.printBookletsPDFDocument'
        ].$dataModelValueChange.subscribe(
          (value: IndexedValue) => {
            const valElem = value.element.getValue().forIndex(null);
            if (valElem) {
              this.showSpinnerBtn = false;
            }
          },
          (error) => {
            this.showSpinnerBtn = false;
            console.error('EurolifeButtonComponent printBookletsSubs', error);
          }
        );
        this.subscriptionArray.add(this.printBookletsSubs);
      }

      if (this.typeScope === 'contract-pdf-motor')
      {
        this.showSpinnerBtn = true;
        //1.
        this.printProposalSubs = this.context.iceModel.elements[
          'policy.details.printProposalPDFDocument'
        ].$dataModelValueChange.subscribe(
          (value: IndexedValue) => {
            const valElem = value.element.getValue().forIndex(null);
            if (valElem) {
              this.showSpinnerBtn = false;
            }
          },
          (error) => {
            this.showSpinnerBtn = false;
            console.error('EurolifeButtonComponent printProposalSubs', error);
          }
        );
        this.subscriptionArray.add(this.printProposalSubs);

        //2.
        this.context.iceModel.elements['deeplink.contract.downloadpdf'].$dataModelValueChange
         .pipe(takeUntil(this.destroy$))
         .subscribe(
         (value: IndexedValue) => {
           const valElem = value.element.getValue().forIndex(null);
            if(valElem)
              this.showSpinnerBtn=true;
              else
              this.showSpinnerBtn=false;
              }
          ,
          (err: any) =>{
            this.showSpinnerBtn = false;
            console.error('EurolifeButton printContractSubs', err)
          }
          );

      }

      if (this.typeScope === 'group-health-pdf')
      {
        this.showSpinnerBtn = true;
        this.printProposalSubs = this.context.iceModel.elements['statement.pdf.base64'].$dataModelValueChange.subscribe((value: IndexedValue) => {
            const valElem = value.element.getValue().forIndex(null);
            if (valElem) {
              this.showSpinnerBtn = false;
            }
          },
          (error) => {
            this.showSpinnerBtn = false;
            console.error('EurolifeButtonComponent printProposalSubs', error);
          }
        );
        this.subscriptionArray.add(this.printProposalSubs);
      }

      this.errFlagSubs = this.context.iceModel.elements[
        'policy.documents.errFlag'
      ].$dataModelValueChange.subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem === 1) {
            this.showSpinnerBtn = false;
          }
        },
        (error) => {
          this.showSpinnerBtn = false;
          console.error('EurolifeButtonComponent errFlagSubs', error);
        }
      );
      this.subscriptionArray.add(this.errFlagSubs);

    } else {
     //Salesforce new implementation click-to-chat
        // if(this.element.recipe['dialogpage']=="clicktochat")
        //   this.openSalesforceChatDialog();
        // else
        // {
        //   this.openDialog(dialog);
        // }

        this.openDialog(dialog);


    //
    }
  }

  openSalesforceChatDialog()
  {

    const helpButton = document.querySelector('.embeddedServiceHelpButton') as HTMLElement;
    if (!!helpButton) {
     helpButton.classList.add('dispNone')
     //: helpButton.classList.remove('dispBlock');
    }

    const clickToChat = document.getElementById('click-to-chat');
    !!clickToChat && clickToChat.remove();

    const mainDiv1 = document.createElement('div');
    mainDiv1.id = 'click-to-chat';
    mainDiv1.className = 'click-to-chat';

    const para1 = document.createElement('p');
    para1.className = 'h6';
    para1.id = 'chat-label';
    const node1 = document.createTextNode('Click to Chat');
    para1.appendChild(node1);
    mainDiv1.appendChild(para1);

    const secDiv1 = document.createElement('div');
    secDiv1.className = 'click-to-chat-icon';
    secDiv1.id = 'click-to-chat-icon';
    secDiv1.setAttribute('aria-label', 'icon');
    mainDiv1.appendChild(secDiv1);

    const helpButtonEnabled = document.querySelector('.helpButtonEnabled') as HTMLElement;
    helpButtonEnabled.appendChild(mainDiv1);


    ////salesforce
    var clickToChatLink = document.getElementById('click-to-chat') as HTMLLinkElement;
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });

    clickToChatLink.dispatchEvent(event);



  }

  openDialog(dialog: string): void {
    if (dialog == 'motorCustomTableComponent') {
      this.dialogRef = this.dialog.open(MotorCustomTableComponent, {
        height: '702px',
        width: '385px',
        position: {
          right: "55px",
          bottom: "0px"
        },
        disableClose: true,
        closeOnNavigation: false,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        data: {
          page: this.element.recipe["dialogpage"],
          iceContext: this.page.context
        }
      });
    }
   else if (dialog == 'SalesforceChatComponent')
    {
      this.dialogRef2 = this.dialog.open(SalesforceChatComponent, {
        panelClass: 'custom-dialog-container-ctc',
        disableClose: true,
        closeOnNavigation: false,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        data: {
          // page: Page,
          // iceContext: this.contextService.context
        }
      });
    }
    else if (dialog == 'contactForm')
    {
      const popupPageName = this.element.recipe["dialogpage"];
      if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
      this.modalService.ismodalOpened();
      this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal' });
      this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
    }
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '27.4');

    return svg;
  }

  get svgFillColor() {
    let svgFillColor = this.element.recipe['svgFillColor'];

    if (this.typeScope === 'booklets-guide' && !this.bookletsExist) {
      return 'disable_color';
    }

    if (svgFillColor === 'booklets-css') {
      if (this.selectedBranch === '3') {
        return 'motor_color'
      }
    }

    if (svgFillColor === 'booklets-css') {
      if (this.selectedBranch === '4' || this.selectedBranch === '13') {
        return 'home_color'
      }
    }

    if (svgFillColor == null) return '';
    return svgFillColor;
  }

  ngOnDestroy(): void {
    this.subscriptionArray.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import { ModalService } from '@insis-portal/services/modal.service';
import { IndexedValue } from '@impeo/ice-core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-open-dialog-text',
  templateUrl: './open-dialog-text.component.html',
  styleUrls: ['./open-dialog-text.component.scss']
})
export class OpenDialogTextComponent extends ElementComponentImplementation implements OnInit {

  dialogRef: NgbModalRef;
  section: any;
  text1 = 'elements.popup.text1.label';
  text2 = 'elements.popup.text2.label';
  currentPageAmendments: boolean = false;
  status: number = 0;
  private destroy$ = new Subject<void>();


  constructor(public ngbModal: NgbModal, public modalService: ModalService, private http: HttpClient, private router: Router) {
    super();
  }

  ngOnInit() {

    if (this.page.name == "viewAmendmentDetails" || this.page.name == "viewAmendmentHomeDetails" || this.page.name == "viewAmendmentHealthDetails" || this.page.name == "viewAmendmentLifeDetails" || this.page.name == "viewAmendmentFinanceDetails") {
      this.currentPageAmendments = true
    }

    //AMENDMENTS....open success dialog or  fail dialog
     this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.pipe(takeUntil(this.destroy$)).subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) == 10 || value.element.getValue().forIndex(null) == 11) {
          this.status = value.element.getValue().forIndex(null); //success or fail dialog
          this.openDialog();

        }
      })



    //AMENDMENTS....close dialog (success or fail)

   this.context.iceModel.elements["amendments.details.close.dialog.status"].$dataModelValueChange.pipe(takeUntil(this.destroy$)).subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) == true) {
          this.ngbModal.dismissAll();
        }
      })

  }



  openDialog(): void {

    var popupPageName: string = "";
    switch (this.status) {
      case 10:
        if (this.page.name == "viewAmendmentDetails" ){
          popupPageName = "viewAmendmentSuccessDialog";
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.modalService.ismodalOpened();
          this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
          let caseId = this.context.iceModel.elements['amendments.salesforce.newcaseid'].getValue().forIndex(null);
          let useremail = this.context.iceModel.elements['customer.details.Email'].getValue().forIndex(null);
          let contractId = this.context.iceModel.elements['amendments.details.PolicyNumberHeader'].getValue().forIndex(null);
          // this.http.post('/api/v1/amendments/sendVerificationEmail', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.http.post('/api/v1/amendments/send-emails', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          break;
        }
        if (this.page.name == "viewAmendmentHomeDetails" ){
          popupPageName = "viewAmendmentPropertySuccessDialog";
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.modalService.ismodalOpened();
          this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
          let caseId = this.context.iceModel.elements['amendments.salesforce.newcaseid'].getValue().forIndex(null);
          let useremail = this.context.iceModel.elements['customer.details.Email'].getValue().forIndex(null);
          let contractId = this.context.iceModel.elements['amendments.details.PolicyNumberHeader'].getValue().forIndex(null);
          // this.http.post('/api/v1/amendments/sendVerificationEmail', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.http.post('/api/v1/amendments/send-emails', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          break;
        }
        if (this.page.name == "viewAmendmentHealthDetails" ){
          //TODO to be change
          popupPageName = "viewAmendmentHealthSuccessDialog";
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.modalService.ismodalOpened();
          this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
          let caseId = this.context.iceModel.elements['amendments.salesforce.newcaseid'].getValue().forIndex(null);
          let useremail = this.context.iceModel.elements['customer.details.Email'].getValue().forIndex(null);
          let contractId = this.context.iceModel.elements['amendments.details.PolicyNumberHeader'].getValue().forIndex(null);
          // this.http.post('/api/v1/amendments/sendVerificationEmail', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.http.post('/api/v1/amendments/send-emails', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          break;
        }
        if (this.page.name == "viewAmendmentLifeDetails" ){
          //TODO to be change
          popupPageName = "viewAmendmentLifeSuccessDialog";
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.modalService.ismodalOpened();
          this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
          let caseId = this.context.iceModel.elements['amendments.salesforce.newcaseid'].getValue().forIndex(null);
          let useremail = this.context.iceModel.elements['customer.details.Email'].getValue().forIndex(null);
          let contractId = this.context.iceModel.elements['amendments.details.PolicyNumberHeader'].getValue().forIndex(null);
          // this.http.post('/api/v1/amendments/sendVerificationEmail', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.http.post('/api/v1/amendments/send-emails', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          break;
        }
        if (this.page.name == "viewAmendmentFinanceDetails" ){
          //TODO to be change
          popupPageName = "viewAmendmentFinanceSuccessDialog";
          if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
          PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
          this.modalService.ismodalOpened();
          this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
          let caseId = this.context.iceModel.elements['amendments.salesforce.newcaseid'].getValue().forIndex(null);
          let useremail = this.context.iceModel.elements['customer.details.Email'].getValue().forIndex(null);
          let contractId = this.context.iceModel.elements['amendments.details.PolicyNumberHeader'].getValue().forIndex(null);
          // this.http.post('/api/v1/amendments/sendVerificationEmail', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.http.post('/api/v1/amendments/send-emails', { 'caseId': caseId, 'useremail': useremail, 'contractId': contractId }).subscribe(response => { });
          this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          break;
        }
      case 11:
        popupPageName = "viewAmendmentFailDialog";
        if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
        PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
        this.modalService.ismodalOpened();
        this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
        this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
        break;
    }

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

  }

}

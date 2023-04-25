import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArrayElement, IndexedValue } from '@impeo/ice-core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
} from '@impeo/ng-ice';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EclaimsLwcCreateCaseService } from '../../../services/eclaims-lwc-create-case.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';

@Component({
  selector: 'app-eclaims-grid-view',
  templateUrl: './eclaims-upload.component.html',
  styleUrls: ['./eclaims-upload.component.scss'],
})
export class EclaimsUploadComponent
  extends SectionComponentImplementation
  implements OnInit, OnDestroy
{
  categoryChoice = '';
  NgdialogRef: NgbModalRef;
  caseNumber: string;
  subType = '';
  private destroy$ = new Subject<void>();

  constructor(
    parent: IceSectionComponent,
    private eclaimsLwcCreateCaseService: EclaimsLwcCreateCaseService,
    public ngbModal: NgbModal,
    public modalService: ModalService
  ) {
    super(parent);
  }

  ngOnInit(): void {

     document.body.style.height="100vh";
     document.body.style.margin="0";


    this.categoryChoice = this.context.iceModel.elements['eclaims.category.choice.flag'].getValue().forIndex(null);


    this.context.iceModel.elements['eclaims.category.choice.flag'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          this.categoryChoice = value.element.getValue().forIndex(null);
        },
        (err: any) => console.error('eclaims.category.choice.flag', err)
      );

    this.subType = this.context.iceModel.elements['eclaims.subType.flag'].getValue().forIndex(null);

    this.context.iceModel.elements['eclaims.subType.flag'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          this.subType = value.element.getValue().forIndex(null);
        },
        (err: any) => console.error('eclaims.category.choice.flag', err)
      );

    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem !== 3 && valElem !== 31) {
            const documentsElement = this.context.iceModel.elements[
              'documents'
            ] as ArrayElement;
            documentsElement.reset();
          }
        },
        (err: any) => console.error('EclaimsUploadComponent eclaims.step', err)
      );

    this.iceModel.elements['eclaims.salesforce.success'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          let valElem = value.element.getValue().forIndex(null) as boolean;
          //valElem=false;   //test purpose
          if (valElem && !this.context.iceModel.elements['eclaims.update.request.flag'].getValue().forIndex(null)) {

            const popupPageName = 'viewEclaimsSuccessDialog';
            if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName]))
            return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
            PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];

            this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'eclaimsModal', centered:true });
            this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })

            /////
            this.salesforceDocsUploaded();
          }
         else if (valElem && this.context.iceModel.elements['eclaims.update.request.flag'].getValue().forIndex(null)) {

            const popupPageName = 'viewEclaimsSuccessFromAttachmentDialog';
            if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName]))
            return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
            PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];

            this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'eclaimsModal', centered:true });
            this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })

            /////
            this.salesforceDocsUploaded();
          }

          else if(!valElem)
          {
            const popupPageName = 'viewEclaimsFailDialog';
            if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName]))
            return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
            PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];

            this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'eclaimsModal', centered:true });
            this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
          }
        },
        (err: any) => console.error('eclaims.salesforce.success', err)
      );




  }

  getSubType():string
  {
    return this.subType;
  }

 getCategoryChoice(): string
 {
   return this.categoryChoice;
 }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.iceModel.elements['eclaims.salesforce.success'].setSimpleValue(false);
  }

  private salesforceDocsUploaded(): void {
    const caseId = this.iceModel.elements['eclaims.salesforce.caseId']
      .getValue()
      .forIndex(null) as string;

    this.eclaimsLwcCreateCaseService
      .salesforceDocsUploaded(caseId)
      .subscribe(
        (resp) => {
          if (!resp.Success) {
            resp.Errors && console.error(resp.Errors[0].Message);
          }
        },
        (err: any) => console.error(err)
      );
  }
}

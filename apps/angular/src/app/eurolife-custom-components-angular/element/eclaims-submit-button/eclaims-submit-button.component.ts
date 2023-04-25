import { Component, OnDestroy, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../../section/motor-custom-table/motor-custom-table.section.component';
import { Overlay } from '@angular/cdk/overlay';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IndexedValue } from '@impeo/ice-core';

@Component({
  selector: 'app-eclaims-submit-button',
  templateUrl: './eclaims-submit-button.component.html',
  styleUrls: ['./eclaims-submit-button.component.scss']
})
export class EclaimsSubmitButtonComponent extends IceButtonComponent implements OnInit, OnDestroy {
  buttonClass: string;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;
  NgdialogRef: NgbModalRef;
  labelAmendment: any = '';
  amendment: boolean = false;
  selectedBranch: string;
  bookletsExist: boolean = false;
  typeScope: any;
  showSpinnerBtn: boolean = false;
  loadingButton = 'sections.pendingPayment.loadingButton.label';

  btnLabel = '';

  private destroy$ = new Subject<void>();
  private eclaimsStep = 0;

  constructor(public dialog: MatDialog, private overlay: Overlay, public ngbModal: NgbModal, public modalService: ModalService) { super(); }

  ngOnInit() {
    super.ngOnInit();

    this.eclaimsStep = this.context.iceModel.elements['eclaims.step']
      .getValue()
      .forIndex(null);

    if (this.eclaimsStep === 3 || this.eclaimsStep === 31) {
      this.btnLabel = this.element.recipe['labelSec'];
    } else {
      this.btnLabel =  this.label;
    }

    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem === 3 || valElem === 31) {
            this.btnLabel = this.element.recipe['labelSec'];
          } else {
            this.btnLabel =  this.label;
          }
        },
        (err: any) =>
          console.error('EclaimsSubmitButtonComponent eclaims.step', err)
      );
  }

  get additionalClasses() {
    let additionalClasses = this.element.recipe['additionalClasses'];

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

   //Log start upload time
   if( this.context.iceModel.elements['eclaims.step'].getValue().forIndex(null)==3 || this.context.iceModel.elements['eclaims.step'].getValue().forIndex(null)==31)
   {
   await this.context.iceModel.actions['actionLogStartUploadTime'].executionRules[0].execute();
  // await this.context.executeExecutionRule(actionStartUploadTime.executionRules[0]);
   }
    ///

    let action = this.context.iceModel.actions[this.element.recipe['defaultValue'].StaticValueRule.value];
    await action.executionRules[0].execute();
    //await this.context.executeExecutionRule(executionRule);

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
    this.destroy$.next();
    this.destroy$.complete();
  }
}

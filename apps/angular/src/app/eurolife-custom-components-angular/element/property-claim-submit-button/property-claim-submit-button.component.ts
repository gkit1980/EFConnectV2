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
  selector: 'app-property-claim-submit-button',
  templateUrl: './property-claim-submit-button.component.html',
  styleUrls: ['./property-claim-submit-button.component.scss']
})
export class PropertyClaimSubmitButtonComponent extends IceButtonComponent implements OnInit, OnDestroy {
  buttonClass: string;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;
  NgdialogRef: NgbModalRef;
  selectedBranch: string;
  bookletsExist: boolean = false;
  typeScope: any;
  showSpinnerBtn: boolean = false;
  isDisable: boolean = true;
  loadingButton = 'sections.pendingPayment.loadingButton.label';

  btnLabel = '';
  private destroy$ = new Subject<void>();

  constructor(public dialog: MatDialog, private overlay: Overlay, public ngbModal: NgbModal, public modalService: ModalService) { super(); }

  ngOnInit() {

     this.btnLabel=this.element.recipe['label'].ResourceLabelRule.key.slice(
      1,
      this.element.recipe['label'].ResourceLabelRule.key.length);

    super.ngOnInit();



    this.context.iceModel.elements['property.notification.step2'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === true ) {
          this.isDisable = false;
        }else{
          this.isDisable = true;
        }
      },
      (err: any) =>
        console.error('PropertyClaimSubmitButtonComponent property.notification.step2', err)
    );

    this.context.iceModel.elements['property.notification.submit.step'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === true ) {
       //      this.getSubmitButtonStatus();
        }
      },
      (err: any) =>
        console.error('PropertyClaimSubmitButtonComponent property.notification.submit.step', err)
    );


    this.context.iceModel.elements['property.claim.step'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem === 2 || valElem==3 ) {

            if(this.element.name=="property.notification.next.button")
            {
            this.btnLabel = this.element.recipe['labelSec'];
            this.context.iceModel.elements['property.notification.step2'].setSimpleValue(false);
            }
          }
          if (valElem === 1) {


             this.btnLabel=this.element.recipe['label'].ResourceLabelRule.key.slice(
                   1,
                   this.element.recipe['label'].ResourceLabelRule.key.length);
            }
        },
        (err: any) =>
          console.error('PropertyClaimSubmitButtonComponent property.claim.step', err)
      );
  }

  getSubmitButtonStatus(): void{
    if(this.btnLabel === this.element.recipe['labelSec']){
      this.isDisable = true;
    }

  }

  get additionalClasses() {
    let additionalClasses = this.element.recipe['additionalClasses'];

    ///left button
    if(this.element.name=="property.notification.next.button")
    {

    let dt = this.page.iceModel.dts["property.claim.notification.next.view-mode"];   //viemode
    if (dt && (this.context.iceModel.elements['property.claim.step'].getValue().forIndex(null)==2 ||
    this.context.iceModel.elements['property.claim.step'].getValue().forIndex(null)==3))
    {
    let result= dt.evaluateSync();
    let buttonClass= result["viewMode"];
    if(buttonClass=="disabled")
     {
      additionalClasses=additionalClasses+" "+buttonClass;
      this.isDisable=true;
     }
    else
    {
    additionalClasses=additionalClasses;
    this.isDisable=false;
    }
    return additionalClasses;
    }

    if (additionalClasses == null) return '';
    return additionalClasses;
    }

    //right button
    if(this.element.name=="property.notification.previous.button")
    {

      //Hide on mobile version
     if(this.context.iceModel.elements['home.isMobileDevice'].getValue().forIndex(null))
     {
     additionalClasses="visibility_hidden";
     return additionalClasses;
     }

    let dt = this.page.iceModel.dts["property.claim.notification.previous.view-mode"];   //viemode
    if (dt)
    {
      let result= dt.evaluateSync();
      let buttonClass= result["viewMode"];
      if(buttonClass=="hidden")
        additionalClasses=additionalClasses+" "+"visibility_hidden";
      else
        additionalClasses=additionalClasses;

        this.isDisable=false;

    return additionalClasses;

    if (additionalClasses == null) return '';
    return additionalClasses;
    }
    }
  }



  get imageSource() {
    let imageSource = this.element.recipe['buttonIcon'];
    if (imageSource == null) return '';
    return imageSource;
  }

  async onClick() {

    if(this.context.iceModel.elements['property.claim.step'].getValue().forIndex(null)==1)
    {
      this.context.iceModel.elements['property.claim.step'].setSimpleValue(2);
    }
    else
    {
      if(this.context.iceModel.elements['property.claim.step'].getValue().forIndex(null)==2 && this.element.name=="property.notification.next.button")
      {
        this.context.iceModel.elements['property.claim.step'].setSimpleValue(3);
        let action = this.context.iceModel.actions[this.element.recipe['defaultValue'].StaticValueRule.value];
        await action.executionRules[0].execute();

      }
      if(this.context.iceModel.elements['property.claim.step'].getValue().forIndex(null)==2 && this.element.name=="property.notification.previous.button")
       {
        this.context.iceModel.elements['property.claim.step'].setSimpleValue(1);
        this.context.iceModel.elements['property.notification.step2'].setSimpleValue(true);
       }
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}

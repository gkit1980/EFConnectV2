import { Component, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../../section-components/motor-custom-table/motor-custom-table.section.component';
import { Overlay } from '@angular/cdk/overlay';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import { ModalService } from '@insis-portal/services/modal.service';


@Component({
  selector: 'app-green-card-button',
  templateUrl: './green-card-button.component.html',
  styleUrls: ['./green-card-button.component.scss']
})
export class GreenCardButtonComponent extends IceButtonComponent implements OnInit {
  buttonClass: string;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;
  NgdialogRef: NgbModalRef;

  constructor(public dialog: MatDialog, private overlay: Overlay, public ngbModal: NgbModal, public modalService: ModalService) { super(); }

  ngOnInit() {
    super.ngOnInit();
  }

  get additionalClasses() {
    let additionalClasses = this.element.recipe['additionalClasses'];
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

      try
      {
      if(this.context.iceModel.elements["greencard.motor.security.greenCardNewNo"].getValue().forIndex(null)==-1)
      this.context.iceModel.elements["greencard.motor.security.greenCardNewNo"].setSimpleValue(null);

      let result = dt.evaluateSync();

      this.buttonClass = result["viewmode"];
      return this.buttonClass
      }
      catch(error)
      {
        return "gc-hidden";
      }

    }
    if (dt) {
      let result = dt.evaluateSync();
      this.buttonClass = result["visibilityPDFButton"];
      return this.buttonClass
    }
    return null;
  }

  onClick() {
    let dialog = this.element.recipe['modalDialog'];
    if (dialog == null || dialog == undefined) {
      this.element.setSimpleValue(this.element.recipe['defaultValue'].StaticValueRule.value);
      super.onClick();
      if (this.element.name === 'greencard.motor.cancel.button') {
        this.context.iceModel.elements["greencard.page.index"].setSimpleValue(10);
      }

    } else {
        this.openDialog(dialog);
    }
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
    } else if (dialog == 'contactForm') {
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
    if (svgFillColor == null) return '';
    return svgFillColor;
  }

  get dynamicLabel() {
    let dynamicLabel = '';
    let dt_name = this.element.recipe['dynamicLabel'];
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      let result = dt.evaluateSync();
      dynamicLabel = result["label"];
      return dynamicLabel;
    }

    return this.element.recipe.label.ResourceLabelRule.key.substr(1);

  }
}

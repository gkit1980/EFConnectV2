import { Component, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../../section-components/motor-custom-table/motor-custom-table.section.component';
import { Overlay } from '@angular/cdk/overlay';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import { ModalService } from '@insis-portal/services/modal.service';
import { environment } from '@insis-portal/environments/environment.prod';

@Component({
  selector: 'app-green-card-back-button',
  templateUrl: './green-card-back-button.component.html',
  styleUrls: ['./green-card-back-button.component.scss']
})
export class GreenCardBackButtonComponent extends IceButtonComponent implements OnInit {
  buttonClass: string;

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

      if(this.context.iceModel.elements["greencard.motor.security.greenCardNewNo"].getValue().forIndex(null)==-1)
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
  }

  onClick() {
    this.context.iceModel.elements["greencard.page.index"].setSimpleValue(this.context.iceModel.elements["greencard.page.index"].getValue().values[0].value - 1);
    // let action = this.context.iceModel.actions['action-greencard-changestep'];
    // if (action != null) {
    //   let executionRule = action.executionRules[0];
    //   this.context.executeExecutionRule(executionRule);
    // }
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '26');
    svg.setAttribute('height', '26');

    return svg;
  }


  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  get svgFillColor() {
    let svgFillColor = this.element.recipe['svgFillColor'];
    if (svgFillColor == null) return '';
    return svgFillColor;
  }

}


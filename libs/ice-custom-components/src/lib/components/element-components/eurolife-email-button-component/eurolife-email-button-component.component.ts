import { Component, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../../section-components/motor-custom-table/motor-custom-table.section.component';
import { Overlay } from '@angular/cdk/overlay';
import { IcePrincipalService } from '@impeo/ng-ice';

@Component({
  selector: 'app-eurolife-email-button-component',
  templateUrl: './eurolife-email-button-component.component.html',
  styleUrls: ['./eurolife-email-button-component.component.scss']
})
export class EurolifeEmailButtonComponentComponent extends IceButtonComponent implements OnInit {
  buttonClass: string;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;

  constructor(public dialog: MatDialog, private overlay: Overlay, private icePrincipalService: IcePrincipalService) { super(); }

  ngOnInit() {
    super.ngOnInit();
    this.element.iceModel.elements["customer.details.hideEmailButton"].setSimpleValue(false);
    this.element.iceModel.elements["customer.details.hideMobileButton"].setSimpleValue(false);
    this.element.iceModel.elements["customer.details.verifyMobileSuccess"].setSimpleValue(false);
    this.element.iceModel.elements["customer.details.VerifyMobilePhone"].setSimpleValue(false);
    this.element.iceModel.elements["customer.details.username"].setSimpleValue(this.icePrincipalService.principal.id);
  }

  get additionalClasses() {

    let additionalClasses = this.element.recipe['additionalClasses'];
    // getRecipeParam('additionalClasses');
    if (additionalClasses == null) return '';
    return additionalClasses;
  }

  get hideButton(): boolean {
    if (this.element.iceModel.elements["customer.details.hideEmailButton"].getValue().forIndex(null) || this.element.iceModel.elements["customer.details.hideMobileButton"].getValue().forIndex(null)) {
      // this.element.iceModel.elements["customer.details.hideEmailButton"].setSimpleValue(false);
      return false;
    }
    else {
      return true;
    }

  }

  get imageSource() {
    let imageSource = this.element.recipe['buttonIcon'];
    if (imageSource == null) return '';
    return imageSource;
  }

  get alignmentClass(): string {
    let dt_name = this.element.recipe['alignmentClass'];
    let dt = this.page.iceModel.dts[dt_name];
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

  onClick() {
    let dialog = this.element.recipe['modalDialog'];
    if (dialog == null || dialog == undefined) {
      this.element.setSimpleValue(this.element.recipe['defaultValue'].StaticValueRule.value);
      super.onClick();
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
}


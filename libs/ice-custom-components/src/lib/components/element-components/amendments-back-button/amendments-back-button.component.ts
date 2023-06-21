import { Component, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from  '@insis-portal/services/modal.service';
import { environment } from '@insis-portal/environments/environment.prod';

@Component({
  selector: 'app-amendments-back-button',
  templateUrl: './amendments-back-button.component.html',
  styleUrls: ['./amendments-back-button.component.scss']
})
export class AmendmentsBackButtonComponent extends IceButtonComponent implements OnInit {
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
  }

  onClick() {
    this.context.iceModel.elements["amendments.step2"].setSimpleValue(false);
    if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 1) { //from 1 to 0
      this.context.iceModel.elements["amendments.step2"].setSimpleValue(true);
    }
    this.context.iceModel.elements["amendments.details.step.status"].setSimpleValue(this.context.iceModel.elements["amendments.details.step.status"].getValue().values[0].value - 1);
    // if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 0) {
    //   this.context.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.driver.new.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(null);

    // }
    // if (this.context.iceModel.elements["amendments.details.step.status"].getValue().forIndex(null) === 0) {

    //   //life-health-finance null values
    //   this.context.iceModel.elements["amendments.health.category.dropdown"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.health.subcategory.dropdown"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.life.category.dropdown"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.life.subcategory.dropdown"].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
    //   this.context.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
    //   this.context.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
    //   this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock1`].setSimpleValue(false);
    //   this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock2`].setSimpleValue(false);
    //   this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock3`].setSimpleValue(false);
    //   this.context.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
    //   this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
    //   this.context.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);

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


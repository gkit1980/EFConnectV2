import { Component, OnInit } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';
import { ActivatedRoute, Router } from '@angular/router';


import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-eclaims-back-button',
  templateUrl: './eclaims-back-button.component.html',
  styleUrls: ['./eclaims-back-button.component.scss']
})
export class EclaimsBackButtonComponent extends IceButtonComponent implements OnInit {
  buttonClass: string;

  constructor(
    private router: Router
  ) { super(); }

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

    if(this.context.iceModel.elements['eclaims.step'].getValue() != null ||  this.context.iceModel.elements['property.claim.step'].getValue() != null){
      this.router.navigate(['/ice/default/customerArea.motor/viewClaims']);
    }


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


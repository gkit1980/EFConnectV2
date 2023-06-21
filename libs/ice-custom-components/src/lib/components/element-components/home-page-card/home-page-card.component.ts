import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { DecodeJWTService } from '@insis-portal/services/decode-jwt.service';
import { IceElement, IndexedValue } from '@impeo/ice-core';

@Component({
  selector: 'app-home-page-card',
  templateUrl: './home-page-card.component.html',
  styleUrls: ['./home-page-card.component.scss']
})
export class HomePageCardComponent extends ElementComponentImplementation implements OnInit {
  cardLink: string = '';
  showDaf: boolean = false;

  constructor(private localStorage: LocalStorageService, private decodeJWT: DecodeJWTService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.showDaf = this.localStorage.getDataFromLocalStorage("showDaf");

    this.context.iceModel.elements["hasDaf"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
        this.showDaf=true
      }

    })
}

  getcardTitle(): string {
    return this.element.recipe["title"];
  }

  getCardClass(): string {
    return this.element.recipe["cardColor"];
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: #383b38');
    svg.setAttribute('width', '29');
    svg.setAttribute('height', '30');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  redirectToDafs() {
    //set value in selectedBranch element for Dafs
    let name: string;
    this.element.iceModel.elements["policy.selectedBranch"].setSimpleValue(10);
    this.element.iceModel.elements["selectedcontractbranch"].setSimpleValue(10);
    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    name = this.decodeJWT.decodedToken.name;
    this.element.iceModel.elements["dafs.insured.name"].setSimpleValue(name);
    this.element.iceModel.elements["dafs.product.name"].setSimpleValue('Ομαδικό Ασφαλιστήριο Διαχείρισης Κεφαλαίου');
  }



}

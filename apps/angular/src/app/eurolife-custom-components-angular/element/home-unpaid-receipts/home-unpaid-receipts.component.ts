import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-home-unpaid-receipts',
  templateUrl: './home-unpaid-receipts.component.html',
  styleUrls: ['./home-unpaid-receipts.component.scss']
})
export class HomeUnpaidReceiptsComponent extends ElementComponentImplementation implements OnInit {

  items: any[] = [];
  homeUnpaid = 'elements.homeUnpaid.label';

  constructor() {
    super();
  }

  ngOnInit() {
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: #ef3340');
    svg.setAttribute('width', '17.9');
    svg.setAttribute('height', '17.2');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

}

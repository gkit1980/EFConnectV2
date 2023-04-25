import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit() {
  }

  get imageSource() {
    return this.getIcon('6DC47B61D7BE45A3AB75E4E7D8EC1A99');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    // 
    svg.setAttribute('width', '52');
    svg.setAttribute('height', '64');
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

}

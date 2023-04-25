import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-output-with-icon',
  templateUrl: './output-with-icon.component.html',
  styleUrls: ['./output-with-icon.component.scss']
})
export class OutputWithIconComponent extends ElementComponentImplementation implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }

  get imageSource(): string {
    let imageSource = this.getRecipeParam('url');
    return imageSource == null ? imageSource : '';
  }

  get imageClass(): string {
    let imageClass = this.getRecipeParam('imageClass');
    return imageClass == null ? imageClass : '';
  }

  get values(): any {
    return this.value;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto');

    return svg;
  }

}

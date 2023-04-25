import { Component, OnInit } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";

@Component({
  selector: "app-svg-image",
  templateUrl: "./svg-image.component.html",
  styleUrls: ["./svg-image.component.scss"]
})
export class SvgImageComponent extends ElementComponentImplementation
  implements OnInit {
  static componentName = "SVG Image";

  ngOnInit() {
    super.ngOnInit();
  }

  get imageSource() {
    let result = '';
    let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;
    let dt_name = this.getRecipeParam("url");
    var regex = new RegExp(expression);

    if (dt_name.match(regex)) {
      result = dt_name;
    } else {
      let dt = this.page.iceModel.dts[dt_name];
      result = dt.getOutputValue(null);
    }
    return result;
  }

  get imageClass() {
    let dt_name = this.getRecipeParam("fillColor");
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.getOutputValue(null);
    return result;
  }

  get showBackground() {
    let showBackground = this.getRecipeParam("showBackground");
    return showBackground;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto');
    svg.setAttribute('class','test')

    return svg;
  }
}

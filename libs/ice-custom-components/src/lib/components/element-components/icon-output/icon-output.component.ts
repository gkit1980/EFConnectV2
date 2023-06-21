import { Component } from "@angular/core";
import {
  SectionComponentImplementation,
  IceSectionComponent,
  ElementComponentImplementation
} from "@impeo/ng-ice";
import { environment } from "@insis-portal/environments/environment";

@Component({
  selector: "app-icon-output",
  templateUrl: "./icon-output.component.html",
  styleUrls: ["./icon-output.component.scss"]
})
export class IconOutputComponent extends ElementComponentImplementation {
  get icon() {
    // Read first class
    let iconCode = this.getRecipeParam("iconCode");
    let icon = this.getIcon(iconCode);
    return icon;
  }

  get text() {
    // Read first class
    let text = this.getRecipeParam("text");
    return text;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");

    return svg;
  }
}

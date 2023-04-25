import { Component, OnInit } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-consent-initial-steps",
  templateUrl: "./consent-initial-steps.component.html",
  styleUrls: ["./consent-initial-steps.component.scss"]
})
export class ConsentInitialStepsComponent extends ElementComponentImplementation
  implements OnInit {
  steps: any;
  stepsArray: any = [];

  ngOnInit() {
    super.ngOnInit();
    this.steps = this.getRecipeParam("steps");
    for (let i = 0; i < this.steps; i++) {
      let index = i + 1;
      let icon = this.getRecipeParam("icon" + index);
      let label = this.getRecipeParam("label" + index);
      let text = this.getRecipeParam("text" + index);
      this.stepsArray.push({
        icon: icon,
        label: label,
        text: text
      });
    }
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto");
    svg.setAttribute("width", "42");
    svg.setAttribute("height", "38");
    return svg;
  }

  handleHandSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "26");
    return svg;
  }
}

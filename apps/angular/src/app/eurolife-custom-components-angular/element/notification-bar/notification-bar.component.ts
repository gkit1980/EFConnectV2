import { Component, OnInit } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";

@Component({
  selector: "app-notification-bar",
  templateUrl: "./notification-bar.component.html",
  styleUrls: ["./notification-bar.component.scss"]
})
export class NotificationBarComponent extends ElementComponentImplementation
  implements OnInit {
  imageSource: string;
  notificationType: string;
  notificationText: string;

  ngOnInit() {
    super.ngOnInit();
    this.imageSource = this.getRecipeParam("url");
    this.notificationType = this.getRecipeParam("image");
    this.notificationText = this.getRecipeParam("text");
  }

  get notificationValue() {
    return this.value;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "30");

    return svg;
  }
}

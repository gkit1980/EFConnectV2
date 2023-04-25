import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-content-walkthrough',
  templateUrl: './content-walkthrough.component.html',
  styleUrls: ['./content-walkthrough.component.scss']
})
export class ContentWalkthroughComponent extends SectionComponentImplementation implements OnInit {


  text: string;
  pageNum: number;
  next: string;
  previous: string;
  iconCode: string = "";
  numberOfDots: any = [];


  constructor(parent: IceSectionComponent) {
    super(parent);
  }


  ngOnInit() {
    this.text = this.recipe["text"];
    this.pageNum = this.recipe["pageNum"];
    this.next = this.recipe["next"];
    this.previous = this.recipe["previous"];
    for (var i = 1; i <= this.context.iceModel.elements[this.recipe["numberOfScreens"]].getValue().forIndex(null); i++) {
      this.numberOfDots.push(i);
    }
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  iconNext() {
    // Read first class
    let icon = ""
    if (this.next === "ΕΠΟΜΕΝΟ")
      icon = this.getIcon("C8705EB508D542E59548EF002F938768");

    return icon;
  }

  iconPrevious() {
    let icon = ""
    if (this.previous == "ΠΡΟΗΓΟΥΜΕΝΟ")
      icon = this.getIcon("C8705EB508D542E59548EF002F938768");
    return icon;
  }


  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {

    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    return svg;
  }

  handleSVGReverse(svg: SVGElement, parent: Element | null): SVGElement {

    svg.setAttribute("style", "display: block;transform: rotate(180deg);");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    return svg;
  }


  start(): boolean {
    return true;
  }

  end(): boolean {
    return true;
  }

  dots(): boolean {
    return true;
  }


  showDot(page: number): boolean {
    if (this.pageNum == page)
      return true;
    else
      return false;
  }


  getActive(page: number): string {
    if (this.pageNum == page)
      return "dot-active";
    else
      return "";
  }

  onClickNext() {
    if (this.page.name.includes('Communication')) {
      this.context.iceModel.elements["walkthrough.page.index.communication"].setSimpleValue(this.pageNum + 1);
    }
    else if (this.page.name.includes('Home')) {
      this.context.iceModel.elements["walkthrough.page.index"].setSimpleValue(this.pageNum + 1);
    }
    else if (this.page.name.includes('PolicyDetails')) {
      this.context.iceModel.elements["walkthrough.page.index.policyDetails"].setSimpleValue(this.pageNum + 1);
    }
    else if (this.page.name.includes('MyProfile')) {
      this.context.iceModel.elements["walkthrough.page.index.customerProfile"].setSimpleValue(this.pageNum + 1);
    }
  }

  onClickPrevious() {
    if (this.page.name.includes('Communication')) {
      this.context.iceModel.elements["walkthrough.page.index.communication"].setSimpleValue(this.pageNum - 1);
    }
    else if (this.page.name.includes('Home')) {
      this.context.iceModel.elements["walkthrough.page.index"].setSimpleValue(this.pageNum - 1);
    }
    else if (this.page.name.includes('PolicyDetails')) {
      this.context.iceModel.elements["walkthrough.page.index.policyDetails"].setSimpleValue(this.pageNum - 1);
    }
    else if (this.page.name.includes('MyProfile')) {
      this.context.iceModel.elements["walkthrough.page.index.customerProfile"].setSimpleValue(this.pageNum - 1);
    }
  }



}

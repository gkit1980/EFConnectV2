import { environment } from "./../../../../environments/environment";

import {
  Component,
  Inject,
  QueryList,
  EventEmitter,
  Output,
  ViewChildren
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageComponentImplementation } from "@impeo/ng-ice";
import { IceContext } from "@impeo/ice-core";
import * as _ from "lodash";

export interface PopupPageData {
  page: string;
  iceContext: IceContext;
}

@Component({
  selector: "app-motor-custom-table-section",
  templateUrl: "./motor-custom-table.section.component.html",
  styleUrls: ["./motor-custom-table.section.component.scss"]
})
export class MotorCustomTableComponent extends PageComponentImplementation {
  // public static componentName = 'PopupPage';
  _page: string;
  // @ViewChildren(IceSectionComponent) sectionComponents: QueryList<IceSectionComponent>
  // @Output() triggerElementValidation =new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<MotorCustomTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupPageData
  ) {
    super();
    this._page = data.page;
    // this.page = data.iceContext.iceModel.pages[data.page];
    this.page = data.iceContext.iceModel.pages[data.page];
    this.context.iceModel.elements["pagebutton"].setSimpleValue(this.page.name);
    //  this.context=data.iceContext;
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }


  // ngOnInit(){
  //     var _this = this;
  //     if (_.isArray(_this.recipe.sections)) {
  //         _this.recipe.sections.forEach(function (sectionRecipe:any)
  //         {
  //             IceSection.build(_this.page, sectionRecipe);
  //             _this.sectionComponents=_this.recipe.sections;
  //         });
  //     }
  //    _this.triggerElementValidation.subscribe(function () {
  //         _this.sectionComponents.forEach(function (component) { return component.triggerElementValidation(); });
  //    });
  // };

  onNoClick() {
    this.dialogRef.close();


    if (
      this.context.iceModel.elements["clicktocall.go-to-calendar"]
        .getValue()
        .forIndex(null) == true ||
      this.context.iceModel.elements["clicktocall.go-to-time-picker"]
        .getValue()
        .forIndex(null) == true
    ) {
      this.context.iceModel.elements[
        "clicktocall.go-to-calendar"
      ].setSimpleValue(null);
      this.context.iceModel.elements[
        "clicktocall.go-to-time-picker"
      ].setSimpleValue(null);
    }
  }

  get headsetImageSource() {
    if (this.page.labelRule.getPageTitle() == "CLICK TO CALL")
      return this.getIcon("5493B343B88D4379A228295D850C3C6A");

    if (this.page.labelRule.getPageTitle() == "CLICK TO CHAT")
      return this.getIcon("3BD95EC9DFCD47F3822636935DF14DB3");
  }

  handleHeadsetSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "32");
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  get closeImageSource() {
    return this.getIcon("9E57CCB2D5E54B739BF6D3DE8551E683");
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "27");
    svg.setAttribute("height", "27");
    return svg;
  }

  // window.addEventListener('resize', () => any : {
  //   // We execute the same script as before
  //   let vh = window.innerHeight * 0.01;
  //   document.documentElement.style.setProperty('--vh', `${vh}px`);
  // });

}

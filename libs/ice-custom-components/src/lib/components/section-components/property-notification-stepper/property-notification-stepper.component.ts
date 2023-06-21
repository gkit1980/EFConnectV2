import { Component } from "@angular/core";
import {
  IceSectionComponent,
  SectionComponentImplementation
} from "@impeo/ng-ice";
import { IndexedValue } from '@impeo/ice-core';
import * as _ from "lodash";
import { environment } from "@insis-portal/environments/environment";

@Component({
  selector: "app-property-notification-stepper",
  templateUrl: "./property-notification-stepper.component.html",
  styleUrls: ["./property-notification-stepper.component.scss"]
})
export class PropertyNotificationStepperComponent extends SectionComponentImplementation {
  stepperState: any = {
    step: 1,
    stepsState: [
      { state: "active", title: "Επιλογή κατοικίας" },
      { state: "inactive", title: "Περιγραφή Ζημιάς" }
    ]
  };

  selectedBranch: number;
  lowScreenSizeStepper: boolean = false;
  conditionBranch: string;
  branch: string;


  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  ngOnInit() {

    this.selectedBranch = this.iceModel.elements["selectedcontractbranch"].getValue()
      .values[0].value

    this.context.iceModel.elements['property.claim.step'].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        this.manageSteps(value.element.getValue().forIndex(null))
      })
  }

  get svgIcon() {
    return this.getIcon("F7877569C4C74C9F9D432D5A01DDC0A0");
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute("width", "21");
    svg.setAttribute("height", "21");
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  checkActive(step: number): string {
    return this.stepperState.stepsState[step].state;
  }

  checkActiveClass(step: number): string {
    if (this.stepperState.stepsState[step].state === 'active') {
      this.getBranchClass(this.selectedBranch)
    } else {
      return this.stepperState.stepsState[step].state;
    }
  }

  getBranchClass(branch: any): string {
    switch (branch) {
      case 9:
        return 'life_color';
      case 9:
        return 'life_color';
      case 2:
        return 'health_color';
      case 3:
        return 'motor_color';
      case 13:
        return 'house_color';
      default:
        return 'otherpc_color';
    }
  }


  getStepperStep(){
    return this.stepperState.step;
  }

  manageSteps(step: any) {
    if(step==1)
    {
      this.stepperState.step = step;
      this.stepperState.stepsState[0].state="done";
      this.stepperState.stepsState[1].state="inactive";
    }
    if(step==2)
    {
      this.stepperState.step = step;
      this.stepperState.stepsState[1].state="done";
      this.stepperState.stepsState[0].state="active";
    }

  }
}

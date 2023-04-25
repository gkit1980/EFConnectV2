import { Component } from "@angular/core";
import {
  IceSectionComponent,
  SectionComponentImplementation
} from "@impeo/ng-ice";
import { IndexedValue } from '@impeo/ice-core';
import * as _ from "lodash";
import { environment } from "../../../../environments/environment";
//import internal = require("assert");

@Component({
  selector: "app-amendments-stepper",
  templateUrl: "./amendments-stepper.component.html",
  styleUrls: ["./amendments-stepper.component.scss"]
})
export class AmendmentsStepperComponent extends SectionComponentImplementation {
  stepperState: any = {
    step: 0, //steps 0-1-2 states active-inactive-done
    stepsState: [
      { state: "active", title: "Είδος αλλαγής" },
      { state: "inactive", title: "Επιπρόσθετα στοιχεία" },
      { state: "inactive", title: "Ολοκλήρωση" }
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

    this.context.iceModel.elements['amendments.details.step.status'].$dataModelValueChange
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

  manageSteps(step: any) {
    if (step < 2) {
      this.stepperState.step = step;
    }
    if (this.stepperState.stepsState[step - 1] != undefined) {
      if (step === 3) {
        this.stepperState.stepsState[step - 1].state = 'done'
      } else if (step < 3){
        this.stepperState.stepsState[step - 1].state = 'done'
        this.stepperState.stepsState[step].state = 'active'
      }
    }

  }
}

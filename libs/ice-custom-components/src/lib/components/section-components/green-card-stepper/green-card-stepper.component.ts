import { Component, OnDestroy } from "@angular/core";
import { IceSectionComponent, SectionComponentImplementation } from "@impeo/ng-ice";
import { IndexedValue,LifecycleEvent } from '@impeo/ice-core';
import * as _ from "lodash";
import { environment } from "@insis-portal/environments/environment";
import { SpinnerService } from "@insis-portal/services/spinner.service";


@Component({
  selector: 'app-green-card-stepper',
  templateUrl: './green-card-stepper.component.html',
  styleUrls: ['./green-card-stepper.component.scss']
})
export class GreenCardStepperComponent extends SectionComponentImplementation implements OnDestroy {


  stepperState: any;
  selectedBranch: number;
  lowScreenSizeStepper: boolean = false;

  constructor(parent: IceSectionComponent, private spinnerService: SpinnerService) {
    super(parent);
  }

  ngOnInit() {

    this.setInitialStep();

    // this.context.$actionEnded.subscribe(async (actionName: string) => {
    //   if (actionName.includes("actionGetPolicies")) {
    //  //   this.context.iceModel.elements["greencard.refresh.status"].setSimpleValue(true);   //for refresh purpose of green card
    //  let action = this.context.iceModel.actions['action-greencard-get-token'];
    //  for(let i=0;i<action.executionRules.length;i++)
    //  {
    //    let executionRule =  action.executionRules[i];
    //    await this.context.executeExecutionRule(executionRule);
    //  }
    //   }
    // });
     ///replace with
    this.context.$lifecycle.subscribe( async (e:LifecycleEvent) => {


      const actionName = _.get(e, ['payload', 'action']);

      if (actionName.includes("actionGetPolicies") && e.type==="ACTION_FINISHED") {
     //   this.context.iceModel.elements["greencard.refresh.status"].setSimpleValue(true);   //for refresh purpose of green card
     let action = this.context.iceModel.actions['action-greencard-get-token'];
     for(let i=0;i<action.executionRules.length;i++)
     {
       await action.executionRules[i].execute();

     }
      }
    });




    this.selectedBranch = this.iceModel.elements["selectedcontractbranch"].getValue()
      .values[0].value
    this.context.iceModel.elements['greencard.page.index'].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) != 10) {
          this.manageSteps(value.element.getValue().forIndex(null))
        }
        else {
          this.setInitialStep();
        }
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
      default:
        return 'otherpc_color';
    }
  }

  setInitialStep() {
    this.stepperState = {
      step: 0,
      stepsState: [
        { state: "active", title: "Στοιχεία Οχήματος" },
        { state: "inactive", title: "Στοιχεία Ασφαλισμένου Οδηγού" },
        { state: "inactive", title: "Υπόλοιποι Οδηγοί" }
      ]
    };
  }

  manageSteps(step: any) {
    if (step === 0) {
      this.setInitialStep();
    }
    else {
      if (step < 2) {
        this.stepperState.step = step;
      }
      if (step === 3) {
        this.stepperState.stepsState[step - 1].state = 'done'
      } else if (step < 3) {
        this.stepperState.stepsState[step - 1].state = 'done'
        this.stepperState.stepsState[step].state = 'active'
      }
      if (step === 1) {
        this.stepperState.stepsState[2].state = 'inactive'
      }
    }

  }

  ngOnDestroy(): void {
    this.context.iceModel.elements['greencard.page.index'].setSimpleValue(0);
  }



}



import { Component, OnInit } from '@angular/core';
import { environment } from "@insis-portal/environments/environment";
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { IndexedValue } from "@impeo/ice-core";

@Component({
  selector: 'app-eclaims-stepper',
  templateUrl: './eclaims-stepper.component.html',
  styleUrls: ['./eclaims-stepper.component.scss']
})
export class EclaimsStepperComponent extends SectionComponentImplementation implements OnInit {

  stepperState: any = {
    step: 0,    //steps 0-1-2 states active-inactive-done
    stepsState: [
      { state: 'active', title: 'Επιλογή ασφαλιστηρίου & αντισυμβαλλόμενου' },
      { state: 'inactive', title: 'Στοιχεία αιτήματος' },
      { state: 'inactive', title: 'Επισύναψη εγγράφων' }
    ]
  };

  lowScreenSizeStepper: boolean = false;
  private eclaimsStep = 0;

  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  ngOnInit() {
    this.eclaimsStep = this.context.iceModel.elements['eclaims.step']
      .getValue()
      .forIndex(null);

    this.checkStepper(this.eclaimsStep);

    this.context.iceModel.elements[
      'eclaims.step'
    ].$dataModelValueChange.subscribe((value: IndexedValue) => {
      this.eclaimsStep = value.element.getValue().forIndex(null);
      this.checkStepper(this.eclaimsStep);
    });
  }

  private checkStepper(eclaimsStep: number): void {
    if (eclaimsStep === 1 || eclaimsStep === 11) {
      this.stepperState.step = 0;
      this.stepperState.stepsState[0].state = 'active';
      this.stepperState.stepsState[1].state = 'inactive';
      this.stepperState.stepsState[2].state = 'inactive';
    }

    if (eclaimsStep === 2  || eclaimsStep === 12 || eclaimsStep === 13 || eclaimsStep === 14) {
      this.stepperState.step = 1;
      this.stepperState.stepsState[0].state = 'done';
      this.stepperState.stepsState[1].state = 'active';
      this.stepperState.stepsState[2].state = 'inactive';
    }

    if (eclaimsStep === 3 || eclaimsStep === 31) {
      this.stepperState.step = 2;
      this.stepperState.stepsState[0].state = 'done';
      this.stepperState.stepsState[1].state = 'done';
      this.stepperState.stepsState[2].state = 'active';
    }
  }

  get svgIcon() {
    return this.getIcon('F7877569C4C74C9F9D432D5A01DDC0A0');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '21');
    svg.setAttribute('height', '21');
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  checkActive(step: number): string {
    return this.stepperState.stepsState[step].state;
  }

  getStepperStep(){

    return this.stepperState.step;
  }

  getStepperStepName() :string{

    return this.stepperState.stepsState[this.stepperState.step].title;
  }

}

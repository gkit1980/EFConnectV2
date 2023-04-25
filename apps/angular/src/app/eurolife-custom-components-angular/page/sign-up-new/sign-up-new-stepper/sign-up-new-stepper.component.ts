import { environment } from './../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../../../services/signup.service';

@Component({
  selector: 'app-sign-up-new-stepper',
  templateUrl: './sign-up-new-stepper.component.html',
  styleUrls: ['./sign-up-new-stepper.component.scss']
})


export class SignUpNewStepperComponent implements OnInit {

  stepperState: any = {
    step: 0,    //steps 0-1-2 states active-inactive-done
    stepsState: [
      { state: 'active', title: 'Κινητό τηλέφωνο' },
      { state: 'inactive', title: 'Επιβεβαίωση Κινητού' },
      { state: 'inactive', title: 'Προσωπικός Κωδικός' }
    ]
  };

  lowScreenSizeStepper: boolean = false;
  constructor(private signupService: SignupService) {

    //intial value
  //  this.signupService.setStepperState(0, "active");

   
  }

  ngOnInit() {

    this.signupService.stepperChange.subscribe(state => {
      this.stepperState = state;
    });
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

}


import { environment } from '../../../../../environments/environment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignupGroupService } from '../../../../services/signupgroup.service';
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sign-up-group-stepper',
  templateUrl: './sign-up-group-stepper.component.html',
  styleUrls: ['./sign-up-group-stepper.component.scss']
})


export class SignUpGroupStepperComponent implements OnInit,OnDestroy {

  stepperState: any = {
    step: 0,    //steps 0-1-2-3 states active-inactive-done
    stepsState: [
      { state: 'active', title: 'Φόρμα στοιχείων' },
      { state: 'inactive', title: 'Κινητό τηλέφωνο' },
      { state: 'inactive', title: 'Επιβεβαίωση Κινητού' },
      { state: 'inactive', title: 'Προσωπικός Κωδικός' }
    ]
  };

  lowScreenSizeStepper: boolean = false;
  private destroy$ = new Subject<void>();
  constructor(private signupGroupService: SignupGroupService) {

    //intial value
   //this.signupGroupService.setStepperState(0, "active");
   
  }

  ngOnInit() {

    this.signupGroupService.stepChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(step => {
      this.checkStepper(step)
    });
  }

  private checkStepper(step: number): void {
    if (step === 0) {
      this.stepperState.step = 0;
      this.stepperState.stepsState[0].state = 'active';
      this.stepperState.stepsState[1].state = 'inactive';
      this.stepperState.stepsState[2].state = 'inactive';
      this.stepperState.stepsState[3].state = 'inactive';
    }

    if (step === 1) {
      this.stepperState.step = 1;
      this.stepperState.stepsState[0].state = 'done';
      this.stepperState.stepsState[1].state = 'active';
      this.stepperState.stepsState[2].state = 'inactive';
      this.stepperState.stepsState[3].state = 'inactive';
    }

    if (step === 2) {
      this.stepperState.step = 2;
      this.stepperState.stepsState[0].state = 'done';
      this.stepperState.stepsState[1].state = 'done';
      this.stepperState.stepsState[2].state = 'active';
      this.stepperState.stepsState[3].state = 'inactive';
    }
    if (step === 3) {
      this.stepperState.step = 2;
      this.stepperState.stepsState[0].state = 'done';
      this.stepperState.stepsState[1].state = 'done';
      this.stepperState.stepsState[2].state = 'done';
      this.stepperState.stepsState[3].state = 'active';
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


  checkActiveLeft(step: number): string {
    if((step==1) && this.stepperState.stepsState[step].state=="active")
    return "inactive";
    else
    return this.stepperState.stepsState[step].state;
  }
  checkActiveRight(step: number): string {
    if((step==1 || step==2 || step==3) && this.stepperState.stepsState[step].state=="active")
    return "inactive";
    else
    return this.stepperState.stepsState[step].state;
  }


  getStepperStep(){

    return this.stepperState.step;
  }



  ngOnDestroy()
    {
      this.destroy$.next();
      this.destroy$.complete();
    }


}


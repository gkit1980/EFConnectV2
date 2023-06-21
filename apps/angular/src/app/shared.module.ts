import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from "ng-inline-svg";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SignUpNewStepperComponent } from './components/sign-up-new/sign-up-new-stepper/sign-up-new-stepper.component';
import { OtpPartitionedInputComponent } from '../../../../libs/ice-custom-components/src/lib/components/element-components/otp-partitioned-input/otp-partitioned-input.component';
//import { NgOtpInputModule } from  'ng-otp-input';
import { SignUpGroupStepperComponent } from './components/sign-up-group/sign-up-group-stepper/sign-up-group-stepper.component';






@NgModule({
  declarations: [SignUpNewStepperComponent,OtpPartitionedInputComponent, SignUpGroupStepperComponent],
  providers:[],
  imports: [
  NgxSkeletonLoaderModule,
  CommonModule,
  InlineSVGModule.forRoot(),
  //NgOtpInputModule
  ],
  exports: [NgxSkeletonLoaderModule,SignUpNewStepperComponent,OtpPartitionedInputComponent,
   // NgOtpInputModule,
     InlineSVGModule,SignUpGroupStepperComponent]
})

export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {Routes,RouterModule} from '@angular/router';
import { PipesModule } from "./pipes.module";
import { SignUpGuard } from "./services/guards/sign-up-guard.service";
import { ResourceResolver } from "./resolvers/resource.resolver";
 import { SignupService } from "./services/signup.service";
 import { SharedModule } from "./shared.module";

///forgot password process



import { 
  MatToolbarModule, 
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule ,
  MatStepperModule,
  MatInputModule
} from '@angular/material';
import { ForgotPasswordComponent } from './eurolife-custom-components-angular/page/forgot-password/forgot-password.component';
import { ForgotPasswordRecoveryComponent } from './eurolife-custom-components-angular/page/forgot-password-recovery/forgot-password-recovery.component';
import { ForgotPasswordResetComponent } from './eurolife-custom-components-angular/page/forgot-password-reset/forgot-password-reset.component';

const routes :Routes =  
[  
    {
        path: "",
        component: ForgotPasswordComponent,
        resolve: { resources: ResourceResolver },
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "recovery",
            resolve: { resources: ResourceResolver }
          },
          {
            path: "recovery",
            component: ForgotPasswordRecoveryComponent,
            resolve: { resources: ResourceResolver }
          },
          {
            path: "reset",
            pathMatch: "full",
            component: ForgotPasswordResetComponent,
            resolve: { resources: ResourceResolver }
          }
        ]
      }
]  

@NgModule({
  declarations: [ForgotPasswordComponent,ForgotPasswordRecoveryComponent,ForgotPasswordResetComponent],
  providers: [SignUpGuard,SignupService],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,  
    SharedModule,
    MatToolbarModule, 
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule ,
    MatStepperModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)  
    ],
    exports:
    [
      FormsModule,
      MatToolbarModule, 
      MatButtonModule,
      MatSidenavModule,
      MatIconModule,
      MatListModule ,
      MatStepperModule,
      MatInputModule,
      ReactiveFormsModule
    ]
})
export class ForgotPasswordModule { }

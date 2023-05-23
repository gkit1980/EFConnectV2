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




import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule}   from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';


import { ForgotPasswordComponent } from './eurolife-custom-components-angular/page/forgot-password/forgot-password.component';
import { ForgotPasswordRecoveryComponent } from './eurolife-custom-components-angular/page/forgot-password-recovery/forgot-password-recovery.component';
import { ForgotPasswordResetComponent } from './eurolife-custom-components-angular/page/forgot-password-reset/forgot-password-reset.component';

const routes :Routes =
[
    {
        path: "",
        component: ForgotPasswordComponent,
        resolve: { runtime: ResourceResolver },
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "recovery",
            resolve: { runtime: ResourceResolver }
          },
          {
            path: "recovery",
            component: ForgotPasswordRecoveryComponent,
            resolve: { runtime: ResourceResolver }
          },
          {
            path: "reset",
            pathMatch: "full",
            component: ForgotPasswordResetComponent,
            resolve: { runtime: ResourceResolver }
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {Routes,RouterModule} from '@angular/router';
import { PipesModule } from "./pipes.module";
import { SharedModule } from "./shared.module";
import { SignUpGuard } from "./services/guards/sign-up-guard.service";
import { ResourceResolver } from "./resolvers/resource.resolver";

//import { SignupService } from "./services/signup.service";

///new sign up process
import { SignUpGroupComponent } from "./eurolife-custom-components-angular/page/sign-up-group/sign-up-group.component";
import { SignUpGroupNewConfirmationComponent } from "./eurolife-custom-components-angular/page/sign-up-group/sign-up-group-new-confirmation/sign-up-group-new-confirmation.component";
import { SignUpGroupDataFormComponent } from "./eurolife-custom-components-angular/page/sign-up-group/sign-up-group-data-form/sign-up-group-data-form.component";
import { SignUpGroupMobileComponent } from "./eurolife-custom-components-angular/page/sign-up-group/sign-up-group-mobile/sign-up-group-mobile.component";
import { SignUpGroupValidateSmsComponent } from "./eurolife-custom-components-angular/page/sign-up-group/sign-up-group-validate-sms/sign-up-group-validate-sms.component";
import { SignUpGroupFinalFormComponent } from "./eurolife-custom-components-angular/page/sign-up-group/sign-up-group-final-form/sign-up-group-final-form.component";
//import { SignUpGroupAreaComponent } from "./eurolife-custom-components-angular/element/sign-up-group-area/sign-up-group-area.component";

// import {
//   MatToolbarModule,
//   MatButtonModule,
//   MatSidenavModule,
//   MatIconModule,
//   MatListModule ,
//   MatStepperModule,
//   MatInputModule
// } from '@angular/material';

import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule}   from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';

const routes :Routes =
[
  {
    path: "",
    component: SignUpGroupComponent,
    resolve: { resources: ResourceResolver },
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "form",
        resolve: { resources: ResourceResolver }
      },
      {
        path: "firstconfirmation",
        component: SignUpGroupNewConfirmationComponent,
        resolve: { resources: ResourceResolver }
      },
      {
        path: "createaccount",
        component: SignUpGroupDataFormComponent,
        resolve: { resources: ResourceResolver }
      },
      {
        path: "confirmation",
        component: SignUpGroupMobileComponent,
        resolve: { resources: ResourceResolver }
      },
      {
        path: "smsvalidation",
        component: SignUpGroupValidateSmsComponent,
        resolve: { resources: ResourceResolver }
      },
      {
        path: "finalizeaccount",
        component: SignUpGroupFinalFormComponent,
       //canActivate: [SignUpGuard],
        resolve: { resources: ResourceResolver }
      }

    ]
  }
]

@NgModule({
  declarations: [
    SignUpGroupComponent,
    SignUpGroupNewConfirmationComponent,
    SignUpGroupDataFormComponent,
    SignUpGroupMobileComponent,
    SignUpGroupValidateSmsComponent,
    SignUpGroupFinalFormComponent
    //SignUpGroupAreaComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    PipesModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule ,
    MatStepperModule,
    MatInputModule,
    ReactiveFormsModule,
    NgbModule,
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
      ReactiveFormsModule,
      SharedModule
    ]
})
export class SignUpGroupModule { }

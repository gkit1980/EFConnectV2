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
import { SignUpNewComponent } from "./eurolife-custom-components-angular/page/sign-up-new/sign-up-new.component";
import { SignUpNewEmailFormComponent } from "./eurolife-custom-components-angular/page/sign-up-new/sign-up-new-email-form/sign-up-new-email-form.component";
import { SignUpNewConfirmationComponent } from "./eurolife-custom-components-angular/page/sign-up-new/sign-up-new-confirmation/sign-up-new-confirmation.component";
import { SignUpNewValidateSmsComponent } from "./eurolife-custom-components-angular/page/sign-up-new/sign-up-new-validate-sms/sign-up-new-validate-sms.component";
import { SignUpNewFinalFormComponent } from "./eurolife-custom-components-angular/page/sign-up-new/sign-up-new-final-form/sign-up-new-final-form.component";




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
    component: SignUpNewComponent,
    resolve: { resources: ResourceResolver },
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "form",
        resolve: { resources: ResourceResolver }
      },
      {
        path: "form",
        component: SignUpNewEmailFormComponent,
        resolve: { resources: ResourceResolver }
      },
      {
        path: "confirmation",
        component: SignUpNewConfirmationComponent,
        canActivate: [SignUpGuard],
        resolve: { resources: ResourceResolver }
      },
      {
        path: "smsvalidation",
        component: SignUpNewValidateSmsComponent,
        canActivate: [SignUpGuard],
        resolve: { resources: ResourceResolver }
      },
      {
        path: "finalizeaccount",
        component: SignUpNewFinalFormComponent,
        canActivate: [SignUpGuard],
        resolve: { resources: ResourceResolver }
      }

    ]
  }
]

@NgModule({
  declarations: [SignUpNewComponent,SignUpNewEmailFormComponent,SignUpNewConfirmationComponent,SignUpNewValidateSmsComponent,
  SignUpNewFinalFormComponent],
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
export class ExternalModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {Routes,RouterModule} from '@angular/router';
import { PipesModule } from "./pipes.module";
import { SharedModule } from "./shared.module";
import { ResourceResolver } from "./resolvers/resource.resolver";


///new sign up process

import { SignUpNewMobileComponent } from './eurolife-custom-components-angular/page/sign-up-new/sign-up-new-mobile/sign-up-new-mobile.component';


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
    component: SignUpNewMobileComponent,
    resolve: { resources: ResourceResolver }
  },
  {
    path: "signupform",
    loadChildren: './external.module#ExternalModule',
    resolve: { resources: ResourceResolver }
  },
  {
    path: "groupform",
    loadChildren: './signupgroup.module#SignUpGroupModule',
    resolve: { resources: ResourceResolver }
  }

]

@NgModule({
  declarations: [
  SignUpNewMobileComponent],
  providers: [],
  imports: [
    CommonModule,
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
    SharedModule,
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
export class CreateAccountModule { }

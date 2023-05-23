import { ModuleWithProviders } from "@angular/core";
import { IceRuntimeResolver } from '@impeo/ng-ice';
import {PreloadAllModules,RouterModule, Routes } from "@angular/router";
import { SignUpValidatedComponent } from "./eurolife-custom-components-angular/section/sign-up-validated/sign-up-validated.component";

import { FaqComponent } from "./eurolife-custom-components-angular/section/faq/faq.component";
import { GlossaryComponent } from "./eurolife-custom-components-angular/section/glossary/glossary.component";
import { ResourceResolver } from "./resolvers/resource.resolver";
import { ForgotUsernameComponent } from "./eurolife-custom-components-angular/page/forgot-username/forgot-username.component";
import { PageNotFoundComponent } from "./eurolife-custom-components-angular/page/page-not-found/page-not-found.component";
import { LoginComponent } from "./eurolife-custom-components-angular/page/login/login.component";


const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
    resolve: { runtime: ResourceResolver },
  },
  {
    path: "login",
    component: LoginComponent,
    resolve: { runtime: ResourceResolver },
  },
  {
    path: "signupform",
    loadChildren: ()=> import('./external.module').then(m=>m.ExternalModule),
    resolve: { runtime: ResourceResolver }
  },
  {
    path: "groupform",
    loadChildren: () => import('./signupgroup.module').then(m=>m.SignUpGroupModule),
    resolve: { runtime: ResourceResolver }
  },
  {
    path: "createaccount",
    loadChildren: () => import('./createaccount.module').then(m=>m.CreateAccountModule),
    resolve: { runtime: ResourceResolver }
  },
  {
    path: "Faq",
    component: FaqComponent,
    resolve: { runtime: ResourceResolver }
  },
  { path: "pageNotFound", component: PageNotFoundComponent },
  {
    path: "Glossary",
    component: GlossaryComponent,
    resolve: { runtime: ResourceResolver }
  },
  {
    path: "forgotUsername",
    component: ForgotUsernameComponent,
    resolve: { runtime: ResourceResolver }
  },
  {
    path: "forgotPassword",
    loadChildren: () => import('./forgotpassword.module').then(m=>m.ForgotPasswordModule),
    resolve: { runtime: ResourceResolver }
  },
  {
    path: "ice/default/customerArea.motor/signupvalidated",
    component: SignUpValidatedComponent,
    resolve: { resources: ResourceResolver }
  }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes, {
  initialNavigation: true,
  useHash: true,
 preloadingStrategy: PreloadAllModules
});

import { ModuleWithProviders } from "@angular/core";
import {PreloadAllModules,RouterModule, Routes } from "@angular/router";
import { SignUpValidatedComponent } from  "@insis-portal/ice-custom-components/src/lib/components/section-components/sign-up-validated/sign-up-validated.component";

import { FaqComponent } from "./components/faq/faq.component";
import { GlossaryComponent } from "./components//glossary/glossary.component";
import { ResourceResolver } from "./resolvers/resource.resolver";
import { ForgotUsernameComponent } from "./components/forgot-username/forgot-username.component";
import { PageNotFoundComponent } from "./components//page-not-found/page-not-found.component";
import { LoginComponent } from "./components//login/login.component";


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

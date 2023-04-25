import { ModuleWithProviders } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
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
    resolve: { resources: ResourceResolver }
  },
  {
    path: "login",
    component: LoginComponent,
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
  },
  {
    path: "createaccount",
    loadChildren: './createaccount.module#CreateAccountModule',
    resolve: { resources: ResourceResolver }
  },
  {
    path: "Faq",
    component: FaqComponent,
    resolve: { resources: ResourceResolver }
  },
  { path: "pageNotFound", component: PageNotFoundComponent },
  {
    path: "Glossary",
    component: GlossaryComponent,
    resolve: { resources: ResourceResolver }
  },
  {
    path: "forgotUsername",
    component: ForgotUsernameComponent,
    resolve: { resources: ResourceResolver }
  },
  {
    path: "forgotPassword",
    loadChildren: './forgotpassword.module#ForgotPasswordModule',
    resolve: { resources: ResourceResolver }
  },
  {
    path: "ice/default/customerArea.motor/signupvalidated",
    component: SignUpValidatedComponent,
    resolve: { resources: ResourceResolver }
  }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes, {
  useHash: true,
  preloadingStrategy: PreloadAllModules
});

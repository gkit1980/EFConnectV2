
import { IceCustomComponentsModule } from '@insis-portal/ice-custom-components';


import { LoginComponent } from "../app/components/login/login.component";
import { ForgotUsernameComponent } from "../app/components/forgot-username/forgot-username.component";
import { LogoutComponent } from "../app/components//logout/logout.component";
import { SessionTimeoutComponent } from "../app/components/session-timeout/session-timeout.component";
import { SignUpGroupConsentsModalComponent } from "../app/components/sign-up-group-consents-modal/sign-up-group-consents-modal.component";
import { SignUpGroupSuccessModalComponent } from "../app/components/sign-up-group-success-modal/sign-up-group-success-modal.component";
import { SignUpGroupWaitingModalComponent } from "../app/components/sign-up-group-waiting-modal/sign-up-group-waiting-modal.component";
import { SignUpGroupErrorServiceModalComponent } from "../app/components/sign-up-group-errorService-modal/sign-up-group-errorService-modal.component";
import { VideoComponent } from "../app/components/login/video/video.component";
import { PreventDoubleClickDirective } from '../app/components/login/prevent-double-click.directive';
import { LogoutSecurityComponent } from '../app/components/logout-security/logout-security.component';
import { NewRegCodeModalComponent } from '../app/components/sign-up-new/new-reg-code-modal/new-reg-code-modal.component';
import { CookieDeclarationComponent } from "../app/components/cookie-declaration/cookie-declaration.component";
import { TermsConditionsComponent } from "./components/terms-conditions/terms-conditions.component";




import { MatDividerModule } from "@angular/material/divider";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { registerLocaleData} from "@angular/common";
import localeEl from "@angular/common/locales/el";
import { NgModule, Injector, ErrorHandler,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { Meta,BrowserModule} from "@angular/platform-browser";
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgIceModule,IcePrincipalService,IceRuntimeService } from "@impeo/ng-ice";
import { ClientPrincipal } from '@impeo/ice-core';
import { AmazingTimePickerModule } from "amazing-time-picker";
//import { ViModule } from "@impeo/visual-ice";                      //V2
// import { NgOtpInputModule } from  'ng-otp-input';
import { HttpClientModule } from "@angular/common/http";
import { ChartsModule } from 'ng2-charts';
import { SaveToGooglePayButtonModule } from '@google-pay/save-button-angular';
import { MessageService } from "primeng/components/common/messageservice";

import { AppRouting } from "./app.routing";
import { AppComponent } from "./components/app/app.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { PageFooterComponent } from "./components/page-footer/page-footer.component";
import { MatSelectModule } from "@angular/material/select";

import { GoogleAnalyticsEventsService } from "./services/google-analytics.service";
import {MatCardModule} from "@angular/material/card";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";

import { SpinnerService } from "./services/spinner.service";
import { WindowRefService } from "./services/windowref.service";

import { FromNowPipe } from "./pipes/from-now.pipe";

import { MatDialogModule } from "@angular/material/dialog";

import { MatRadioModule } from "@angular/material/radio";

import { MatStepperModule } from "@angular/material/stepper";

import { LocalAuthedicationService } from "./services/local-authedication.service";
import { LoginAuthenticationGuard } from "./services/login-authentication.guard";
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service'

import { StorageServiceModule } from "ngx-webstorage-service";
import { LocalStorageService } from "./services/local-storage.service"

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InlineSVGModule } from "ng-inline-svg";
import { SignUpGuard } from "./services/guards/sign-up-guard.service";
import { AuthGuard } from "./services/guards/auth.guard";
import { SignupService } from "./services/signup.service";
import { SignupGroupService } from "./services/signupgroup.service";
import { AuthService } from "./services/auth.service";
import { AmendmentsService } from "./services/amendments.service";
import { ForgetUsernameService } from "./services/forget-username.service";
import { ForgetPasswordService } from "./services/forget-password.service";
import { PipesModule } from "./pipes.module";
import { ResourceService } from "./services/resource.service";
import { ResourceResolver } from "./resolvers/resource.resolver";
import { LogoutService } from "./services/logout.service";
import { ModalService } from "./services/modal.service";
import { CookieConsentService } from "./services/cookie-consent.service";
import { SitecoreService } from "./services/sitecore.service";
import { WindowScrollingService } from "./services/window-scrolling.service";
import { setAppInjector } from "./components/app/app-injector";
import { CheckInactivityService } from "./services/check-inactivity.service";
import { GlobalErrorHandler } from "./components/app/global-error-handler";
import { ErrorLogService } from "./services/error-log.service";
import { CurrencyFormat } from "./pipes/currencyFormat.pipe";
import { EuroCurrencyFormat } from "./pipes/euroCurrencyFormat.pipe";
import { RecapchaService } from "./services/recapcha.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { PipeFunctionPipe } from "./pipes/pipe-function.pipe";
import { DragDropDirective } from './directives/drag-drop.directive';
import { RedirectEclaimsDirective } from './directives/redirect-eclaims.directive';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SalesforceChatComponent } from "./components/salesforce-chat/salesforce-chat.component";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatExpansionModule } from '@angular/material/expansion';



///new
import { registerCustomRules } from '@insis-portal/ice-custom-rules';
import { LanguageService, getDefaultLanguage } from './services/language.service';
import moment from 'moment';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotUsernameComponent,
    LogoutComponent,
    SessionTimeoutComponent,
    SignUpGroupConsentsModalComponent,
    SignUpGroupSuccessModalComponent,
    SignUpGroupWaitingModalComponent,
    SignUpGroupErrorServiceModalComponent,
    VideoComponent,
    PreventDoubleClickDirective,
    LogoutSecurityComponent,
    NewRegCodeModalComponent,
    PageFooterComponent,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    CurrencyFormat,
    EuroCurrencyFormat,
    FromNowPipe,
    PipeFunctionPipe,
    DragDropDirective,
    RedirectEclaimsDirective,
    SalesforceChatComponent,
    CookieDeclarationComponent,
    TermsConditionsComponent
  ],
  imports: [
    PipesModule,
    //NgOtpInputModule,
    InlineSVGModule.forRoot(),
    NgxSkeletonLoaderModule,
    BrowserModule,
    MatDividerModule,
    RecaptchaV3Module,
    StorageServiceModule,
    AppRouting,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    TextMaskModule,
    BrowserAnimationsModule,
    NgIceModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatPaginatorModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatStepperModule,
    NgbModule,
    AmazingTimePickerModule,
    MatSlideToggleModule,
    ChartsModule,
    SaveToGooglePayButtonModule,
    MatProgressBarModule,
    ZXingScannerModule,
    MatButtonToggleModule,
    IceCustomComponentsModule
  ],
  providers: [
    LocalStorageService,
    IcePrincipalService,
    IceRuntimeService,
    LocalAuthedicationService,
    LoginAuthenticationGuard,
    CanDeactivateGuard,
    MessageService,
    GoogleAnalyticsEventsService,
    SignUpGuard,
    AuthGuard,
    SignupService,
    SignupGroupService,
    AuthService,
    AmendmentsService,
    RecapchaService,
    ForgetUsernameService,
    ForgetPasswordService,
    SpinnerService,
    WindowRefService,
    ResourceResolver,
    ResourceService,
    LanguageService,
    LogoutService,
    ModalService,
    CookieConsentService,
    SitecoreService,
    WindowScrollingService,
    CheckInactivityService,
    ErrorLogService,
    Meta,
    DeviceDetectorService,
    LanguageService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "6Lfom6kUAAAAAH9Fq2B1IoZgyYdyF2T9k-iyg28r"
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "standard" }
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  entryComponents: [
    SalesforceChatComponent
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatTabsModule,
    FromNowPipe,
    CurrencyFormat,
    EuroCurrencyFormat,
    PipeFunctionPipe
  ]
})
export class AppModule {

  constructor(injector: Injector,icePrincipalService:IcePrincipalService,iceRuntimeService:IceRuntimeService) {
    /**
     * TIP: We need to register our custom rules to the client application
     */
    registerCustomRules();


icePrincipalService.principal = new ClientPrincipal('1','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2ODQ2MDQxMTIsImV4cCI6MTcxNjE0MDExMiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInJvbGVzIjoiW10iLCJkYXRhIjoie30iLCJpZCI6IjEifQ._Izb5qQQTMeoBxt9HmCHVFnkw96gF200P8tupyGWD-Q', 'el', [], {});

    const langCode = getDefaultLanguage();
    moment.locale(langCode, {
      week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4, // Used to determine first week of the year.
      },
    }); //reference https://momentjscom.readthedocs.io/en/latest/moment/07-customization/16-dow-doy/

       setAppInjector(injector);
      registerLocaleData(localeEl);
  }

}

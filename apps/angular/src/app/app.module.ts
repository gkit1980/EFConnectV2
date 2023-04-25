import { EurolifeDropdownComponent } from './eurolife-custom-components-angular/element/eurolife-dropdown/eurolife-dropdown.component';
import { CommunicationServiceComponent } from "./eurolife-custom-components-angular/section/communication-service/communication-service.component";
import { PaymentManagementComponent } from "./eurolife-custom-components-angular/section/payment-management/payment-management.component";
import { ExternalUrlComponent } from "./eurolife-custom-components-angular/section/externalUrl/externalUrl.element.component";
import { MatDividerModule } from "@angular/material/divider";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { registerLocaleData} from "@angular/common";
import localeEl from "@angular/common/locales/el";
import { NgModule, Injector, ErrorHandler } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { NgOtpInputModule } from  'ng-otp-input';
import { BrowserModule,Meta } from "@angular/platform-browser";
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgIceModule } from "@impeo/ng-ice";
import { AmazingTimePickerModule } from "amazing-time-picker";
import { ViModule } from "@impeo/visual-ice";
import { HttpClientModule } from "@angular/common/http";
import { ChartsModule } from 'ng2-charts';
import { SaveToGooglePayButtonModule } from '@google-pay/save-button-angular';
import { MessageService } from "primeng/components/common/messageservice";
import {
  AutoCompleteModule,
  BlockUIModule,
  CardModule,
  ConfirmDialogModule,
  ConfirmationService,
  DropdownModule,
  GrowlModule,
  InputSwitchModule,
  MessageModule,
  PanelModule,
  TabViewModule,
  TreeModule
} from "primeng/primeng";
import { AppRouting } from "./app.routing";
import { AppComponent } from "./components/app/app.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { PageFooterComponent } from "./components/page-footer/page-footer.component";
import {MatSelectModule} from "@angular/material/select";

import { GoogleAnalyticsEventsService } from "./services/google-analytics.service";
import { MotorCoversEditorCardComponent } from "./eurolife-custom-components-angular/section/motor-covers-card/motor-covers-card.section.component";
import { MotorPopUpDeleteAccount } from "./eurolife-custom-components-angular/section/motor-popup-deteteAccount/motor-popup-deleteAccount.component";
import { MotorDeleteAccount } from "./eurolife-custom-components-angular/element/motor-deleteAccount/motor-deleteAccount.component";
import { MotorPopUpchangeMobilePhone } from "./eurolife-custom-components-angular/section/motor-popup-changeMobilePhone/motor-popup-changeMobilePhone.component";
import { MotorChangeMobilePhone } from "./eurolife-custom-components-angular/element/motor-changeMobilePhone/motor-changeMobilePhone.component";
import { MotorPopUpchangePhone } from "./eurolife-custom-components-angular/section/motor-popup-changePhone/motor-popup-changePhone.component";
import { MotorChangePhone } from "./eurolife-custom-components-angular/element/motor-changePhone/motor-changePhone.component";
import { MotorPopUpchangeEmail } from "./eurolife-custom-components-angular/section/motor-popup-changeEmail/motor-popup-changeEmail.component";
import { MotorChangeEmail } from "./eurolife-custom-components-angular/element/motor-changeEmail/motor-changeEmail.component";
import { MotorProfilePicture } from "./eurolife-custom-components-angular/element/motor-profilePicture/motor-profilePicture.component";
import { MotorPopUpChangeProfilePicture } from "./eurolife-custom-components-angular/section/motor-popup-changeProfilePicure/motor-popup-changeProfilePicure.component";
import { MotorPopUpchangePassword } from "./eurolife-custom-components-angular/section/motor-popup-changePassword/motor-popup-changePassword.component";
import { MotorChangePassword } from "./eurolife-custom-components-angular/element/motor-changePassword/motor-changePassword.component";
import { MotorCustomTableComponent } from "./eurolife-custom-components-angular/section/motor-custom-table/motor-custom-table.section.component";
import { PdfDownloadComponent } from "./eurolife-custom-components-angular/component/pdf-download-component/pdf-download-component";
import { PdfTableLinkComponent } from "./eurolife-custom-components-angular/component/pdf-table-link-component/pdf-table-link-component";
import { TimePickerComponent } from "./eurolife-custom-components-angular/element/time-picker/time-picker.component";
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
import { MaskComponent } from "./eurolife-custom-components-angular/element/mask/mask.element.component";
import { SpinnerService } from "./services/spinner.service";
import { WindowRefService } from "./services/windowref.service";

import { FromNowPipe } from "./pipes/from-now.pipe";

import { MatDialogModule } from "@angular/material/dialog";
import { SuccessfullmessageComponent } from "./eurolife-custom-components-angular/element/successfullmessage/successfullmessage.component";
import { PaymentdetailsComponent } from "./eurolife-custom-components-angular/section/paymentdetails/paymentdetails.component";
import { MatRadioModule } from "@angular/material/radio";
import { SubHeaderComponent } from "./eurolife-custom-components-angular/section/sub-header/sub-header.component";
import { MotorCustomDetailTableComponent } from "./eurolife-custom-components-angular/section/motor-custom-detail-table/motor-custom-detail-table.section.component";
import { InfoButtonComponent } from "./eurolife-custom-components-angular/element/info-button/info-button.component";
import { SocialNetworkSignUpComponent } from "./eurolife-custom-components-angular/section/social-network-sign-up/social-network-sign-up.component";
import { RegistrationPageComponent } from "./eurolife-custom-components-angular/page/registration-page/registration-page.component";
import { CalculateLifeExpirationDateComponent } from "./eurolife-custom-components-angular/element/calculate-life-expiration-date/calculate-life-expiration-date.component";
import { ParticipantsViewComponent } from "./eurolife-custom-components-angular/section/participants-view/participants-view.component";
import { ExagoraComponent } from "./eurolife-custom-components-angular/section/exagora/exagora.component";
import { ClaimsCardComponent } from "./eurolife-custom-components-angular/section/claims-card/claims-card.component";
import { MatStepperModule } from "@angular/material/stepper";
import { SubheaderStepperComponent } from "./eurolife-custom-components-angular/section/subheader-stepper/subheader-stepper.component";
import { ForgotUsernameComponent } from "./eurolife-custom-components-angular/page/forgot-username/forgot-username.component";
import { LocalAuthedicationService } from "./services/local-authedication.service";
import { LoginAuthenticationGuard } from "./services/login-authentication.guard";
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';

import { TelephoneiconComponent } from "./eurolife-custom-components-angular/element/telephoneicon/telephoneicon.component";
import { SalesChannelDetailsComponent } from "./eurolife-custom-components-angular/section/sales-channel-details/sales-channel-details.component";
import { PopUpComponent } from "./eurolife-custom-components-angular/element/pop-up/pop-up.component";
import { ButtonToDialogComponent } from "./eurolife-custom-components-angular/element/button-to-dialog-component/button-to-dialog-component";
import { GdprNotificationComponent } from "./eurolife-custom-components-angular/element/gdpr-notification/gdpr-notification.component";
import { FileUploadSection } from "./eurolife-custom-components-angular/section/file-upload-section/file-upload-section.component";
import { SignUpCardComponent } from "./eurolife-custom-components-angular/section/sign-up-card/sign-up-card.component";
import { SignUpValidatedComponent } from "./eurolife-custom-components-angular/section/sign-up-validated/sign-up-validated.component";
import { StorageServiceModule } from "ngx-webstorage-service";
import { LocalStorageService } from "./services/local-storage.service";

import { LoginComponent } from "./eurolife-custom-components-angular/page/login/login.component";
import { CalculatePropertyDurationDateComponent } from "./eurolife-custom-components-angular/element/calculate-property-duration-date/calculate-property-duration-date.component";
import { CalculatePropertyPaymentFrequencyComponent } from "./eurolife-custom-components-angular/element/calculate-property-payment-frequency/calculate-property-payment-frequency.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplePageComponent } from "./eurolife-custom-components-angular/page/simple-page/simple-page.component";
import { SvgImageComponent } from "./eurolife-custom-components-angular/element/svg-image/svg-image.component";
import { JoyrideModule } from "ngx-joyride";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InlineSVGModule } from "ng-inline-svg";

import { FaqComponent } from "./eurolife-custom-components-angular/section/faq/faq.component";
import { SimplePageWithNavigationComponent } from "./eurolife-custom-components-angular/page/simple-page-with-navigation/simple-page-with-navigation.component";
import { EurolifeOutputComponent } from "./eurolife-custom-components-angular/element/eurolife-output/eurolife-output.component";
import { EurolifeH3Component } from "./eurolife-custom-components-angular/element/eurolife-h3/eurolife-h3.component";
import { SimpleGridViewComponent } from "./eurolife-custom-components-angular/section/simple-grid-view/simple-grid-view.component";
import { EurolifeDropdownMenuComponent } from "./eurolife-custom-components-angular/component/eurolife-dropdown-menu/eurolife-dropdown-menu.component";
import { EurolifeNotificationBarComponent } from "./eurolife-custom-components-angular/element/eurolife-notification-bar/eurolife-notification-bar.component";
import { FormatTimePipeForMobile } from "./eurolife-custom-components-angular/element/insert-code-timer/insert-code-timer.component";
import { SignUpGuard } from "./services/guards/sign-up-guard.service";
import { AuthGuard } from "./services/guards/auth.guard";
import { SignupService } from "./services/signup.service";
import { SignupGroupService } from "./services/signupgroup.service";
import { AuthService } from "./services/auth.service";
import { AmendmentsService } from "./services/amendments.service";
import { ForgetUsernameService } from "./services/forget-username.service";
import { ForgetPasswordService } from "./services/forget-password.service";
import { OtpInputComponent } from "./eurolife-custom-components-angular/element/otp-input/otp-input.component";
import { OnlyDigitsDirective } from "./eurolife-custom-components-angular/element/otp-input/only-digits.directive";
import { EurolifeOutputColorComponent } from "./eurolife-custom-components-angular/element/eurolife-output-color/eurolife-output-color.component";
import { EurolifeHeaderTileComponent } from "./eurolife-custom-components-angular/element/eurolife-header-tile/eurolife-header-tile.component";
import { HeaderComponent } from "./eurolife-custom-components-angular/section/header/header.component";
import { PaymentComponent } from "./eurolife-custom-components-angular/section/payment/payment.component";
import { SplitPageWithIconComponent } from "./eurolife-custom-components-angular/page/split-page-with-icon/split-page-with-icon.component";
import { IceImageComponent } from "./eurolife-custom-components-angular/element/ice-image/ice-image.component";
import { FlatSectionComponent } from "./eurolife-custom-components-angular/section/flat-section/flat-section.component";
import { InputComponent } from "./eurolife-custom-components-angular/element/input/input.component";
import { MatCardHomeComponent } from "./eurolife-custom-components-angular/element/mat-card-home/mat-card-home.component";
import { SimpleTableNoPaginationComponent } from "./eurolife-custom-components-angular/section/simple-table-no-pagination/simple-table-no-pagination.component";
import { HomePageComponent } from "./eurolife-custom-components-angular/page/home-page/home-page.component";
import { HomePageMainSectionComponent } from "./eurolife-custom-components-angular/section/home-page-main-section/home-page-main-section.component";
import { HomePageCardComponent } from "./eurolife-custom-components-angular/element/home-page-card/home-page-card.component";
import { EurolifeOutputSubheaderComponent } from "./eurolife-custom-components-angular/element/eurolife-output-subheader/eurolife-output-subheader.component";
import { EurolifeMotorOutputDriversComponentComponent } from "./eurolife-custom-components-angular/element/eurolife-motor-output-drivers-component/eurolife-motor-output-drivers-component.component";
import { EurolifeButtonComponent } from "./eurolife-custom-components-angular/element/eurolife-button/eurolife-button.component";
import { OutputWithIconComponent } from "./eurolife-custom-components-angular/element/output-with-icon/output-with-icon.component";
import { HomeUnpaidReceiptsComponent } from "./eurolife-custom-components-angular/element/home-unpaid-receipts/home-unpaid-receipts.component";
import { PaymentManagementSuccessComponent } from "./eurolife-custom-components-angular/section/payment-management-success/payment-management-success.component";
import { PaymentManagementStatusBarComponent } from "./eurolife-custom-components-angular/section/payment-management-status-bar/payment-management-status-bar.component";
import { SimplePageNoTitleComponent } from "./eurolife-custom-components-angular/page/simple-page-no-title/simple-page-no-title.component";
import { ChangePasswordFieldComponent } from "./eurolife-custom-components-angular/section/change-password-fields/change-password-fields.component";
import { InsertCodeTimerComponent } from "./eurolife-custom-components-angular/element/insert-code-timer/insert-code-timer.component";
import { SendEmailButtonComponent } from "./eurolife-custom-components-angular/element/send-email-button/send-email-button.component";
import { GlossaryComponent } from "./eurolife-custom-components-angular/section/glossary/glossary.component";
import { InsertCodeEmailTimerComponent } from "./eurolife-custom-components-angular/element/insert-code-email-timer/insert-code-email-timer.component";
import { FormatTimePipeForEmail } from "./eurolife-custom-components-angular/element/insert-code-email-timer/insert-code-email-timer.component";
import { EmailConfirmationComponent } from "./eurolife-custom-components-angular/page/email-confirmation/email-confirmation.component";
import { PipesModule } from "./pipes.module";
import { ResourceService } from "./services/resource.service";
import { ResourceResolver } from "./resolvers/resource.resolver";
import { LogoutComponent } from "./eurolife-custom-components-angular/page/logout/logout.component";
import { LogoutService } from "./services/logout.service";
import { MyDocumentsComponent } from "./eurolife-custom-components-angular/section/my-documents/my-documents.component";
import { TextWithLinkComponent } from "./eurolife-custom-components-angular/element/text-with-link/text-with-link.component";
import { ModalService } from "./services/modal.service";
import { CookieConsentService } from "./services/cookie-consent.service";
import { SitecoreService } from "./services/sitecore.service";
import { CalendarComponent } from "./eurolife-custom-components-angular/element/calendar/calendar.component";
import { OutputWithActionComponent } from "./eurolife-custom-components-angular/element/output-with-action/output-with-action.component";
import { PopUpPageComponent } from "./eurolife-custom-components-angular/page/pop-up-page/pop-up-page.component";
import { WindowScrollingService } from "./services/window-scrolling.service";
import { AvatarElementComponent } from "./eurolife-custom-components-angular/element/avatar-element.component/avatar-element.component";
import { setAppInjector } from "./components/app/app-injector";
import { MyDafsComponent } from "./eurolife-custom-components-angular/section/my-dafs/my-dafs.component";
import { SessionTimeoutComponent } from "./eurolife-custom-components-angular/page/session-timeout/session-timeout.component";
import { CheckInactivityService } from "./services/check-inactivity.service";
import { HomeCardContainerComponent } from "./eurolife-custom-components-angular/section/home-card-container/home-card-container.component";
import { OpenDialogTextComponent } from "./eurolife-custom-components-angular/element/open-dialog-text/open-dialog-text.component";
import { TermsConditionsComponent } from "./eurolife-custom-components-angular/page/terms-conditions/terms-conditions.component";
import { ConsentsComponent } from "./eurolife-custom-components-angular/page/consents/consents.component";
import { SignUpGroupConsentsModalComponent } from "./eurolife-custom-components-angular/page/sign-up-group-consents-modal/sign-up-group-consents-modal.component";
import { SignUpGroupSuccessModalComponent } from "./eurolife-custom-components-angular/page/sign-up-group-success-modal/sign-up-group-success-modal.component";
import { SignUpGroupWaitingModalComponent } from "./eurolife-custom-components-angular/page/sign-up-group-waiting-modal/sign-up-group-waiting-modal.component";
import { SignUpGroupErrorServiceModalComponent } from "./eurolife-custom-components-angular/page/sign-up-group-errorService-modal/sign-up-group-errorService-modal.component";
import { CookieDeclarationComponent } from "./eurolife-custom-components-angular/page/cookie-declaration/cookie-declaration.component";
import { DetailsCustomTableComponent } from "./eurolife-custom-components-angular/section/details-custom-table/details-custom-table.component";
import { LegalPopupComponent } from "./eurolife-custom-components-angular/page/legal-popup/legal-popup.component";
import { CloseCancelPopUpComponent } from "./eurolife-custom-components-angular/element/close-cancel-pop-up/close-cancel-pop-up.component";
import { GlobalErrorHandler } from "./components/app/global-error-handler";
import { ErrorLogService } from "./services/error-log.service";
import { CurrencyFormat } from "./pipes/currencyFormat.pipe";
import { EuroCurrencyFormat } from "./pipes/euroCurrencyFormat.pipe";
import { ParticipantViewClaimsComponent } from "./eurolife-custom-components-angular/section/participant-view-claims/participant-view-claims.component";
import { RecapchaService } from "./services/recapcha.service";
import { EurolifeEmailButtonComponentComponent } from "./eurolife-custom-components-angular/element/eurolife-email-button-component/eurolife-email-button-component.component";
import { EurolifeMobileButtonComponent } from "./eurolife-custom-components-angular/element/eurolife-mobile-button/eurolife-mobile-button.component";
import { VideoComponent } from "./eurolife-custom-components-angular/page/login/video/video.component";
import { PageNotFoundComponent } from "./eurolife-custom-components-angular/page/page-not-found/page-not-found.component";
import { InputonchangeactionComponent } from "./eurolife-custom-components-angular/element/inputonchangeaction/inputonchangeaction.component";
import { PopupConsentComponent } from "./eurolife-custom-components-angular/element/popup-consent/popup-consent.component";
import { ConsentsCardsComponent } from "./eurolife-custom-components-angular/element/consents-cards/consents-cards.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { EurolifeConsentButtonComponent } from "./eurolife-custom-components-angular/element/eurolife-consent-button/eurolife-consent-button.component";
import { NotificationBarComponent } from "./eurolife-custom-components-angular/element/notification-bar/notification-bar.component";
import { ConsentGridViewComponent } from "./eurolife-custom-components-angular/section/consent-grid-view/consent-grid-view.component";
import { ConsentFooterComponent } from "./eurolife-custom-components-angular/section/consent-footer/consent-footer.component";
import { IconOutputConsentComponent } from "./eurolife-custom-components-angular/element/icon-output-consent/icon-output-consent.component";
import { ConsentComplianceComponent } from './eurolife-custom-components-angular/section/consent-compliance/consent-compliance.component';
import { ConsentsTextMsgComponent } from './eurolife-custom-components-angular/element/consents-text-msg/consents-text-msg.component';
import { ConsentInitialStepsComponent } from './eurolife-custom-components-angular/element/consent-initial-steps/consent-initial-steps.component';
import { ReviewConfirmComponent } from './eurolife-custom-components-angular/page/review-confirm/review-confirm.component';
import { GreenCardStepperComponent } from './eurolife-custom-components-angular/section/green-card-stepper/green-card-stepper.component';
import { GreenCardDynamicComponent } from './eurolife-custom-components-angular/element/green-card-dynamic/green-card-dynamic.component';
import { GreenCardAddDriverComponent } from './eurolife-custom-components-angular/element/green-card-add-driver/green-card-add-driver.component';
import { GreenCardOtherDriverToggleComponent } from './eurolife-custom-components-angular/element/green-card-other-driver-toggle/green-card-other-driver-toggle.component';
import { GreenCardDropdownPlatesComponent } from './eurolife-custom-components-angular/element/green-card-dropdown-plates/green-card-dropdown-plates.component';
import { GreenCardDatepickerComponent } from './eurolife-custom-components-angular/element/green-card-datepicker/green-card-datepicker.component';
import { GreenCardFullnameComponent } from './eurolife-custom-components-angular/element/green-card-fullname/green-card-fullname.component';
import { GreencardNotificationBarComponent } from './eurolife-custom-components-angular/element/greencard-notification-bar/greencard-notification-bar.component';
import { GreenCardButtonComponent } from './eurolife-custom-components-angular/element/green-card-button/green-card-button.component';
import { GreenCardBackButtonComponent } from './eurolife-custom-components-angular/element/green-card-back-button/green-card-back-button.component';
import { AmendmentsBackButtonComponent } from './eurolife-custom-components-angular/element/amendments-back-button/amendments-back-button.component';
import { RedirectionGreenCardComponent } from './eurolife-custom-components-angular/section/redirection-green-card/redirection-green-card.component';
import { AmendmentsInprogressComponent } from "./eurolife-custom-components-angular/section/amendments-inprogress/amendments-inprogress.component";
import { AmendmentsRequestsComponent } from "./eurolife-custom-components-angular/section/amendments-requests/amendments-requests.component";
import { AmendmentDetailsHeaderComponent } from "./eurolife-custom-components-angular/section/amendment-details-header/amendment-details-header.component";
import { AmendmentsStepperComponent } from "./eurolife-custom-components-angular/section/amendments-stepper/amendments-stepper.component";
import { AmendmentsStepperHomeComponent } from "./eurolife-custom-components-angular/section/amendments-stepper-home/amendments-stepper-home.component";
import { AmendmentsStepperHealthComponent } from "./eurolife-custom-components-angular/section/amendments-stepper-health/amendments-stepper-health.component";
import { AmendmentsStepperFinanceComponent } from "./eurolife-custom-components-angular/section/amendments-stepper-finance/amendments-stepper-finance.component";
import { AmendmentsStepperLifeComponent } from "./eurolife-custom-components-angular/section/amendments-stepper-life/amendments-stepper-life.component";
import { AmendmentsLifeBeneficiariesComponent } from './eurolife-custom-components-angular/section/amendments-life-beneficiaries/amendments-life-beneficiaries.component';
import { UploadFileButtonComponent } from "./eurolife-custom-components-angular/element/upload-file-button/upload-file-button.component";
import { CommentInputComponent } from "./eurolife-custom-components-angular/element/comment-input/comment-input.component";
import { IconOutputComponent } from "./eurolife-custom-components-angular/element/icon-output/icon-output.component";
import { OtpTimerComponent } from "./eurolife-custom-components-angular/element/otp-timer/otp-timer.component";
import { AmendmentinputfieldComponent } from './eurolife-custom-components-angular/element/amendmentinputfield/amendmentinputfield.component';
import { AmendmentinputlifefieldComponent } from './eurolife-custom-components-angular/element/amendmentinputlifefield/amendmentinputlifefield.component';
import { PropertyClaimNotificationInputFieldComponent } from './eurolife-custom-components-angular/element/property-clailm-notification-input-field/property-clailm-notification-input-field.component';
import { AmendmentinputpropertyfieldComponent } from './eurolife-custom-components-angular/element/amendmentinputpropertyfield/amendmentinputpropertyfield.component';
import { AmendmentMaskComponent } from './eurolife-custom-components-angular/element/amendmentmask/amendmentmask.component';
import { EurolifeOutputClickableComponent } from './eurolife-custom-components-angular/element/eurolife-output-clickable/eurolife-output-clickable.component';
import { AmendmentGridViewComponent } from './eurolife-custom-components-angular/section/amendment-grid-view/amendment-grid-view.component';
import { NoAmendmentGridViewComponent } from './eurolife-custom-components-angular/section/no-amendment-grid-view/no-amendment-grid-view.component';
import { TextLabelComponent } from './eurolife-custom-components-angular/element/text-label/text-label.component';
import { ContentWalkthroughComponent } from './eurolife-custom-components-angular/section/content-walkthrough/content-walkthrough.component';
import { HomeCardContainerAmendmentComponent } from './eurolife-custom-components-angular/section/home-card-container-amendment/home-card-container-amendment.component';
import { ShowComponentDirective } from './directives/show-component.directive';
import { CustomerProfileComponent } from './eurolife-custom-components-angular/section/customer-profile/customer-profile.component';
import { HeaderWelcomeComponent } from './eurolife-custom-components-angular/element/header-welcome/header-welcome.component';
import { HomeAgentInfoComponent } from './eurolife-custom-components-angular/section/home-agent-info/home-agent-info.component';
import { PreventDoubleClickDirective } from './eurolife-custom-components-angular/page/login/prevent-double-click.directive';
import { PendingPaymentComponent } from './eurolife-custom-components-angular/section/pending-payment/pending-payment.component';
import { LogoutSecurityComponent } from './eurolife-custom-components-angular/page/logout-security/logout-security.component';
import { PipeFunctionPipe } from "./pipes/pipe-function.pipe";
import { VanillaUlLineChartComponent } from './eurolife-custom-components-angular/section/vanilla-ul-line-chart/vanilla-ul-line-chart.component';
import { FundsBasketComponent } from './eurolife-custom-components-angular/section/funds-basket/funds-basket.component';
import { SimpleGridViewQuotationComponent } from './eurolife-custom-components-angular/section/simple-grid-view-quotation/simple-grid-view-quotation.component';
import { NewRegCodeModalComponent } from './eurolife-custom-components-angular/page/sign-up-new/new-reg-code-modal/new-reg-code-modal.component';
import { FundsTippProductComponent } from './eurolife-custom-components-angular/section/funds-tipp-product/funds-tipp-product.component';
import { TippLineChartComponent } from './eurolife-custom-components-angular/section/tipp-line-chart/tipp-line-chart.component';
import { FundsLifecycleProductComponent } from './eurolife-custom-components-angular/section/funds-lifecycle-product/funds-lifecycle-product.component';
import { LifecycleLineChartComponent } from './eurolife-custom-components-angular/section/lifecycle-line-chart/lifecycle-line-chart.component';
import { SimplePageClaimsComponent } from './eurolife-custom-components-angular/page/simple-page-claims/simple-page-claims.component';
import { EclaimsBackButtonComponent } from './eurolife-custom-components-angular/element/eclaims-back-button/eclaims-back-button.component';
import { EclaimsStepperComponent } from './eurolife-custom-components-angular/section/eclaims-stepper/eclaims-stepper.component';
import { EclaimsAvailableContractsComponent } from './eurolife-custom-components-angular/section/eclaims-available-contracts/eclaims-available-contracts.component';
import { EclaimsReceiptScannerComponent } from './eurolife-custom-components-angular/section/eclaims-receipt-scanner/eclaims-receipt-scanner.component';
import { EclaimsSelectIncidentComponent } from './eurolife-custom-components-angular/section/eclaims-select-incident/eclaims-select-incident.component';
import { EclaimsPageComponent } from './eurolife-custom-components-angular/page/eclaims-page/eclaims-page.component';
import { EclaimsSubmitButtonComponent } from './eurolife-custom-components-angular/element/eclaims-submit-button/eclaims-submit-button.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { DragDropFileComponent } from "./eurolife-custom-components-angular/element/drag-drop-file/drag-drop-file.component";
import { EclaimsLwcCreateCaseComponent }  from "./eurolife-custom-components-angular/section/eclaims-lwc-create-case/eclaims-lwc-create-case.component";
import { EclaimsCoveragesComponent } from './eurolife-custom-components-angular/section/eclaims-coverages/eclaims-coverages.component';
import { EclaimsRequestsOpenComponent } from './eurolife-custom-components-angular/section/eclaims-group-health-requests/eclaims-requests-open.component';
import { EclaimsGridViewComponent } from './eurolife-custom-components-angular/section/eclaims-grid-view/eclaims-grid-view.component';
import { EclaimsUploadComponent } from './eurolife-custom-components-angular/section/eclaims-upload/eclaims-upload.component';
import { EclaimsRequestsInProgressComponent } from './eurolife-custom-components-angular/section/eclaims-requests-in-progress/eclaims-requests-in-progress.component';
import { EclaimsRequestsClosedComponent } from './eurolife-custom-components-angular/section/eclaims-requests-closed/eclaims-requests-closed.component';
import { RedirectionEclaimsComponent } from './eurolife-custom-components-angular/section/redirection-eclaims/redirection-eclaims.component';
import { RedirectEclaimsDirective } from './directives/redirect-eclaims.directive';
import { EclaimsPageErrorComponent } from './eurolife-custom-components-angular/page/eclaims-page-error/eclaims-page-error.component';
import { EclaimsErrorScriptComponent } from './eurolife-custom-components-angular/section/eclaims-error-script/eclaims-error-script.component';
import { DigitalCardComponent } from './eurolife-custom-components-angular/element/digital-card/digital-card.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SalesforceChatComponent } from "./components/salesforce-chat/salesforce-chat.component";
import { PropertyNotificationStepperComponent } from './eurolife-custom-components-angular/section/property-notification-stepper/property-notification-stepper.component';
import { PropertyAvailableContractsComponent } from './eurolife-custom-components-angular/section/property-available-contracts/property-available-contracts.component';
import { PropertyClaimNotificationCreateCaseComponent } from './eurolife-custom-components-angular/section/property-claim-notification-create-case/property-claim-notification-create-case.component';
import { PropertyClaimSubmitButtonComponent } from './eurolife-custom-components-angular/element/property-claim-submit-button/property-claim-submit-button.component';
import { PropertyNotificationDatepickerComponent } from './eurolife-custom-components-angular/element/property-notification-datepicker/property-notification-datepicker.component';
import { PropertyClaimTypeComponent } from './eurolife-custom-components-angular/element/property-claim-type/property-claim-type.component';
import { AmendmentsRelationshipComponent } from './eurolife-custom-components-angular/element/amendments-relationship/amendments-relationship.component';
import { SignUpGroupAreaComponent } from './eurolife-custom-components-angular/element/sign-up-group-area/sign-up-group-area.component';
import { SignUpGroupCustomerProfilePopUpComponent} from './eurolife-custom-components-angular/section/sign-up-group-customer-profile-pop-up/sign-up-group-customer-profile-pop-up.component';
import { EclaimsDocumentsComponent } from './eurolife-custom-components-angular/element/eclaims-documents/eclaims-documents.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AmendmentsGetBeneficiariesComponent } from './eurolife-custom-components-angular/section/amendments-get-beneficiaries/amendments-get-beneficiaries.component';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FaqComponent,
    PageFooterComponent,
    PageHeaderComponent,
    MotorCoversEditorCardComponent,
    MotorCustomTableComponent,
    MotorCustomDetailTableComponent,
    ExternalUrlComponent,
    PdfDownloadComponent,
    PdfTableLinkComponent,
    MaskComponent,
    LoadingSpinnerComponent,
    MotorPopUpDeleteAccount,
    MotorDeleteAccount,
    MotorPopUpchangeMobilePhone,
    MotorChangeMobilePhone,
    MotorPopUpchangePhone,
    MotorChangePhone,
    MotorPopUpchangeEmail,
    MotorChangeEmail,
    MotorProfilePicture,
    MotorPopUpChangeProfilePicture,
    MotorPopUpchangePassword,
    MotorChangePassword,
    SuccessfullmessageComponent,
    PaymentdetailsComponent,
    PaymentManagementComponent,
    SubHeaderComponent,
    InfoButtonComponent,
    SocialNetworkSignUpComponent,
    ForgotUsernameComponent,
    RegistrationPageComponent,
    CalculateLifeExpirationDateComponent,
    ParticipantsViewComponent,
    ExagoraComponent,
    ClaimsCardComponent,
    SubheaderStepperComponent,
    CommunicationServiceComponent,
    TelephoneiconComponent,
    SalesChannelDetailsComponent,
    PopUpComponent,
    ButtonToDialogComponent,
    GdprNotificationComponent,
    FileUploadSection,
    SignUpCardComponent,
    SignUpValidatedComponent,
    CalculatePropertyDurationDateComponent,
    CalculatePropertyPaymentFrequencyComponent,
    SimplePageComponent,
    SvgImageComponent,
    SimplePageWithNavigationComponent,
    EurolifeOutputComponent,
    EurolifeH3Component,
    SimpleGridViewComponent,
    EurolifeDropdownMenuComponent,
    EurolifeDropdownMenuComponent,
    EurolifeNotificationBarComponent,
    FormatTimePipeForMobile,
    CurrencyFormat,
    EuroCurrencyFormat,
    OtpInputComponent,
    OnlyDigitsDirective,
    EurolifeOutputColorComponent,
    EurolifeHeaderTileComponent,
    HeaderComponent,
    PaymentComponent,
    SplitPageWithIconComponent,
    IceImageComponent,
    FlatSectionComponent,
    MatCardHomeComponent,
    SimpleTableNoPaginationComponent,
    InputComponent,
    HomePageComponent,
    HomePageMainSectionComponent,
    HomePageCardComponent,
    EurolifeOutputSubheaderComponent,
    EurolifeMotorOutputDriversComponentComponent,
    EurolifeButtonComponent,
    OutputWithIconComponent,
    HomeUnpaidReceiptsComponent,
    PaymentManagementSuccessComponent,
    PaymentManagementStatusBarComponent,
    GlossaryComponent,
    SimplePageNoTitleComponent,
    ChangePasswordFieldComponent,
    InsertCodeTimerComponent,
    SendEmailButtonComponent,
    FromNowPipe,
    TimePickerComponent,
    InsertCodeEmailTimerComponent,
    EmailConfirmationComponent,
    FormatTimePipeForEmail,
    LogoutComponent,
    MyDocumentsComponent,
    TextWithLinkComponent,
    CalendarComponent,
    OutputWithActionComponent,
    PopUpPageComponent,
    AvatarElementComponent,
    MyDafsComponent,
    SessionTimeoutComponent,
    HomeCardContainerComponent,
    OpenDialogTextComponent,
    TermsConditionsComponent,
    ConsentsComponent,
    SignUpGroupConsentsModalComponent,
    SignUpGroupSuccessModalComponent,
    SignUpGroupWaitingModalComponent,
    SignUpGroupErrorServiceModalComponent,
    CookieDeclarationComponent,
    DetailsCustomTableComponent,
    LegalPopupComponent,
    CloseCancelPopUpComponent,
    ParticipantViewClaimsComponent,
    EurolifeEmailButtonComponentComponent,
    EurolifeMobileButtonComponent,
    VideoComponent,
    PageNotFoundComponent,
    InputonchangeactionComponent,
    PopupConsentComponent,
    ConsentsCardsComponent,
    EurolifeConsentButtonComponent,
    NotificationBarComponent,
    ConsentGridViewComponent,
    ConsentFooterComponent,
    IconOutputConsentComponent,
    ConsentComplianceComponent,
    ConsentsTextMsgComponent,
    ConsentInitialStepsComponent,
    ReviewConfirmComponent,
    GreenCardStepperComponent,
    GreenCardDynamicComponent,
    GreenCardAddDriverComponent,
    GreenCardOtherDriverToggleComponent,
    GreenCardDropdownPlatesComponent,
    GreenCardDatepickerComponent,
    GreenCardFullnameComponent,
    GreencardNotificationBarComponent,
    GreenCardButtonComponent,
    GreenCardBackButtonComponent,
    AmendmentsBackButtonComponent,
    RedirectionGreenCardComponent,
    AmendmentsInprogressComponent,
    AmendmentsRequestsComponent,
    AmendmentDetailsHeaderComponent,
    AmendmentsStepperComponent,
    AmendmentsStepperHomeComponent,
    AmendmentsStepperHealthComponent,
    AmendmentsStepperFinanceComponent,
    AmendmentsStepperLifeComponent,
    AmendmentsLifeBeneficiariesComponent,
    UploadFileButtonComponent,
    CommentInputComponent,
    IconOutputComponent,
    OtpTimerComponent,
    EurolifeDropdownComponent,
    AmendmentinputfieldComponent,
    AmendmentinputlifefieldComponent,
    AmendmentinputpropertyfieldComponent,
    PropertyClaimNotificationInputFieldComponent,
    AmendmentMaskComponent,
    EurolifeOutputClickableComponent,
    AmendmentGridViewComponent,
    NoAmendmentGridViewComponent,
    TextLabelComponent,
    ContentWalkthroughComponent,
    HomeCardContainerAmendmentComponent,
    ShowComponentDirective,
    CustomerProfileComponent,
    HeaderWelcomeComponent,
    HomeAgentInfoComponent,
    PreventDoubleClickDirective,
    PendingPaymentComponent,
    LogoutSecurityComponent,
    PipeFunctionPipe,
    VanillaUlLineChartComponent,
    FundsBasketComponent,
    SimpleGridViewQuotationComponent,
    NewRegCodeModalComponent,
    FundsTippProductComponent,
    TippLineChartComponent,
    FundsLifecycleProductComponent,
    LifecycleLineChartComponent,
    SimplePageClaimsComponent,
    EclaimsBackButtonComponent,
    EclaimsStepperComponent,
    EclaimsAvailableContractsComponent,
    EclaimsReceiptScannerComponent,
    EclaimsSelectIncidentComponent,
    EclaimsPageComponent,
    EclaimsSubmitButtonComponent,
    DragDropDirective,
    DragDropFileComponent,
    EclaimsLwcCreateCaseComponent,
    EclaimsCoveragesComponent,
    EclaimsRequestsOpenComponent,
    EclaimsGridViewComponent,
    EclaimsUploadComponent,
    EclaimsRequestsInProgressComponent,
    EclaimsRequestsClosedComponent,
    RedirectionEclaimsComponent,
    RedirectEclaimsDirective,
    EclaimsPageErrorComponent,
    EclaimsErrorScriptComponent,
    DigitalCardComponent,
    SalesforceChatComponent,
    PropertyNotificationStepperComponent,
    PropertyAvailableContractsComponent,
    PropertyClaimNotificationCreateCaseComponent,
    PropertyClaimSubmitButtonComponent,
    PropertyNotificationDatepickerComponent,
    PropertyClaimTypeComponent,
    AmendmentsRelationshipComponent,
    SignUpGroupAreaComponent,
    SignUpGroupCustomerProfilePopUpComponent,
    EclaimsDocumentsComponent,
    AmendmentsGetBeneficiariesComponent

  ],
  imports: [
    PipesModule,
    NgOtpInputModule,
    InlineSVGModule.forRoot(),
    NgxSkeletonLoaderModule,
    MatDividerModule,
    RecaptchaV3Module,
    StorageServiceModule,
    AppRouting,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    TextMaskModule,
    BrowserModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    MessageModule,
    GrowlModule,
    InputSwitchModule,
    GrowlModule,
    TreeModule,
    TabViewModule,
    CardModule,
    PanelModule,
    DropdownModule,
    AutoCompleteModule,
    BlockUIModule,
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
    JoyrideModule.forRoot(),
    ChartsModule,
    SaveToGooglePayButtonModule,
    MatProgressBarModule,
    ZXingScannerModule,
    MatButtonToggleModule
  ],
  providers: [
    LocalStorageService,
    LocalAuthedicationService,
    LoginAuthenticationGuard,
    CanDeactivateGuard,
    ConfirmationService,
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
    LogoutService,
    ModalService,
    CookieConsentService,
    SitecoreService,
    WindowScrollingService,
    SessionTimeoutComponent,
    CheckInactivityService,
    ErrorLogService,
    LogoutSecurityComponent,
    Meta,
    DeviceDetectorService,
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
    MotorCoversEditorCardComponent,
    MotorCustomTableComponent,
    MotorCustomDetailTableComponent,
    ExternalUrlComponent,
    PdfDownloadComponent,
    PdfTableLinkComponent,
    MaskComponent,
    MotorPopUpDeleteAccount,
    MotorDeleteAccount,
    MotorPopUpchangeMobilePhone,
    MotorChangeMobilePhone,
    MotorPopUpchangePhone,
    MotorChangePhone,
    MotorPopUpchangeEmail,
    MotorChangeEmail,
    MotorProfilePicture,
    MotorPopUpChangeProfilePicture,
    MotorPopUpchangePassword,
    MotorChangePassword,
    SuccessfullmessageComponent,
    PaymentdetailsComponent,
    PaymentManagementComponent,
    PaymentManagementSuccessComponent,
    PaymentManagementStatusBarComponent,
    SubHeaderComponent,
    InfoButtonComponent,
    SocialNetworkSignUpComponent,
    RegistrationPageComponent,
    CalculateLifeExpirationDateComponent,
    ParticipantsViewComponent,
    ExagoraComponent,
    ClaimsCardComponent,
    SubheaderStepperComponent,
    ForgotUsernameComponent,
    CommunicationServiceComponent,
    TelephoneiconComponent,
    SalesChannelDetailsComponent,
    PopUpComponent,
    ButtonToDialogComponent,
    GdprNotificationComponent,
    FileUploadSection,
    SignUpCardComponent,
    SignUpValidatedComponent,
    CalculatePropertyDurationDateComponent,
    CalculatePropertyPaymentFrequencyComponent,
    SimplePageComponent,
    SvgImageComponent,
    SimplePageWithNavigationComponent,
    EurolifeOutputComponent,
    EurolifeH3Component,
    SimpleGridViewComponent,
    EurolifeDropdownMenuComponent,
    EurolifeNotificationBarComponent,
    OtpInputComponent,
    EurolifeHeaderTileComponent,
    HeaderComponent,
    PaymentComponent,
    SplitPageWithIconComponent,
    IceImageComponent,
    FlatSectionComponent,
    MatCardHomeComponent,
    SimpleTableNoPaginationComponent,
    InputComponent,
    HomePageComponent,
    HomePageMainSectionComponent,
    HomePageCardComponent,
    EurolifeOutputSubheaderComponent,
    EurolifeMotorOutputDriversComponentComponent,
    EurolifeButtonComponent,
    OutputWithIconComponent,
    HomeUnpaidReceiptsComponent,
    SimplePageNoTitleComponent,
    ChangePasswordFieldComponent,
    InsertCodeTimerComponent,
    SendEmailButtonComponent,
    TimePickerComponent,
    InsertCodeEmailTimerComponent,
    EmailConfirmationComponent,
    GlossaryComponent,
    LogoutComponent,
    MyDocumentsComponent,
    TextWithLinkComponent,
    CalendarComponent,
    OutputWithActionComponent,
    PopUpPageComponent,
    AvatarElementComponent,
    MyDafsComponent,
    SessionTimeoutComponent,
    HomeCardContainerComponent,
    OpenDialogTextComponent,
    TermsConditionsComponent,
    ConsentsComponent,
    SignUpGroupConsentsModalComponent,
    SignUpGroupSuccessModalComponent,
    SignUpGroupWaitingModalComponent,
    SignUpGroupErrorServiceModalComponent,
    CookieDeclarationComponent,
    DetailsCustomTableComponent,
    LegalPopupComponent,
    CloseCancelPopUpComponent,
    ParticipantViewClaimsComponent,
    EurolifeEmailButtonComponentComponent,
    EurolifeMobileButtonComponent,
    VideoComponent,
    PageNotFoundComponent,
    InputonchangeactionComponent,
    PopupConsentComponent,
    ConsentsCardsComponent,
    EurolifeConsentButtonComponent,
    NotificationBarComponent,
    ConsentGridViewComponent,
    ConsentFooterComponent,
    IconOutputConsentComponent,
    ConsentComplianceComponent,
    ConsentsTextMsgComponent,
    ConsentInitialStepsComponent,
    ReviewConfirmComponent,
    GreenCardStepperComponent,
    GreenCardDynamicComponent,
    GreenCardAddDriverComponent,
    GreenCardOtherDriverToggleComponent,
    GreenCardDropdownPlatesComponent,
    GreenCardDatepickerComponent,
    GreenCardFullnameComponent,
    GreencardNotificationBarComponent,
    GreenCardButtonComponent,
    GreenCardBackButtonComponent,
    AmendmentsBackButtonComponent,
    RedirectionGreenCardComponent,
    AmendmentsInprogressComponent,
    AmendmentsRequestsComponent,
    AmendmentDetailsHeaderComponent,
    AmendmentsStepperComponent,
    AmendmentsStepperHomeComponent,
    AmendmentsStepperHealthComponent,
    AmendmentsStepperFinanceComponent,
    AmendmentsStepperLifeComponent,
    AmendmentsLifeBeneficiariesComponent,
    UploadFileButtonComponent,
    CommentInputComponent,
    IconOutputComponent,
    OtpTimerComponent,
    EurolifeDropdownComponent,
    AmendmentinputfieldComponent,
    AmendmentinputlifefieldComponent,
    AmendmentinputpropertyfieldComponent,
    PropertyClaimNotificationInputFieldComponent,
    AmendmentMaskComponent,
    EurolifeOutputClickableComponent,
    AmendmentGridViewComponent,
    NoAmendmentGridViewComponent,
    TextLabelComponent,
    ContentWalkthroughComponent,
    HomeCardContainerAmendmentComponent,
    CustomerProfileComponent,
    HeaderWelcomeComponent,
    HomeAgentInfoComponent,
    PendingPaymentComponent,
    LogoutSecurityComponent,
    VanillaUlLineChartComponent,
    FundsBasketComponent,
    SimpleGridViewQuotationComponent,
    NewRegCodeModalComponent,
    FundsTippProductComponent,
    TippLineChartComponent,
    FundsLifecycleProductComponent,
    LifecycleLineChartComponent,
    SimplePageClaimsComponent,
    EclaimsBackButtonComponent,
    EclaimsStepperComponent,
    EclaimsAvailableContractsComponent,
    EclaimsReceiptScannerComponent,
    EclaimsSelectIncidentComponent,
    EclaimsPageComponent,
    EclaimsSubmitButtonComponent,
    DragDropFileComponent,
    EclaimsLwcCreateCaseComponent,
    EclaimsCoveragesComponent,
    EclaimsRequestsOpenComponent,
    EclaimsGridViewComponent,
    EclaimsUploadComponent,
    EclaimsRequestsInProgressComponent,
    EclaimsRequestsClosedComponent,
    RedirectionEclaimsComponent,
    EclaimsPageErrorComponent,
    EclaimsErrorScriptComponent,
    DigitalCardComponent,
    PropertyNotificationStepperComponent,
    PropertyAvailableContractsComponent,
    PropertyClaimNotificationCreateCaseComponent,
    PropertyClaimSubmitButtonComponent,
    PropertyNotificationDatepickerComponent,
    PropertyClaimTypeComponent,
    AmendmentsRelationshipComponent,
    SignUpGroupAreaComponent,
    SignUpGroupCustomerProfilePopUpComponent,
    EclaimsDocumentsComponent,
    SalesforceChatComponent,
    AmendmentsGetBeneficiariesComponent

  ],
  bootstrap: [AppComponent],
  exports: [
    MotorCoversEditorCardComponent,
    MotorCustomTableComponent,
    MotorCustomDetailTableComponent,
    ExternalUrlComponent,
    PdfDownloadComponent,
    PdfTableLinkComponent,
    MaskComponent,
    MotorPopUpDeleteAccount,
    MotorDeleteAccount,
    MotorPopUpchangeMobilePhone,
    MotorChangeMobilePhone,
    MotorPopUpchangePhone,
    MotorChangePhone,
    MotorPopUpchangeEmail,
    MotorChangeEmail,
    MotorProfilePicture,
    MotorPopUpChangeProfilePicture,
    MotorPopUpchangePassword,
    MotorChangePassword,
    SuccessfullmessageComponent,
    PaymentdetailsComponent,
    PaymentManagementComponent,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatTabsModule,
    InfoButtonComponent,
    SocialNetworkSignUpComponent,
    RegistrationPageComponent,
    CalculateLifeExpirationDateComponent,
    ParticipantsViewComponent,
    ClaimsCardComponent,
    SubheaderStepperComponent,
    ForgotUsernameComponent,
    CommunicationServiceComponent,
    TelephoneiconComponent,
    SalesChannelDetailsComponent,
    PopUpComponent,
    ButtonToDialogComponent,
    FileUploadSection,
    SignUpCardComponent,
    SignUpValidatedComponent,
    CalculatePropertyDurationDateComponent,
    CalculatePropertyPaymentFrequencyComponent,
    SimplePageComponent,
    SvgImageComponent,
    SimplePageWithNavigationComponent,
    EurolifeOutputComponent,
    EurolifeH3Component,
    SimpleGridViewComponent,
    EurolifeDropdownMenuComponent,
    EurolifeNotificationBarComponent,
    FormatTimePipeForMobile,
    OtpInputComponent,
    OnlyDigitsDirective,
    EurolifeHeaderTileComponent,
    SplitPageWithIconComponent,
    IceImageComponent,
    FlatSectionComponent,
    MatCardHomeComponent,
    SimpleTableNoPaginationComponent,
    InputComponent,
    HomePageComponent,
    HomePageMainSectionComponent,
    HomePageCardComponent,
    EurolifeOutputSubheaderComponent,
    EurolifeMotorOutputDriversComponentComponent,
    EurolifeButtonComponent,
    OutputWithIconComponent,
    HomeUnpaidReceiptsComponent,
    PaymentManagementSuccessComponent,
    PaymentManagementStatusBarComponent,
    SimplePageNoTitleComponent,
    ChangePasswordFieldComponent,
    InsertCodeTimerComponent,
    SendEmailButtonComponent,
    FromNowPipe,
    CurrencyFormat,
    EuroCurrencyFormat,
    TimePickerComponent,
    InsertCodeEmailTimerComponent,
    FormatTimePipeForEmail,
    EmailConfirmationComponent,
    GlossaryComponent,
    LogoutComponent,
    MyDocumentsComponent,
    TextWithLinkComponent,
    CalendarComponent,
    OutputWithActionComponent,
    PopUpPageComponent,
    AvatarElementComponent,
    MyDafsComponent,
    SessionTimeoutComponent,
    HomeCardContainerComponent,
    OpenDialogTextComponent,
    TermsConditionsComponent,
    ConsentsComponent,
    SignUpGroupConsentsModalComponent,
    SignUpGroupSuccessModalComponent,
    SignUpGroupWaitingModalComponent,
    SignUpGroupErrorServiceModalComponent,
    CookieDeclarationComponent,
    DetailsCustomTableComponent,
    LegalPopupComponent,
    CloseCancelPopUpComponent,
    ParticipantViewClaimsComponent,
    EurolifeEmailButtonComponentComponent,
    EurolifeMobileButtonComponent,
    VideoComponent,
    InputonchangeactionComponent,
    PopupConsentComponent,
    ConsentsCardsComponent,
    EurolifeConsentButtonComponent,
    NotificationBarComponent,
    ConsentGridViewComponent,
    ConsentFooterComponent,
    IconOutputConsentComponent,
    ConsentComplianceComponent,
    ConsentsTextMsgComponent,
    ConsentInitialStepsComponent,
    ReviewConfirmComponent,
    GreenCardStepperComponent,
    GreenCardDynamicComponent,
    GreenCardAddDriverComponent,
    GreenCardOtherDriverToggleComponent,
    GreenCardDropdownPlatesComponent,
    GreenCardDatepickerComponent,
    GreenCardFullnameComponent,
    GreencardNotificationBarComponent,
    GreenCardButtonComponent,
    GreenCardBackButtonComponent,
    AmendmentsBackButtonComponent,
    RedirectionGreenCardComponent,
    AmendmentsInprogressComponent,
    AmendmentsRequestsComponent,
    AmendmentDetailsHeaderComponent,
    AmendmentsStepperComponent,
    AmendmentsStepperHomeComponent,
    AmendmentsStepperHealthComponent,
    AmendmentsStepperFinanceComponent,
    AmendmentsStepperLifeComponent,
    AmendmentsLifeBeneficiariesComponent,
    UploadFileButtonComponent,
    CommentInputComponent,
    IconOutputComponent,
    OtpTimerComponent,
    EurolifeDropdownComponent,
    AmendmentinputfieldComponent,
    AmendmentinputlifefieldComponent,
    AmendmentinputpropertyfieldComponent,
    PropertyClaimNotificationInputFieldComponent,
    AmendmentMaskComponent,
    EurolifeOutputClickableComponent,
    AmendmentGridViewComponent,
    NoAmendmentGridViewComponent,
    TextLabelComponent,
    ContentWalkthroughComponent,
    HomeCardContainerAmendmentComponent,
    CustomerProfileComponent,
    HeaderWelcomeComponent,
    HomeAgentInfoComponent,
    PendingPaymentComponent,
    LogoutSecurityComponent,
    PipeFunctionPipe,
    VanillaUlLineChartComponent,
    FundsBasketComponent,
    SimpleGridViewQuotationComponent,
    FundsTippProductComponent,
    TippLineChartComponent,
    FundsLifecycleProductComponent,
    LifecycleLineChartComponent,
    SimplePageClaimsComponent,
    EclaimsBackButtonComponent,
    EclaimsStepperComponent,
    EclaimsAvailableContractsComponent,
    EclaimsReceiptScannerComponent,
    EclaimsSelectIncidentComponent,
    EclaimsPageComponent,
    EclaimsSubmitButtonComponent,
    DragDropFileComponent,
    EclaimsLwcCreateCaseComponent,
    EclaimsCoveragesComponent,
    EclaimsRequestsOpenComponent,
    EclaimsGridViewComponent,
    EclaimsUploadComponent,
    EclaimsRequestsInProgressComponent,
    EclaimsRequestsClosedComponent,
    RedirectionEclaimsComponent,
    EclaimsPageErrorComponent,
    EclaimsErrorScriptComponent,
    DigitalCardComponent,
    PropertyNotificationStepperComponent,
    PropertyAvailableContractsComponent,
    PropertyClaimNotificationCreateCaseComponent,
    PropertyClaimSubmitButtonComponent,
    PropertyNotificationDatepickerComponent,
    PropertyClaimTypeComponent,
    AmendmentsRelationshipComponent,
    SignUpGroupAreaComponent,
    SignUpGroupCustomerProfilePopUpComponent,
    EclaimsDocumentsComponent,
    AmendmentsGetBeneficiariesComponent
  ]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
    registerLocaleData(localeEl);
  }
}

import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IceComponentsService, NgIceModule } from '@impeo/ng-ice';
// import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {NgxEchartsModule} from 'ngx-echarts';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { InsisTwoLevelStepperNavigationPageComponent } from './components/page-components/insis-two-level-stepper-navigation-page/insis-two-level-stepper-navigation-page.component';
import { InsisConfirmationPageComponent } from './components/page-components/insis-confirmation-page/insis-confirmation-page.component';
import { InsisHorizontalStepperNavigationComponent } from './components/navigation-components/insis-horizontal-stepper-navigation/insis-horizontal-stepper-navigation.component';
import { InsisVerticalStepperNavigationComponent } from './components/navigation-components/insis-vertical-stepper-navigation/insis-vertical-stepper-navigation.component';
import { InsisHorizontalTabsNavigationComponent } from './components/navigation-components/insis-horizontal-tabs-navigation/insis-horizontal-tabs-navigation.component';
import { InsisPolicySummarySectionComponent } from './components/section-components/insis-policy-summary-section/insis-policy-summary-section.component';


import { OverlayModule } from '@angular/cdk/overlay';
import { InsisSummarySectionDetailContainer } from './components/shared-components/insis-summary-section-detail-container/insis-summary-section-detail-container.component';
import { InsisSimplePageComponent } from './components/page-components/insis-simple-page/insis-simple-page.component';
import { InsisDatagridSectionComponent } from './components/section-components/insis-datagrid-section/insis-datagrid-section.component';
import { InsisOneLevelTabsNavigationPageComponent } from './components/page-components/insis-one-level-tabs-navigation-page/insis-one-level-tabs-navigation-page.component';
import { InsisDialogSectionContainer } from './components/shared-components/insis-dialog-section-container/insis-dialog-section-container';
import { InsisPremiumSummarySection } from './components/section-components/insis-premium-summary-section/insis-premium-summary-section.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { InsisFormFlexSectionComponent } from './components/section-components/insis-form-flex-section/insis-form-flex-section.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InsisFistArrayItemSectionComponent } from './components/section-components/insis-first-array-item-section/insis-first-array-item-section';
import { InsisPaymentsSection } from './components/section-components/insis-payments-section/insis-payments-section.components';
import { InsisPaginatorSectionComponent } from './components/section-components/insis-paginator-section/insis-paginator-section.component';
import { InsisChartSectionComponent } from './components/section-components/insis-chart-section/insis-chart-section.component';
import { FileUploadWithQrCodeSection } from './components/section-components/file-upload-with-qrcode-section/file-upload-with-qrcode-section.component';


///Eurolife Components

import { EurolifeDropdownComponent } from './components/element-components/eurolife-dropdown/eurolife-dropdown.component';

import { MotorCoversEditorCardComponent } from './components/section-components/motor-covers-card/motor-covers-card.section.component';
import { MotorPopUpDeleteAccount } from "./components/section-components/motor-popup-deteteAccount/motor-popup-deleteAccount.component";
import { MotorPopUpchangeMobilePhone } from "./components/section-components/motor-popup-changeMobilePhone/motor-popup-changeMobilePhone.component";
import { MotorPopUpchangePhone } from "./components/section-components/motor-popup-changePhone/motor-popup-changePhone.component";
import { MotorPopUpchangeEmail } from "./components/section-components//motor-popup-changeEmail/motor-popup-changeEmail.component";
import { MotorPopUpChangeProfilePicture } from "./components/section-components/motor-popup-changeProfilePicure/motor-popup-changeProfilePicure.component";
import { MotorPopUpchangePassword } from "./components/section-components/motor-popup-changePassword/motor-popup-changePassword.component";
import { MotorCustomTableComponent } from "./components/section-components//motor-custom-table/motor-custom-table.section.component";

import { TelephoneiconComponent } from "./components/element-components/telephoneicon/telephoneicon.component";
import { TextWithLinkComponent } from "./components/element-components/text-with-link/text-with-link.component";
import { MotorDeleteAccount } from "./components/element-components/motor-deleteAccount/motor-deleteAccount.component";
import { MotorChangeMobilePhone } from "./components/element-components/motor-changeMobilePhone/motor-changeMobilePhone.component";
import { MotorChangePhone } from "./components/element-components/motor-changePhone/motor-changePhone.component";
import { MotorChangeEmail } from "./components/element-components/motor-changeEmail/motor-changeEmail.component";
import { MotorProfilePicture } from "./components/element-components/motor-profilePicture/motor-profilePicture.component";
import { MotorChangePassword } from "./components/element-components/motor-changePassword/motor-changePassword.component";
import { TimePickerComponent } from "./components/element-components/time-picker/time-picker.component";
import { MaskComponent } from "./components/element-components/mask/mask.element.component";
import { CalendarComponent } from "./components/element-components/calendar/calendar.component";
import { OutputWithActionComponent } from "./components/element-components/output-with-action/output-with-action.component";
import { OpenDialogTextComponent } from "./components/element-components/open-dialog-text/open-dialog-text.component";
import { ConsentsComponent } from "../../../../apps/angular/src/app/components/consents/consents.component";


import { EurolifeConsentButtonComponent } from "./components/element-components/eurolife-consent-button/eurolife-consent-button.component";
import { NotificationBarComponent } from "./components/element-components/notification-bar/notification-bar.component";
import { IconOutputConsentComponent } from "./components/element-components/icon-output-consent/icon-output-consent.component";
import { ConsentsTextMsgComponent } from './components/element-components/consents-text-msg/consents-text-msg.component';
import { ConsentInitialStepsComponent } from './components/element-components/consent-initial-steps/consent-initial-steps.component';
import { GreenCardDynamicComponent } from './components/element-components/green-card-dynamic/green-card-dynamic.component';
import { GreenCardAddDriverComponent } from './components/element-components/green-card-add-driver/green-card-add-driver.component';
import { GreenCardOtherDriverToggleComponent } from './components/element-components/green-card-other-driver-toggle/green-card-other-driver-toggle.component';
import { GreenCardDropdownPlatesComponent } from './components/element-components/green-card-dropdown-plates/green-card-dropdown-plates.component';
import { GreenCardDatepickerComponent } from './components/element-components/green-card-datepicker/green-card-datepicker.component';
import { GreenCardFullnameComponent } from './components/element-components/green-card-fullname/green-card-fullname.component';
import { GreencardNotificationBarComponent } from './components/element-components/greencard-notification-bar/greencard-notification-bar.component';
import { GreenCardButtonComponent } from './components/element-components/green-card-button/green-card-button.component';
import { GreenCardBackButtonComponent } from './components/element-components/green-card-back-button/green-card-back-button.component';
import { AmendmentsBackButtonComponent } from './components/element-components/amendments-back-button/amendments-back-button.component';
import { UploadFileButtonComponent } from "./components/element-components/upload-file-button/upload-file-button.component";
import { CommentInputComponent } from "./components/element-components/comment-input/comment-input.component";
import { IconOutputComponent } from "./components/element-components/icon-output/icon-output.component";
import { AmendmentinputfieldComponent } from './components/element-components/amendmentinputfield/amendmentinputfield.component';
import { AmendmentinputlifefieldComponent } from './components/element-components/amendmentinputlifefield/amendmentinputlifefield.component';
import { PropertyClaimNotificationInputFieldComponent } from './components/element-components/property-clailm-notification-input-field/property-clailm-notification-input-field.component';
import { AmendmentinputpropertyfieldComponent } from './components/element-components/amendmentinputpropertyfield/amendmentinputpropertyfield.component';
import { AmendmentMaskComponent } from './components/element-components/amendmentmask/amendmentmask.component';
import { EurolifeOutputClickableComponent } from './components/element-components/eurolife-output-clickable/eurolife-output-clickable.component';
import { TextLabelComponent } from './components/element-components/text-label/text-label.component';

import { HeaderWelcomeComponent } from './components/element-components/header-welcome/header-welcome.component';
import { HomeAgentInfoComponent } from './components/section-components/home-agent-info/home-agent-info.component';




import { EurolifeEmailButtonComponentComponent } from "./components/element-components/eurolife-email-button-component/eurolife-email-button-component.component";
import { EurolifeMobileButtonComponent } from "./components/element-components/eurolife-mobile-button/eurolife-mobile-button.component";
import { InputonchangeactionComponent } from "./components/element-components/inputonchangeaction/inputonchangeaction.component";
import { PopupConsentComponent } from "./components/element-components/popup-consent/popup-consent.component";
import { ConsentsCardsComponent } from "./components/element-components/consents-cards/consents-cards.component";
import { ButtonToDialogComponent } from "./components/element-components/button-to-dialog-component/button-to-dialog-component";
import { GdprNotificationComponent } from "./components/element-components/gdpr-notification/gdpr-notification.component";


import { PdfDownloadComponent } from "./components/shared-components/pdf-download-component/pdf-download-component";
import { PdfTableLinkComponent } from "./components/shared-components/pdf-table-link-component/pdf-table-link-component";

import { PaymentdetailsComponent } from "./components/section-components/paymentdetails/paymentdetails.component";
import { MotorCustomDetailTableComponent } from "./components/section-components/motor-custom-detail-table/motor-custom-detail-table.section.component";
import { SocialNetworkSignUpComponent } from "./components/section-components/social-network-sign-up/social-network-sign-up.component";
import { RegistrationPageComponent } from "./components/page-components/registration-page/registration-page.component";
import { ParticipantsViewComponent } from "./components/section-components/participants-view/participants-view.component";
import { ExagoraComponent } from "./components/section-components/exagora/exagora.component";
import { ClaimsCardComponent } from "./components/section-components/claims-card/claims-card.component";
import { SubheaderStepperComponent } from "./components/section-components/subheader-stepper/subheader-stepper.component";

import { SalesChannelDetailsComponent } from "./components/section-components/sales-channel-details/sales-channel-details.component";
import { FileUploadSection } from "./components/section-components/file-upload-section/file-upload-section.component";
import { SignUpCardComponent } from "./components/section-components/sign-up-card/sign-up-card.component";
import { SignUpValidatedComponent } from "./components/section-components/sign-up-validated/sign-up-validated.component";

import { SimplePageComponent } from "./components/page-components/simple-page/simple-page.component";
import { FaqComponent } from "../../../../apps/angular/src/app/components/faq/faq.component";
import { SimplePageWithNavigationComponent } from "./components/page-components/simple-page-with-navigation/simple-page-with-navigation.component";
import { EurolifeOutputComponent } from "./components/element-components/eurolife-output/eurolife-output.component";
import { EurolifeH3Component } from "./components/element-components/eurolife-h3/eurolife-h3.component";
import { SimpleGridViewComponent } from "./components/section-components/simple-grid-view/simple-grid-view.component";
import { EurolifeDropdownMenuComponent } from "./components/shared-components/eurolife-dropdown-menu/eurolife-dropdown-menu.component";
import { EurolifeNotificationBarComponent } from "./components/element-components/eurolife-notification-bar/eurolife-notification-bar.component";
import { OtpInputComponent } from "./components/element-components/otp-input/otp-input.component";
// import { OnlyDigitsDirective } from "./components/element-components/otp-input/only-digits.directive";
import { EurolifeOutputColorComponent } from "./components/element-components/eurolife-output-color/eurolife-output-color.component";
import { EurolifeHeaderTileComponent } from "./components/element-components/eurolife-header-tile/eurolife-header-tile.component";
import { HeaderComponent } from "./components/section-components/header/header.component";
import { PaymentComponent } from "./components/section-components/payment/payment.component";
import { SplitPageWithIconComponent } from "./components/page-components/split-page-with-icon/split-page-with-icon.component";
import { IceImageComponent } from "./components/element-components/ice-image/ice-image.component";
import { FlatSectionComponent } from "./components/section-components/flat-section/flat-section.component";
import { InputComponent } from "./components/element-components/input/input.component";
import { MatCardHomeComponent } from "./components/element-components/mat-card-home/mat-card-home.component";
import { SimpleTableNoPaginationComponent } from "./components/section-components/simple-table-no-pagination/simple-table-no-pagination.component";
import { HomePageComponent } from "./components/page-components/home-page/home-page.component";
import { HomePageMainSectionComponent } from "./components/section-components/home-page-main-section/home-page-main-section.component";
import { HomePageCardComponent } from "./components/element-components/home-page-card/home-page-card.component";
import { EurolifeOutputSubheaderComponent } from "./components/element-components/eurolife-output-subheader/eurolife-output-subheader.component";
import { EurolifeMotorOutputDriversComponentComponent } from "./components/element-components/eurolife-motor-output-drivers-component/eurolife-motor-output-drivers-component.component";
import { EurolifeButtonComponent } from "./components/element-components/eurolife-button/eurolife-button.component";
import { OutputWithIconComponent } from "./components/element-components/output-with-icon/output-with-icon.component";
import { HomeUnpaidReceiptsComponent } from "./components/element-components/home-unpaid-receipts/home-unpaid-receipts.component";
import { PaymentManagementSuccessComponent } from "./components/section-components/payment-management-success/payment-management-success.component";
import { PaymentManagementStatusBarComponent } from "./components/section-components/payment-management-status-bar/payment-management-status-bar.component";
import { SimplePageNoTitleComponent } from "./components/page-components/simple-page-no-title/simple-page-no-title.component";
import { ChangePasswordFieldComponent } from "./components/section-components/change-password-fields/change-password-fields.component";
import { InsertCodeTimerComponent } from "./components/element-components/insert-code-timer/insert-code-timer.component";
import { SendEmailButtonComponent } from "./components/element-components/send-email-button/send-email-button.component";
import { GlossaryComponent } from "../../../../apps/angular/src/app/components/glossary/glossary.component";
import { InsertCodeEmailTimerComponent } from "./components/element-components/insert-code-email-timer/insert-code-email-timer.component";
// import { FormatTimePipeForEmail } from "./components/element-components/insert-code-email-timer/insert-code-email-timer.component";
import { EmailConfirmationComponent } from "./components/page-components/email-confirmation/email-confirmation.component";

import { MyDocumentsComponent } from "./components/section-components/my-documents/my-documents.component";
import { PopUpPageComponent } from "./components/page-components/pop-up-page/pop-up-page.component";
import { MyDafsComponent } from "./components/section-components/my-dafs/my-dafs.component";
import { HomeCardContainerComponent } from "./components/section-components/home-card-container/home-card-container.component";



import { DetailsCustomTableComponent } from "./components/section-components/details-custom-table/details-custom-table.component";
import { LegalPopupComponent } from "../../../../apps/angular/src/app/components/legal-popup/legal-popup.component";
import { ParticipantViewClaimsComponent } from "./components/section-components/participant-view-claims/participant-view-claims.component";

import { PageNotFoundComponent } from "../../../../apps/angular/src/app/components/page-not-found/page-not-found.component";
import { ConsentGridViewComponent } from "./components/section-components/consent-grid-view/consent-grid-view.component";
import { ConsentFooterComponent } from "./components/section-components/consent-footer/consent-footer.component";
import { ConsentComplianceComponent } from './components/section-components/consent-compliance/consent-compliance.component';
import { ReviewConfirmComponent } from '../../../../apps/angular/src/app/components/review-confirm/review-confirm.component';
import { GreenCardStepperComponent } from './components/section-components/green-card-stepper/green-card-stepper.component';
import { RedirectionGreenCardComponent } from './components/section-components/redirection-green-card/redirection-green-card.component';
import { AmendmentsInprogressComponent } from "./components/section-components/amendments-inprogress/amendments-inprogress.component";
import { AmendmentsRequestsComponent } from "./components/section-components/amendments-requests/amendments-requests.component";
import { AmendmentDetailsHeaderComponent } from "./components/section-components/amendment-details-header/amendment-details-header.component";
import { AmendmentsStepperComponent } from "./components/section-components/amendments-stepper/amendments-stepper.component";
import { AmendmentsStepperHomeComponent } from "./components/section-components/amendments-stepper-home/amendments-stepper-home.component";
import { AmendmentsStepperHealthComponent } from "./components/section-components/amendments-stepper-health/amendments-stepper-health.component";
import { AmendmentsStepperFinanceComponent } from "./components/section-components/amendments-stepper-finance/amendments-stepper-finance.component";
import { AmendmentsStepperLifeComponent } from "./components/section-components/amendments-stepper-life/amendments-stepper-life.component";
import { AmendmentsLifeBeneficiariesComponent } from './components/section-components/amendments-life-beneficiaries/amendments-life-beneficiaries.component';
import { AmendmentGridViewComponent } from './components/section-components/amendment-grid-view/amendment-grid-view.component';
import { NoAmendmentGridViewComponent } from './components/section-components/no-amendment-grid-view/no-amendment-grid-view.component';
import { ContentWalkthroughComponent } from './components/section-components/content-walkthrough/content-walkthrough.component';
import { HomeCardContainerAmendmentComponent } from './components/section-components/home-card-container-amendment/home-card-container-amendment.component';
import { CustomerProfileComponent } from './components/section-components/customer-profile/customer-profile.component';

import { PendingPaymentComponent } from './components/section-components/pending-payment/pending-payment.component';

import { VanillaUlLineChartComponent } from './components/section-components/vanilla-ul-line-chart/vanilla-ul-line-chart.component';
import { FundsBasketComponent } from './components/section-components/funds-basket/funds-basket.component';
import { SimpleGridViewQuotationComponent } from './components/section-components/simple-grid-view-quotation/simple-grid-view-quotation.component';

import { FundsTippProductComponent } from './components/section-components/funds-tipp-product/funds-tipp-product.component';
import { TippLineChartComponent } from './components/section-components/tipp-line-chart/tipp-line-chart.component';
import { FundsLifecycleProductComponent } from './components/section-components/funds-lifecycle-product/funds-lifecycle-product.component';
import { LifecycleLineChartComponent } from './components/section-components/lifecycle-line-chart/lifecycle-line-chart.component';
import { SimplePageClaimsComponent } from './components/page-components/simple-page-claims/simple-page-claims.component';
import { EclaimsBackButtonComponent } from './components/element-components/eclaims-back-button/eclaims-back-button.component';
import { EclaimsStepperComponent } from './components/section-components/eclaims-stepper/eclaims-stepper.component';
import { EclaimsAvailableContractsComponent } from './components/section-components/eclaims-available-contracts/eclaims-available-contracts.component';
import { EclaimsReceiptScannerComponent } from './components/section-components/eclaims-receipt-scanner/eclaims-receipt-scanner.component';
import { EclaimsSelectIncidentComponent } from './components/section-components/eclaims-select-incident/eclaims-select-incident.component';
import { EclaimsPageComponent } from './components/page-components/eclaims-page/eclaims-page.component';
import { EclaimsLwcCreateCaseComponent }  from "./components/section-components/eclaims-lwc-create-case/eclaims-lwc-create-case.component";
import { EclaimsCoveragesComponent } from './components/section-components/eclaims-coverages/eclaims-coverages.component';
import { EclaimsRequestsOpenComponent } from './components/section-components/eclaims-group-health-requests/eclaims-requests-open.component';
import { EclaimsGridViewComponent } from './components/section-components/eclaims-grid-view/eclaims-grid-view.component';
import { EclaimsUploadComponent } from './components/section-components/eclaims-upload/eclaims-upload.component';
import { EclaimsRequestsInProgressComponent } from './components/section-components/eclaims-requests-in-progress/eclaims-requests-in-progress.component';
import { EclaimsRequestsClosedComponent } from './components/section-components/eclaims-requests-closed/eclaims-requests-closed.component';
import { RedirectionEclaimsComponent } from './components/section-components/redirection-eclaims/redirection-eclaims.component';
import { EclaimsPageErrorComponent } from './components/page-components/eclaims-page-error/eclaims-page-error.component';
import { EclaimsErrorScriptComponent } from './components/section-components/eclaims-error-script/eclaims-error-script.component';
import { PropertyNotificationStepperComponent } from './components/section-components/property-notification-stepper/property-notification-stepper.component';
import { PropertyAvailableContractsComponent } from './components/section-components/property-available-contracts/property-available-contracts.component';
import { PropertyClaimNotificationCreateCaseComponent } from './components/section-components/property-claim-notification-create-case/property-claim-notification-create-case.component';
import { SignUpGroupCustomerProfilePopUpComponent} from './components/section-components/sign-up-group-customer-profile-pop-up/sign-up-group-customer-profile-pop-up.component';
import { AmendmentsGetBeneficiariesComponent } from './components/section-components/amendments-get-beneficiaries/amendments-get-beneficiaries.component';
import { EclaimsSubmitButtonComponent } from './components/element-components/eclaims-submit-button/eclaims-submit-button.component';
import { CloseCancelPopUpComponent } from "./components/element-components/close-cancel-pop-up/close-cancel-pop-up.component";
import { AvatarElementComponent } from "./components/element-components/avatar-element.component/avatar-element.component";
import { CalculatePropertyDurationDateComponent } from "./components/element-components/calculate-property-duration-date/calculate-property-duration-date.component";
import { CalculatePropertyPaymentFrequencyComponent } from "./components/element-components/calculate-property-payment-frequency/calculate-property-payment-frequency.component";
import { DragDropFileComponent } from "./components/element-components/drag-drop-file/drag-drop-file.component";
import { DigitalCardComponent } from './components/element-components/digital-card/digital-card.component';
import { PropertyClaimSubmitButtonComponent } from './components/element-components/property-claim-submit-button/property-claim-submit-button.component';
import { PropertyNotificationDatepickerComponent } from './components/element-components/property-notification-datepicker/property-notification-datepicker.component';
import { PropertyClaimTypeComponent } from './components/element-components/property-claim-type/property-claim-type.component';
import { AmendmentsRelationshipComponent } from './components/element-components/amendments-relationship/amendments-relationship.component';
import { SignUpGroupAreaComponent } from './components/element-components/sign-up-group-area/sign-up-group-area.component';
import { EclaimsDocumentsComponent } from './components/element-components/eclaims-documents/eclaims-documents.component';

import { SuccessfullmessageComponent } from "./components/element-components/successfullmessage/successfullmessage.component";
import { SubHeaderComponent } from "./components/section-components/sub-header/sub-header.component";
import { InfoButtonComponent } from "./components/element-components/info-button/info-button.component";
import { CalculateLifeExpirationDateComponent } from "./components/element-components/calculate-life-expiration-date/calculate-life-expiration-date.component";
import { PopUpComponent } from "./components/element-components/pop-up/pop-up.component";
import { SvgImageComponent } from "./components/element-components/svg-image/svg-image.component";

/**
 * TIP: You will need to include in this array any new component you create.
 */
export const iceCustomComponents = [
  InsisTwoLevelStepperNavigationPageComponent,
  InsisSimplePageComponent,
  InsisDatagridSectionComponent,
  InsisPaginatorSectionComponent,
  InsisFormFlexSectionComponent,
  InsisPolicySummarySectionComponent,
  InsisSummarySectionDetailContainer,
  InsisOneLevelTabsNavigationPageComponent,
  InsisConfirmationPageComponent,
  InsisPremiumSummarySection,
  InsisFistArrayItemSectionComponent,
  InsisPaymentsSection,
  InsisChartSectionComponent,
  PdfDownloadComponent,
  PdfTableLinkComponent,
  FileUploadWithQrCodeSection,
  EurolifeDropdownComponent,
  MotorCoversEditorCardComponent,
  OpenDialogTextComponent,
  TelephoneiconComponent,
  ConsentsComponent,
  HeaderWelcomeComponent,
  HomeAgentInfoComponent,
  IconOutputComponent,
  TextLabelComponent,
  EurolifeOutputClickableComponent,
  AmendmentMaskComponent,
  AmendmentinputpropertyfieldComponent,
  PropertyClaimNotificationInputFieldComponent,
  AmendmentinputlifefieldComponent,
  AmendmentinputfieldComponent,
  UploadFileButtonComponent,
  CommentInputComponent,
  AmendmentsBackButtonComponent,
  GreenCardButtonComponent,
  GreenCardBackButtonComponent,
  GreenCardDatepickerComponent,
  GreenCardFullnameComponent,
  GreencardNotificationBarComponent,
  GreenCardDropdownPlatesComponent,
  GreenCardOtherDriverToggleComponent,
  GreenCardDynamicComponent,
  GreenCardAddDriverComponent,
  ConsentInitialStepsComponent,
  ConsentsTextMsgComponent,
  IconOutputConsentComponent,
  NotificationBarComponent,
  EurolifeConsentButtonComponent,
  MotorDeleteAccount,
  MotorPopUpDeleteAccount,
  MotorPopUpchangeMobilePhone,
  MotorPopUpchangePhone,
  MotorPopUpchangeEmail,
  MotorPopUpChangeProfilePicture,
  MotorPopUpchangePassword,
  MotorCustomTableComponent,
  MotorChangeMobilePhone,
  MotorChangePhone,
  MotorChangeEmail,
  MotorProfilePicture,
  MotorChangePassword,
  TimePickerComponent,
  CalendarComponent,
  OutputWithActionComponent,
  MaskComponent,
  PaymentdetailsComponent,
  MotorCustomDetailTableComponent,
  SocialNetworkSignUpComponent,
  RegistrationPageComponent,
  ParticipantsViewComponent,
  ExagoraComponent,
  ClaimsCardComponent,
  SubheaderStepperComponent,
  SalesChannelDetailsComponent,
  FileUploadSection,
  SignUpCardComponent,
  SignUpValidatedComponent,
  SimplePageComponent,
  FaqComponent,
  SimplePageWithNavigationComponent,
  EurolifeOutputComponent,
  EurolifeH3Component,
  SimpleGridViewComponent,
  EurolifeDropdownMenuComponent,
  EurolifeNotificationBarComponent,
  EurolifeEmailButtonComponentComponent,
  InputonchangeactionComponent,
  PopupConsentComponent,
  ConsentsCardsComponent,
  GdprNotificationComponent,
  ButtonToDialogComponent,
  EurolifeMobileButtonComponent,
  OtpInputComponent,
  // OnlyDigitsDirective,
  EurolifeOutputColorComponent,
  EurolifeHeaderTileComponent,
  HeaderComponent,
  PaymentComponent,
  SplitPageWithIconComponent,
  IceImageComponent,
  FlatSectionComponent,
  InputComponent,
  MatCardHomeComponent,
  SimpleTableNoPaginationComponent,
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
  GlossaryComponent,
  InsertCodeEmailTimerComponent,
  // FormatTimePipeForEmail,
  EmailConfirmationComponent,
  MyDocumentsComponent,
  PopUpPageComponent,
  MyDafsComponent,
  HomeCardContainerComponent,
  DetailsCustomTableComponent,
  LegalPopupComponent,
  ParticipantViewClaimsComponent,
  PageNotFoundComponent,
  ConsentGridViewComponent,
  ConsentFooterComponent,
  ConsentComplianceComponent,
  ReviewConfirmComponent,
  TextWithLinkComponent,
  GreenCardStepperComponent,
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
  AmendmentGridViewComponent,
  NoAmendmentGridViewComponent,
  ContentWalkthroughComponent,
  HomeCardContainerAmendmentComponent,
  CustomerProfileComponent,
  PendingPaymentComponent,
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
  PropertyNotificationStepperComponent,
  PropertyAvailableContractsComponent,
  PropertyClaimNotificationCreateCaseComponent,
  SignUpGroupCustomerProfilePopUpComponent,
  AmendmentsGetBeneficiariesComponent,
  EclaimsSubmitButtonComponent,
  CloseCancelPopUpComponent,
  AvatarElementComponent,
  CalculatePropertyDurationDateComponent,
  CalculatePropertyPaymentFrequencyComponent,
  DragDropFileComponent,
  DigitalCardComponent,
  PropertyClaimSubmitButtonComponent,
  PropertyNotificationDatepickerComponent,
  PropertyClaimTypeComponent,
  AmendmentsRelationshipComponent,
  SignUpGroupAreaComponent,
  EclaimsDocumentsComponent,
  SuccessfullmessageComponent,
  SubHeaderComponent,
  InfoButtonComponent,
  CalculateLifeExpirationDateComponent,
  PopUpComponent,
  SvgImageComponent
];

/**
 * TIP: Include this module in your main Angular app.module to automatically register all custom ICE components
 * @param componentService
 */
export function registerComponents(componentService: IceComponentsService) {
  const result = function (): Promise<any> {
    return new Promise((resolve, reject) => {
      componentService.registerComponentTypes(iceCustomComponents);
      resolve();
    });
  };
  return result;
}

@NgModule({
  imports: [
    CommonModule,
   // BrowserModule,
    OverlayModule,
    MarkdownToHtmlModule,
    NgIceModule.forRoot(),
    FormsModule,
    MatPaginatorModule,
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MarkdownToHtmlModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatChipsModule,
    FlexLayoutModule,
    MatIconModule,
    MatBadgeModule,
    MatAutocompleteModule,
    NgxEchartsModule
  ],

  declarations: [
    ...iceCustomComponents,
    InsisHorizontalStepperNavigationComponent,
    InsisVerticalStepperNavigationComponent,
    InsisDialogSectionContainer,
    InsisHorizontalTabsNavigationComponent
  ],
  exports: [...iceCustomComponents],
  entryComponents: [
    ...iceCustomComponents,
    InsisHorizontalStepperNavigationComponent,
    InsisVerticalStepperNavigationComponent,
    InsisDialogSectionContainer,
    InsisHorizontalTabsNavigationComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [IceComponentsService],
      multi: true,
      useFactory: registerComponents,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IceCustomComponentsModule {}

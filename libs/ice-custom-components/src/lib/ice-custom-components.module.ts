import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InsisDummyButtonComponent } from './components/element-components/insis-dummy-button-component/insis-dummy-button.component';
import { IceComponentsService, NgIceModule } from '@impeo/ng-ice';
import { BrowserModule } from '@angular/platform-browser';
import { InsisSliderComponent } from './components/element-components/insis-slider-component/insis-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatCheckboxModule,
  MatMenuModule,
  MatTableModule,
  MatTooltipModule,
  MatBadgeModule
} from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { NgxEchartsModule } from 'ngx-echarts';

import { InsisTwoLevelStepperNavigationPageComponent } from './components/page-components/insis-two-level-stepper-navigation-page/insis-two-level-stepper-navigation-page.component';
import { InsisConfirmationPageComponent } from './components/page-components/insis-confirmation-page/insis-confirmation-page.component';
import { InsisHorizontalStepperNavigationComponent } from './components/navigation-components/insis-horizontal-stepper-navigation/insis-horizontal-stepper-navigation.component';
import { InsisVerticalStepperNavigationComponent } from './components/navigation-components/insis-vertical-stepper-navigation/insis-vertical-stepper-navigation.component';
import { InsisArrayComponent } from './components/element-components/insis-array-component/insis-array.component';
import { InsisArrayCardsLayoutComponent } from './components/element-components/insis-array-cards-layout-component/insis-array-cards-layout.component';
import { InsisMotorPolicySummarySectionComponent } from './components/section-components/insis-motor-policy-summary-section/insis-motor-policy-summary-section.component';
import { InsisArrayListLayoutComponent } from './components/element-components/insis-array-list-layout-component/insis-array-list-layout.component';
import { InsisCheckboxCardComponent } from './components/element-components/insis-checkbox-card-component/insis-checkbox-card.component';
import { InsisCardComponent } from './components/element-components/insis-card-component/insis-card.component';
import { InsisFileUploadComponent } from './components/element-components/insis-file-upload-component/insis-file-upload.component';
import {
  InsisInfoButtonComponent,
  TooltipComponent
} from './components/element-components/insis-info-button/insis-info-button.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { InsisSummarySectionDetailContainer } from './components/shared-components/insis-summary-section-detail-container/insis-summary-section-detail-container.component';
import { InsisPictureComponent } from './components/element-components/insis-picture-component/insis-picture.component';
import { InsisCurrencyComponent } from './components/element-components/insis-currency-component/insis-currency.component';
import { InsisButtonDropdownComponent } from './components/element-components/insis-button-dropdown-component/insis-button-dropdown.component';
import { InsisSimplePageComponent } from './components/page-components/insis-simple-page/insis-simple-page.component';
import { InsisButtonToggleComponent } from './components/element-components/insis-button-toggle-component/insis-button-toggle.component';
import { InsisDatagridSectionComponent } from './components/section-components/insis-datagrid-section/insis-datagrid-section.component';
import { InsisChartComponent } from './components/section-components/insis-chart/insis-chart.component';
import { InsisOneLevelTabsNavigationPageComponent } from './components/page-components/insis-one-level-tabs-navigation-page/insis-one-level-tabs-navigation-page.component';
import { InsisCheckboxWithMarkdownComponent } from './components/element-components/insis-checkbox-with-markdown-component/insis-checkbox-with-markdown.component';
import { InsisIconComponent } from './components/element-components/insis-icon-component/insis-icon.component';
import { InsisImageButtonComponent } from './components/element-components/insis-image-button-component/insis-image-button.component';
import { InsisMarkdownOutputElementComponent } from './components/element-components/insis-markdown-output-component/insis-markdown-output-element.component';
import { InsisDialogSectionContainer } from './components/shared-components/insis-dialog-section-container/insis-dialog-section-container';
import { InsisButtonWithDialogComponent } from './components/element-components/insis-button-with-dialog/insis-button-with-dialog.component';
import { InsisGoogleMapComponent } from './components/element-components/insis-google-map-component/insis-google-map.component';
import { InsisPremiumSummarySection } from './components/section-components/insis-premium-summary-section/insis-premium-summary-section.component';
import { InsisArrayTooltipComponent } from './components/element-components/insis-array-tooltip/insis-array-tooltip.component';

/**
 * TIP: You will need to include in this array any new component you create.
 */

export const iceCustomComponents = [
  InsisButtonDropdownComponent,
  InsisDummyButtonComponent,
  InsisInfoButtonComponent,
  InsisSliderComponent,
  InsisArrayComponent,
  InsisArrayCardsLayoutComponent,
  InsisArrayListLayoutComponent,
  InsisArrayTooltipComponent,
  InsisCheckboxCardComponent,
  InsisCardComponent,
  InsisTwoLevelStepperNavigationPageComponent,
  InsisSimplePageComponent,
  InsisChartComponent,
  InsisDatagridSectionComponent,
  InsisMotorPolicySummarySectionComponent,
  InsisSummarySectionDetailContainer,
  InsisOneLevelTabsNavigationPageComponent,
  InsisConfirmationPageComponent,
  InsisFileUploadComponent,
  InsisButtonToggleComponent,
  InsisPictureComponent,
  InsisCurrencyComponent,
  InsisButtonDropdownComponent,
  InsisButtonWithDialogComponent,
  InsisCheckboxCardComponent,
  InsisCheckboxWithMarkdownComponent,
  InsisIconComponent,
  InsisImageButtonComponent,
  InsisMarkdownOutputElementComponent,
  InsisGoogleMapComponent,
  InsisPremiumSummarySection
];

/**
 * TIP: Include this module in your main Angular app.module to automatically register all custom ICE components
 * @param componentService
 */
export function registerComponents(componentService: IceComponentsService) {
  const result = function(): Promise<any> {
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
    BrowserModule,
    OverlayModule,
    MarkdownToHtmlModule,
    NgIceModule.forRoot(),
    FormsModule,
    MatSliderModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MarkdownToHtmlModule,
    NgxEchartsModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatChipsModule,
    FlexLayoutModule,
    MatIconModule,
    MatBadgeModule
  ],

  declarations: [
    ...iceCustomComponents,
    TooltipComponent,
    InsisHorizontalStepperNavigationComponent,
    InsisVerticalStepperNavigationComponent,
    InsisDialogSectionContainer
  ],
  exports: [...iceCustomComponents],
  entryComponents: [
    ...iceCustomComponents,
    TooltipComponent,
    InsisHorizontalStepperNavigationComponent,
    InsisVerticalStepperNavigationComponent,
    InsisDialogSectionContainer
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [IceComponentsService],
      multi: true,
      useFactory: registerComponents
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IceCustomComponentsModule {}

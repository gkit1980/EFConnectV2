import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DummyButtonComponent } from './components/element-components/dummy-button-component/dummy-button.component';
import { IceComponentsService, NgIceModule } from '@impeo/ng-ice';
import { BrowserModule } from '@angular/platform-browser';
import { IceSliderComponent } from './components/element-components/ice-slider-component/ice-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { TwoLevelStepperNavigationPageComponent } from './components/page-components/two-level-stepper-navigation-page/two-level-stepper-navigation-page.component';
import { ConfirmationPageComponent } from './components/page-components/confirmation-page/confirmation-page.component';
import { HorizontalStepperNavigationComponent } from './components/navigation-components/horizontal-stepper-navigation/horizontal-stepper-navigation.component';
import { VerticalStepperNavigationComponent } from './components/navigation-components/vertical-stepper-navigation/vertical-stepper-navigation.component';
import { InsisArrayComponent } from './components/element-components/insis-array-component/insis-array.component';
import { InsisArrayCardsLayoutComponent } from './components/element-components/insis-array-cards-layout-component/insis-array-cards-layout.component';
import { InsisMotorPolicySummarySectionComponent } from './components/section-components/insis-motor-policy-summary-section/insis-motor-policy-summary-section.component';
import { InsisArrayListLayoutComponent } from './components/element-components/insis-array-list-layout-component/insis-array-list-layout.component';
import { InsisFileUploadComponent } from './components/element-components/insis-file-upload-component/insis-file-upload.component';

/**
 * TIP: You will need to include in this array any new component you create.
 */

export const iceCustomComponents = [
  DummyButtonComponent,
  IceSliderComponent,
  InsisArrayComponent,
  InsisArrayCardsLayoutComponent,
  InsisArrayListLayoutComponent,
  TwoLevelStepperNavigationPageComponent,
  InsisMotorPolicySummarySectionComponent,
  ConfirmationPageComponent,
  InsisFileUploadComponent
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
    NgIceModule.forRoot(),
    FormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    FlexLayoutModule
  ],

  declarations: [
    ...iceCustomComponents,
    HorizontalStepperNavigationComponent,
    VerticalStepperNavigationComponent
  ],
  exports: [...iceCustomComponents],
  entryComponents: [
    ...iceCustomComponents,
    HorizontalStepperNavigationComponent,
    VerticalStepperNavigationComponent
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

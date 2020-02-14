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

import { TwoLevelStepperNavigationPageComponent } from './components/page-components/two-level-stepper-navigation-page/two-level-stepper-navigation-page.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { HorizontalStepperNavigationComponent } from './components/navigation-components/horizontal-stepper-navigation/horizontal-stepper-navigation.component';
import { VerticalStepperNavigationComponent } from './components/navigation-components/vertical-stepper-navigation/vertical-stepper-navigation.component';
import { InsisArrayComponent } from './components/element-components/insis-array-component/insis-array.component';

/**
 * TIP: You will need to include in this array any new component you create.
 */

export const iceCustomComponents = [
  DummyButtonComponent,
  IceSliderComponent,
  InsisArrayComponent,
  TwoLevelStepperNavigationPageComponent
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

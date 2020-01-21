import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { StyleGuideComponent } from './components/styleguide/styleguide.component';
import { AppRouting } from './app.routing';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatSelectModule,
  MatTooltipModule,
  MatInputModule,
  MatSliderModule,
  MatMenuModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatRadioModule,
  MatCheckboxModule,
  MatSlideToggleModule
} from '@angular/material';
import { NgIceModule, IcePrincipalService } from '@impeo/ng-ice';
import { ClientPrincipal } from '@impeo/ice-core';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [AppComponent, HomeComponent, StyleGuideComponent],
  imports: [
    AppRouting,
    FormsModule,
    BrowserModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatSliderModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    NgIceModule.forRoot()
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'standard' }
    },
    IcePrincipalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(icePrincipalService: IcePrincipalService) {
    /**
     * TIP: Configure proper ICE principal
     */
    icePrincipalService.principal = new ClientPrincipal('n/a', 'en', [], {});
  }
}

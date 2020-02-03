import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { StyleGuideComponent } from './components/styleguide/styleguide.component';
import { LanguagePickerComponent } from './components/language-picker/language-picker.component';
import { AppDialog } from './components/dialog/dialog.component';
import { LanguageService, getDefaultLanguage } from './services/language.service';
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
  MatSlideToggleModule,
  MatDialogModule
} from '@angular/material';
import { NgIceModule, IcePrincipalService } from '@impeo/ng-ice';
import { ClientPrincipal } from '@impeo/ice-core';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { LoginAuthenticationGuard } from './guards/login-authentication.guard';
import { AlertService } from './services/alert.service';
import { AlertComponent } from './components/alert/alert.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginPageGuard } from './guards/login-page.guard';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { registerCustomRules } from '@insis-portal/ice-custom-rules';
import { IceCustomComponentsModule } from '@insis-portal/ice-custom-components';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    StyleGuideComponent,
    HeaderComponent,
    FooterComponent,
    StyleGuideComponent,
    LanguagePickerComponent,
    AppDialog
  ],
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
    NgIceModule.forRoot(),
    IceCustomComponentsModule,
    MatDialogModule
  ],
  providers: [
    AlertService,
    AuthenticationService,
    LoginAuthenticationGuard,
    LoginPageGuard,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    IcePrincipalService,
    LanguageService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(icePrincipalService: IcePrincipalService) {
    const langCode = getDefaultLanguage();
    /**
     * TIP: Configure proper ICE principal
     */
    icePrincipalService.principal = new ClientPrincipal('n/a', langCode, [], {});

    /**
     * TIP: We need to register our custom rules to the client application
     */
    registerCustomRules();
  }
}

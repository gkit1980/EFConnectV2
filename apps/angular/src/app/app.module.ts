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
import { CustomBreakpointsProvider } from './custom-breakpoints';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';

import moment from 'moment';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { RoleGuard } from './guards/role.guard';
import { ThemeService } from './services/theme.service';

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
    SpinnerComponent,
    AppDialog,
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
    MatProgressSpinnerModule,
    MatDialogModule,
    FlexLayoutModule,
    NgIceModule.forRoot(),
    IceCustomComponentsModule,
  ],
  providers: [
    AlertService,
    AuthenticationService,
    LoginAuthenticationGuard,
    LoginPageGuard,
    RoleGuard,
    SpinnerService,
    ThemeService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    IcePrincipalService,
    LanguageService,
    CustomBreakpointsProvider,
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    /**
     * TIP: We need to register our custom rules to the client application
     */
    registerCustomRules();

    const langCode = getDefaultLanguage();
    moment.locale(langCode, {
      week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4, // Used to determine first week of the year.
      },
    }); //reference https://momentjscom.readthedocs.io/en/latest/moment/07-customization/16-dow-doy/
  }
}

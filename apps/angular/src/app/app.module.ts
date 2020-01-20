import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { AppRouting } from './app.routing';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatSelectModule,
  MatTooltipModule,
  MatInputModule,
  MatSliderModule,
  MatMenuModule,
  MatCardModule,
  MatIconModule
} from '@angular/material';
import { NgIceModule, IcePrincipalService } from '@impeo/ng-ice';
import { ClientPrincipal } from '@impeo/ice-core';

@NgModule({
  declarations: [AppComponent, HomeComponent],
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

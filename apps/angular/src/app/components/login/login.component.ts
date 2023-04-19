import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  pid = 'DCT01';
  role = 'customer';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {}

  async login() {
    await this.authenticationService.login(this.pid, this.role);

    if (this.authenticationService.loggedIn) {
      if (this.role === 'agent') {
        this.router.navigate(['/ice/insis.dashboard.home.agent/home']);
      } else if (this.role === 'customer') {
        this.router.navigate(['/ice/insis.dashboard.home.customer/home']);
      }
      this.router.navigate(['/home']);
    } else this.alertService.error('Login failed');
  }
}

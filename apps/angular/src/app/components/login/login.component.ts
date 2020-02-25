import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  pid = 'DCT01';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  async login() {
    await this.authenticationService.login(this.pid);

    if (this.authenticationService.loggedIn) this.router.navigate(['/home']);
    else this.alertService.error('Login failed');
  }
}

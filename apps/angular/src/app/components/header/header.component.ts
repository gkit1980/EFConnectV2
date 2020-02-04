import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IceRuntimeService } from '@impeo/ng-ice';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  activeURL = '';
  navigation: any[] = [];
  menuItems: { key: string; method: () => any }[] = [];

  get name(): string {
    return this.authenticationService.name;
  }

  constructor(
    private router: Router,
    private runtimeService: IceRuntimeService,
    private authenticationService: AuthenticationService
  ) {
    this.runtimeService.getRuntime().then(runtime => {
      this.navigation.push(
        {
          key: runtime.iceResource.resolve('pages.header.dashboard.label'),
          link: runtime.iceResource.resolve('pages.header.dashboard.link'),
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.policies.label'),
          link: runtime.iceResource.resolve('pages.header.policies.link'),
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.payments.label'),
          link: runtime.iceResource.resolve('pages.header.payments.link'),
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.claims.label'),
          link: runtime.iceResource.resolve('pages.header.claims.link'),
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.products.label'),
          link: runtime.iceResource.resolve('pages.header.products.link'),
          includes: []
        }
      );

      this.menuItems.push({
        key: runtime.iceResource.resolve('pages.header.menu.logout'),
        method: this.logout.bind(this)
      });
    });
    this.router.events.subscribe(event => {
      this.activeURL = window.location.hash.split('#')[1];
    });
  }

  isSelectedTab(tab): boolean {
    if (!tab) return false;
    return (
      this.activeURL === tab.link || tab.includes.some(urlPart => this.activeURL.includes(urlPart))
    );
  }

  private async logout(): Promise<void> {
    await this.authenticationService.logout();

    this.router.navigate(['/login']);
  }
}

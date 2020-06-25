import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IceRuntimeService } from '@impeo/ng-ice';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  activeURL = '';
  agentNavigation: any[] = [];
  customerNavigation: any[] = [];
  menuItems: { key: string; method: () => any }[] = [];
  showMobileNav = false;
  get navigation() {
    return this.authenticationService.role === 'agent'
      ? this.agentNavigation
      : this.customerNavigation;
  }

  get name(): string {
    return this.authenticationService.name;
  }

  constructor(
    private router: Router,
    private runtimeService: IceRuntimeService,
    private authenticationService: AuthenticationService
  ) {
    this.runtimeService.getRuntime().then((runtime) => {
      this.customerNavigation.push(
        {
          key: runtime.iceResource.resolve('pages.header.customer.dashboard.label'),
          link: runtime.iceResource.resolve('pages.header.customer.dashboard.link'),
          includes: ['/ice/insis.dashboard.home.customer/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.customer.policies.label'),
          link: runtime.iceResource.resolve('pages.header.customer.policies.link'),
          includes: ['/ice/insis.dashboard.policies.customer/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.customer.claims.label'),
          link: runtime.iceResource.resolve('pages.header.customer.claims.link'),
          includes: ['/ice/insis.dashboard.claims.customer/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.customer.products.label'),
          link: runtime.iceResource.resolve('pages.header.customer.products.link'),
          includes: ['/ice/insis.dashboard.products.customer/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.customer.payments.label'),
          link: runtime.iceResource.resolve('pages.header.customer.payments.link'),
          includes: ['/ice/insis.dashboard.payments.customer/home'],
        }
      );

      this.agentNavigation.push(
        {
          key: runtime.iceResource.resolve('pages.header.agent.dashboard.label'),
          link: runtime.iceResource.resolve('pages.header.agent.dashboard.link'),
          includes: ['/ice/insis.dashboard.home.agent/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.agent.clients.label'),
          link: runtime.iceResource.resolve('pages.header.agent.clients.link'),
          includes: ['/ice/insis.dashboard.clients.agent/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.agent.policies.label'),
          link: runtime.iceResource.resolve('pages.header.agent.policies.link'),
          includes: ['/ice/insis.dashboard.policies.agent/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.agent.claims.label'),
          link: runtime.iceResource.resolve('pages.header.agent.claims.link'),
          includes: ['/ice/insis.dashboard.claims.agent/home'],
        },
        {
          key: runtime.iceResource.resolve('pages.header.agent.products.label'),
          link: runtime.iceResource.resolve('pages.header.agent.products.link'),
          includes: ['/ice/insis.dashboard.products.agent/home'],
        }
      );

      this.menuItems.push({
        key: runtime.iceResource.resolve('pages.header.menu.logout'),
        method: this.logout.bind(this),
      });
    });
    this.router.events.subscribe((event) => {
      this.activeURL = window.location.hash.split('#')[1];
      this.showMobileNav = false;
    });
  }

  isSelectedTab(tab): boolean {
    if (!tab) return false;
    return (
      this.activeURL === tab.link ||
      tab.includes.some((urlPart) => this.activeURL.includes(urlPart))
    );
  }

  private async logout(): Promise<void> {
    await this.authenticationService.logout();

    this.router.navigate(['/login']);
  }

  toggleMobileNav() {
    this.showMobileNav = !this.showMobileNav;
  }
}

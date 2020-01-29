import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IceRuntimeService } from '@impeo/ng-ice';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  activeURL = '';
  navigation: any[] = [];

  constructor(private http: HttpClient, private runtimeService: IceRuntimeService, router: Router) {
    this.runtimeService.getRuntime().then(runtime => {
      this.navigation.push(
        {
          key: runtime.iceResource.resolve('pages.header.dashboard'),
          link: '/',
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.policies'),
          link: '/',
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.payments'),
          link: '/',
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.claims'),
          link: '/',
          includes: []
        },
        {
          key: runtime.iceResource.resolve('pages.header.products'),
          link: '/',
          includes: []
        }
      );
    });
    router.events.subscribe(event => {
      this.activeURL = window.location.hash.split('#')[1];
    });
  }

  isSelectedTab(tab): boolean {
    if (!tab) return false;
    return (
      this.activeURL === tab.link || tab.includes.some(urlPart => this.activeURL.includes(urlPart))
    );
  }
}

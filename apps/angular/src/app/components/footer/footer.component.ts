import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IceContext } from '@impeo/ice-core';
import { IceRuntimeService } from '@impeo/ng-ice';
import buildJSON from '../../../../../../build-info.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version: any = {
    BuildNumber: '',
  };
  navigation: any[] = [];

  get buildNumber(): string {
    return buildJSON.buildNumber;
  }

  constructor(private http: HttpClient, private runtimeService: IceRuntimeService) {
    this.runtimeService.getRuntime().then((runtime) => {
      this.navigation.push({
        key: runtime.iceResource.resolve('pages.footer.terms-and-conditions'),
        link: '/terms-and-conditions',
      });
    });
  }
}

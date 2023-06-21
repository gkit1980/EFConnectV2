import { Component, OnInit } from '@angular/core';
import {
  IceSectionComponent, SectionComponentImplementation
} from '@impeo/ng-ice';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';

@Component({
  selector: 'app-redirection-eclaims',
  templateUrl: './redirection-eclaims.component.html',
  styleUrls: ['./redirection-eclaims.component.scss'],
})
export class RedirectionEclaimsComponent
  extends SectionComponentImplementation
  implements OnInit
{
  currentBranch: number;

  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService
  ) {
    super(parent);
  }

  ngOnInit() {
    this.currentBranch =
      this.localStorage.getDataFromLocalStorage('selectedBranch');
  }
}

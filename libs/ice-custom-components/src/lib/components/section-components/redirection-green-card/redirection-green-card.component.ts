import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { LocalStorageService } from '@insis-portal/services/local-storage.service';

@Component({
  selector: 'app-redirection-green-card',
  templateUrl: './redirection-green-card.component.html',
  styleUrls: ['./redirection-green-card.component.scss']
})
export class RedirectionGreenCardComponent extends SectionComponentImplementation {

  currentBranch: number;


  constructor(parent: IceSectionComponent, private router: Router, private localStorage: LocalStorageService) {
    super(parent);
  }

  ngOnInit() {
    this.currentBranch = this.localStorage.getDataFromLocalStorage("selectedBranch");
  }

  async redirectToGc() {
    var plate = this.iceModel.elements["policies.details.VehicleLicensePlate"].getValue().forIndex(null);
    this.router.navigate(['/ice/default/customerArea.motor/greenCard']
      , {
        queryParams: {
          plate: plate,
        }
      });

      let action = this.context.iceModel.actions['action-greencard-get-token'];
      for (let i = 0; i < action.executionRules.length; i++) {
        let executionRule = action.executionRules[i];
        await this.context.executeExecutionRule(executionRule);
      }
  }

}

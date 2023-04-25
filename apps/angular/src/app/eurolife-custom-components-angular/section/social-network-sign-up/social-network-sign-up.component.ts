import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';


@Component({
  selector: 'app-social-network-sign-up',
  templateUrl: './social-network-sign-up.component.html',
  styleUrls: ['./social-network-sign-up.component.scss']
})
export class SocialNetworkSignUpComponent extends SectionComponentImplementation {

  socialNetwork = 'sections.socialNetwork.label';

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
  };

}

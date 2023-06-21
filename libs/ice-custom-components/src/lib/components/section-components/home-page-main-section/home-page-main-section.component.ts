import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-home-page-main-section',
  templateUrl: './home-page-main-section.component.html',
  styleUrls: ['./home-page-main-section.component.scss']
})
export class HomePageMainSectionComponent extends SectionComponentImplementation implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }

}

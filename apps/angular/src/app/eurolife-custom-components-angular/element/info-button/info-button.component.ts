import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.scss']
})
export class InfoButtonComponent implements OnInit {

  smsCode: boolean;
  pageName: string;
  section: any;
  constructor() { }

  ngOnInit() {
    this.pageName = this.section.page.name;
    if(this.pageName === 'sign-up') {
      this.smsCode = false;
    }
    else {
      this.smsCode = true;
    }
    
  }

}

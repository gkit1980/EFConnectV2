import { IceTextInputComponent } from '@impeo/ng-ice';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-successfullmessage',
  templateUrl: './successfullmessage.component.html',
  styleUrls: ['./successfullmessage.component.scss']
})
export class SuccessfullmessageComponent extends IceTextInputComponent implements OnInit {

  success: boolean;
  pageName: string;
  section: any;
  // constructor() { }

  ngOnInit() {
    this.pageName = this.section.page.name;
    if(this.pageName === 'successfullPayment') {
      this.success = true;
    }
    else {
      this.success = false;
    }
    
  }

}

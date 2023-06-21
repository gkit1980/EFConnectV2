import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';


@Component({
  selector: 'app-amendmentmask',
  templateUrl: './amendmentmask.component.html',
  styleUrls: ['./amendmentmask.component.scss']
})


export class AmendmentMaskComponent extends ElementComponentImplementation implements OnInit {

  myinput = "";
  firstDigits: any;
  lastDigits: any;
  myMobile: any;


  ngOnInit(): void {


    this.myMobile = this.context.iceModel.elements["customer.details.MobilePhone"].getValue().forIndex(null);
    this.firstDigits = this.myMobile.slice(0,3);
    this.lastDigits = this.myMobile.slice(-2);
    this.myinput += this.firstDigits;
    this.myinput += "*****";
    this.myinput += this.lastDigits;

  }
}

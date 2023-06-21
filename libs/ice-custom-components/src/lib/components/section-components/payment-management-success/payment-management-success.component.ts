import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';

@Component({
  selector: 'app-payment-management-success',
  templateUrl: './payment-management-success.component.html',
  styleUrls: ['./payment-management-success.component.css']
})
export class PaymentManagementSuccessComponent extends SectionComponentImplementation implements OnInit {

  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  ngOnInit() {
    
  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
  };

}

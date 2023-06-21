import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-management-status-bar',
  templateUrl: './payment-management-status-bar.component.html',
  styleUrls: ['./payment-management-status-bar.component.scss']
})
export class PaymentManagementStatusBarComponent implements OnInit {

  trueText = 'elements.payment.paymentManagementStatus.trueText.label';
  falseText = 'elements.payment.paymentManagementStatus.falseText.label';

  constructor() { }

  ngOnInit() {
  }

}

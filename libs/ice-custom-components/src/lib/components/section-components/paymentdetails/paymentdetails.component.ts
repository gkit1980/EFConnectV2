import { SectionComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paymentdetails',
  templateUrl: './paymentdetails.component.html',
  styleUrls: ['./paymentdetails.component.scss']
})
export class PaymentdetailsComponent extends SectionComponentImplementation {

  paymentDate = 'elements.payment.paymentDetails.paymentDate.label';

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
  };


  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate() - 1;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    let minutes: any;
    minutes = today.getMinutes();
    var length = Math.log(minutes) * Math.LOG10E + 1 | 0;
    if (length == 1) minutes = ('0' + minutes).slice(-2);
    return dd + '/' + mm + '/' + yyyy + ', ' + hours + ':' + minutes;
  }

  print() {
    const printContent = document.getElementById("divToPrint");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}

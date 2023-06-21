import { ModalService } from '@insis-portal/services/modal.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { IceSectionComponent, SectionComponentImplementation } from '@impeo/ng-ice';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-send-email-button',
  templateUrl: './send-email-button.component.html',
  styleUrls: ['./send-email-button.component.css']
})
export class SendEmailButtonComponent extends SectionComponentImplementation implements OnInit {

  contactForm: boolean;
  myRightsForm: boolean;
  insuredFirstName: any;
  insuredLastName: any;
  taxCode: any;
  phoneNumber: any;
  email: any;
  text1 = 'elements.sendEmail.text1.label';
  text2 = 'elements.sendEmail.text2.label';

  constructor(private http: HttpClient,
    private router: Router, parent: IceSectionComponent, private ngbActiveModal: NgbActiveModal, private modalService: ModalService) {
    super(parent);
  }

  ngOnInit() {
    this.insuredFirstName = this.context.iceModel.elements['customer.details.FirstName'].getValue().values[0].value;
    this.insuredLastName = this.context.iceModel.elements['customer.details.LastName'].getValue().values[0].value;
    this.taxCode = this.context.iceModel.elements['customer.details.TaxCode'].getValue().values[0].value;
    this.phoneNumber = this.context.iceModel.elements['customer.details.MobilePhone'].getValue().values[0].value;
    this.email = this.context.iceModel.elements['customer.details.Email'].getValue().values[0].value;
    const pageName = this.context.iceModel.elements['pagebutton'].getValue().values[0].value;
    if (pageName === 'contactForm') {
      this.contactForm = true;
    } else {
      this.myRightsForm = true;
    }
  }

  SendContactFormEmails(): void {
    const theme = this.context.iceModel.elements['communication.contact.form.theme'].getValue().values[0].value;
    let data: any;
    let name: any;
    let comment: any;

    let contactTheme;
    if (theme === "1") {
      contactTheme = ContactTheme.theme1;
    } else if (theme === "2") {
      contactTheme = ContactTheme.theme2;
    } else if (theme === "3") {
      contactTheme = ContactTheme.theme3;
    } else if (theme === "4") {
      contactTheme = ContactTheme.theme4;
    } else if (theme === "5") {
      contactTheme = ContactTheme.theme5;
    } else {
      contactTheme = ContactTheme.theme6;
    }

    if (this.context.iceModel.elements['communication.input'].getValue().values[0].value != null) {
      comment = this.context.iceModel.elements['communication.input'].getValue().values[0].value;
    } else {
      comment = '';
    }

    // const data
    // const documentsContent = this.context.iceModel.elements['documents'].getValue().values[0].value;
    // for (let i = 0; i < documentsContent.length; i++) {
    //   data[i] = this.context.iceModel.elements['documents'].getValue().values[0].value[0].content;
    // }
    if (this.context.iceModel.elements['documents~content'].getValue().values[0]) {
      data = this.context.iceModel.elements['documents~content'].getValue().values[0].value;
      name = this.context.iceModel.elements['documents~name'].getValue().values[0].value;
    } else {
      data = '';
      name = '';
    }

    // tslint:disable-next-line:max-line-length
    this.http.post('/api/v1/contactForm/send-emails', { 'theme': contactTheme, 'comment': comment, 'data': data, 'docName': name, 'insuredFirstName': this.insuredFirstName, 'insuredLastName': this.insuredLastName, 'taxCode': this.taxCode, 'phone': this.phoneNumber, 'email': this.email }).subscribe(response => {
      this.context.iceModel.elements['communication.point.contact.form.description'].setSimpleValue(null);
      this.context.iceModel.elements['communication.contact.form.theme'].setSimpleValue(null);
      this.modalService.isModalClosed();
      this.ngbActiveModal.close();
    });
  }

  SendMyRightsFormEmails(): void {
    const theme = this.context.iceModel.elements['communication.myrights.form.theme'].getValue().values[0].value;
    let comment: any;
    let myrightsTheme;

    if (theme === "1") {
      myrightsTheme = MyRightsTheme.theme1;
    } else if (theme === "2") {
      myrightsTheme = MyRightsTheme.theme2;
    } else if (theme === "3") {
      myrightsTheme = MyRightsTheme.theme3;
    } else if (theme === "4") {
      myrightsTheme = MyRightsTheme.theme4;
    } else if (theme === "5") {
      myrightsTheme = MyRightsTheme.theme5;
    } else if (theme === "6") {
      myrightsTheme = MyRightsTheme.theme6;
    } else {
      myrightsTheme = MyRightsTheme.theme7;
    }

    if (this.context.iceModel.elements['communication.myrights.form.input'].getValue().values[0].value != null) {
      comment = this.context.iceModel.elements['communication.myrights.form.input'].getValue().values[0].value;
    } else {
      comment = '';
    }

    // tslint:disable-next-line:max-line-length
    this.http.post('/api/v1/myRightsForm/send-emails', { 'theme': myrightsTheme, 'comment': comment, 'insuredFirstName': this.insuredFirstName, 'insuredLastName': this.insuredLastName, 'taxCode': this.taxCode, 'phone': this.phoneNumber, 'email': this.email }).subscribe(response => {
      this.modalService.isModalClosed();
      this.ngbActiveModal.close();
    });
  }


}

export enum ContactTheme {
  theme1 = 'Τα Ασφαλιστήρια Συμβόλαιά Μου',
  theme2 = 'Οι Αποζημιώσεις Μου',
  theme3 = 'Αλλαγή Στοιχείων ή Επικαιροποίηση Πληροφορίας',
  theme4 = 'Βεβαιώσεις - Πληρωμές',
  theme5 = 'Υπηρεσία ΜΥ EUROLIFE',
  theme6 = 'Άλλο'
}

export enum MyRightsTheme {
  theme1 = 'Δικαίωμα Πρόσβασης',
  theme2 = 'Δικαίωμα Διόρθωσης',
  theme3 = 'Δικαίωμα Διαγραφής ("δικαίωμα στη λήθη")',
  theme4 = 'Δικαίωμα Περιορισμού της επεξεργασίας',
  theme5 = 'Δικαίωμα στη φορητότητα των δεδομένων',
  theme6 = 'Δικαίωμα εναντίωσης',
  theme7 = 'Άλλο'
}

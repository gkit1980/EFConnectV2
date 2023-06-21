import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit, Inject, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignupService } from '@insis-portal/services/signup.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { ModalService } from '@insis-portal/services/modal.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecapchaService } from '@insis-portal/services/recapcha.service';
import { Router } from '@angular/router';

export interface data {
  mail: string
}

@Component({
  selector: 'app-new-reg-code-modal',
  templateUrl: './new-reg-code-modal.component.html',
  styleUrls: ['./new-reg-code-modal.component.scss']
})
export class NewRegCodeModalComponent implements OnInit {

  vatNo: string;
  birthDate: string;
  day: string;
  month: string;
  year: string;
  success: boolean = false;
  errorMsg: string;
  errorMsgHere: string;
  days: Array<any> = [];
  gotBirthDate: boolean = false;
  gotVatNo: boolean = false;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;

  registration = 'pages.signup.regCodeModal.registration.label';
  text1 = 'pages.signup.regCodeModal.text1.label';
  vatR = 'pages.signup.regCodeModal.vatR.label';
  vatText = 'pages.signup.regCodeModal.vatText.label';
  birthDateR = 'pages.signup.regCodeModal.birthDateR.label';
  dayR = 'pages.signup.regCodeModal.dayR.label';
  monthR = 'pages.signup.regCodeModal.monthR.label';
  yearR = 'pages.signup.regCodeModal.yearR.label';
  next = 'pages.signup.regCodeModal.next.label';
  cancel = 'pages.signup.regCodeModal.cancel.label';
  check = 'pages.signup.regCodeModal.check.label';
  check2 = 'pages.signup.regCodeModal.check2.label';
  ok = 'pages.signup.regCodeModal.ok.label';
  vatError = 'pages.signup.regCodeModal.vatError.label';
  vatno = new FormControl("", [Validators.required]);

  months: Array<any> = [
    { value: '01', viewValue: 'Ιανουάριος' },
    { value: '02', viewValue: 'Φεβρουάριος' },
    { value: '03', viewValue: 'Μάρτιος' },
    { value: '04', viewValue: 'Απρίλιος' },
    { value: '05', viewValue: 'Μάιος' },
    { value: '06', viewValue: 'Ιούνιος' },
    { value: '07', viewValue: 'Ιούλιος' },
    { value: '08', viewValue: 'Αύγουστος' },
    { value: '09', viewValue: 'Σεπτέμβριος' },
    { value: '10', viewValue: 'Οκτώβριος' },
    { value: '11', viewValue: 'Νοέμβριος' },
    { value: '12', viewValue: 'Δεκέμβριος' }
  ];
  years: Array<any> = [];

  // constructor(public dialogRef: MatDialogRef<RegCodeModalComponent>,
  //    @Inject(MAT_DIALOG_DATA) public data: data,
  //    private signupService: SignupService
  //   ) { }
  constructor(public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private signupService: SignupService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService,
    private router: Router) {
    var d = new Date();
    let year = d.getFullYear()
    let j = 0;
    for (let i = year; i >= 1940; i--) {
      this.years.push(i);
      j++;
      if (j < 32) {
        this.days.push(j);
      }
    }
  }

  ngOnInit() {

  }

  onOptionChange() {


    if (this.day != null && this.month != null && this.year != null) {

      this.gotBirthDate = true;
    }
  }

  executeRegistrationCodeAction(): void {
    this.onSubmit();
    this.recaptchaV3Service.execute('registrationCodeAction')
      .subscribe((token) =>{
        this.recapchaService.recapchaValidation(token).subscribe((response: any) => {
          if(response.success){
            if (response.score > 0.55){
            }else{
              // this.router.navigate(["/login"])
            }
          }else{
            // this.router.navigate(["/login"])
          }
        })
      });
  }


  onVatChange() {
    this.regexp = this.regexp = new RegExp('^[0-9]{9}$');
    this.validateRegex = this.regexp.test(this.vatNo);
    if (this.validateRegex) {
      this.gotVatNo = true;
    }
    else {
      this.gotVatNo = false;
    }
  }

  onSubmit() {
    this.errorMsg = ''
    this.birthDate = this.year.toString() + "-" + this.month + "-" + this.day.toString()
    this.success = false;
    var date = new Date(this.birthDate)
    this.signupService.getRegCode(this.vatNo, this.birthDate).subscribe((res: any) => {


      if (res.Success) {
        this.success = res.Success;
      } else {
        this.errorMsg = `Δεν υπάρχει δυνατότητα αποστολής Μοναδικού Κωδικού. Παρακαλούμε επικοινωνήστε με το Τμήμα Εξυπηρέτησης Πελατών στο 210-9303800 επιλογή 4, τις εργάσιμες ημέρες από 09:00 έως 17:00. Εναλλακτικά πατήστε `;
        this.errorMsgHere = `εδώ.`;
      }
    })
  }

  onCancelClick() {
    this.modalService.isModalClosed();
    this.activeModal.close();
  }

  get imageSource() {
    return this.getIcon('44B30F2D7E43462F8F82E832A481E10C');
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  get closeImageSource() {
    return this.getIcon('9E57CCB2D5E54B739BF6D3DE8551E683');
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '27');
    svg.setAttribute('height', '27');

    return svg;
  }

  onNoClick() {
    this.onCancelClick();
  }
}

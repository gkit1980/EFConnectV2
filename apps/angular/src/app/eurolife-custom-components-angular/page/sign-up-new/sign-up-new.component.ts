import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../../services/signup.service';
import { TermsConditionsComponent } from "../terms-conditions/terms-conditions.component";
import { LegalPopupComponent } from '../legal-popup/legal-popup.component';
import { ModalService } from '../../../services/modal.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CookieDeclarationComponent } from "../../../eurolife-custom-components-angular/page/cookie-declaration/cookie-declaration.component";


@Component({
  selector: 'app-sign-up-new',
  templateUrl: './sign-up-new.component.html',
  styleUrls: ['./sign-up-new.component.scss']
})
export class SignUpNewComponent implements OnInit {

  SIGNUP_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';

  stepperState: any = { step: 0 };
  eurolife = 'pages.signup.updated.eurolife.label';
  signin = 'pages.signup.updated.signin.label';
  steps = 'pages.signup.updated.steps.label';
  oroiXrishs = 'portal.login.oroiXrishs.label';
  copyright = 'portal.login.copyright.label';
  prostasiadedomenwn = 'app.footer.prostasiadedomenwn.label';
  politikicookies = 'app.footer.politikicookies.label';


  constructor(private signupService: SignupService,
    private ngbModal: NgbModal,
    private modalService: ModalService)
     {
    this.signupService.stepperChange.subscribe(state => {
      this.stepperState = state;
    });

  }

  // constructor(public activeModal: NgbActiveModal,
  //   private modalService: ModalService) { }

  ngOnInit() {
   
  }

  stepState(): number {
    return 2;
  }

  openDialog() {
    let modalRef: NgbModalRef;
    this.modalService.ismodalOpened();
    modalRef = this.ngbModal.open(TermsConditionsComponent, { windowClass: 'xlModal' });
    modalRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
  }

  openDialogLegal() {
    window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
    
    // let modalRef: NgbModalRef;
    // this.modalService.ismodalOpened();
    // modalRef = this.ngbModal.open(LegalPopupComponent, { windowClass: 'xlModal' });
    // modalRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
  }

  cookieClick() {
    let modalRef: NgbModalRef;
    this.modalService.ismodalOpened();
    modalRef = this.ngbModal.open(CookieDeclarationComponent, { windowClass: 'xlModal' });
    modalRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
    // document.getElementById('cookie-btn').click();
  }




}

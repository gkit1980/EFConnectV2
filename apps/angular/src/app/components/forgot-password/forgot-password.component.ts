import { CookieDeclarationComponent } from "../cookie-declaration/cookie-declaration.component";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordService } from '@insis-portal/services/forget-password.service';
import { TermsConditionsComponent } from "../terms-conditions/terms-conditions.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';
  eurolife = 'pages.forgotPassword.eurolife.label';
  terms = 'pages.forgotPassword.terms.label';
  oroiXrishs = 'portal.login.oroiXrishs.label';
  copyright = 'portal.login.copyright.label';
  prostasiadedomenwn = 'app.footer.prostasiadedomenwn.label';
  politikicookies = 'app.footer.politikicookies.label';


  constructor(private forgetPasswordService: ForgetPasswordService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    // var acceptButton = document.getElementsByClassName("optanon-allow-all")[0];
    // var saveSettingButton = document.getElementsByClassName("optanon-white-button-middle")[0];
    // var allowAllButton = document.getElementsByClassName("optanon-white-button-middle")[1];

    // acceptButton.addEventListener('click', function(){
    //   location.reload()
    // });


    // allowAllButton.addEventListener('click', function(){
    //   location.reload()
    // });

    // saveSettingButton.addEventListener('click', function(){
    //   location.reload()
    // });
  }

  cookieClick() {
    this.modalService.open(CookieDeclarationComponent, { windowClass: 'xlModal' });
    // document.getElementById('cookie-btn').click();
  }

  openDialog() {
    this.modalService.open(TermsConditionsComponent, { windowClass: 'xlModal' });
  }

  openDialogLegal() {
    window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
  }


}

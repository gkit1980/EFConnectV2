import { environment } from "./../../../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { SignupService } from "../../../../services/signup.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { errorList } from "../errorList";
import { LocalStorageService } from "../../../../services/local-storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../../services/modal.service";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { RecapchaService } from "../../../../services/recapcha.service";
import { NewRegCodeModalComponent } from "../new-reg-code-modal/new-reg-code-modal.component";
import { SignupGroupService } from "../../../../services/signupgroup.service";
import { HttpClient } from '@angular/common/http';
import { elementAt } from "rxjs-compat/operator/elementAt";

@Component({
  selector: 'app-sign-up-new-email-form',
  templateUrl: './sign-up-new-email-form.component.html',
  styleUrls: ['./sign-up-new-email-form.component.scss']
})
export class SignUpNewEmailFormComponent implements OnInit {

  state: string = "inactive";
  emailValid: boolean = false;
  regCodeValid: boolean = false;
  errorMsgMail: string;
  errorMsgRegCode: string;
  mail: string;
  regCode: string;
  showPassword: boolean;
  showSpinnerBtn : boolean =false;

  membersDeclared : number ;
  membersRegistered : number;
  companyName: string;
  registrationCode: string;
  expDate: Date;
  currentDate = new Date();
  dateFormat:any;
  splittedDate:any;
  splittedExpDate:any;

  basicElements = "pages.signup.basic.basicElements.label";
  // infoResendEmail = "pages.signup.basic.infoResendEmail.label";

  emailText = "pages.signup.basic.emailText.label";
  uniqueEntryPassword = "pages.signup.basic.uniqueEntryPassword.text.label";
  registration = "pages.signup.basic.registration.label";
  next = "pages.signup.basic.next.label";
  cancel = "pages.signup.basic.cancel.label";

  submitEmail = "pages.signup.basic.submitEmail.label";
  signin = 'pages.signup.updated.signin.label';
  posts : any;


  constructor(
    private router: Router,
    private signupService: SignupService,
    private signupGroupService: SignupGroupService,
    public dialog: MatDialog,
    private localStorage: LocalStorageService,
    private ngbModal: NgbModal,
    private modalService: ModalService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {}


  ngOnInit() {
    
    this.route.queryParamMap.subscribe(params => {
      if (params.get("RegistrationCode")) 
      {
        if (Number.isNaN(+params.get("RegistrationCode")) && params.get("RegistrationCode").startsWith('GRP') && params.get("RegistrationCode").toString().length === 20) 
        {
          this.regCode = params.get("RegistrationCode");
          this.checkRegCode();
        } 
         else if(!Number.isNaN(+params.get("RegistrationCode")))
        {
          this.regCode = params.get("RegistrationCode");
          this.checkRegCode();
        }
      }
    });

  }

  executeSignupFormAction(serviceToBeCalled: string): void {
    var mailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (serviceToBeCalled === "checkRegCode" ) 
    {
      this.callCheckRegCode();
      this.recaptchaV3Service.execute("signupFormAction").subscribe(token => {
        this.recapchaService
          .recapchaValidation(token)
          .subscribe((response: any) => {
            if (response.success) {
              if (response.score > 0.55) {
              } else {
                // this.router.navigate(["/login"])
              }
            } else {
              // this.router.navigate(["/login"])
            }
          });
      });
    }
  
    if (serviceToBeCalled === "checkMail") {
      this.emailValid = false;
    }

    if (serviceToBeCalled === "checkMail" && mailValidator.test(this.mail.toLowerCase())) 
    {
      this.checkEmail();
      this.recaptchaV3Service.execute("signupFormAction").subscribe(token => {
        this.recapchaService
          .recapchaValidation(token)
          .subscribe((response: any) => {
            if (response.success) {
              if (response.score > 0.55) {
              } else {
            //    this.router.navigate(["/login"])
              }
            } else {
            //   this.router.navigate(["/login"])
            }
          });
      });
    }
  }

  checkEmail() {
    this.errorMsgMail = "";
    this.emailValid = false;
    this.signupService.setStageProtection(1);
    this.signupService.emailExists(this.mail.trim()).subscribe((res: any) => {
      if (res.Success && res.EmailExists) 
      {
        this.emailValid = !res.EmailExists;
        this.errorMsgMail ="Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτό το email";
      } 
      else if (res.Success && !res.EmailExists) 
      {
        this.emailValid = !res.EmailExists;
        this.errorMsgMail = "";
      //  this.callCheckRegCode();
      } 
      else if (!res.Success) 
      {
        this.errorMsgMail = errorList[res.Errors[0].ErrorCode];
      }
    });
  }

  checkRegCode() {
    this.errorMsgRegCode = "";
    //this.regCodeValid = false;
    if (this.regCode.toString().length === 10){
      this.signupService.IsValidRegCode(this.regCode.toString()).subscribe((res: any) => {
        if (res.Success) 
        {
          this.regCodeValid = res.Success;
          this.errorMsgRegCode = "";
        }
        else 
        {
            this.errorMsgRegCode = errorList[res.Errors[0].ErrorCode];
        }    
    
        
        });
    }
    if (this.regCode.startsWith('GRP') && this.regCode.toString().length === 20){ 
       
      this.signupGroupService.getGroupRegCode(this.regCode).subscribe((res: any) => {
        if (res.Success) 
        { 
          this.dateFormat = this.currentDate.toISOString();
          this.splittedDate = this.dateFormat.split('T')[0];
          this.splittedExpDate = res.expirationDate.split('T')[0];
          // console.log('splittedDate',this.splittedDate)
          // console.log('splittedExpDate',this.splittedExpDate)

          if (this.splittedExpDate >= this.splittedDate) {
            if (res.membersDeclared > res.membersRegistered){
              this.regCodeValid = true;
              this.errorMsgRegCode = "";
              this.companyName = res.policyholderName;
            }
          else
          {
            this.errorMsgRegCode = "Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτόν τον κωδικό!";
            this.regCodeValid = false;
          }
          }
          else
          {
            this.errorMsgRegCode = "Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτόν τον κωδικό!";
            this.regCodeValid = false;
          }
        }
        else 
        {
          this.errorMsgRegCode = "Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτόν τον κωδικό!";
          this.regCodeValid = false;
        }    
      });
    }
  }



  callCheckRegCode() {
    if (this.regCode.toString().length === 10 || (this.regCode.startsWith('GRP') && this.regCode.toString().length === 20) ) {
      this.checkRegCode();
    }
  }

  onSubmit() {
       
        this.showSpinnerBtn=true;
        this.emailValid=false;                //for disable of submit button....cant press twice or more 

      if (this.regCode.toString().length === 10) {
          this.signupService
          .initSignUp(this.regCode.toString(), this.mail.trim())
          .subscribe((res: any) => {
            if (res.Success) {
              this.regCodeValid = res.Success;
              this.errorMsgRegCode = "";
          
              //set time for email link
              var End=new Date(res.EmailValidUntil).getTime();
              var Start =new Date().getTime();
              var diff= (End-Start)/1000;

              this.signupService.setTimeForClock(diff-60);    //EmailValidUntil

              this.signupService.setStoredMail(this.mail.trim());
              this.signupService.setstoredRegCode(this.regCode);
              this.localStorage.setDataToLocalStorage("mail", this.mail.trim());
              this.localStorage.setDataToLocalStorage("regCode", this.regCode);
            
            } else 
            {
              this.errorMsgRegCode = errorList[res.Errors[0].ErrorCode];
            }
          },
          (error) => { this.errorMsgRegCode = "Συνέβη κάποιο λάθος"; },
          () => {
            
            this.showSpinnerBtn=false;
            this.router.navigate(["/signupform/confirmation"], {})

          } 
        );
      } 
      else if (this.regCode.toString().length === 20) {

        this.signupGroupService
      .InitSignUpGroup(this.regCode, this.mail.trim(),this.companyName)
      .subscribe((res: any) => {
        if (res.Success) {
          this.regCodeValid = res.Success;
          this.errorMsgRegCode = "";
      
          //set time for email link
          var End=new Date(res.EmailValidUntil).getTime();
          var Start =new Date().getTime();
          var diff= (End-Start)/1000;

          this.signupGroupService.setTimeForClock(diff-60);     //EmailValidUntil

          this.signupGroupService.setStoredMail(this.mail.trim());
          this.signupGroupService.setStoredRegistrationCode(res.ResgistationCode); //regCode
          this.signupGroupService.setStoredCompanyName(this.companyName);
          this.signupGroupService.setStoredKivosCode(this.regCode); //kivos code
          this.localStorage.setDataToLocalStorage("mail", this.mail.trim());
          this.localStorage.setDataToLocalStorage("RegistrationCode", res.ResgistationCode);
          this.localStorage.setDataToLocalStorage("companyName", this.companyName);
          this.router.navigate(["/groupform/firstconfirmation"], {})

        
        } else 
        {
          this.errorMsgRegCode = errorList[res.Errors[0].ErrorCode];
        }
      },
      (error) => { 
        this.errorMsgRegCode = "Συνέβη κάποιο λάθος"; 
      },
      () => {
        
         this.showSpinnerBtn=false;

      } 
      );
    }
   
  
  }

  //Registration code pop up
  getRegCode() {
    this.openDialog();
  }

  openDialog(): void {

    this.modalService.ismodalOpened();
    const modalRef = this.ngbModal.open(NewRegCodeModalComponent, {
      windowClass: "xlModal-icon",
      centered: true,
      backdropClass: "backgroundClass"
    });
    modalRef.componentInstance.name = "World";
    modalRef.result.then(
      () => {
        console.log("When user closes");
      },
      () => {
        this.modalService.isModalClosed();
      }
    );
  }

  // Error Message for the Email
  getEmailErrorMessage() {
    return 0;
  }

  // Error Message for the Passsword
  getRegCodeErrorMessage() {
    return 0;
  }

  get imageSource() {
    return this.getIcon("0B8BF05BD9C54878807163B1050D5AF3");
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block;");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "16");

    return svg;
  }

  onShowPassword(show: boolean) {
    this.showPassword = show;
  }

}

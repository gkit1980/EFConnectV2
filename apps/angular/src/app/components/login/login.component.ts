import { environment } from '@insis-portal/environments/environment';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { IceModel, RuleFactoryImpl, DataModel , LifecycleEvent} from "@impeo/ice-core";
import { IcePrincipalService, IceContextService, IceRuntimeResolver } from "@impeo/ng-ice";
import { AuthService } from "@insis-portal/services/auth.service";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { PassManagementService } from '@insis-portal/services/pass-management.service';
import { SpinnerService } from "@insis-portal/services/spinner.service";
import { HttpErrorResponse } from "@angular/common/http";
import { CookieDeclarationComponent } from "../../components/cookie-declaration/cookie-declaration.component";
import { TermsConditionsComponent } from "../../components/terms-conditions/terms-conditions.component";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecapchaService } from '@insis-portal/services/recapcha.service';
import { ModalService } from '@insis-portal/services/modal.service';
import { VideoComponent } from './video/video.component';
import { LogoutService } from "@insis-portal/services/logout.service";
import * as CryptoJS from 'crypto-js';
import { get } from 'lodash';


export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {

  LOGIN_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';

  email = new FormControl("", [Validators.required, Validators.email]);
  pwd = new FormControl("", [Validators.required]);
  error = "";
  loading = false;
  eurolife = 'portal.login.eurolife.label';
  loginSectionHeader = 'portal.login.section-header.label';
  emailText = 'portal.login.emailText.label';
  loginPasswordText = 'portal.login.loginPasswordText.label';
  loginEnterPasswordText = 'portal.login.loginEnterPasswordText.label';
  noAccount = 'portal.login.noAccount.label';
  telephone = 'portal.login.telephone.label';
  okSubmit = 'portal.login.okSubmit.label';
  forgotUser = 'portal.login.forgotUser.label';
  forgotPass = 'portal.login.forgotPass.label';
  newUser = 'portal.login.newUser.label';
  newUserText1 = 'portal.login.newUserText1.label';
  newUserText2 = 'portal.login.newUserText2.label';
  oroiXrishs = 'portal.login.oroiXrishs.label';
  copyright = 'portal.login.copyright.label';
  prostasiadedomenwn = 'app.footer.prostasiadedomenwn.label';
  politikicookies = 'app.footer.politikicookies.label';
  logoutText = 'portal.login.logoutText.label';

  fromLogoutFlag: boolean = false;
  authedicatedUser: number;
  authediaction: boolean;
  serverError: boolean;
  showPassword: boolean;
  showDaf: boolean = false;
  clickCount: number=0;
  returnUrl: string;

  constructor(
    private router: Router,
    private icePrincipalService: IcePrincipalService,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private spinnerService: SpinnerService,
    private iceContextService: IceContextService,
    private iceRuntimeResolver: IceRuntimeResolver,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService,
    private ngbModal: NgbModal,
    private blurModal: ModalService,
    private logoutService: LogoutService,
    private passManagement: PassManagementService
  ) {

  }

  executeLogintAction(): void {
    this.clickCount++;
    if(this.clickCount>1) return;

    this.login();
    this.recaptchaV3Service.execute('loginAction')
      .subscribe((token) => {
        this.recapchaService.recapchaValidation(token).subscribe((response: any) => {
          if (response.success) {
            if (response.score > 0.55) {
              this.clickCount=0;
            } else {
              // this.router.navigate(["/login"])
            }
          } else {
            // this.router.navigate(["/login"])
          }
        })
      });
  }

  ngOnInit(): void {

    if (this.route.snapshot.queryParamMap.get('logout') == 'true') {
      this.fromLogoutFlag = true;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '//';
    var token =  this.localStorage.getDataFromLocalStorage('token');
    //  if(this.localStorage.getDataFromLocalStorage('token')&& this.returnUrl != '//'){
    //   var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
    //   var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery.toString(), environment.decryption_code).toString(CryptoJS.enc.Utf8));
    //   this.localStorage.setDataToLocalStorage("refreshStatus",1);
    //   this.router.navigate([decodedQuery]);
    // }
    // var acceptButton = document.getElementsByClassName("optanon-allow-all")[0];
    // var saveSettingButton = document.getElementsByClassName("optanon-white-button-middle")[0];
    // var allowAllButton = document.getElementsByClassName("optanon-white-button-middle")[1];

    // acceptButton.addEventListener('click', function () {
    //   location.reload()
    // });


    // allowAllButton.addEventListener('click', function () {
    //   location.reload()
    // });

    // saveSettingButton.addEventListener('click', function () {
    //   location.reload()
    // });

  }

  ngOnDestroy(): void {
    this.spinnerService.loadingOff();
  }

  cookieClick() {
    this.modalService.open(CookieDeclarationComponent, { windowClass: 'xlModal' });
  }

  signUp()
  {
    // this.modalService.open(SignUpNewComponent, { windowClass: 'xlRegistrationModal' });
    this.router.navigate(['/signupform']);
  }

  //Click on the login button
  login(): any {
    this.spinnerService.loadingOn();

    const token = this.localStorage.getDataFromLocalStorage('token');
    if (token != undefined) {
      this.spinnerService.loadingOff();
      this.logoutService.logoutSec();
      return null;
    }

    this.serverError = false;
    this.fromLogoutFlag = false;
    if (this.email.value !== '' && this.pwd.value !== '') {
      this.authService
        .sighinUser(this.email.value, this.pwd.value)
        .subscribe((response: any) => {
          this.localStorage.setDataToLocalStorage("token", response.access_token);
          window.sessionStorage.setItem("token", response.access_token);
          this.localStorage.setDataToLocalStorage("email", this.email.value);
          this.localStorage.setDataToLocalStorage("consents", true);
          this.localStorage.setDataToLocalStorage("_tokenExpirationTime", (Date.now() + 1800 * 1000).toString());
          this.authService.buildPrincipal();
          this.route.queryParams.subscribe((params: any) => {
            this.returnUrl = params["returnUrl"] || '//';
            if(this.returnUrl !=='//'){
              var encryptedQuery = decodeURIComponent(this.returnUrl.toString());
              if(!encryptedQuery.includes("returnUrl=")){
                this.prepareHomeAndNavigateToHome();
              }else{
                this.prepareData();
                var decodedQuery =  JSON.parse(CryptoJS.AES.decrypt(encryptedQuery.split("returnUrl=")[1], environment.decryption_code).toString(CryptoJS.enc.Utf8));
                this.localStorage.setDataToLocalStorage("selectedBranch",decodedQuery.branchDeepLink);
                this.localStorage.setDataToLocalStorage("contractID",decodedQuery.contractIdDeepLink);
                this.localStorage.setDataToLocalStorage("contractKey",decodedQuery.contractKeyDeepLink);
                this.localStorage.setDataToLocalStorage("refreshStatus",1);
                if(decodedQuery.nextLink == "/ice/default/customerArea.motor/greenCard"){
                  this.router.navigate([decodedQuery.nextLink], {
                    queryParams: {
                      plate: decodedQuery.VehicleLicensePlate,
                    }});
                }else if(decodedQuery.nextLink == '/ice/default/customerArea.motor/viewAmendments'){
                  this.router.navigate(["/ice/default/customerArea.motor/home"], {
                    queryParams: {
                      returnUrl: encryptedQuery.split("returnUrl=")[1],
                    }});
                }else if(decodedQuery.nextLink == '/ice/default/customerArea.motor/viewClaims'){
                  this.router.navigate(["/ice/default/customerArea.motor/home"], {
                    queryParams: {
                      returnUrl: encryptedQuery.split("returnUrl=")[1],
                    }});
                }else if(decodedQuery.nextLink == '/ice/default/customerArea.motor/paymentManagement'){
                  this.router.navigate(["/ice/default/customerArea.motor/viewMyPolicies"], {
                    queryParams: {
                        returnUrl: encryptedQuery.split("returnUrl=")[1],
                    }});
                }else if(decodedQuery.nextLink == '/ice/default/customerArea.motor/policyDetails' ){
                  this.router.navigate(["/ice/default/customerArea.motor/home"], {
                    queryParams: {
                        returnUrl: encryptedQuery.split("returnUrl=")[1],
                    }});
                }else{
                  this.router.navigate([decodedQuery.nextLink]);
                }
              }
            }else{
              this.prepareHomeAndNavigateToHome();
            }
          })
        },
        (error: HttpErrorResponse) => {
          this.spinnerService.loadingOff();
          if (error.status == 400) {
            this.serverError = true;
          }
        });
    } else {
      if (this.email.value === '') {
        document.getElementById("email").focus();
        this.getEmailErrorMessage();
        this.spinnerService.loadingOff();
      }
      if (this.pwd.value === '') {
        document.getElementById("password").focus();
        this.getPwdErrorMessage();
        this.spinnerService.loadingOff();
        if (this.email.value === '') {
          document.getElementById("email").focus();
        }
      }
    }
  }

  log()
  {
    console.log("Clicked!")
  }


  onShowPassword(show: boolean) {
    this.showPassword = show;
  }

  openDialog() {
    this.modalService.open(TermsConditionsComponent, { windowClass: 'xlModal' });
  }

  openDialogLegal() {
    window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
  }

  //Error Message for the Email
  getEmailErrorMessage() {
    return this.email.hasError("required")
      ? "Το πεδίο email είναι υποχρεωτικό"
      : this.email.hasError("email")
        ? "To email που καταχωρήσατε δεν είναι έγκυρο"
        : "";
  }

  //Error Message for the Passsword
  getPwdErrorMessage() {
    return this.pwd.hasError("required")
      ? "Το πεδίο password είναι υποχρεωτικό"
      : "";
  }

  get imageSource() {
    return this.getIcon('1547DE9BAEA84C1A9A1513B382614372');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '54');
    svg.setAttribute('height', '54');

    return svg;
  }

  handleTickSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '21');
    svg.setAttribute('height', '21');

    return svg;
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '16');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  get imageSourceNotification() {
    return this.getIcon('981D16C6FE5447429742308B97C23613');
  }

  handleNotificationSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('fill', '#cc046c');
    return svg;
  }


  private async prepareHomeAndNavigateToHome(): Promise<void> {
    if (this.icePrincipalService.principal.data["token"]) {
      const route: ActivatedRouteSnapshot = { params: {}, url: null, queryParams: {}, routeConfig: <any>null, fragment: '', data: <any>null, outlet: '', component: null, root: null, parent: null, firstChild: null, children: null, pathFromRoot: null, paramMap: null, queryParamMap: null };
      route.params['definition'] = 'customerArea.motor';
      route.params["repo"] = 'default';
      const iceModelRecipe = await this.iceRuntimeResolver.resolve(route, null);
      RuleFactoryImpl.build((await this.iceContextService.getContext("customerArea")));
      const iceModel = await IceModel.build((await this.iceContextService.getContext("customerArea")), null, null);
      (await this.iceContextService.getContext("customerArea")).iceModel = iceModel;
        // this.spinnerService.setMessage('Φόρτωση συμβολαίων');
      DataModel.build( (await this.iceContextService.getContext("customerArea")));
      this.router.navigate(["/ice/default/customerArea.motor/home"]);

      (await this.iceContextService.getContext("customeArea")).$lifecycle.subscribe((e: LifecycleEvent) => {

        const actionName = get(e, ['payload', 'action']);


          if (actionName != 'actionGetPolicies' && actionName == "actionGetDocumentTypes") {
            this.ckeckIfDafDocExists();
            return;
          }
      // if (actionName != 'actionGetPolicies') return;

        //   this.spinnerService.setMessage('Φόρτωση προφίλ');
          // this.router.navigate([
          //   "/ice/default/customerArea.motor/home"
          // ]);
        })

    }
  }

  async ckeckIfDafDocExists() {
    var documentTypes = (await this.iceContextService.getContext("customerArea")).iceModel.elements["policy.documentTypes"].getValue().values[0].value;
    var dafLifeDocs = documentTypes.filter((x: any) => x.docType == "dafLife"); //ToDo: this should be changed to dafLife
    if (dafLifeDocs.length > 0) {
      this.showDaf = true;
      this.localStorage.setDataToLocalStorage('showDaf', true);
      (await this.iceContextService.getContext("customerArea")).iceModel.elements["hasDaf"].setSimpleValue(true);
    }
    else {
      this.showDaf = false;
      this.localStorage.setDataToLocalStorage('showDaf', false);
      (await this.iceContextService.getContext("customerArea")).iceModel.elements["hasDaf"].setSimpleValue(false);
    }
  }

  playVideo() {
    this.blurModal.ismodalOpened();
    let modalRef: NgbModalRef;
    modalRef = this.ngbModal.open(VideoComponent, { windowClass: "xlVideoModal", centered: true });
    modalRef.result.then(() => { console.log('When user closes'); }, () => { this.blurModal.isModalClosed(); })
  }


  private async prepareData(): Promise<void> {
    if (this.icePrincipalService.principal.data["token"]) {
      const route: ActivatedRouteSnapshot = { params: {}, url: null, queryParams: {}, routeConfig: <any>null, fragment: '', data: <any>null, outlet: '', component: null, root: null, parent: null, firstChild: null, children: null, pathFromRoot: null, paramMap: null, queryParamMap: null };
      route.params['definition'] = 'customerArea.motor';
      route.params["repo"] = 'default';
      const iceModelRecipe = await this.iceRuntimeResolver.resolve(route, null);
      RuleFactoryImpl.build(await this.iceContextService.getContext("customerArea"));
      const iceModel = await IceModel.build(await this.iceContextService.getContext("customerArea"), null, null);
      (await this.iceContextService.getContext("customerArea")).iceModel = iceModel;
        // this.spinnerService.setMessage('Φόρτωση συμβολαίων');
      DataModel.build(await this.iceContextService.getContext("customerArea"));

    }
  }

}

import { TermsConditionsComponent } from './../../terms-conditions/terms-conditions.component';
import { LegalPopupComponent } from './../../legal-popup/legal-popup.component';
import { environment } from './../../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { SignupService } from '../../../../services/signup.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { AuthService } from '../../../../services/auth.service';
import { DemoPageComponent, IcePrincipalService, IceModelRecipeResolver, IceContextService } from "@impeo/ng-ice";
import { IcePrincipal, RuleFactoryImpl, IceModel, DataModel } from "@impeo/ice-core";
import { errorList } from '../errorList';
import { SpinnerService } from '../../../../services/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-sign-up-new-final-form',
  templateUrl: './sign-up-new-final-form.component.html',
  styleUrls: ['./sign-up-new-final-form.component.scss']
})
export class SignUpNewFinalFormComponent  extends DemoPageComponent {

  @ViewChild('f') slForm: NgForm;
  LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';
  success: boolean = false;
  password: string;
  confirmPassword: string;
  vatNo: number;
  passwordStrengthStage: number; //1:low 2:high 3:very high
  isPasswordPassedRules: boolean = false;
  isPasswordConfirmed: boolean = true;
  passwordStrength: Array<string> = ['low', 'medium', 'high'];
  currentStrength: string;
  mail: string;
  regCode: number;
  showPassword: boolean;
  checkPrivacy: boolean = false;
  checkTerms: boolean = false;
  errMsgService: string;
  errMsgPasswordMatch: string = 'Οι κωδικοί δεν ταιριάζουν';
  mailVerified: boolean = false;
  serverError: boolean;
  gotPasswordConfirm: boolean = false;
  gotVatNo: boolean = false;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;
  vatno = new FormControl("", [Validators.required]);
  passwordStrendthColor: number;
  isLinkExpired: boolean = false;
  showDaf = false;
  showSpinnerBtn = false;

  eurolife = 'pages.signup.create.eurolife.label';
  step = 'pages.signup.create.step.label';
  terms1 = 'pages.signup.create.terms1.label';
  terms2 = 'pages.signup.create.terms2.label';
  terms3 = 'pages.signup.create.terms3.label';
  privacy1 = 'pages.signup.create.privacy1.label';
  privacy2 = 'pages.signup.create.privacy2.label';
  enableRegistration1 = 'pages.signup.create.enableRegistration1.label';
  enableRegistration2 = 'pages.signup.create.enableRegistration2.label';
  myEurolife = 'pages.signup.create.myEurolife.label';
  ohNo = 'pages.signup.create.ohNo.label';
  problem = 'pages.signup.create.problem.label';
  connection = 'pages.signup.create.connection.label';
  ok = 'pages.signup.create.ok.label';
  vatText = 'pages.signup.create.vatText.label';
  signupCreatePasswordText = 'pages.signup.create.signupCreatePasswordText.label';
  signupCreateConfirmPasswordText1 = 'pages.signup.create.signupCreateConfirmPasswordText1.label';
  signupCreateConfirmPasswordText2 = 'pages.signup.create.signupCreateConfirmPasswordText2.label';
  vatError = 'pages.signup.create.vatError.label';


  basicElements = "pages.signup.basic.basicElements.label";
  next = "pages.signup.basic.next.label";
  cancel = "pages.signup.basic.cancel.label";
  signin = 'pages.signup.updated.signin.label';


  constructor(private router: Router, private signupService: SignupService, private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private icePrincipalService: IcePrincipalService,
    private iceModelRecipeResolver: IceModelRecipeResolver,
    private iceContextService: IceContextService,
    private spinnerService: SpinnerService,
    private modalService: NgbModal) {
    super();
  }

  ngOnInit() {

  }

  onVatChange() {

    if(this.vatNo!=undefined)
    {
      this.regexp = new RegExp('^[0-9]{9}$');
      this.validateRegex = this.regexp.test(this.vatNo.toString());
      if (this.validateRegex) {
        this.gotVatNo = true;
      }
      else {
        this.gotVatNo = false;
      }
    }
  }


  checkPasswordMatchRegex() {

    this.isPasswordPassedRules = false;
    this.currentStrength = '';
    if (this.password.match(/(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[0-9])(?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))).{8,}/)) {
      this.currentStrength = this.passwordStrength[2];
      this.passwordStrendthColor = 2;
      this.isPasswordPassedRules = true;
    } else if (this.password.match(/(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))).{8,}/)) {
      this.currentStrength = this.passwordStrength[1];
      this.passwordStrendthColor = 1;
      this.isPasswordPassedRules = false;
    } else if (this.password.match(/(?=.*[a-z]|[A-Z]|[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]|[0-9]).{4,}/)) {
      this.currentStrength = this.passwordStrength[0];
      this.passwordStrendthColor = 0;
      this.isPasswordPassedRules = false;
    }
  }

  onShowPassword(show: boolean) {
    this.showPassword = show;
  }

  checkPasswordMatchConfirm() {

    this.errMsgPasswordMatch = '';
    this.isPasswordConfirmed = false;
    if (this.password == this.confirmPassword) {
      this.isPasswordConfirmed = true;
      this.gotPasswordConfirm = true;
    } else {
      this.errMsgPasswordMatch = 'Οι κωδικοί δεν ταιριάζουν';
      this.gotPasswordConfirm = false;
    }

  }

  getStrengthColor(index: number) {
    if (this.currentStrength == 'low' && index == 0) {
      return 'low'
    } else if (this.currentStrength == 'medium' && index <= 1) {
      return 'medium'
    } else if (this.currentStrength == 'high' && index <= 2) {
      return 'high'
    }
  }

  getStrengthColorText(index: number) {
    if (this.currentStrength == 'low' && index == 0) {
      return 'lowText'
    } else if (this.currentStrength == 'medium' && index <= 1) {
      return 'mediumText'
    } else if (this.currentStrength == 'high' && index <= 2) {
      return 'highText'
    }
  }

  getStrengthText(i: any){
    if (i === 'low' || i === 'medium'){
      return 'Μη αποδεκτό'
    }else if ( i === 'high') {
      return 'Αποδεκτό'
    }
  }



  checkBoxHandle(event: any) {
    if (event.target.id === 'privacy') {
      this.checkPrivacy = event.target.checked;
    } else if (event.target.id === 'terms') {
      this.checkTerms = event.target.checked;
    }
  }

  onSubmit() {
    this.showSpinnerBtn = true;
    this.errMsgService = '';
    this.signupService
      .createUser(this.signupService.storedMail, this.password, this.vatNo.toString())
      .subscribe((res: any) => {
        if (res.Success) {
          this.auth.sighinUser(this.signupService.storedMail, this.password).subscribe(
            (response: any) => {
              this.localStorage.setDataToLocalStorage('token', response.access_token);
              this.localStorage.setDataToLocalStorage('email', this.signupService.storedMail);
              this.localStorage.setDataToLocalStorage('consents', true);
              this.localStorage.setDataToLocalStorage("_tokenExpirationTime", (Date.now() + 1800 * 1000).toString());
              this.auth.buildPrincipal();
              this.prepareHomeAndNavigateToHome();
            },
            (error: HttpErrorResponse) => {
              this.showSpinnerBtn = false;
              if (error.status == 400) {
                this.serverError = true;
              }
            }
          );
        } else {
          this.errMsgService = errorList[res.Errors[0].ErrorCode];
        }
      });
  }

  get imageSource() {
    return this.getIcon('44B30F2D7E43462F8F82E832A481E10C');
  }

  get imageSourceIcon() {
    return this.getIcon('0B8BF05BD9C54878807163B1050D5AF3');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '52');
    svg.setAttribute('height', '64');
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
    return svg;
  }

  handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block;');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');

    return svg;
  }

  ngOnDestroy(): void {
    this.localStorage.clearFromLocalStorage();
  }

  gotitClick() {
    this.router.navigate(['\login'])
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '16');

    return svg;
  }

  private async prepareHomeAndNavigateToHome(): Promise<void> {
    if (this.icePrincipalService.principal.data['token']) {
      const route: ActivatedRouteSnapshot = {
        params: {},
        url: null,
        queryParams: {},
        routeConfig: <any>null,
        fragment: '',
        data: <any>null,
        outlet: '',
        component: null,
        root: null,
        parent: null,
        firstChild: null,
        children: null,
        pathFromRoot: null,
        paramMap: null,
        queryParamMap: null,
      };
      route.params['definition'] = 'customerArea.motor';
      route.params['repo'] = 'default';
      const iceModelRecipe = await this.iceModelRecipeResolver.resolve(route, null);
      RuleFactoryImpl.build( (await this.iceContextService.getContext("customerArea")));
      const iceModel = await IceModel.build( (await this.iceContextService.getContext("customerArea")), iceModelRecipe.recipe, iceModelRecipe.hash);
      (await this.iceContextService.getContext("customerArea")).iceModel = iceModel;
      DataModel.build(await this.iceContextService.getContext("customerArea"));
      this.showSpinnerBtn = false;
      this.router.navigate(['/ice/default/customerArea.motor/home']);

      this.iceContextService.context.$actionEnded.subscribe((actionName: string) => {
        if (actionName != 'actionGetPolicies' && actionName == 'actionGetDocumentTypes') {
          this.ckeckIfDafDocExists();
          return;
        }
      });
    }
  }

  private async ckeckIfDafDocExists() {
    var documentTypes = (await this.iceContextService.getContext("customerArea")).iceModel.elements['policy.documentTypes'].getValue().values[0]
      .value;
    var dafLifeDocs = documentTypes.filter((x: any) => x.docType == 'dafLife');
    if (dafLifeDocs.length > 0) {
      this.showDaf = true;
      this.localStorage.setDataToLocalStorage('showDaf', true);
      (await this.iceContextService.getContext("customerArea")).iceModel.elements['hasDaf'].setSimpleValue(true);
    } else {
      this.showDaf = false;
      this.localStorage.setDataToLocalStorage('showDaf', false);
      (await this.iceContextService.getContext("customerArea")).iceModel.elements['hasDaf'].setSimpleValue(false);
    }
  }

  openTermsDialog() {
    this.modalService.open(TermsConditionsComponent, { windowClass: 'xlModal' });
  }

  openDialogLegal() {
    this.modalService.open(LegalPopupComponent, { windowClass: 'xlModal' });
    //window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
  }


  ngAfterViewInit()
  {
    this.signupService.setStepperState(0, "done");
    this.signupService.setStepperState(1, "done");
    this.signupService.setStepperState(2, "active");
  }

}

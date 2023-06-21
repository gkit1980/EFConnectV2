import { Component, OnInit } from '@angular/core';
import { environment } from "@insis-portal/environments/environment";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupGroupService } from '@insis-portal/services/signupgroup.service';
import { SignUpGroupSuccessModalComponent } from '../sign-up-group-success-modal/sign-up-group-success-modal.component';
import { RuleFactoryImpl, IceModel, DataModel,LifecycleEvent } from "@impeo/ice-core";
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { IcePrincipalService, IceRuntimeResolver, IceContextService } from "@impeo/ng-ice";
import { errorList } from '../sign-up-group/errorList';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@insis-portal/services/auth.service';
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { DomSanitizer} from '@angular/platform-browser';
import { SignUpGroupWaitingModalComponent } from '../sign-up-group-waiting-modal/sign-up-group-waiting-modal.component';
import { SignUpGroupErrorServiceModalComponent } from '../sign-up-group-errorService-modal/sign-up-group-errorService-modal.component';
import { get } from 'lodash';


@Component({
  selector: 'app-sign-up-group-consents-modal',
  templateUrl: './sign-up-group-consents-modal.component.html',
  styleUrls: ['./sign-up-group-consents-modal.component.scss']
})
export class SignUpGroupConsentsModalComponent implements OnInit {

  showSpinnerBtn = false;
  promoConsent: boolean =false;
  thirdPartyConsent: boolean =false;
  errMsgService: string;

  no_promo:string='no_promo';
  yes_only_promo:string='yes_only_promo';
  yes_target_promo:string='yes_target_promo';

  no:string='no';
  yes:string='yes';

  policyNo: any;
  kivosId: any;
  localStorage: any;
  serverError: boolean;
  showDaf: boolean;


  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private signupGroupService: SignupGroupService,
              private auth: AuthService,
              private icePrincipalService: IcePrincipalService,
              private IceRuntimeResolver: IceRuntimeResolver,
              private iceContextService: IceContextService,
              private localStorageService:LocalStorageService,
              private router:Router,
              public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  get imageSource() {
    return this.getIcon("E8D77F8BE0CC4427B18F0FD7EA8AFB96");
  }

  onOK() {
    this.activeModal.close();
    //this.modalService.isModalClosed();
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

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block;");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    return svg;
  }

  onNoClick() {
    this.onOK();
  }

  checkBoxHandle(event: any) {
  if (event.target.id === 'no_promo' || event.target.id === 'yes_only_promo'||event.target.id === 'yes_target_promo'){
      this.promoConsent = event.target.checked;
      if (event.target.id === 'no_promo'){
        this.signupGroupService.storedConsentMarketingCode = "0";
      }else if (event.target.id === 'yes_only_promo'){
        this.signupGroupService.storedConsentMarketingCode = "2";
      }else{
        this.signupGroupService.storedConsentMarketingCode = "1";
      }
    }else if  (event.target.id === 'yes'|| event.target.id === 'no'){
      this.thirdPartyConsent = event.target.checked;
      if (event.target.id === 'yes'){
        this.signupGroupService.storedConsentMarketingThirdPartyCode = "1";
      }else{
        this.signupGroupService.storedConsentMarketingThirdPartyCode = "0";
      }

    }
  }

  onSubmit() {
    this.showSpinnerBtn = true;
    this.errMsgService = '';
    this.animationDialogLegal();
    this.signupGroupService
      .insuredUser(this.signupGroupService.storedKivosCode, this.signupGroupService.storedGender, this.signupGroupService.storedName, this.signupGroupService.storedSurname,
        this.signupGroupService.storedFathername, this.signupGroupService.storedBirthdate, this.signupGroupService.storedVatNo, this.signupGroupService.storedIbanNo,
        this.signupGroupService.storedMail, this.signupGroupService.storedMobile, this.signupGroupService.storedLandline,this.signupGroupService.storedConsentMarketingCode,
        this.signupGroupService.storedConsentMarketingThirdPartyCode)
      .subscribe((res: any) => {
        if (res.Success) {
          this.policyNo = res.policyNo;
          this.kivosId = res.kivosId;
          this.callgetUpadateUser();
        } else {
         // this.errMsgService = errorList[res.Errors[0].ErrorCode];
         this.errorMessage();
        }
      });

  }

  callgetUpadateUser(){
    this.signupGroupService.updateUserGroup(this.signupGroupService.storedRegistrationCode,this.signupGroupService.storedVatNo,this.signupGroupService.storedSurname,this.signupGroupService.storedName,
      this.signupGroupService.storedBirthdate,this.signupGroupService.storedGender, this.policyNo,this.kivosId)
    .subscribe((res: any)=>{
      if(res.Success){
        this.callcreateUser();
      }else {
        this.errMsgService = errorList[res.Errors[0].ErrorCode];
      }

    });
  }

  callcreateUser(){
    this.signupGroupService
      .createUser(this.signupGroupService.storedMail, this.signupGroupService.storedPassword, this.signupGroupService.storedVatNo.toString())
      .subscribe((res: any) => {
        if (res.Success) {
          this.auth.sighinUser(this.signupGroupService.storedMail, this.signupGroupService.storedPassword).subscribe(
            (response: any) => {
              this.localStorageService.setDataToLocalStorage('token', response.access_token);
              this.localStorageService.setDataToLocalStorage('email', this.signupGroupService.storedMail);
              this.localStorageService.setDataToLocalStorage('consents', true);
              this.localStorageService.setDataToLocalStorage("_tokenExpirationTime", (Date.now() + 1800 * 1000).toString());
              this.auth.buildPrincipal();
              this.prepareHomeAndNavigateToHome();
              this.successDialogLegal();

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
    //  const iceModelRecipe = await this.IceRuntimeResolver.resolve(route, null);
      RuleFactoryImpl.build(await this.iceContextService.getContext("customerArea"));
      const iceModel = await IceModel.build(await this.iceContextService.getContext("customerArea"),null,null);
      (await this.iceContextService.getContext("customerArea")).iceModel = iceModel;
      DataModel.build(await this.iceContextService.getContext("customerArea"));
      this.showSpinnerBtn = false;
      this.router.navigate(['/ice/default/customerArea.motor/home']);

      (await this.iceContextService.getContext("customerArea")).$lifecycle.subscribe((e: LifecycleEvent) => {

        const actionName = get(e, ['payload', 'action']);

        if (actionName != 'actionGetPolicies' && actionName == 'actionGetDocumentTypes' && e.type === 'ACTION_FINISHED') {
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

  successDialogLegal() {
    this.modalService.dismissAll();
    this.modalService.open(SignUpGroupSuccessModalComponent, { windowClass: 'xlModal' });
  }

  animationDialogLegal(){
    this.modalService.dismissAll();
    this.modalService.open(SignUpGroupWaitingModalComponent, { windowClass: 'xlModal', backdrop : 'static',
    keyboard : false });
  }

  errorMessage(){
    this.modalService.dismissAll();
    this.modalService.open( SignUpGroupErrorServiceModalComponent,{ windowClass: 'xlModal', backdrop : 'static',
    keyboard : false });
  }


}

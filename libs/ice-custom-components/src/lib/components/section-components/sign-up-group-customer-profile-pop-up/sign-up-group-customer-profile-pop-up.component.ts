
import { environment } from  "@insis-portal/environments/environment";
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component,ChangeDetectorRef } from '@angular/core';
import { IcePrincipalService } from '@impeo/ng-ice';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { SignupGroupService } from '@insis-portal/services/signupgroup.service';
import {  HttpClient } from '@angular/common/http';
import { AuthService } from '@insis-portal/services/auth.service';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import { ConsentsComponent } from '../../../../../../../apps/angular/src/app/components/consents/consents.component';



@Component({
  selector: 'app-sign-up-group-customer-profile-pop-up',
  templateUrl: './sign-up-group-customer-profile-pop-up.component.html',
  styleUrls: ['./sign-up-group-customer-profile-pop-up.component.scss']
})
export class SignUpGroupCustomerProfilePopUpComponent extends SectionComponentImplementation {

  constructor(private icePrincipalService: IcePrincipalService,
    parent: IceSectionComponent,
    public ngbModal: NgbModal,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private signupGroupService: SignupGroupService,
    private auth: AuthService,
    private http: HttpClient,
    private ngbActiveModal: NgbActiveModal,
    private modal: ModalService) {
    super(parent);
  }

  showSpinnerBtn = false;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;
  dialogRef: NgbModalRef;
  errorMsgRegCode: string;

  ibanNumber = new FormControl("", [Validators.required]);
  ibanNo :string;
  groupRegCode = new FormControl("", [Validators.required]);
  groupRegCodeNo: string;
  gendervalue = new FormControl("", [Validators.required]);
  genderValue: number;
  consentYesvalue = new FormControl("", [Validators.required]);
  consentYes: boolean;
  promoConsentValue = new FormControl("", [Validators.required]);
  promoConsentvalue: string;
  thirdPartyConsentValue = new FormControl("", [Validators.required]);
  thirdPartyConsentvalue: string;

  gotIban: boolean = false;
  gotGroupRegCode: boolean = false;
  gotGender: boolean = false;
  promoConsent: boolean = false;
  thirdPartyConsent: boolean = false;
  gotCheckConsent: boolean = false;

  no_promo:string='no_promo';
  yes_only_promo:string='yes_only_promo';
  yes_target_promo:string='yes_target_promo';
  unChecked: string = 'consentYes';

  infoText: string = 'show';
  radioOptions: string = 'checked';

  male: string = 'male';
  female: string = 'female';

  serverError: boolean;
  errMsgService: string;

  policyNo:any;
  kivosId:any;
  companyName:any;

  data: any;
  popupPageName: string = "";

  currentDate = new Date();
  dateFormat:any;
  splittedDate:any;
  splittedExpDate:any;
  formattedBrirthDate : any;
  newformattedBrirthDate: any;
  birthDate : any;


  title = 'sections.signupGroupPopup.groupCodeRegister.title.label';
  code = 'sections.signupGroupPopup.groupCodeRegister.code.label';
  codeError = 'sections.signupGroupPopup.groupCodeRegister.codeError.label';
  iban = 'sections.signupGroupPopup.groupCodeRegister.iban.label';
  ibanError = 'sections.signupGroupPopup.groupCodeRegister.ibanError.label';
  gender = 'sections.signupGroupPopup.groupCodeRegister.gender.label';

  ngOnInit() {

    this.signupGroupService.setStoredName(this.context.iceModel.elements["customer.details.FirstName"].getValue().forIndex(null));
    this.signupGroupService.setStoredSurname(this.context.iceModel.elements["customer.details.LastName"].getValue().forIndex(null));
    this.signupGroupService.setStoredFathername(this.context.iceModel.elements["customer.details.FathersName"].getValue().forIndex(null));
    this.signupGroupService.setStoredBirthdate(this.context.iceModel.elements["customer.details.BirthDate"].getValue().forIndex(null));
    this.signupGroupService.setStoredVatNo(this.context.iceModel.elements["customer.details.TaxCode"].getValue().forIndex(null));
    this.signupGroupService.setstoredMobile(this.context.iceModel.elements["customer.details.MobilePhone"].getValue().forIndex(null));
    this.signupGroupService.setStoredMail(this.context.iceModel.elements["customer.details.Email"].getValue().forIndex(null));
    this.signupGroupService.setStoredLandline(null);

    this.birthDate = this.signupGroupService.storedBirthdate;
    //console.log("dateeeeeeee", this.birthDate);
  }

  inputIBAN() {
    if(this.ibanNumber!=undefined)
    {
      this.regexp = new RegExp('^GR[0-9]{25}');
      this.validateRegex = this.regexp.test(this.ibanNumber.value);
      if (this.validateRegex) {
        this.gotIban = true;
      }
      else {
        this.gotIban = false;
      }
    }
  }

  inputRegCode(){

    if(this.groupRegCode!=undefined)
    {
      this.regexp = new RegExp('^GRP[0-9]{17}');
      this.validateRegex = this.regexp.test(this.groupRegCode.value);
      if (this.validateRegex) {
        this.signupGroupService.getGroupRegCode(this.groupRegCode.value).subscribe((res: any) => {
          if (res.Success)
          {
            this.dateFormat = this.currentDate.toISOString();
            this.splittedDate = this.dateFormat.split('T')[0];
            this.splittedExpDate = res.expirationDate.split('T')[0];
            if (this.splittedExpDate >= this.splittedDate) {
              if (res.membersDeclared > res.membersRegistered){
                this.gotGroupRegCode = true;
                this.errorMsgRegCode = "";
                this.companyName = res.policyholderName;
              }else{
                this.errMsgService = "Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτόν τον κωδικό!";
               this.gotGroupRegCode = false;
              }
            }else{
              this.errMsgService = "Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτόν τον κωδικό!";
              this.gotGroupRegCode = false;
            }
          }
          else
          {
            this.errMsgService = "Δεν μπορείτε να προχωρήσετε τη διαδικασία με αυτόν τον κωδικό!";
            this.gotGroupRegCode = false;
          }
        });

      }
      else {
        this.gotGroupRegCode = false;
      }
    }
  }
  onGenderChecked(event:any) {
    if (event.value != undefined && (event.value==1 || event.value==2)) {
      this.gotGender = true;
      this.genderValue=event.value
      this.signupGroupService.storedGender=this.genderValue;
    } else {
      this.gotGender = false;
    }
  }
  onConsentChange(event:any) {
    if (event.value != undefined) {
      this.gotCheckConsent = true;
      this.consentYes=event.value;
    } else {
      this.gotCheckConsent = false;
    }
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }

  ngAfterViewInit()
  {
  // if(this.localStorage.getDataFromLocalStorage("refreshStatus") == 1)
  //   this.CheckMarketConsents();
  }

  getGridColumnClass(col: any): string {
    let result: any;
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
    if (this.context.iceModel.elements[col.css]) {
      let dt_name = this.context.iceModel.elements[col.css].recipe.dtName;
      let dt = this.page.iceModel.dts[dt_name];
      if (dt) {
        result = dt.evaluateSync();
        if (result.elementClass) {
          return result.elementClass;
        }

      }
    }

    if (col.css) css = css + " " + col.css;
    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.internalCol;
    if (col.css) css = css + " " + col.css;
    return css;
  }

  get elementClass(): string {
    return '';
  }

  getSectionClass(row: any) {
    let result: any;
    if (row.css) {
      if (this.context.iceModel.elements[row.css] != undefined) {
        let dt_name = this.context.iceModel.elements[row.css].recipe.dtName;
        let dt = this.page.iceModel.dts[dt_name];
        if (dt) {
          result = dt.evaluateSync();
          if (result.defaultValue) {
            return result.defaultValue;
          }
          else {
            return 'section-breaks-gen';
          }

        }
      }else{
        return row.css;
      }

    }
    return null;
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

  handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block;');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');

    return svg;
  }

  get imageSourceIcon() {
    return this.getIcon('0B8BF05BD9C54878807163B1050D5AF3');
  }

  ShowDiv(value: string) {
    this.infoText = value;
  }

  checkBoxHandle(event: any) {
    if  (event.target.id === 'no_promo' || event.target.id === 'yes_only_promo'||event.target.id === 'yes_target_promo'){
      this.promoConsent = event.target.checked;
      if (event.target.id === 'no_promo'){
        this.promoConsentvalue = "0";
      }else if (event.target.id === 'yes_only_promo'){
        this.promoConsentvalue = "2";
      }else{
        this.promoConsentvalue = "1";
      }
    }else if  (event.target.id === 'yes'|| event.target.id === 'no'){
      this.thirdPartyConsent = event.target.checked;
      if (event.target.id === 'yes'){
        this.thirdPartyConsentvalue = "1";
      }else{
        this.thirdPartyConsentvalue = "0";
      }
    }
  }

  openUpdateDialog() {
    this.modalService.open(ConsentsComponent, { windowClass: 'xlModal' });
  }

  onSubmit() {
    this.showSpinnerBtn = true;
    this.errMsgService = '';
    this.getWaitingModal();

    var date = new Date(this.birthDate),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    this.formattedBrirthDate = [date.getFullYear(), mnth, day].join("-");
    // this.formattedBrirthDate = this.birthDate;

    //console.log("this.formattedBrirthDate", this.formattedBrirthDate);
    this.signupGroupService
      .insuredUser(this.groupRegCodeNo, this.genderValue, this.signupGroupService.storedName, this.signupGroupService.storedSurname,
        this.signupGroupService.storedFathername, this.formattedBrirthDate, this.signupGroupService.storedVatNo, this.ibanNo,
        this.signupGroupService.storedMail, this.signupGroupService.storedMobile, this.signupGroupService.storedLandline,this.promoConsentvalue,
        this.thirdPartyConsentvalue)
      .subscribe((res: any) => {
        if (res.Success) {
          this.getSuccessEmail();
        } else {;
          this.errorMessage();
          //this.errMsgService = "Συνέβη κάποιο Σφάλμα";
        }
      });
  }

  getSuccessEmail(){
    this.modalService.dismissAll();
    this.http.post('/api/v1/signupGroupForm/send-emails', { 'data': this.data, 'useremail': this.signupGroupService.storedMail,'companyName': this.companyName }).subscribe(response => {
      this.popupPageName = "viewGroupProfileSuccessDialog";
      if ((!this.popupPageName) || (!this.context.iceModel.pages[this.popupPageName])) return console.error(`Page ${this.popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[this.popupPageName];
      this.modal.ismodalOpened();
      this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true });
      this.modal.isModalClosed();
      this.ngbActiveModal.close();
    });
  }

  getWaitingModal(){
    this.popupPageName = "viewGroupProfileWaitingDialog";
    if ((!this.popupPageName) || (!this.context.iceModel.pages[this.popupPageName])) return console.error(`Page ${this.popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[this.popupPageName];
      this.modal.ismodalOpened();
      this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true , backdrop : 'static'});
      this.modal.isModalClosed();
      this.ngbActiveModal.close()
  }

  errorMessage(){
    this.modalService.dismissAll();
    this.popupPageName = "viewGroupProfileErrorServiceDialog";
    if ((!this.popupPageName) || (!this.context.iceModel.pages[this.popupPageName])) return console.error(`Page ${this.popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[this.popupPageName];
      this.modal.ismodalOpened();
      this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxlModal', centered: true , backdrop : 'static'});
      this.modal.isModalClosed();
      this.ngbActiveModal.close()

  }


}




import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject,timer , throwError } from 'rxjs';
import { scan, takeWhile } from 'rxjs/operators';
const URL = '/api/v1/middleware/signup/'
import { map, catchError } from 'rxjs/operators';
import * as axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class SignupGroupService {
  
  //InsuredRegistration: string = "https://kivosuat-gw.eurolife.gr/EurolifeMediator/Kivos/InsuredRegistration/";

  storedMail: string;

  storedRegistrationCode: string;
  storedKivosCode: string;
  storedGender: number;
  storedName: string;
  storedSurname: string;
  storedFathername: string;
  storedBirthdate: Date;
  storedVatNo: string;
  storedIbanNo: string;

  storedMobile: number;
  storedLandline: number;

  otp: string;
  
  storedPassword: string;

  storedConsentMarketingCode: string;
  storedConsentMarketingThirdPartyCode: string;

  stageProtection: number;
  
  storedInterval:number | Observable<number>;
  storedEmailCode: string;
  
  storedCompanyName: string;
  storedContractNo: string;
  storedOriginCustId: string;


  ///Test
  // private isLoadingSubj = new BehaviorSubject<any>({
  //   Success : true
  // });
  // isLoading$ = this.isLoadingSubj.asObservable();



  public stepChange: Subject<number> = new BehaviorSubject<number>(0);
  stepChange$=this.stepChange.asObservable()



  constructor(private http: HttpClient)
   {
  

  }


  headerOptions = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  );

  setStageProtection(stage: number) {
    this.stageProtection = stage;
    this.stepChange.next(stage);
  }




  //Set Values storedOriginCustId
  setStoredOriginCustId(originCustId: string) {
    this.storedOriginCustId = originCustId;
  }
  setStoredContractNo(contractNo: string) {
    this.storedContractNo = contractNo;
  }
  setStoredCompanyName(companyName: string) {
    this.storedCompanyName = companyName;
  }
  setStoredMail(mail: string) {
    this.storedMail = mail;
  }
  setstoredMobile(mobile: number) {
    this.storedMobile = mobile;
  }
  setstoredPassword(mail: string) {
    this.storedPassword = mail;
  }
  setStoredVatNo(vat: string) {
    this.storedVatNo = vat;
  }
  setStoredKivosCode(kivosCode: string) {
    this.storedKivosCode = kivosCode;
  }
  setStoredRegistrationCode(registrationCode: string) {
    this.storedRegistrationCode = registrationCode;
  }
  setStoredGender(gender: number) {
    this.storedGender = gender;
  }
  setStoredName(name: string) {
    this.storedName = name;
  }
  setStoredSurname(surname: string) {
    this.storedSurname = surname;
  }
  setStoredFathername(fatherName: string) {
    this.storedFathername = fatherName;
  }

  setStoredBirthdate(birthdate: Date){
    this.storedBirthdate = birthdate;
  }

  setStoredIbanNo(ibanNo: string){
    this.storedIbanNo = ibanNo;
  }

  setStoredLandline(landline: number) {
    this.storedLandline = landline;
  }

  setStoredConsentMarketingCode(consentMarketingCode: string) {
    this.storedConsentMarketingCode = consentMarketingCode;
  }

  setStoredConsentMarketingThirdPartyCode(consentMarketingThirdPartyCode: string) {
    this.storedConsentMarketingThirdPartyCode = consentMarketingThirdPartyCode;
  }

  setTimeForClock(time: number) : any {
    this.storedInterval= timer(0, 1000).pipe(
      scan(acc => --acc, time),
      takeWhile(x => x >= 0)
    )
  }

  emailExists = (email: string): Observable<any> => {
    return this.http.post(URL + "EmailExists",
      {
        "Email": email,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      });
    //return this.isLoading$;
  }

  InitSignUpGroup(kivosCode: string, email: string, companyName: string): Observable<any> {
    return this.http.post(URL + "InitSignUpGroup",
      {
        "KivosCode": kivosCode,
        "Email": email,
        "CompanyName": companyName,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      });
  }

  verifyMobile(mobile: string, email: string, registrationCode: string): Observable<any> {
    return this.http.post(URL + "VerifyMobile",
      {
        "Mobile": mobile,
        "Email": email,
        "RegistrationCode": registrationCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
  }

  resendSMS(mobile: string, email: string, registrationCode: string): Observable<any> {
    return this.http.post(URL + "ReSendSMS",
      {
        "Mobile": mobile,
        "Email": email,
        "RegistrationCode": registrationCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })

  }

  verifySMS(smsCode: number, email: string, registrationCode: string): Observable<any> {
    return this.http.post(URL + "VerifySMS",
      {
        "SMSCode": smsCode,
        "Email": email,
        "RegistrationCode": registrationCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
      //return this.isLoading$;
  }

  verifyEmail(emailCode: string): Observable<any> {
    return this.http.post(URL + "VerifyEmail",
      {
        "EmailCode": emailCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
    //return this.isLoading$;
  }

  //insured service
  insuredUser(groupRegCode:string, gender: number, firstname: string, lastname: string, fathername: string, birthdate: Date, tin: string, 
    iban: string, email:string, mobile:number, landline:number, consentMarketingCode: string, consentMarketingThirdPartyCode: string): Observable<any> {
    return this.http.post(URL + "Insured",
      { 
        "registrationCode": groupRegCode,
        "gender": gender,
        "firstname": firstname,
        "lastname": lastname,
        "fathername": fathername,
        "birthdate": birthdate,
        "tin": tin,
        "iban": iban,
        "email": email,
        "mobile" :mobile,
        "landline":landline,
        "consentMarketingCode": consentMarketingCode,
        "consentMarketingThirdPartyCode": consentMarketingThirdPartyCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }

      })
    //return this.isLoading$;
  }

  createUser(email: string, password: string, tin: string): Observable<any> {
    return this.http.post(URL + "CreateUser",
      {
        "Email": email,
        "Password": password,
        "TaxId": tin,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }

      })

  }

  // PolicyRegistration service
   getGroupRegCode (groupRegCode: string):Observable<any> {
      return this.http.post(URL + "InsuredRegistration",
      {
        "RegistrationCode": groupRegCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
  }
  

  updateUserGroup(registrationCode: string, taxId: string, lastname:string, firstname: string, birthDate: Date, 
    gender: number,contractNo: string, origin_CustId: string ): Observable<any>{
      return this.http.post(URL + "UpdateUserGroup",
      {
        "RegistrationCode": registrationCode,
        "TaxId": taxId,
        "LastName": lastname,
        "FirstName": firstname,
        "BirthDate": birthDate,
        "Sex": gender,
        "ContractNo": contractNo,
        "Origin_CustId": origin_CustId,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
  }
  

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject,timer } from 'rxjs';
import { scan, takeWhile } from 'rxjs/operators';
const URL = '/api/v1/middleware/signup/'

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  


  storedMail: string;
  storedMobile: number;
  storedPassword: string;
  storedVatNo: number;
  storedRegCode: string;
  storedInterval:number | Observable<number>;
  storedEmailCode: string;
  stageProtection: number = 1;

  otp: string;


  ///Test
  private isLoadingSubj = new BehaviorSubject<any>({
    Success : true
  });
  isLoading$ = this.isLoadingSubj.asObservable();



  stepperState: any = {
    step: 0,    //steps 0-1-2 states active-inactive-done
    stepsState: [
      { state: 'active', title: 'Κινητό τηλέφωνο' },
      { state: 'inactive', title: 'Επιβεβαίωση Κινητού' },
      { state: 'inactive', title: 'Προσωπικός Κωδικός' }
    ]
  };

  stepperChange: Subject<boolean> = new Subject<boolean>();
  // otpChange:  Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
    this.stepperChange.subscribe((value) => {
      this.stepperState = value;
    });


    // this.otpChange.subscribe((value) => {
    //   this.otp = value;
    // });

  }


  headerOptions = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  );

  setStageProtection(stage: number) {
    this.stageProtection = stage;
  }

  setStepperState(step: number, state: string) {
    this.stepperState.step = step;
    this.stepperState.stepsState[step].state = state;
    this.stepperChange.next(this.stepperState);
  }

  // setOtp(otp: string){
  //   this.otp = otp;
  //   this.otpChange.next(this.otp)
  // }

  setStoredMail(mail: string) {
    this.storedMail = mail;
  }
  setstoredMobile(mobile: number) {
    this.storedMobile = mobile;
  }
  setstoredPassword(mail: string) {
    this.storedPassword = mail;
  }
  setStoredVatNo(vat: number) {
    this.storedVatNo = vat;
  }
  setstoredRegCode(regCode: string) {
    this.storedRegCode = regCode;
  }

  setstoredEmailCode(emailCode: string) {
    this.storedEmailCode = emailCode;
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
    // return this.isLoading$;
  }

  initSignUp(regCode: string, email: string): Observable<any> {
    return this.http.post(URL + "InitSignUp",
      {
        "RegistrationCode": regCode,
        "Email": email,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      });
  }

  verifyMobile(mobile: string, email: string, regCode: string): Observable<any> {
    return this.http.post(URL + "VerifyMobile",
      {
        "Mobile": mobile,
        "Email": email,
        "RegistrationCode": regCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
  }

  resendSMS(mobile: string, email: string, regCode: string): Observable<any> {
    return this.http.post(URL + "ReSendSMS",
      {
        "Mobile": mobile,
        "Email": email,
        "RegistrationCode": regCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
  }

  verifySMS(smsCode: number, email: string, regCode: string): Observable<any> {
    return this.http.post(URL + "VerifySMS",
      {
        "SMSCode": smsCode,
        "Email": email,
        "RegistrationCode": regCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })

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
  }

  createUser(email: string, password: string, taxID: string): Observable<any> {
    return this.http.post(URL + "CreateUser",
      {
        "Email": email,
        "Password": password,
        "TaxId": taxID,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }

      })
  }

  getRegCode(taxID: string, birthDate: string): Observable<any> {
    return this.http.post(URL + "GetRegistrationCode",
      {
        "TaxId": taxID,
        "BirthDate": birthDate,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })

  }

  IsValidRegCode(regCode: string): Observable<any> {
    return this.http.post(URL + "IsValidRegistrationCode",
      {
        "RegistrationCode": regCode,
        "Header": {
          "ServicesVersion": "string",
          "CultureName": "string"
        }
      })
  }  

}

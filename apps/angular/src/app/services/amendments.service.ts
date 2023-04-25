import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
const URL = "/api/v1/middleware/amendments/otp/";

@Injectable({
  providedIn: "root"
})
export class AmendmentsService {

  constructor(private http: HttpClient) {}

  headerOptions = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });

  // ******TEST PURPOSE
//   private isLoadingSubj = new BehaviorSubject<any>({
//     Success : true
//   });
//  isLoading$ = this.isLoadingSubj.asObservable(); //

  sendOTP(
    email: string
  ): Observable<any> {
    return this.http.post(URL + "SendOTP", {
      Email: email,
      Header: {
        ServicesVersion: "1",
        CultureName: "GR",
        TimeDiff: null
      }
    });
    //return this.isLoading$;
  }

  VerifyOTP( email: string, otpCode: string): Observable<any> {
    return this.http.post(URL + "VerifyOTP", {
      Email: email,
      OTPCode: otpCode,
      Header: {
        ServicesVersion: "1",
        CultureName: "GR"
      }
    });
    //return this.isLoading$;
  }
}

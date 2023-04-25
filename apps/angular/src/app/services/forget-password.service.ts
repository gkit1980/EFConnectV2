import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
const URL = '/api/v1/middleware/forgotPassword/'


@Injectable({
    providedIn: 'root'
})
export class ForgetPasswordService {


    constructor(private http: HttpClient) { }


    headerOptions = new HttpHeaders(
        {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    );

    forgetPassword(name: string): Observable<any> {
        return this.http.post(URL + "ForgetPassword",
            {
                "UserName": name,
                "Header": {
                    "ServicesVersion": "string",
                    "CultureName": "string"
                }
            })
    }

    verifyForgetPassword(verifyPasswordCode: string, newPassword: string): Observable<any> {
        return this.http.post(URL + "VerifyForgetPassword",
            {
                "VerifyPasswordCode": verifyPasswordCode,
                "NewPassword": newPassword,
                "Header": {
                    "ServicesVersion": "string",
                    "CultureName": "string"
                }
            })
    }

}

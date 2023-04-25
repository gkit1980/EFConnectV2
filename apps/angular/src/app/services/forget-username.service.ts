import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
const URL = '/api/v1/middleware/forgotUsername/'

@Injectable({
    providedIn: 'root'
})
export class ForgetUsernameService {


    constructor(private http: HttpClient) { }


    headerOptions = new HttpHeaders(
        {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    );

    getUserName(taxID: string, birthDate: string): Observable<any> {
        return this.http.post(URL + "GetUserName",
            {
                "TaxId": taxID,
                "BirthDate": birthDate,
                "Header": {
                    "ServicesVersion": "string",
                    "CultureName": "string"
                }
            })
    }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
const URL = '/api/v1/middleware/recaptchaservice/recaptcha'

@Injectable()
export class RecapchaService {

  constructor(private http: HttpClient) { }

  recapchaValidation(token: string): Observable<any> {

    return this.http.post(URL,{
      token : token,
      secret : '6Lfom6kUAAAAAPEF63u1crMB1PqfEpb1v4bxNHEB'
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const URL = '/api/v1/middleware/errorlogger/'

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {

constructor(private http: HttpClient) {

}

sendErrorLog = (message: string, location: string, time: string): Observable<any> => {
    return this.http.post(URL + "writelog",
      {
        "message": message,
        "location": location,
        "time": time
      });
  }

}
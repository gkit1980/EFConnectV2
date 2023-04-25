import { Injectable } from '@angular/core';
import * as jwt_token from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class DecodeJWTService {

  decodedToken: any

  constructor() { }

  decodeToken(token: any): any {
    this.decodedToken = jwt_token(token);
  }
}

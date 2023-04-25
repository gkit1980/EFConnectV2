import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
var CryptoJS = require("crypto-js");

interface Token {
  GeneratedToken: string;
  GeneratedPayload: any;
}

interface Update {
  update: boolean;
}



@Injectable({ providedIn: 'root' })
export class PassManagementService {

  private OAUTH2_URL = '/api/v1/middleware/oauth2/Oauth2GoogleAccess';
  private APPLE_CREATE_URL = '/api/v1/middleware/apple/CreateApplePass';
  private APPLE_READ_URL = '/api/v1/middleware/apple/ReadApplePass';
  private GOOGLE_UPDATE_URL = '/api/v1/middleware/google/GooglePassUpdate';


  constructor(private http: HttpClient) { }

  createApplePass(
    ContractId: string,
    ProductDescription: string,
    Branch: string,
    insuredName: string,
    ExpirationDate: string,
    NextPaymentDate: string,
    paymentFrequencyToString: string,
    Status: string,
    passStatus: string,
    PaymentType: string,
    dangerAdrress: any,
    VehicleLicensePlate: string,
    ContractKey: string,
    ContractIDType: string,
    participants: any,
    GoldenRecordId: string,
  ): Observable<any> {
    // var ContractIdEncr = CryptoJS.AES.encrypt(ContractId, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var ProductDescriptionEncr = CryptoJS.AES.encrypt(ProductDescription, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var BranchEncr = CryptoJS.AES.encrypt(Branch, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var insuredNameEncr = CryptoJS.AES.encrypt(insuredName, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var ExpirationDateEncr = CryptoJS.AES.encrypt(ExpirationDate, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var NextPaymentDateEncr = CryptoJS.AES.encrypt(NextPaymentDate, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var paymentFrequencyToStringEncr = CryptoJS.AES.encrypt(paymentFrequencyToString, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var StatusEncr = CryptoJS.AES.encrypt(Status, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var passStatusEncr = CryptoJS.AES.encrypt(passStatus, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var PaymentTypeEncr = CryptoJS.AES.encrypt(PaymentType, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var dangerAdrressEncr = CryptoJS.AES.encrypt(dangerAdrress, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var VehicleLicensePlateEncr = CryptoJS.AES.encrypt(VehicleLicensePlate, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var ContractKeyEncr = CryptoJS.AES.encrypt(ContractKey, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var ContractIDTypeEncr = CryptoJS.AES.encrypt(ContractIDType, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    // var participantsEncr = CryptoJS.AES.encrypt(participants, 'eurolifeConnect_decrypt_passQWEAZXCDSFFGHYFEESW').toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
    var parameters = {
      ContractId,
      ProductDescription,
      Branch,
      insuredName,
      ExpirationDate,
      NextPaymentDate,
      paymentFrequencyToString,
      Status,
      passStatus,
      PaymentType,
      dangerAdrress,
      VehicleLicensePlate,
      ContractKey,
      ContractIDType,
      participants,
      GoldenRecordId
    };
    // var encryptedParameters = CryptoJS.AES.encrypt(JSON.stringify(parameters), this.decryptionCode).toString().replace(/[+]/gm, 'xMl3Jk').replace(/[\/]/gm, 'Por21Ld').replace(/[=]/gm, 'Ml32');
    var encryptedParameters = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(parameters), environment.decryption_code).toString());
    // const params = new HttpParams()
    //   .set('ContractId', ContractId)
    //   .set('ProductDescription', ProductDescription)
    //   .set('Branch', Branch)
    //   .set('insuredName', insuredName)
    //   .set('ExpirationDate', ExpirationDate)
    //   .set('NextPaymentDate', NextPaymentDate)
    //   .set('paymentFrequencyToString', paymentFrequencyToString)
    //   .set('Status', Status)
    //   .set('passStatus', passStatus)
    //   .set('PaymentType', PaymentType)
    //   .set('dangerAdrress', dangerAdrress)
    //   .set('VehicleLicensePlate', VehicleLicensePlate)
    //   .set('ContractKey', ContractKey)
    //   .set("ContractIDType", ContractIDType)
    //   .set("participants", participants);
    const params = new HttpParams()
      .set('parameter', encryptedParameters);
    const headers = new HttpHeaders()
      // .set('content-type', 'application/vnd.apple.pkpass')
      .set('Access-Control-Allow-Origin', '*');
    const options = { params: params, headers: headers, responseType: 'blob' as 'blob' };
    return this.http.get(this.APPLE_CREATE_URL, options);
    // Change from POST to GET request
    // return this.http.post<Token>(
    //   this.APPLE_CREATE_URL,
    //   {
    //     ContractId,
    //     ProductDescription,
    //     Branch,
    //     insuredName,
    //     ExpirationDate,
    //     NextPaymentDate,
    //     paymentFrequencyToString,
    //     Status,
    //     passStatus,
    //     PaymentType,
    //     dangerAdrress,
    //     VehicleLicensePlate,
    //     ContractKey

    //   },
    //   { headers }
    // );
  }

  // readApplePass():Observable<Token> 
  // {
  //   const headers = new HttpHeaders()
  //   .set('content-type', 'application/json')
  //   .set('Access-Control-Allow-Origin', '*');

  // return this.http.post<Token>(
  //   this.APPLE_READ_URL,
  //   {
  //   },
  //   { headers }
  // );
  // }

  oauth2GoogleAccess(
    encryptedParameters:any,
    // ContractId: string,
    // ProductDescription: string,
    // Branch: string,
    // insuredName: string,
    // ExpirationDate: string,
    // NextPaymentDate: string,
    // paymentFrequencyToString: string,
    // Status: string,
    // passStatus: any,
    // PaymentType: string,
    // dangerAdrress: any,
    // VehicleLicensePlate: string,
    // ContractKey: string,
    // ContractIDType: string,
    // participants: any,
    // GoldenRecordId: string
    // policyNumber: string,
    // insuredId: string,
    // dependentMemberId: string,
    // claimInsuredName: string,
    // coverages: string,
    // personalContracts:string,
    // email:string,
    // customerCode: string
  ): Observable<Token> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<Token>(
      this.OAUTH2_URL,
      {
        encryptedParameters
        // ContractId,
        // ProductDescription,
        // Branch,
        // insuredName,
        // ExpirationDate,
        // NextPaymentDate,
        // paymentFrequencyToString,
        // Status,
        // passStatus,
        // PaymentType,
        // dangerAdrress,
        // VehicleLicensePlate,
        // ContractKey,
        // ContractIDType,
        // participants,
        // GoldenRecordId
        // insuredId,
        // dependentMemberId,
        // claimInsuredName,
        // coverages,
        // personalContracts,
        // email,
        // customerCode
      },
      { headers }
    );
  }


  googlePassUpdate(
    encryptedPayload:any,
  ): Observable<Update> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<Update>(
      this.GOOGLE_UPDATE_URL,
      {
        encryptedPayload
      },
      { headers }
    );
  }




}


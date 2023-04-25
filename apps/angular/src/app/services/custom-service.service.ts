import { Injectable } from '@angular/core';

import { HttpClient ,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomServiceService {

   email:string;

  constructor(private http: HttpClient) { }

  headerOptions = new HttpHeaders(
    {'Content-Type': 'application/json',
    'authorization': 'fsdfsdfsd',
    }
    );

    restCall_GetCustomerContracts() {
      return this.http.post('https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerData/GetCustomerContracts',{},{headers: this.headerOptions})
    }

    restCall_GetReceiptsByContractKey(contractKey:any) {
      return this.http.post('https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerData/GetReceiptsByContractKey',{"ContractKey": contractKey},{headers: this.headerOptions})
    }

    restCall_GetContractMotorDetails(contractID:any) {
      return  this.http.post('https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerData/GetContractMotorDetails',{"ContractID": contractID},{headers: this.headerOptions})
    }

    restCall_GetContractPropertyCoolgenDetails(contractID:any){
      return  this.http.post('https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerData/GetContractPropertyCoolgenDetails',{"ContractID": contractID},{headers: this.headerOptions})
    }

    restCall_GetContractIndividualDetails(contractID:any) {
      return  this.http.post('https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerData/GetContractIndividualDetails',{"ContractID": contractID},{headers: this.headerOptions})
    }
    restCall_GetUniquePaymentCode(contractKey:any) {
      return  this.http.post('https://lifeuatna.eurolife.gr/CustomerDataProvider/api/CustomerData/GetUniquePaymentCode',{"ContractID": parseInt(contractKey),"CompanyID": 1},{headers: this.headerOptions})
    }

    sighinUser(email:any,password:any) {

      return this.http.post(`https://login.microsoftonline.com/eurob2c.onmicrosoft.com/oauth2/v2.0/token?p=B2C_1_resource-owner&grant_type=password&client_id=668f01f7-aa44-41b0-9d99-4d7517c44296&username=${email}&password=${password}&scope=https://eurob2c.onmicrosoft.com/tasks/read https://eurob2c.onmicrosoft.com/tasks/write offline_access`,{});
    }

  }

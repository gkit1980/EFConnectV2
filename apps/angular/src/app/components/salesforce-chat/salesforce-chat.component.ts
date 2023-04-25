import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import * as jwt_token from 'jwt-decode';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { environment } from "./../../../environments/environment";

@Component({
  selector: 'app-salesforce-chat',
  template: `<iframe id="salesforce-chat-cmp" [src]="srcsafe"
  style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;border: 0;"
  >
  </iframe>`,
})
export class SalesforceChatComponent implements OnInit {
  private jwtData: any;
  private email = '';
  private lastName = '';
  private firstName = '';
  private subject = '';
  private goldenRecord: number;
  src: string;
  srcsafe:SafeResourceUrl

 //http://localhost:4201?firstname=George&lastname=Kitsos&email=gkit1980@yahoo.com&gid=1011010123"
 //"http://click-to-chat:80

  constructor(private localStorage: LocalStorageService,public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
  this.getTokenData();
  }

  private getTokenData(): void {
    const token = this.localStorage.getDataFromLocalStorage('token');
    if (token) {
      this.jwtData = jwt_token(token);
      [this.lastName = '', this.firstName = ''] = this.jwtData.name.split(' ');
      this.email = this.jwtData.emails[0];
      this.goldenRecord = this.jwtData.extension_CustomerCode as number;
      this.subject = 'Eurolife_Connect';

      var fName = this.firstName;
      var lName = this.lastName;
      var email = this.email;
      var goldenRecordId = this.goldenRecord;
      var parameters = {
        fName,
        lName,
        email,
        goldenRecordId
      };
      let encryptedParameters =  encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(
        parameters),  environment.decryption_code).toString());
      //set
      //test http://localhost:4201
      this.src="https://ctc.eurolife.gr?encryptedParameters="+encryptedParameters; //"https://ctc-uat.eurolife.gr?firstname="+this.firstName+"&lastname="+this.lastName+"&email="+this.email+"&gid="+this.goldenRecord;
      this.srcsafe=this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
    }
  }



}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SitecoreService {

  constructor(
    private http: HttpClient) {

  }

  getFaq() {
    return this.http.get(`${environment.sitecore_baseurl}('/sitecore/content/Api/CustomerArea/FAQList')/Children?sc_apikey=${environment.sitecore_apikey}&$expand=Children($expand=Children,%20FieldValues),FieldValues&language=el-GR`);
  }

  getGlossary() {
    return this.http.get(`${environment.sitecore_baseurl}('/sitecore/content/Api/CustomerArea/GlossaryList')/Children?sc_apikey=5B2903B2882A41B9BD91C9739A027F6E&$expand=Children($expand=Children,%20FieldValues),FieldValues&language=el-GR`);
  }

  getIconsList(iconFamily: string) {
    return this.http.get(`${environment.sitecore_baseurl}('/sitecore/content/Api/CustomerArea/Assets/${iconFamily}')?sc_apikey=${environment.sitecore_apikey}&$expand=FieldValues&language=el-GR`);
  }

  // getIcon(iconID: string ){
  //   return this.http.get(`https://scp.eurolife.gr/~/media/${iconID}.ashx`);
  // }

}
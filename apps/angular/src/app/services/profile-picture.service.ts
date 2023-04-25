import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
const URL = "/api/v1/middleware/profilePicture/";
import * as CryptoJS from "crypto-js";


@Injectable({
  providedIn: "root"
})
export class ProfilePictureService {
  private emitChangePhoto = new Subject<any>();
  changeEmitted = this.emitChangePhoto.asObservable();
  isProfilePicture: boolean;
  src: any;
  constructor(private http: HttpClient) {}

  uploadPhoto(email: string, photo: string): Observable<any> {
    let encryptedEmail = CryptoJS.AES.encrypt(email, "ice_email");
    let encryptedPhoto = CryptoJS.AES.encrypt(photo, "ice_photo");
    let postData = {
      data: { Email: `${encryptedEmail}`, Photo: `${encryptedPhoto}` }
    };

    return this.http.post(URL + "UploadPhoto", {
      Header: {
        ServicesVersion: "1",
        CultureName: "GR"
      },
      postData
    });
  }

  getPhoto(email: string) {
    let encryptedEmail = CryptoJS.AES.encrypt(email, "ice_email");

    let postData = { data: { Email: `${encryptedEmail}` } };

    return this.http.post(URL + "GetPhoto", {
      Header: {
        ServicesVersion: "1",
        CultureName: "GR"
      },
      postData
    });
  }

  setPhoto(url: any) {
    this.emitChangePhoto.next(url);
  }

  storeImage(isProfilePicture: boolean, src: any) {
    this.isProfilePicture = isProfilePicture;
    this.src = src;
  }

  restoreImage() {
    return { isProfilePicture: this.isProfilePicture, src: this.src };
  }
}

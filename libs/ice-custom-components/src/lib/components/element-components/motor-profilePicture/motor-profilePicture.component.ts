import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit } from '@angular/core';
import { DecodeJWTService } from '@insis-portal/services/decode-jwt.service';
import { MatDialog } from '@angular/material/dialog';

import { MotorPopUpChangeProfilePicture } from '../../section-components/motor-popup-changeProfilePicure/motor-popup-changeProfilePicure.component';
import { ProfilePictureService } from '@insis-portal/services/profile-picture.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { SpinnerService } from "@insis-portal/services/spinner.service";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from '@insis-portal/services/modal.service';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'motor-profilePicture',
  templateUrl: 'motor-profilePicture.component.html',
  styleUrls: ['motor-profilePicture.component.scss']
})
export class MotorProfilePicture implements OnInit {

  name = 'elements.motor.profilePicture.name.label';
  edit = 'elements.motor.profilePicture.edit.label';
  flag: boolean = false;
  profilePicture: string;
  showAvatar: boolean = true;
  showProfilePicture: boolean
  fullName: any


  constructor(public dialog: MatDialog, private profilePictureService: ProfilePictureService,
    private localStorage: LocalStorageService, private decodeJWT: DecodeJWTService, private SpinnerService: SpinnerService,
    private ngbModal: NgbModal, private modalService: ModalService) { }

  ngOnInit() {

    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    this.fullName = this.decodeJWT.decodedToken.name;

    this.profilePictureService.getPhoto(this.localStorage.getDataFromLocalStorage("email"))
      .subscribe((response: any) => {
        if (response.Photo != null) {
          this.showProfilePicture = true;
          this.showAvatar = false;
          this.profilePicture = 'data:image/jpg;base64,' + response.Photo;


        } else {
          this.showProfilePicture = false;
          this.showAvatar = true;


        }

      })

    this.profilePictureService.changeEmitted.subscribe((data: any) => {
      this.profilePicture = 'data:image/jpg;base64,' + data
      if (this.profilePicture == " ") {
        this.showAvatar = true;
        this.showProfilePicture = false;


      } else {
        this.showProfilePicture = true;
        this.showAvatar = false;


      }
    })

  }


  openDialog(): void {
    // const dialogRef = this.dialog.open(MotorPopUpChangeProfilePicture, {
    //   width: '700px',
    //   height: '946px'
    // }).afterClosed().subscribe(image => {
    //   this.SpinnerService.visible.next(false);

    // });
    let modalRef: NgbModalRef;
    this.modalService.ismodalOpened();
    modalRef = this.ngbModal.open(MotorPopUpChangeProfilePicture, { windowClass: 'xlModal' });
    modalRef.result.then(() => { console.log('When user closes'); }, () => {
      this.modalService.isModalClosed();

    })
  }

  // openDialog() {
  //   let modalRef: NgbModalRef;
  //   this.modalService.ismodalOpened();
  //   modalRef = this.ngbModal.open(TermsConditionsComponent, { windowClass: 'xlModal' });
  //   modalRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
  // }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: #ef3340 !important');
    svg.setAttribute('width', '96');
    svg.setAttribute('height', '116.1');

    return svg;
  }

  getIcon(iconID: string): string {

    let icon = environment.sitecore_media + iconID + '.ashx';


    return icon;

  }

  getProfilePicture() {



    return this.profilePicture;
  }



}



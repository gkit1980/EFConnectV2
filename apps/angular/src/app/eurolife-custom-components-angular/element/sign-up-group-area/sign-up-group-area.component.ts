import { Component, NgZone, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-sign-up-group-area',
  templateUrl: './sign-up-group-area.component.html',
  styleUrls: ['./sign-up-group-area.component.scss']
})
export class SignUpGroupAreaComponent extends ElementComponentImplementation implements OnInit{

  NgdialogRef: NgbModalRef;
  constructor(
    public modalService: ModalService,
    public ngbModal: NgbModal
  ) {
    super();
    
  }

  ngOnInit() {
  }

  openDialog(): void {
    this.modalService.ismodalOpened();
    const popupPageName = 'signUpGroupPopUp';
    if (!popupPageName || !this.context.iceModel.pages[popupPageName])
      return console.error(
        `Page ${popupPageName} does not exists, dialog will not be displayed`
      );
    PopUpPageComponent.pageToDisplay =
      this.context.iceModel.pages[popupPageName];

    this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, {
      windowClass: 'customerModal',
      centered: true,
      backdrop : 'static',
      keyboard : false
    });
    this.NgdialogRef.result.then(
      () => {
        console.log('When user closes');
      },
      () => {
        this.modalService.isModalClosed();
      }
    );
	}

}
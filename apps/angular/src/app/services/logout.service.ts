import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "./modal.service";
import { IceContextService } from "@impeo/ng-ice";
import { SessionTimeoutComponent } from "../eurolife-custom-components-angular/page/session-timeout/session-timeout.component";
import { LogoutComponent } from "../eurolife-custom-components-angular/page/logout/logout.component";

import { LogoutSecurityComponent } from "../eurolife-custom-components-angular/page/logout-security/logout-security.component";

@Injectable({
  providedIn: "root"
})
export class LogoutService {
    dialogRef: NgbModalRef;
    constructor(private ngbModal: NgbModal,
        private modalService: ModalService,
        private contextService: IceContextService) { }

    logout(isSessionTimeout: boolean): void {
        this.modalService.ismodalOpened();
        let modalRef: NgbModalRef;
        if (isSessionTimeout) {
            modalRef = this.ngbModal.open(SessionTimeoutComponent, { windowClass: "xlModal-icon", centered: true, backdropClass: "backgroundClass", backdrop: 'static' });
        } else {

            modalRef = this.ngbModal.open(LogoutComponent, { windowClass: "xlModal-icon", centered: true, backdropClass: "backgroundClass" });
        }
        modalRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
    }

    logoutSec(): void {
        this.modalService.ismodalOpened();
        let modalRef: NgbModalRef;
        modalRef = this.ngbModal.open(LogoutSecurityComponent, { windowClass: "xlModal-icon", centered: true, backdropClass: "backgroundClass", backdrop: 'static' });
        modalRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })
    }

    closeDialog() {
        this.modalService.isModalClosed();
        this.ngbModal.dismissAll();

    }

}


import { Component, Inject } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';



@Component({
	selector: 'app-motor-change-Password',
	templateUrl: './motor-changePassword.component.html',
	styleUrls: ['./motor-changePassword.component.scss']
})
export class MotorChangePassword extends ElementComponentImplementation {


	motorPassword = 'elements.motor.motorPassword.text.label';
	dialogRef: NgbModalRef;

	constructor(public ngbModal: NgbModal, public modalService: ModalService) {
		super();
	}

	ngOnInit() {

		// private ngbActiveModal: NgbActiveModal
		this.context.$actionEnded.subscribe((actionName: string) => {
			if (actionName.includes('actionChangePassword')) {
				// if (this.context.iceModel.elements["changePasswordResult"]) {
				// 	this.ngbModal.dismissAll();
				// }
			}
		})

	}

	openDialog(): void {

		const popupPageName = this.element.recipe["dialogpage"];
		if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
		PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
		this.modalService.ismodalOpened();
		this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xlModal' });
		this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })

	}




}

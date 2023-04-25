
import { Component, Inject } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';



@Component({
	selector: 'app-motor-change-Email',
	templateUrl: './motor-changeEmail.component.html',
	styleUrls: ['./motor-changeEmail.component.scss']
})
export class MotorChangeEmail extends ElementComponentImplementation {

	dialogRef: NgbModalRef;

	motorEmail = 'elements.motor.motorEmail.text.label';
	constructor(public ngbModal: NgbModal, public modalService: ModalService) {
		super();
	}

	openDialog(): void {

		// const dialogRef = this.dialog.open(MotorPopUpchangeEmail, {
		// 	width: '800px',
		// 	data: {
		// 		page: this.element.recipe["dialogpage"],
		// 		iceContext: this.page.context
		// 	}
		// });
		const popupPageName = this.element.recipe["dialogpage"];
		if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
		PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
		this.modalService.ismodalOpened();
		this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xlModal' });
		this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })


	}




}

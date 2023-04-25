import { Component, Inject } from '@angular/core';
import { SectionComponentImplementation, ElementComponentImplementation } from '@impeo/ng-ice';
import { MotorPopUpchangeMobilePhone } from '../../section/motor-popup-changeMobilePhone/motor-popup-changeMobilePhone.component';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';
import { ModalService } from '../../../services/modal.service';



@Component({
	selector: 'app-motor-change-MobilePhone',
	templateUrl: './motor-changeMobilePhone.component.html',
	styleUrls: ['./motor-changeMobilePhone.component.scss']
})
export class MotorChangeMobilePhone extends ElementComponentImplementation {

	dialogRef: NgbModalRef;

	motorMobilePhone = 'elements.motor.motorMobilePhone.text.label';


	constructor(public ngbModal: NgbModal, public modalService: ModalService) {

		super();
	}

	openDialog(): void {

		const popupPageName = this.element.recipe["dialogpage"];
		if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
		PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
		this.modalService.ismodalOpened();
		this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xlModal' });
		this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })

		/* pairname to context sto dialog pou anoigei */
		// const dialogRef = this.dialog.open(MotorPopUpchangeMobilePhone, {
		// 	width: '700px',
		// 	data: {
		// 		page: this.element.recipe["dialogpage"],
		// 		iceContext: this.page.context
		// 	}
		// });

	}



}

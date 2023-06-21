
import { Component, Inject } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import {LifecycleEvent } from '@impeo/ice-core';
import { get } from 'lodash';




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
		this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

      const actionName = get(e, ['payload', 'action']);

			if (actionName.includes('actionChangePassword') && e.type==="ACTION_FINISHED") {

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

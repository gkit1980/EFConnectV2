
import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';


@Component({
	selector: 'app-pop-up',
	templateUrl: './pop-up.component.html',
	styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent extends SectionComponentImplementation {

	dialogRef: NgbModalRef;
	// dialogRef: MatDialogRef<MotorCustomTableComponent>;
	section: any;
	// text1 = 'elements.popup.text1.label';
	// text2 = 'elements.popup.text2.label';
	text3 = 'elements.popup.text3.label';
	text4 = 'elements.popup.text4.label';

	// constructor(public dialog: MatDialog, parent: IceSectionComponent) {
	// 	super(parent);
	// }
	constructor(public ngbModal: NgbModal, public modalService: ModalService, parent: IceSectionComponent) {
		super(parent);
	}

	openDialog(): void {

		// this.dialogRef = this.dialog.open(MotorCustomTableComponent, {
		// 	height: '700px',
		// 	width: '900px',
		// 	data: {
		// 		page: this.recipe["dialogpage"],
		// 		iceContext: this.page.context
		// 	}
		// });

		// const popupPageName = this.page.recipe["dialogpage"];
		const popupPageName = this.page.recipe.sections[4].dialogpage;
		if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
		PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
		this.modalService.ismodalOpened();
		this.dialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xlModal' });
		this.dialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })

	}

}

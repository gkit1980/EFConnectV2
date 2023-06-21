import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageComponentImplementation, NgIceContext, ElementComponentImplementation } from '@impeo/ng-ice';
import { IcePage } from "@impeo/ice-core";

export interface PopupPageData {
	page: string
	iceContext: NgIceContext
}

@Component({
	selector: 'motor-popup-changePassword',
	templateUrl: 'motor-popup-changePassword.component.html',
	styleUrls: ['./motor-popup-changePassword.component.scss']
})
export class MotorPopUpchangePassword extends PageComponentImplementation {

	changeSecurityCode = 'sections.motorChangePassword.changeSecurityCode.label';
	_page: string;
	constructor(public dialogRef: MatDialogRef<MotorPopUpchangePassword>, @Inject(MAT_DIALOG_DATA) public data: PopupPageData) {
		super();
		/* page initialitzion and the same time context initialization */
		this._page = data.page;
		this.page = data.iceContext.iceModel.pages[data.page];
	}



	onNoClick(): void {
		this.dialogRef.close();
	}


}

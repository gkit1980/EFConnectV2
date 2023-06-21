import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: 'motor-popup-changePhone',
	templateUrl: 'motor-popup-changePhone.component.html',
})
export class MotorPopUpchangePhone {

	changePhone1 = 'sections.motorPopUp.changePhone1.label';
	changePhone2 = 'sections.motorPopUp.changePhone2.label';
	changePhoneText = 'sections.motorPopUp.changePhoneText.label';

	constructor(
		public dialogRef: MatDialogRef<MotorPopUpchangePhone>) { }

	onNoClick(): void {
		this.dialogRef.close();
	}

}

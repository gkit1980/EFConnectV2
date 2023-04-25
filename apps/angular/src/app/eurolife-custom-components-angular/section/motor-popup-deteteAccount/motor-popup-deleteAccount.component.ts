import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";


@Component({
	selector: 'motor-popup-deleteAccount',
	templateUrl: 'motor-popup-deleteAccount.component.html',
})
export class MotorPopUpDeleteAccount {

	delete = 'pages.motorPopUpDelete.delete.label';
	weAreSorrytext = 'pages.motorPopUpDelete.weAreSorrytext.label';
	confirmText = 'pages.motorPopUpDelete.confirmText.label';
	motorPopUpDeletePasswordText = 'pages.motorPopUpDelete.motorPopUpDeletePasswordText.label';
	deletingAccountText = 'pages.motorPopUpDelete.deletingAccountText.label';
	deleteAccountText = 'pages.motorPopUpDelete.deleteAccountText.label';


	constructor(
		public dialogRef: MatDialogRef<MotorPopUpDeleteAccount>) { }

	onNoClick(): void {
		this.dialogRef.close();
	}

}


import { Component, Inject } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MotorPopUpDeleteAccount } from '../../section/motor-popup-deteteAccount/motor-popup-deleteAccount.component';



@Component({
	selector: 'app-motor-delete-account',
	templateUrl: './motor-deleteAccount.component.html',
	styleUrls: ['./motor-deleteAccount.component.scss']
})
export class MotorDeleteAccount {


	motorDeleteAccount = 'elements.motor.motorDeleteAccount.label';
	constructor(public dialog: MatDialog) { }

	openDialog(): void {
		const dialogRef = this.dialog.open(MotorPopUpDeleteAccount, {
			width: '800px',

		});

	}




}

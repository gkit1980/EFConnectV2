
import { Component, Inject } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MotorPopUpchangePhone } from '../../section-components/motor-popup-changePhone/motor-popup-changePhone.component';



@Component({
	selector: 'app-motor-change-Phone',
	templateUrl: './motor-changePhone.component.html',
	styleUrls: ['./motor-changePhone.component.scss']
})
export class MotorChangePhone {


	motorPhone = 'elements.motor.motorPhone.text.label';
	constructor(public dialog: MatDialog) { }

	openDialog(): void {

		const dialogRef = this.dialog.open(MotorPopUpchangePhone, {
			width: '800px',

		});



	}




}

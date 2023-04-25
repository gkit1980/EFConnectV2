import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageNavigationComponentImplementation, PageComponentImplementation, IcePrincipalService } from "@impeo/ng-ice";
import { MotorPopUpchangePassword } from "../motor-popup-changePassword/motor-popup-changePassword.component";
import { PopupPageData } from "../motor-custom-table/motor-custom-table.section.component";
import { IndexedValue } from "@impeo/ice-core";

@Component({
	selector: 'motor-popup-changeEmail',
	templateUrl: 'motor-popup-changeEmail.component.html',
})
export class MotorPopUpchangeEmail extends PageComponentImplementation {
	_page: string;
	showButton: boolean = false;

	textEmail = 'elements.customer.details.textEmail.label';
	okEmail = 'elements.customer.details.okEmail.label';

	constructor(public dialogRef: MatDialogRef<MotorPopUpchangePassword>, @Inject(MAT_DIALOG_DATA) public data: PopupPageData, private icePrincipalService: IcePrincipalService) {
		super();
		data.iceContext.iceModel.elements['customer.details.username'].setSimpleValue(this.icePrincipalService.principal.id);
		/* pairnoume to page pou simainei oti tautogxrona pairnoume kai to context apo to MotorChangePassword */
		this._page = data.page;
		this.page = data.iceContext.iceModel.pages[data.page];
	}


	ngAfterViewInit() {
		//check when we must appear the "The End" button
		this.context.iceModel.elements["customer.details.theEndEmailButtonValue"].$dataModelValueChange.subscribe(
			(value: IndexedValue) => {
				if (value.element.getValue().forIndex(null)) {
					//	this.context.iceModel.elements["customer.details.theEndEmailButtonValue"].setSimpleValue(false);
					this.showButton = true;
				}
				else {
					this.showButton = false;
				}
			}
		);
	}



	onNoClick(): void {


		this.context.iceModel.elements["customer.details.changeEmailSuccess"].setSimpleValue(false);
		this.context.iceModel.elements["customer.details.emailResendButtonFlag"].setSimpleValue(false);
		this.context.iceModel.elements["customer.details.verifyEmailBoolean"].setSimpleValue(false);
		this.dialogRef.close();

	}

}

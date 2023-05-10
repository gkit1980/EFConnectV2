import { Component, Inject, OnInit, AfterViewInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PageComponentImplementation, IcePrincipalService } from "@impeo/ng-ice";
import { IndexedValue,IceContext } from "@impeo/ice-core";


export interface PopupPageData {
	page: string
	iceContext: IceContext
}

@Component({
	selector: 'motor-popup-changeMobilePhone',
	templateUrl: 'motor-popup-changeMobilePhone.component.html',
})
export class MotorPopUpchangeMobilePhone extends PageComponentImplementation implements OnInit, AfterViewInit {

	changeMobilePhone = 'sections.motorChangeMobile.changeMobilePhone.label';
	_page: string;
	showButton: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<MotorPopUpchangeMobilePhone>, @Inject(MAT_DIALOG_DATA) public data: PopupPageData, private icePrincipalService: IcePrincipalService) {
		super();
		data.iceContext.iceModel.elements['customer.details.username'].setSimpleValue(this.icePrincipalService.principal.id);
		/* page initialitzion and the same time context initialization */
		this._page = data.page;
		this.page = data.iceContext.iceModel.pages[data.page];
	}

	ngAfterViewInit() {
		//check when we must appear the "The End" button
		this.context.iceModel.elements["customer.details.theEndMobileButtonValue"].$dataModelValueChange.subscribe(
			(value: IndexedValue) => {
				if (value.element.getValue().forIndex(null)) {
					this.context.iceModel.elements["customer.details.theEndMobileButtonValue"].setSimpleValue(false);
					this.showButton = true;
				}
				else {
					this.showButton = false;
				}

			}
		);
	}



	onNoClick(): void {



		this.context.iceModel.elements["customer.details.verifyMobileSuccess"].setSimpleValue(false);
		this.context.iceModel.elements["customer.details.mobilePhoneResendButtonFlag"].setSimpleValue(false);
		this.context.iceModel.elements["customer.details.VerifyMobilePhone"].setSimpleValue(false);
		this.dialogRef.close();

	}


}

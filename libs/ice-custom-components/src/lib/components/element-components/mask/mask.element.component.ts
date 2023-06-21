import { Component } from '@angular/core';
import { IceTextInputComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';


@Component({
	selector: 'app-mask-element',
	templateUrl: './mask.element.component.html',
	styleUrls: ['./mask.element.component.scss']
})
export class MaskComponent extends IceTextInputComponent {


	validateEmail(elementValue:string)
	{      
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		return emailPattern.test(elementValue); 
	}
	
	textAdjust(){
	if(this.validateEmail(this.value))
	this.onComponentValueChange();

     if(_.isString(this.value) && _.isEmpty(this.value))
	{	
		this.value=null;
		this.applyComponentValueToDataModel();
		let dta = this.context.iceModel.dts["clicktochat.btnsubmit.view-mode"];
		if (dta)
		{
		dta.evaluateSync();
		}
	}
}

	onBlur(event:any)
	{
	if (_.isString(this.value) && _.isEmpty(this.value))
	{
		this.value = null;
		this.onComponentValueChange();
	}

	 if(this.validateEmail(this.value))
	 this.onComponentValueChange();
	}
	

}

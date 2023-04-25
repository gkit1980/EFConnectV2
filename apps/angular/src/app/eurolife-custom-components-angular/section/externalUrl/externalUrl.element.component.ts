import { Component } from '@angular/core';
import { GridViewComponent } from '@impeo/ng-ice';

@Component({
	selector: 'app-externalUrl-element',
	templateUrl: './externalUrl.element.component.html',
	styleUrls: ['./externalUrl.element.component.scss']
})
export class ExternalUrlComponent extends GridViewComponent {

	linkLabel = 'portal.privacy.notice.link.label';

	public ExternalUrlComponent(col: any) {
		super.getGridColumnClass(col);
	}

	getValueFromElement(elementName: string): any {
		let element = this.section.elements.find(pageElement => pageElement.name == elementName);
		if (element == null) return "";

		return element.element.recipe.defaultValue.StaticValueRule.value;
	}
	// zeroDigit: string = "0";
	// elementName: string = "policy.insured.object.motor.owner.TaxIdentificationNumber";

	// addZeroDigit(elementValue: string): any {
	// 	elementValue = elementValue;
	// if(elementValue.length > 0 && elementValue.length == 8)
	// {
	// 	elementValue = this.zeroDigit + elementValue;
	// 	this.setValueToElement(this.elementName, elementValue);
	// } 	
	// }

	// setValueToElement(elementName: string, elementValue: any) {
	// 	let element = this.section.elements.find(pageElement => pageElement.name == elementName);
	// 	if (element == null) return;

	// 	element.element.setSimpleValue(elementValue);
	// }
}

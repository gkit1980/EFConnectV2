import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';

import { IndexedValue } from '@impeo/ice-core';

// import the WindowRef,user,threads,message provider
import { WindowRefService } from '@insis-portal/services/windowref.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';


@Component({
	templateUrl: './button-to-dialog-component.html',
	styleUrls: ['./button-to-dialog-component.scss']
})
export class ButtonToDialogComponent extends ElementComponentImplementation {

	dialogRef: NgbModalRef;
	section: any;
	componentRef: any;
	numberConstructor: number = 0;


	@ViewChild('messagecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;


	constructor(private resolver: ComponentFactoryResolver, public modalService: NgbModal, private winRef: WindowRefService) {
		super();
	}

	ngOnInit() {
		//1.When Click to chat is being connected....
		this.context.iceModel.elements['clicktochat.connected'].$dataModelValueChange
			.subscribe((value: IndexedValue) => {
				if (!value.element.getValue().forIndex(null)) {
					this.closeDialog();
				}
			})
	}

	onClick() {
		this.context.iceModel.elements['navigator.platform'].setSimpleValue('Mozilla');
		this.context.iceModel.elements['navigator.appname'].setSimpleValue('Netscape');
		this.context.iceModel.elements['navigator.useragent'].setSimpleValue('5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36');

		this.openDialog();
	}

	openDialog(): void {
		const popupPageName = this.element.recipe['dialogpage'];
		if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
		PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
		this.dialogRef = this.modalService.open(PopUpPageComponent, { windowClass: 'chat-popup' });


		// this.dialogRef = this.dialog.open(MotorCustomTableComponent, {
		// 	position: {
		// 		bottom: '0px',
		// 		right: '55px'
		// 	},
		// 	data: {
		// 		page: this.element.recipe['dialogpage'],
		// 		iceContext: this.page.context
		// 	}
		// });


		// this.dialogRef.afterClosed().subscribe(result => {
		this.dialogRef.result.then(result => {
			let action = this.context.iceModel.actions[this.element.recipe['dialogcloseaction']];
			if (action != null) {
				action.executionRules[0].execute();

			}
		});

	}

	createComponent(component: any) {
		this.entry.clear();
		this.numberConstructor++;
		const factory = this.resolver.resolveComponentFactory(component);
		this.componentRef = this.entry.createComponent(factory);
		this.componentRef.instance.varIceContext = this.context;
		this.componentRef.instance.ConstructorNum = this.numberConstructor;
	}
	destroyComponent() {
		this.componentRef.destroy();

	}

	closeDialog() {
		this.modalService.dismissAll();
	}

}

import { Component } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import * as fsave from "file-saver";

@Component({
	selector: 'pdf-table-link-component',
	templateUrl: './pdf-table-link-component.html',
	styleUrls: ['./pdf-table-link-component.scss']
})
export class PdfTableLinkComponent extends ElementComponentImplementation {
	get filename(): string {
		return this.element.recipe["pdfTableLinkComponentFileName"] ? this.element.recipe["pdfTableLinkComponentFileName"] as string : "unknown.pdf";
	}

	constructor() {
		super();
	}

	protected getSupportedTypes(): string[] {
		return ["text"];
	}


	ngOnInit() {

	}

	handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
		svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(30, 32, 29)');
		svg.setAttribute('width', '22');
		svg.setAttribute('height', '21.2');

		return svg;
	}

	// onClick(item:any) {
	// 	debugger;
	// 	this.context.iceModel.elements["policy.selectedNote"].setSimpleValue(null);
	// 	this.context.iceModel.elements["policy.selectedNote"].setSimpleValue("r2:note/3274330");
	// }

	// private base64StringToBlob(data: string): Blob {
	// 	if (data == undefined)
	// 		throw new Error("Base 64 data is undefined");

	// 	var binary = atob(data.replace(/\s/g, ''));
	// 	var len = binary.length;
	// 	var buffer = new ArrayBuffer(len);
	// 	var view = new Uint8Array(buffer);
	// 	for (var i = 0; i < len; i++) {
	// 		view[i] = binary.charCodeAt(i);
	// 	}

	// 	return new Blob([view], { type: "application/pdf" });
	// }

	// private open(blob: Blob, data: string) {
	// 	let linkData = window.URL.createObjectURL(blob);
	// 	window.open(linkData);
	// 	setTimeout(function () { window.URL.revokeObjectURL(data), 100 });
	// }

	// private save(blob: Blob) {
	// 	let filename = this.filename;
	// 	if (!filename.toLowerCase().endsWith(".pdf"))
	// 		filename += ".pdf";
	// 	fsave.saveAs(blob, filename);
	// }
}

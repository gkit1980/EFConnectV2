import { Component } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import * as fsave from "file-saver";

@Component({
	selector: 'pdf-download-component',
	templateUrl: './pdf-download-component.html',
	styleUrls: ['./pdf-download-component.scss']
})
export class PdfDownloadComponent extends ElementComponentImplementation {
	get isSet(): boolean { return this.element.iceModel.elements[this.element.recipe["pdfDownloadComponentDataElement"]] ? this.element.iceModel.elements[this.element.recipe["pdfDownloadComponentDataElement"]].getValue().forIndex(null) : false; }

	get mode(): string { return this.element.recipe["pdfDownloadComponentMode"]; }

	get filename(): string { return this.element.recipe["pdfDownloadComponentFileName"] ? this.element.recipe["pdfDownloadComponentFileName"] as string : "unknown.pdf"; }

	constructor() {
		super();
	}

	protected getSupportedTypes(): string[] {
		return ["text"];
	}

	onClick() {
		if (!this.isDisabled) {
			try {
				// TODO: pdfDownloadComponent element recipe parameters should be replaced with component recipe parameters when ice version is updated
				let data = this.element.iceModel.elements[this.element.recipe["pdfDownloadComponentDataElement"]].getValue().forIndex(null);

				//convert to blob
				let blob: Blob = this.base64StringToBlob(data);

				//open or download
				if (this.mode === "open") this.open(blob, data);
				else if (this.mode === "download") this.save(blob);
				else console.warn("Unknown mode. Please use open or download.");
			} catch (error) {
				console.error(error);
			}
		}
	}

	private base64StringToBlob(data: string): Blob {
		if (data == undefined)
			throw new Error("Base 64 data is undefined");

		var binary = atob(data.replace(/\s/g, ''));
		var len = binary.length;
		var buffer = new ArrayBuffer(len);
		var view = new Uint8Array(buffer);
		for (var i = 0; i < len; i++) {
			view[i] = binary.charCodeAt(i);
		}

		return new Blob([view], { type: "application/pdf" });
	}

	private open(blob: Blob, data: string) {
		let linkData = window.URL.createObjectURL(blob);
		window.open(linkData);
		setTimeout(function () { window.URL.revokeObjectURL(data), 100 });
	}

	private save(blob: Blob) {
		let filename = this.filename;
		if (!filename.toLowerCase().endsWith(".pdf"))
			filename += ".pdf";
		fsave.saveAs(blob, filename);
	}
}

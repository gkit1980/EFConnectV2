import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
import * as fsave from "file-saver";
import * as moment from "moment";

export class OpenPdfExecutionRule extends ExecutionRule {
	async execute(): Promise<void> {

		try {
			this.context.iceModel.elements['policy.documents.errFlag'].setSimpleValue(0);

			//grab data
			let data = this.getData();

			//convert to blob
			let blob: Blob = this.base64StringToBlob(data);

			// check for iOS
      const regexpios = new RegExp('/iPad|iPhone|iPod/');
      const ios = !!navigator.platform && regexpios.test(navigator.platform);

      //open or download
      if (ios) {
        this.save(blob);
      } else {
        const mode: string = this.recipe['mode'];
        if (mode === 'open') {
          this.open(blob, data);
        } else if (mode === 'download') {
          this.save(blob);
        } else {
          console.warn('Unknown mode. Please use open or download.');
        }
      }
		} catch (error) {
			this.context.iceModel.elements['policy.documents.errFlag'].setSimpleValue(1);
			console.error(error);
		}
	}

	private getData(): string {
		let data: string = undefined;

		if (this.recipe["element"]) {
			data = this.context.iceModel.elements[this.recipe["element"]].getValue().forIndex(null) as string;
		} else if (this.recipe["datastorePath"]) {
			data = _.get(this.context.dataStore, this.recipe["datastorePath"]);
		} else {
			throw new Error("Please set either element or datastorePath paramater to get pdf data from!");
		}

		return data;
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
    window.open(linkData, '_blank');
    setTimeout(function () {
      window.URL.revokeObjectURL(data), 100;
    });
  }

	private save(blob: Blob) {
    const PDFFileName = this.recipe['filename'] ? (this.recipe['filename'] as string) : 'document';
    const cur_timestamp = moment().format('DD_MM_YYYY_HH:mm:ss');
    let filename = `${PDFFileName}_${cur_timestamp}`;
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }
		fsave.saveAs(blob, filename);
		// const fileURL = window.URL.createObjectURL(blob);
    // let fileLink = document.createElement('a');
    // fileLink.href = fileURL;
    // fileLink.target = '_blank';
    // fileLink.setAttribute('download', filename);
    // document.body.appendChild(fileLink);
    // fileLink.click();
    // setTimeout(function () {
    //   window.URL.revokeObjectURL(fileLink.href), 100;
    // });
    // document.body.removeChild(fileLink);
  }
}

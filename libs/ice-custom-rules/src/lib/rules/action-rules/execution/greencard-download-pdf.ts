import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
import * as FileSaver from "file-saver";


export class GreenCardDownloadPDF extends ExecutionRule {
    async execute(): Promise<void> {
        try {
            let url = this.context.iceModel.elements['greencard.motor.security.url'].getValue().forIndex(null);
            if (url !== null && url !== undefined){
                let blob = await fetch(url)
                    .then(res => res.blob()) // Gets the response and returns it as a blob
                    .then(blob => blob);

                FileSaver.saveAs(blob, "document.pdf");
            }
        } catch (error) {
            //do sth
        }
    }
}

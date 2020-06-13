import { ExecutionRule } from '@impeo/ice-core';
import * as _ from 'lodash';
import * as fsave from 'file-saver';

export class InsisOpenPdfExecutionRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      //grab data
      const data = this.getData();
      if (!data) {
        console.warn('No data');
        return;
      }

      //convert to blob
      const blob: Blob = this.base64StringToBlob(data);

      //open or download
      const mode: string = this.recipe['mode'];
      if (mode === 'open') this.open(blob, data);
      else if (mode === 'download') this.save(blob);
      else console.warn('Unknown mode. Please use open or download.');
    } catch (error) {
      console.error(error);
    }
  }

  private getData(): string {
    let data: string;

    if (this.recipe['element']) {
      data = this.context.iceModel.elements[this.recipe['element']]
        .getValue()
        .forIndex(null) as string;
    } else if (this.recipe['datastorePath']) {
      const dataStoreData = _.get(this.context.dataStore.data, this.recipe['datastorePath']);
      console.log(this.context.dataStore.data, this.recipe['datastorePath']);
      // console.log(typeof dataStoreData);
      // console.log(dataStoreData);

      if (dataStoreData && dataStoreData.byteLength !== undefined) {
        data = btoa(dataStoreData);
      } else data = dataStoreData;
    } else {
      throw new Error('Please set either element or datastorePath paramater to get pdf data from!');
    }

    return data;
  }

  private base64StringToBlob(data: string): Blob {
    if (data === undefined || data === null) throw new Error('Base 64 data is undefined');

    const binary = atob(data.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }

    return new Blob([view], { type: 'application/pdf' });
  }

  private open(blob: Blob, data: string) {
    const linkData = window.URL.createObjectURL(blob);
    window.open(linkData);
    setTimeout(function () {
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  private save(blob: Blob) {
    let filename = this.recipe['filename'] ? (this.recipe['filename'] as string) : 'unknown.pdf';
    if (!filename.toLowerCase().endsWith('.pdf')) filename += '.pdf';
    fsave.saveAs(blob, filename);
  }
}

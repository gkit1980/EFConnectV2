import { Component, OnInit } from '@angular/core';
import { IceTextInputComponent } from '@impeo/ng-ice';
import { truncate } from 'lodash';
import { IceElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';

@Component({
  selector: 'insis-file-upload',
  templateUrl: './insis-file-upload.component.html',
})
export class InsisFileUploadComponent extends IceTextInputComponent implements OnInit {
  static componentName = 'InsisFileUpload';
  private fileNameElement: IceElement;

  ngOnInit() {
    super.ngOnInit();
    const fileNameElementName = this.getRecipeParam('fileNameElement');
    this.fileNameElement = this.context.iceModel.elements[fileNameElementName];
  }

  uploadEvent(event) {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onloadend = () => {
      const fileName = file.name ? file.name : this.createName();
      this.setAndApplyValue(fileName, fileReader.result);
    };
  }

  getFileName() {
    return this.fileNameElement ? this.fileNameElement.getValue().forIndex(this.index) : null;
  }

  deleteFile() {
    this.setAndApplyValue(null, null);
  }

  trimName(name) {
    return truncate(name, { length: 15 });
  }

  private createName() {
    const d = new Date();
    return `photo-${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()}-${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.jpg`;
  }

  private setAndApplyValue(fileName: string, value: any) {
    this.fileNameElement.setValue(
      new IndexedValue(this.fileNameElement, fileName, this.index, ValueOrigin.UI)
    );
    this.setComponentValue(value);
    this.applyComponentValueToDataModel();
  }
}

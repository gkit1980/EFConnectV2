import { Component } from '@angular/core';
import { IceTextInputComponent } from '@impeo/ng-ice';
import { truncate } from 'lodash';

@Component({
  selector: 'insis-file-upload',
  templateUrl: './insis-file-upload.component.html'
})
export class InsisFileUploadComponent extends IceTextInputComponent {
  static componentName = 'InsisFileUpload';

  uploadEvent(event) {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      const fileName = file.name ? file.name : this.createName();
      this.setAndApplyValue(fileName);

      //TODO: Do something with this data
      const fileData = fileReader.result.toString();
    };
  }

  getValue() {
    return this.value;
  }

  deleteFile() {
    this.setAndApplyValue(null);
  }

  trimName(name) {
    return truncate(name, { length: 15 });
  }

  private createName() {
    const d = new Date();
    return `photo-${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.jpg`;
  }

  private setAndApplyValue(value: any) {
    this.setComponentValue(value);
    this.applyComponentValueToDataModel();
  }
}

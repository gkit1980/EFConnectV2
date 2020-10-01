import { Component } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { IceAction, IndexedValue, ItemElement, ValueOrigin } from '@impeo/ice-core';

interface FileDataType {
  name: string;
  data: string;
}

@Component({
  selector: 'insis-portal-insis-upload-attachment-button',
  templateUrl: './insis-upload-attachment-button.component.html',
  styleUrls: ['./insis-upload-attachment-button.component.scss'],
})
export class InsisUploadAttachmentButtonComponent extends MaterialElementComponentImplementation {
  static componentName = 'InsisUploadButtonAttachment';

  async uploadEvent(event) {
    const files: File[] = event.target.files;
    const promises: Promise<FileDataType>[] = Array.prototype.map.call(files, (file) =>
      this.loadDataFromFile(file)
    );

    const loadedFiles = await Promise.all(promises);

    const uploadFiles = loadedFiles.filter(this.isNewData.bind(this));

    const uploadPromises = uploadFiles.map((file) => {
      const arrayIndex = this.attachmentNameElement.getValue().values.length;
      const composedIndex = this.getIndex(arrayIndex);
      const value = new IndexedValue(
        this.attachmentNameElement,
        file.name,
        composedIndex,
        ValueOrigin.UI
      );
      const data = new IndexedValue(
        this.attachmentDataElement,
        file.data,
        composedIndex,
        ValueOrigin.UI
      );
      this.attachmentNameElement.setValue(value);
      this.attachmentDataElement.setValue(data);

      // this logic is required due to the fact that currently
      // INSIS transformations does not understand the index format
      // used by ICE Array elements for example [0,0,0] (valid array index)
      // but transformation will expect to recieve [[[0,0,0]]]
      let recursion = [];
      const deepest = recursion;
      composedIndex.map((current, index) => {
        if (index < composedIndex.length - 1) recursion = [recursion];
        return recursion;
      });
      deepest.push(...composedIndex);

      return this.action.execute({ index: recursion });
    });

    await Promise.all(uploadPromises);
  }

  get attachmentNameElement(): ItemElement {
    return <ItemElement>(
      this.context.iceModel.elements[this.getRecipeParam('attachmentNameElement')]
    );
  }

  get attachmentDataElement(): ItemElement {
    return <ItemElement>(
      this.context.iceModel.elements[this.getRecipeParam('attachmentDataElement')]
    );
  }

  get action(): IceAction {
    return this.context.iceModel.actions[this.getRecipeParam('action')];
  }

  private isNewData(file: FileDataType) {
    const result = this.attachmentDataElement
      .getValue()
      .values.filter((value) => !!value.value)
      .filter((value) => value.value.length === file.data.length)
      .filter((value) => value.value === file.data);

    return result.length === 0;
  }

  private getIndex(index: number): number[] {
    return this.index ? [...this.index, index] : [index];
  }

  private loadDataFromFile(file: File): Promise<FileDataType> {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve({ name: file.name, data: <string>fileReader.result });
      };
      fileReader.readAsDataURL(file);
    });
  }
}

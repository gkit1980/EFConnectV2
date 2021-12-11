import { Component } from '@angular/core';
import { IndexedValue, ValueOrigin } from '@impeo/ice-core';
import { IceButtonComponent } from '@impeo/ng-ice';
@Component({
  selector: 'insis-photo-capture',
  templateUrl: './insis-photo-capture.component.html'
})
export class InsisPhotoCaptureComponent extends IceButtonComponent {
  static componentName = 'InsisPhotoCapture';
  uploadEvent(event) {
    const file: File = event.target.files[0];
    // If filenameElement exists in the recipe, store filename to it:
    if (this.getRecipeParam('filenameElement', null)) {
      this.context.iceModel.elements[this.getRecipeParam('filenameElement')].setSimpleValue(file.name);
    }
    // If mimeTypeElement exists in the recipe, store mimeType to it:
    if (this.getRecipeParam('mimeTypeElement', null)) {
      this.context.iceModel.elements[this.getRecipeParam('mimeTypeElement')].setSimpleValue(file.type);
    }
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = async () => {
      let dataUrl = fileReader.result as string;
      // dataUrl = await this.reizeImage(dataUrl, 100);
      const data = this.removeDataUrlHeaderAndAdjustPadding(dataUrl);


      const indexedValue = new IndexedValue(this.context.iceModel.elements[this.getRecipeParam('fileContentElement')], data, this.index, ValueOrigin.UI);
      this.context.iceModel.elements[this.getRecipeParam('fileContentElement')].setValue(indexedValue);
      await this.executeAction();
    };
  }
  private async executeAction() {
    let action = this.element.action;
    if (action == null) action = this.element.iceModel.actions[this.getElementValue()];
    if (action) await action.execute({ index: this.index });
    const value = new IndexedValue(this.element, this.getComponentValue(), this.index, ValueOrigin.UI);
    this.element.$dataModelValueChange.next(value); // this would trigger inline change action
  }
  private reizeImage(imageSource: string, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = (imageEvent) => {
        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg'));
      }
      image.src = imageSource;
    });
  }

  private removeDataUrlHeaderAndAdjustPadding(input: string): string {
    let encoded = input.toString().replace(/^data:(.*,)?/, '');
    if ((encoded.length % 4) > 0) {
      encoded += '='.repeat(4 - (encoded.length % 4));
    }
    return encoded;
  }
}
import { ValidationRule, ValidationMessages, IndexedValue } from '@impeo/ice-core';

//
//
export class SignatureValidationRule extends ValidationRule {
  //
  //
  validateValue(messages: ValidationMessages, value: IndexedValue): void {
    this.validateCanvas(messages, value);
  }

  private validateCanvas(messages: ValidationMessages, value: IndexedValue) {
    return new Promise<void>((resolve, reject) => {
      //get recipe values
      const minCountOfPixels = parseInt(this.requireParam('minCountOfPixels'), 10);
      const ignorePixelValue = parseInt(this.requireParam('ignorePixelValue'), 10);
      const messageKey = this.requireParam('messageKey');

      //create canvas and render image
      var canvas = document.createElement('canvas');

      // load image from data url
      var imageObj = new Image();
      imageObj.onload = () => {
        //adjust canvas w h
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;

        //get and draw into 2dContext
        var context = canvas.getContext('2d');
        context.drawImage(imageObj, 0, 0);

        //count set pixels
        // console.log("img width height", imageObj.width, imageObj.height);
        // console.log("canvas width height", canvas.width, canvas.height);
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        const setPixels = this.countSetPixels(imgData.data, ignorePixelValue);

        //validate
        if (setPixels < minCountOfPixels) {
          // console.log("nonWhite", setPixels);
          let message = this.resource.resolve(
            messageKey,
            `Signature is not valid. Set pixels ${setPixels}`
          );
          messages.addMessage(message, this.element.name, value.index);
        }
        resolve();
      };

      //initiate the whole validation
      imageObj.src = value.value;
    });
  }

  protected countSetPixels(data: Uint8ClampedArray, ignorePixelValue: number) {
    let setPixels = 0;

    for (var i = 0; i < data.length; i += 4) {
      //no need to check every pixel value, only checking RED
      if (data[i] != ignorePixelValue) {
        setPixels++;
      }
    }

    return setPixels;
  }
}

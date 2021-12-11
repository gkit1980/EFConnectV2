import {
  Component,
  HostListener,
  Input,
  ViewChild,
  OnInit,
  ElementRef,
  Inject,
  AfterViewInit,
} from '@angular/core';
import {
  IceTextInputComponent,
  MaterialElementComponentImplementation,
  IceContextService,
} from '@impeo/ng-ice';
import { IceElement, IndexedValue, ItemElement, ValueOrigin } from '@impeo/ice-core';
import { get } from 'lodash';
import { distinctUntilChanged } from 'rxjs/operators';

declare var require: any;
var signature = require('signature_pad');

import x from 'signature_pad';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';

@Component({
  selector: 'insis-capture-signature',
  templateUrl: './insis-capture-signature.component.html',
  styleUrls: ['./insis-capture-signature.component.scss'],
})
export class InsisCaptureSignatureComponent extends MaterialElementComponentImplementation
  implements OnInit {
  static componentName = 'InsisCaptureSignature';

  constructor(
    private elRef: ElementRef,
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) defaults: MatFormFieldDefaultOptions
  ) {
    super(defaults);
  }

  canvas: any;
  ctx: any;
  signaturePad: any;
  coord: any = { x: 0, y: 0 }; /// Stores the initial position of the cursor
  paint: boolean = false; // This is the flag that we are going to use to

  ignoreDataChange = false;
  clearButtonlabel: string;
  qrCodeUrlElement: ItemElement;
  qrCodeResource: string;
  hideQrCodeOnMobile = true;

  ngOnInit() {
    super.ngOnInit();

    if (this.getRecipeParam('qrCodeUrlElement'))
      this.qrCodeUrlElement = this.context.iceModel.elements[
        this.getRecipeParam('qrCodeUrlElement')
      ] as ItemElement;
    this.qrCodeResource = this.resource.getEntry(this.getRecipeParam('qrCodeResource'));
    if (this.getRecipeParam('hideQrCodeOnMobile'))
      this.hideQrCodeOnMobile = this.getRecipeParam('hideQrCodeOnMobile');

    //todo, oh my...
    this.canvas = this.elRef.nativeElement.querySelector('canvas');

    requestAnimationFrame(() => {
      this.canvas.height = this.canvas.offsetHeight;
      this.canvas.width = this.canvas.offsetWidth;
      this.ctx = this.canvas.getContext('2d');

      // this adjust the size of canvas for screens with higher pixel dencity
      if (window.devicePixelRatio > 1) {
        var canvasWidth = this.canvas.width;
        var canvasHeight = this.canvas.height;

        this.canvas.width = canvasWidth * window.devicePixelRatio;
        this.canvas.height = canvasHeight * window.devicePixelRatio;
        this.canvas.style.width = canvasWidth;
        this.canvas.style.height = canvasHeight;

        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }

      //needed for touch screens since onEnd does not fire then!
      this.canvas.addEventListener('touchend', () => {
        this.save();
      });

      this.signaturePad = new signature.default(this.canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        onEnd: () => {
          this.save();
        },
      });
    });

    this.element.$dataModelValueChange.pipe(distinctUntilChanged()).subscribe((value) => {
      if (value.origin === ValueOrigin.UI) {
        // console.log('Ignore value, same origin');
        return;
      }

      if (value.value) {
        this.signaturePad.fromDataURL(value.value);
      } else {
        this.signaturePad.clear();
      }
    });

    this.determineLabels();
  }

  clear() {
    this.signaturePad.clear();
    this.save();
  }

  save() {
    // console.debug("InsisCaptureSignatureComponent save");
    this.ignoreDataChange = true;
    const currValue = (this.getComponentValue() as string) ?? '';
    const newValue = (this.signaturePad.toDataURL('image/jpeg') as string) ?? '';

    if (currValue !== newValue) {
      // console.log("value changed");
      this.setComponentValue(newValue);
      this.applyComponentValueToDataModel();
    }

    this.ignoreDataChange = false;
  }

  determineLabels() {
    let recipe = this.getComponentRecipe();
    this.clearButtonlabel = this.resource.resolve(get(recipe, 'clearLabel'), 'Clear signiture');
  }

  qrCodeImageUrl() {
    if (!this.qrCodeUrlElement) return;
    const elementValue = this.qrCodeUrlElement.getValue().forIndex(null);
    if (!elementValue) return;
    const url = `https://chart.googleapis.com/chart?chs=352x352&cht=qr&choe=UTF-8&chl=${encodeURIComponent(
      elementValue
    )}`;
    // console.log(url);
    return url;
  }

  copyQrToClipboard() {
    if (!this.qrCodeUrlElement) return;
    const elementValue = this.qrCodeUrlElement.getValue().forIndex([0]);
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = elementValue;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }

  isMobile() {
    return (
      this.hideQrCodeOnMobile &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }
}

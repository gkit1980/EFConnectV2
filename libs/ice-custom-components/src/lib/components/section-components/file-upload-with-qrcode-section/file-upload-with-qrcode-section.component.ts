import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IceElement, IndexedValue, ItemElement, ValueOrigin, ArrayElement } from '@impeo/ice-core';
import { get } from 'lodash';
import { resolve } from 'url';
import { Subscription, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'insis-file-upload-with-qrcode-section',
  templateUrl: './file-upload-with-qrcode-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadWithQrCodeSection extends SectionComponentImplementation
  implements OnInit, OnDestroy {
  static componentName = 'FileUploadWithQrCodeSection';

  public files: any[] = [];

  arrayElement: ArrayElement;
  arrayElementFileName: ItemElement;
  arrayElementMimeType: ItemElement;
  arrayElementBase64Data: ItemElement;
  qrCodeUrlElement: ItemElement;
  qrCodeResource: string;
  hideQrCodeOnMobile: boolean;
  captionStaticResource: string;
  captionSelectionPictureLinkResource: string;
  private postMessageSubscription: Subscription;
  qrCodeUrlElementValue: string;

  fileName(index: number) {
    return this.arrayElementFileName.getValue().forIndex([index]);
  }

  constructor(
    parent: IceSectionComponent,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) {
    super(parent);
  }

  private recipeParam(name: string): string {
    return _.get(
      this.recipe,
      'component.' + FileUploadWithQrCodeSection.componentName + '.' + name
    );
  }
  ngOnInit(): void {
    super.ngOnInit();

    this.arrayElement = this.iceModel.elements[this.recipeParam('arrayElement')] as ArrayElement;
    this.arrayElementFileName = this.iceModel.elements[
      this.recipeParam('arrayElementFileName')
    ] as ItemElement;
    this.arrayElementMimeType = this.iceModel.elements[
      this.recipeParam('arrayElementMimeType')
    ] as ItemElement;
    this.arrayElementBase64Data = this.iceModel.elements[
      this.recipeParam('arrayElementBase64Data')
    ] as ItemElement;
    if (this.recipeParam('qrCodeUrlElement'))
      this.qrCodeUrlElement = this.iceModel.elements[
        this.recipeParam('qrCodeUrlElement')
      ] as ItemElement;
    this.qrCodeResource = this.resource.getEntry(this.recipeParam('qrCodeResource'));
    this.hideQrCodeOnMobile = this.recipeParam('hideQrCodeOnMobile') === 'true';
    this.captionStaticResource = this.resource.getEntry(this.recipeParam('captionStaticResource'));
    this.captionSelectionPictureLinkResource = this.resource.getEntry(
      this.recipeParam('captionSelectionPictureLinkResource')
    );

    this.registerPostEvent();

    this.arrayElement.$dataModelValueChange.subscribe(() => {
      this.files = this.arrayElement.getValue().forIndex(null) as any[];
      this.ref.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.postMessageSubscription) {
      this.postMessageSubscription.unsubscribe();
    }
  }

  registerPostEvent() {
    const eventName = 'new-file';
    this.postMessageSubscription = fromEvent(window, 'message')
      .pipe(
        filter(({ data }: MessageEvent) => {
          return get(data, 'type') === 'ice' && get(data, 'event') === eventName;
        })
      )
      .subscribe(({ data }) => {
        const payload = get(data, 'payload');
        const index = this.files.length;
        const origin = ValueOrigin.UI;
        const content = payload.image.split(',')[1];

        this.arrayElementFileName.setValue(
          new IndexedValue(this.arrayElementFileName, `file-${index + 1}.jpg`, [index], origin)
        );
        this.arrayElementMimeType.setValue(
          new IndexedValue(this.arrayElementMimeType, 'image/jpeg', [index], origin)
        );
        this.arrayElementBase64Data.setValue(
          new IndexedValue(this.arrayElementBase64Data, content, [index], origin)
        );
      });
  }

  deleteFile(index: number) {
    this.arrayElement.removeItem(null, index, ValueOrigin.UI);
  }

  onFileInputClick(event: any) {
    event.target.value = null;
  }

  onDragDropFiles(files: FileList) {
    this.onFileImport(files);
  }

  async onFileImport(files: FileList) {
    const currentFilesCount = this.files.length;
    const fetchFilesPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const index = currentFilesCount + i;
      fetchFilesPromises.push(this.saveFileAsBase64ToDataModel(file, index, ValueOrigin.UI));
    }
    const indexes = await Promise.all(fetchFilesPromises);
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      await this.uploadFile([index]);
    }
  }

  saveFileAsBase64ToDataModel(
    file: File,
    index: number,
    origin: ValueOrigin = ValueOrigin.UNKNOWN
  ): Promise<number> {
    return new Promise<number>((resolvex, reject) => {
      const myReader = new FileReader();
      myReader.onloadend = (e) => {
        try {
          // This is due to the specification of FileReader.readAsDataURL() method, which return not a plain base64 file content
          // but adds tha meta in-front of it.
          const data = (myReader.result as string).split(',')[1];
          this.arrayElementFileName.setValue(
            new IndexedValue(this.arrayElementFileName, file.name, [index], origin)
          );
          this.arrayElementMimeType.setValue(
            new IndexedValue(this.arrayElementMimeType, file.type, [index], origin)
          );
          this.arrayElementBase64Data.setValue(
            new IndexedValue(this.arrayElementBase64Data, data, [index], origin)
          );
          resolvex(index);
        } catch (error) {
          console.error('Could not extract base64 data for file', file);
          reject(index);
        }
      };
      myReader.readAsDataURL(file);
    });
  }

  uploadFile(index: number[]) {
    const action = this.iceModel.actions[this.recipe['action']];
    return action ? action.execute({ index }) : null;
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

    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = elementValue;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    // not working:
    // window['clipboardData'].setData('text/plain', elementValue);
  }

  isMobile() {
    return (
      this.hideQrCodeOnMobile &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }
}

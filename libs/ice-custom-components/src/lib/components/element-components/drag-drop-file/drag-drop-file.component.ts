import { Element } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArrayElement } from '@impeo/ice-core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { Subject } from 'rxjs';
import { environment } from  "@insis-portal/environments/environment";
var filesize = require('filesize');
var ice_1 = require('@impeo/ice-core');

@Component({
  selector: 'app-drag-drop-file',
  templateUrl: './drag-drop-file.component.html',
  styleUrls: ['./drag-drop-file.component.scss'],
})
export class DragDropFileComponent
  extends ElementComponentImplementation
  implements OnInit, OnDestroy
{
  labelName: string;

  elementName: any;
  elementSize: any;
  elementSizeEncoded: any;
  elementMimeType: any;
  elementBase64Data: any;
  documentsElement: any;

  browse = 'sections.fileUpload.browse.label';
  deleteFilee = 'sections.fileUpload.deleteFilee.label';
  image = 'sections.fileUpload.image.label';
  description = 'sections.fileUpload.description.label';

  items: any[] = [];
  result: any;

  private destroy$ = new Subject<void>();
  categoryChoice: any;
  requestType: any;

  constructor() {
    super();
  }

  ngOnInit() {
    this.documentsElement = this.context.iceModel.elements[
      'documents'
    ] as ArrayElement;
    this.documentsElement.reset();

    this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(
      false
    );

    this.elementName =
      this.context.iceModel.elements[
        this.element.recipe['arrayElementFileName']
      ];
    this.elementSize =
      this.context.iceModel.elements[
        this.element.recipe['arrayElementSize']
      ];
    this.elementSizeEncoded =
      this.context.iceModel.elements[
        this.element.recipe['arrayElementSizeEncoded']
      ];
    this.elementMimeType =
      this.context.iceModel.elements[
        this.element.recipe['arrayElementMimeType']
      ];
    this.elementBase64Data =
      this.context.iceModel.elements[
        this.element.recipe['arrayElementBase64Data']
      ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.documentsElement.reset();
  }

  get folderImageSource() {
    return this.getIcon('5C0A75E3B754407393954369D5441D41');
  }

  folderSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '32');
    svg.setAttribute('height', '32');
    svg.setAttribute('fill', '#485294');

    return svg;
  }

  onFileImport(upldFiles: any[]) {
    const numberOfFiles = this.getFilesFromDataModel().length;

      //**** eclaims upload file exception-only for eclaims flow
      // this.requestType=this.context.iceModel.elements['eclaims.selected.requestType'].getValue().forIndex(null)
      // if(this.requestType=="1" &&  upldFiles.length>1)    //attach only one file
      // return;
      //end

    if (numberOfFiles <= 14) {
      for (let i = 0; i < upldFiles.length; i++) {
        const file = upldFiles[i];
        this.saveFileAsBase64ToDataModel(file, i + numberOfFiles);
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(
          true
        );
        this.context.iceModel.elements['eclaims.step'].setSimpleValue(31);
      }
    }
  }

  onFileInputClick(event: any) {
    //**** eclaims upload file exception-only for eclaims flow
   // this.categoryChoice = this.context.iceModel.elements['eclaims.category.choice.flag'].getValue().forIndex(null);
   //this.categoryChoice=="Doctors" || this.categoryChoice=="Medicines")
  //  this.requestType=this.context.iceModel.elements['eclaims.selected.requestType'].getValue().forIndex(null)
  // if(this.requestType=="1" && this.getNumberOfFiles()==1)    //attach only one file
  //    event.preventDefault();
  //  else
    event.target.value = null;          //let the user to upload as much files as he needs
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  saveFileAsBase64ToDataModel(file: any, index: any): any {
    const _this = this;
    const myReader = new FileReader();
    myReader.onloadend = function (this, e) {
      const data = '';

      _this.elementName.setValue(
        new ice_1.IndexedValue(
          _this.elementName,
          file.name,
          [index],
          ice_1.ValueOrigin.INTERNAL
        )
      );
      _this.elementSize.setValue(
        new ice_1.IndexedValue(
          _this.elementSize,
          file.size,
          [index],
          ice_1.ValueOrigin.INTERNAL
        )
      );
      _this.elementSizeEncoded.setValue(
        new ice_1.IndexedValue(
          _this.elementSizeEncoded,
          data.length,
          [index],
          ice_1.ValueOrigin.INTERNAL
        )
      );
      _this.elementMimeType.setValue(
        new ice_1.IndexedValue(
          _this.elementMimeType,
          file.type,
          [index],
          ice_1.ValueOrigin.INTERNAL
        )
      );

      _this.elementBase64Data.setValue(
        new ice_1.IndexedValue(
          _this.elementBase64Data,
          this.result,
          [index],
          ice_1.ValueOrigin.INTERNAL
        )
      );
    };

    myReader.readAsDataURL(file);
  }

  getFilesFromDataModel(): any {
    const indexedValueList =
      this.context.iceModel.elements[
        this.element.recipe['arrayElement']
      ].getValue();

    return indexedValueList.values[0].value;
  }

  deleteFile(idx: number): void {
    this.getFilesFromDataModel().splice(idx, 1);
    const numberOfFiles = this.getFilesFromDataModel().length;

    if (numberOfFiles === 0) {
      this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(
        false
      );
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(3);
      this.documentsElement.reset();
    }
  }

  getFileName(index: any): any {
    const val = this.elementName.getValue().forIndex([index]);
    return val;
  }

  getFileSize(index: any): any {
    const val =
      this.context.iceModel.elements[
        this.element.recipe['arrayElement']
      ].getValue().values[0].value[index].size;

    return filesize(val);
  }

  get closeImageSource(): string {
    return this.getIcon('9E57CCB2D5E54B739BF6D3DE8551E683');
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');

    return svg;
  }

  get imageSource(): string {
    return this.getIcon(this.page.recipe.topImageID);
  }

  handleBrowseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute(
      'style',
      'display: block; margin: auto; fill: rgb(72, 82, 148);'
    );
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');

    return svg;
  }

  getNumberOfFiles(): number {
    return this.getFilesFromDataModel().length;
  }
}

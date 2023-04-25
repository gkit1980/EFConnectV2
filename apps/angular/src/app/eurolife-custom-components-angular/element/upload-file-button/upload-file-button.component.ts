import { ArrayElement } from '@impeo/ice-core';
// import { Component, OnInit } from "@angular/core";
// import { environment } from "../../../../environments/environment";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import { environment } from "./../../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { Element } from "@angular/compiler";
import { IndexedValue } from "@impeo/ice-core";
var filesize = require("filesize");
var ice_1 = require("@impeo/ice");

@Component({
  selector: "app-upload-file-button",
  templateUrl: "./upload-file-button.component.html",
  styleUrls: ["./upload-file-button.component.scss"]
})
export class UploadFileButtonComponent extends ElementComponentImplementation {
  showBrowse: boolean;
  labelName: string;
  isDisabledText: boolean = false;
  isExtraPaymentText: boolean = false;

  elementName: any;
  elementSize: any;
  elementSizeEncoded: any;
  elementMimeType: any;
  elementBase64Data: any;

  numberOfFiles: number;

  browse = "sections.fileUpload.browse.label";
  deleteFilee = "sections.fileUpload.deleteFilee.label";
  image = "sections.fileUpload.image.label";
  description = "sections.fileUpload.description.label";

  items: any = [];
  result: any;

  constructor() {
    super();
  }

  ngOnInit() {
    this.showBrowse = true;
    const documentsElement = this.context.iceModel.elements['documents'] as ArrayElement;
    documentsElement.reset();
    this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);

    this.context.iceModel.elements['amendments.motor.subcategory.dropdown'].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        documentsElement.reset();
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);
        this.labelName = this.element.recipe.label.ResourceLabelRule.key;

        let dt = this.page.iceModel.dts[this.labelName.substr(1, this.labelName.length)];
        if (dt) {
          this.result = dt.evaluateSync();
          this.items = [];
          for (var i = 0; i < this.result.length; i++) {
            this.items.push(this.result[i].label);
          }
        }
        // this.items.push(value.element.getValue().forIndex(null))
      })

    this.context.iceModel.elements['amendments.life.subcategory.dropdown'].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        documentsElement.reset();
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);
        this.labelName = this.element.recipe.label.ResourceLabelRule.key;
        this.isDisabledText = true;
        let dt = this.page.iceModel.dts[this.labelName.substr(1, this.labelName.length)];
        if (dt) {
          this.result = dt.evaluateSync();
          this.items = [];
          for (var i = 0; i < this.result.length; i++) {
            this.items.push(this.result[i].label);
          }
        }
        // this.items.push(value.element.getValue().forIndex(null))
      })
    this.context.iceModel.elements['amendments.health.subcategory.dropdown'].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        documentsElement.reset();
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);
        this.labelName = this.element.recipe.label.ResourceLabelRule.key;
        this.isDisabledText = true;
        let dt = this.page.iceModel.dts[this.labelName.substr(1, this.labelName.length)];
        if (dt) {
          this.result = dt.evaluateSync();
          this.items = [];
          for (var i = 0; i < this.result.length; i++) {
            this.items.push(this.result[i].label);
          }
        }
        // this.items.push(value.element.getValue().forIndex(null))
      })
    this.context.iceModel.elements['amendments.finance.subcategory.dropdown'].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        documentsElement.reset();
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);
        this.labelName = this.element.recipe.label.ResourceLabelRule.key;
        if(this.context.iceModel.elements['amendments.finance.subcategory.dropdown'].getValue().forIndex(null) == 7){
          this.isDisabledText = true;
        }else if(this.context.iceModel.elements['amendments.finance.subcategory.dropdown'].getValue().forIndex(null) == 6){
          this.isExtraPaymentText =true;
        }
        let dt = this.page.iceModel.dts[this.labelName.substr(1, this.labelName.length)];
        if (dt) {
          this.result = dt.evaluateSync();
          this.items = [];
          for (var i = 0; i < this.result.length; i++) {
            this.items.push(this.result[i].label);
          }
        }
        // this.items.push(value.element.getValue().forIndex(null))
      })
    // this.items.push(this.context.iceModel.elements["amendments.motor.category.dropdown"].getValue().forIndex(null));

    this.elementName = this.context.iceModel.elements[
      this.element.recipe["arrayElementFileName"]
    ];
    this.elementSize = this.context.iceModel.elements[
      this.element.recipe["arrayElementSize"]
    ];
    this.elementSizeEncoded = this.context.iceModel.elements[
      this.element.recipe["arrayElementSizeEncoded"]
    ];
    this.elementMimeType = this.context.iceModel.elements[
      this.element.recipe["arrayElementMimeType"]
    ];
    this.elementBase64Data = this.context.iceModel.elements[
      this.element.recipe["arrayElementBase64Data"]
    ];
  }

  get folderImageSource() {
    return this.getIcon("5C0A75E3B754407393954369D5441D41");
  }

  folderSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "32");
    svg.setAttribute("height", "32");
    svg.setAttribute("fill", "#485294");

    return svg;
  }

  onFileInputClick(event: any) {
    event.target.value = null;
  }

  onFileImport(files: any) {
    // this.showBrowse = false;
    const count = this.getFilesFromDataModel().length;
    if (this.numberOfFiles <= 14) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        this.saveFileAsBase64ToDataModel(file, i + count);
        this.context.iceModel.elements["amendments.upload.file"].setSimpleValue(true);
      }
    }
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  saveFileAsBase64ToDataModel(file: any, index: any): any {
    const _this = this;
    const myReader = new FileReader();
    myReader.onloadend = function (this, e) {
      const data = "";

      try {
        // data = myReader.result.split(",")[1];
      } catch (error) {
        console.error("Could not extract base64 data for file", file);
      }

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
      //  _this.elementBase64Data.setValue(new ice_1.IndexedValue(_this.elementBase64Data, data, [index], ice_1.ValueOrigin.INTERNAL));
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
    //myReader.readAsArrayBuffer(file);
  }

  getFilesFromDataModel(): any {
    const indexedValueList = this.context.iceModel.elements[
      this.element.recipe["arrayElement"]
    ].getValue();
    this.numberOfFiles = indexedValueList.values[0].value.length;
    return indexedValueList.values[0].value;
  }

  deleteFile(index: any): any {
    this.getFilesFromDataModel().splice(index, 1);
    this.showBrowse = true;
    if (index === 0) {
      this.context.iceModel.elements["amendments.upload.file"].setSimpleValue(false);
    }
  }

  isType(type: any, index: any): any {
    const val = this.elementMimeType.getValue().forIndex([index]);
    return val.includes(type);
  }

  getFileName(index: any): any {
    const val = this.elementName.getValue().forIndex([index]);
    return val;
  }

  getFileSize(index: any): any {
    const val = this.context.iceModel.elements[
      this.element.recipe["arrayElement"]
    ].getValue().values[0].value[index].size;
    //  var val = this.elementSizeEncoded.getValue().forIndex([index]);
    return filesize(val);
  }

  handleFAQSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute(
      "style",
      "display: block; margin: auto; fill: rgb(72, 82, 148);"
    );
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "28");

    return svg;
  }

  get closeImageSource() {
    return this.getIcon("9E57CCB2D5E54B739BF6D3DE8551E683");
  }

  handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");

    return svg;
  }

  get imageSource() {
    return this.getIcon(this.page.recipe.topImageID);
  }
}

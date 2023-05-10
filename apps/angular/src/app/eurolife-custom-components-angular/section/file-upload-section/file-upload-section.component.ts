import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { Element } from '@angular/compiler';
var filesize = require("filesize");
var ice_1 = require("@impeo/ice-core");

@Component({
    selector: 'file-upload-section',
    templateUrl: './file-upload-section.component.html',
    styleUrls: ['./file-upload-section.component.scss']
})
export class FileUploadSection extends SectionComponentImplementation {
    // constructor(parent: IceSectionComponent) {
    //     super(parent);
    // }
    showBrowse: boolean;

    elementName: any;
    elementSize: any;
    elementSizeEncoded: any;
    elementMimeType: any;
    elementBase64Data: any;

    browse = 'sections.fileUpload.browse.label';
    deleteFilee = 'sections.fileUpload.deleteFilee.label';
    image = 'sections.fileUpload.image.label';
    description = 'sections.fileUpload.description.label';

    ngOnInit() {
        super.ngOnInit();
        this.showBrowse = true;
        this.elementName = this.iceModel.elements[this.recipe['arrayElementFileName']];
        this.elementSize = this.iceModel.elements[this.recipe['arrayElementSize']];
        this.elementSizeEncoded = this.iceModel.elements[this.recipe['arrayElementSizeEncoded']];
        this.elementMimeType = this.iceModel.elements[this.recipe['arrayElementMimeType']];
        this.elementBase64Data = this.iceModel.elements[this.recipe['arrayElementBase64Data']];
    }

    onFileInputClick(event: any) {
        event.target.value = null;
    }

    onFileImport(files: any) {
        this.showBrowse = false;
        const count = this.getFilesFromDataModel().length;
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            this.saveFileAsBase64ToDataModel(file, i + count);
        }
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

            try {
                // data = myReader.result.split(",")[1];
            } catch (error) {
                console.error('Could not extract base64 data for file', file);
            }


            _this.elementName.setValue(new ice_1.IndexedValue(_this.elementName, file.name, [index], ice_1.ValueOrigin.INTERNAL));
            _this.elementSize.setValue(new ice_1.IndexedValue(_this.elementSize, file.size, [index], ice_1.ValueOrigin.INTERNAL));
            _this.elementSizeEncoded.setValue(new ice_1.IndexedValue(_this.elementSizeEncoded, data.length, [index], ice_1.ValueOrigin.INTERNAL));
            _this.elementMimeType.setValue(new ice_1.IndexedValue(_this.elementMimeType, file.type, [index], ice_1.ValueOrigin.INTERNAL));
            // _this.elementBase64Data.setValue(new ice_1.IndexedValue(_this.elementBase64Data, data, [index], ice_1.ValueOrigin.INTERNAL));
            _this.elementBase64Data.setValue(new ice_1.IndexedValue(_this.elementBase64Data, this.result, [index], ice_1.ValueOrigin.INTERNAL));
        };
        myReader.readAsDataURL(file);
    }

    getFilesFromDataModel(): any {
        const indexedValueList = this.iceModel.elements[this.recipe['arrayElement']].getValue();
        return indexedValueList.values[0].value;
    }

    deleteFile(index: any): any {
        this.getFilesFromDataModel().splice(index, 1);
        this.showBrowse = true;
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
        const val = this.iceModel.elements[this.recipe['arrayElement']].getValue().values[0].value[index].size;
        // var val = this.elementSizeEncoded.getValue().forIndex([index]);
        return filesize(val);
    }

    handleFAQSVG(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(72, 82, 148);');
        svg.setAttribute('width', '28');
        svg.setAttribute('height', '28');

        return svg;
    }


    get closeImageSource() {
        return this.getIcon('9E57CCB2D5E54B739BF6D3DE8551E683');
    }

    handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');

        return svg;
    }

    get imageSource() {
        return this.getIcon(this.page.recipe.topImageID);
    }

}

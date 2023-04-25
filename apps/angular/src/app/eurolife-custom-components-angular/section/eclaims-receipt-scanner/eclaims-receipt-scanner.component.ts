import { Component, OnDestroy, OnInit } from '@angular/core';
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { environment } from "./../../../../environments/environment";
import { LocalStorageService } from "../../../services/local-storage.service";
import * as _ from "lodash";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { SpinnerService } from '../../../services/spinner.service';
import { BarcodeFormat } from '@zxing/library';
import { takeUntil } from 'rxjs/operators';
import { IceSection,IndexedValue } from '@impeo/ice-core';
export interface Insured {
  MainInsured: boolean;
  Contractkey: string;
  CustomerCode:string;
  Fullname: string;
  Id: string;
  MainInsuredId: string;
}
@Component({
  selector: 'app-eclaims-receipt-scanner',
  templateUrl: './eclaims-receipt-scanner.component.html',
  styleUrls: ['./eclaims-receipt-scanner.component.scss']
})
export class EclaimsReceiptScannerComponent extends SectionComponentImplementation implements OnInit,OnDestroy {
  header: string;
  innerheader: string;
  data: any[] = [];
  private destroy$ = new Subject<void>();
  mainInsuredId: string;
  qrResultString: string;
  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];
  receiptData: {};
  qrResultSuccess: boolean=true;
  qrSuccessTextHidden: boolean = false;
  scanner: boolean = false;
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[] = null;
  onCamerasDevicesFound: MediaDeviceInfo[] = null;
  deviceCurrent: MediaDeviceInfo = null;
  hasDevices: boolean;
  regexp: RegExp = undefined;
  foundBackCam: boolean = false;
  deviceSelected: string;
  torchEnabled = true;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = true;

  constructor( parent: IceSectionComponent,private localStorage: LocalStorageService,public ngbModal: NgbModal, public modalService: ModalService,
    private spinnerService: SpinnerService) {
    super(parent);
   }
  async ngOnInit() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.filterCameraDevices();
    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if ( valElem === 12   || valElem === 14 || valElem === 15) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
        if (valElem === 11 || valElem === 12 || valElem === 13 || valElem === 14) {
          this.deviceCurrent = null;
          this.qrResultSuccess = true;
          this.qrSuccessTextHidden = false;
          this.scanner = false;
          this.qrResultString = null;
        }
      },
      (err: any) =>
        console.error('EclaimsGridViewComponent eclaims.step', err)
    );
  }
  ngOnDestroy(): void {
  }
  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }
  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; float: right; fill: rgb(255, 255, 255);");
    svg.setAttribute("width", "29");
    svg.setAttribute("height", "30");
    return svg;
  }
  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");
    return svg;
  }
  clearResult(): void {
    this.qrResultString = null;
  }
  async onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    console.log("this.qrResultString: "+this.qrResultString)
    if(resultString.includes("https://www1.aade.gr/tameiakes")){
      this.receiptData = await this.getDataFromAadeUrl(resultString);
      console.log(this.receiptData);
      this.qrResultSuccess = true;
      this.qrSuccessTextHidden = true;
    }else{
      this.qrResultSuccess = false;
    }
  }
  async getDataFromAadeUrl(aadeUrl: any){
    this.iceModel.elements["eclaims.aade.scanned.url"].setSimpleValue(aadeUrl);
    this.context.iceModel.elements['eclaims.step'].setSimpleValue(15);
    return this.iceModel.elements["eclaims.aade.scanned.url"].getValue().values[0].value;
  }
  showScanner() {
    this.scanner = !this.scanner;
    this.filterCameraDevices();
    this.regexp= new RegExp('/iPad|iPhone|iPod|Mac/');
    var iOS =  !!navigator.userAgent &&  this.regexp.test(navigator.userAgent);
    if(this.availableDevices && this.availableDevices.length>0){
      // console.log("showScanner availableDevices:"+ this.availableDevices.length);
      if(iOS){
        for(let i=0; i<this.availableDevices.length; i++ ){
          if(this.availableDevices[i].label.indexOf("Πίσω κάμερα")>=0 || this.availableDevices[i].label.indexOf("Back Camera")>=0){
            // console.log("Πίσω κάμερα || Back Camera:"+ this.availableDevices[i].label);
            this.deviceSelected = this.availableDevices[i].deviceId;
            this.deviceCurrent = this.availableDevices[i];
            this.foundBackCam = true;
          }
        }
      }
    }else{
      for(let i=0; i<this.availableDevices.length; i++ ){
        if(this.availableDevices[i].label.indexOf("back")>=0 && this.availableDevices[i].label.indexOf("0")>=0){
          // console.log("back && 0:"+ this.availableDevices[i].label);
          this.deviceSelected = this.availableDevices[i].deviceId;
          this.deviceCurrent = this.availableDevices[i];
          this.foundBackCam = true;
        }
      }
    }

    if(!this.foundBackCam){
      this.deviceCurrent = this.availableDevices? (this.availableDevices.length>0? this.availableDevices[0] : null) : null;
      // console.log(" foundBackCam:"+this.foundBackCam + "this.deviceCurrent" + this.deviceCurrent);
    }
    // console.log(" !!foundBackCam:"+this.foundBackCam + "this.deviceCurrent" + this.deviceCurrent);

  }
  imageSource(avatar: string): string {
    let mypath = `${environment.sitecore_media}${avatar}.ashx`;
    return mypath;
  }
  goToNextScreen(){
    this.context.iceModel.elements['eclaims.step'].setSimpleValue(2);
  }
  onDeviceSelectChange()
  {
    let index=0;
    // console.log("availableDevices.length:"+this.availableDevices.length);
    // console.log(` this.deviceCurrent:${ this.deviceCurrent}`);
    for(let i=0; i<this.availableDevices.length; i++ ){
      // console.log(`this.availableDevices[${i}].label:${this.availableDevices[i].label}`);
      if(this.availableDevices[i].deviceId == this.deviceSelected){
        index=i;
      }
    }
    // console.log("index before:"+index);
    index = (((index+1) % this.availableDevices.length)+ this.availableDevices.length) % this.availableDevices.length;
    // console.log(`index after:${index}`);
    // console.log(`this.deviceSelected:${this.deviceSelected}`);
    // console.log(`this.availableDevices[index].deviceId:${this.availableDevices[index].deviceId}`);
    if (this.deviceSelected !== this.availableDevices[index].deviceId) {
      this.deviceSelected = this.availableDevices[index].deviceId;
      this.deviceCurrent = this.availableDevices[index];
    }
  }
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device? (device.deviceId || '') : '';
    if(device && (device.label.indexOf("γραφείου") > -1  || device && device.label.indexOf("Desk") > -1)){
      for(let i=0; i<this.availableDevices.length; i++ ){
        if(this.availableDevices[i].label.indexOf("Πίσω κάμερα")>=0 || this.availableDevices[i].label.indexOf("Back Camera")>=0){
          this.deviceSelected = this.availableDevices[i].deviceId;
          this.deviceCurrent = this.availableDevices[i];
        }
      }
    }else if(device && (device.label.indexOf("3") > -1|| device.label.indexOf("2,") > -1)){
      for(let i=0; i<this.availableDevices.length; i++ ){
        // console.log("onCamerasFound2 length:"+ this.availableDevices ? this.availableDevices.length : "null");
        if(this.availableDevices[i].label.indexOf("0,")>=0){
          this.deviceSelected = this.availableDevices[i].deviceId;
          this.deviceCurrent = this.availableDevices[i];
          // console.log("onCamerasFound deviceCurrent:"+ this.deviceCurrent ? this.deviceCurrent.label : "null");
        }
      }
    }
    if (this.deviceSelected !== selectedStr && selectedStr!=='') {
      this.deviceSelected = selectedStr;
      this.deviceCurrent = device || null;
    }
    if(this.deviceCurrent && (this.deviceCurrent.label.indexOf("γραφείου") > -1 ||this.deviceCurrent && this.deviceCurrent.label.indexOf("Desk") > -1)){
      for(let i=0; i<this.availableDevices.length; i++ ){
        if(this.availableDevices[i].label.indexOf("Πίσω κάμερα")>=0 || this.availableDevices[i].label.indexOf("Back Camera")>=0){
          this.deviceSelected = this.availableDevices[i].deviceId;
          this.deviceCurrent = this.availableDevices[i];
        }
      }
    }else if(this.deviceCurrent && (this.deviceCurrent.label.indexOf("3") > -1|| this.deviceCurrent.label.indexOf("2,") > -1)){
      for(let i=0; i<this.availableDevices.length; i++ ){
        // console.log("onCamerasFound2 length:"+ this.availableDevices ? this.availableDevices.length : "null");
        if(this.availableDevices[i].label.indexOf("0,")>=0){
          this.deviceSelected = this.availableDevices[i].deviceId;
          this.deviceCurrent = this.availableDevices[i];
          // console.log("onCamerasFound deviceCurrent:"+ this.deviceCurrent ? this.deviceCurrent.label : "null");
        }
      }
    }
    // console.log(`device.deviceId:${device.deviceId}`);
    // console.log(`onDeviceChange:${selectedStr}`);

  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.onCamerasDevicesFound = devices;
    this.availableDevices = devices;
    this.filterCameraDevices();
    // console.log("onCamerasFound length:"+ this.availableDevices ? this.availableDevices.length : "null");
    if(!this.foundBackCam && this.deviceSelected != this.availableDevices[0].deviceId){
      for(let i=0; i<this.availableDevices.length; i++ ){
        if(this.availableDevices[i].label.indexOf("Πίσω κάμερα")>=0 || this.availableDevices[i].label.indexOf("Back Camera")>=0 || (this.availableDevices[i].label.indexOf("back")>=0 && this.availableDevices[i].label.indexOf("0,")>=0)){
          this.deviceSelected = this.availableDevices[0].deviceId;
          this.deviceCurrent = this.availableDevices[i];
          this.foundBackCam = true;
        }
      }
      if(!this.foundBackCam){
        this.deviceSelected = this.availableDevices[0].deviceId;
        this.deviceCurrent = this.availableDevices? (this.availableDevices.length>0? this.availableDevices[0] : null) : null;
        this.foundBackCam = true;
      }
    }
    // console.log("onCamerasFound deviceCurrent:"+ this.deviceCurrent ? this.deviceCurrent.label : "null");

    if(this.deviceCurrent && (this.deviceCurrent.label.indexOf("γραφείου") > -1 || this.deviceCurrent && this.deviceCurrent.label.indexOf("Desk") > -1)){
      for(let i=0; i<this.availableDevices.length; i++ ){
        if(this.availableDevices[i].label.indexOf("Πίσω κάμερα")>=0 || this.availableDevices[i].label.indexOf("Back Camera")>=0){
          this.deviceCurrent = this.availableDevices[i];
        }
      }
    }else if(this.deviceCurrent && (this.deviceCurrent.label.indexOf("3") > -1|| this.deviceCurrent.label.indexOf("2,") > -1)){
      for(let i=0; i<this.availableDevices.length; i++ ){
        // console.log("onCamerasFound2 length:"+ this.availableDevices ? this.availableDevices.length : "null");
        if(this.availableDevices[i].label.indexOf("0,")>=0){
          this.deviceCurrent = this.availableDevices[i];
          // console.log("onCamerasFound deviceCurrent:"+ this.deviceCurrent ? this.deviceCurrent.label : "null");
        }
      }
    }
    this.hasDevices = Boolean(devices && devices.length);
  }
  onHasPermission(has: boolean) {
    // console.log("onHasPermission:"+has);
    if(has==null){
      this.hasPermission = true;
    }else{
      this.hasPermission = has;
    }
    // console.log(" this.hasPermission:"+ this.hasPermission);

  }

  filterCameraDevices(){
    let filterCameraDevices: any=[];
    // this.availableDevices = this.onCamerasDevicesFound;
    if(this.availableDevices && this.availableDevices.length>0){
      // console.log("filterCameraDevices" + this.availableDevices.length);
      let back,front = false;
      let backCamIndex;
      for(let i=0; i<this.availableDevices.length; i++ ){
        // console.log("filterCameraDevices FOR" + this.availableDevices[i].label);
        // if(this.availableDevices[i].label.indexOf("back")>=0 && !back){
        //   back=true;
        //   filterCameraDevices.push(this.availableDevices[i]);
        //   backCamIndex = filterCameraDevices.length-1;
        //   console.log("back" + this.availableDevices[i].label);
        // }else
        if(this.availableDevices[i].label.indexOf("back")>=0 && this.availableDevices[i].label.indexOf("0,")>=0 && !back){
          back=true;
          filterCameraDevices.push(this.availableDevices[i]);
          if(!this.foundBackCam && this.deviceSelected != this.availableDevices[i].deviceId){
            this.deviceSelected = this.availableDevices[i].deviceId;
            this.deviceCurrent = this.availableDevices[i];
            this.foundBackCam = true;
            // console.log("back2 :foundBackCam:" + this.availableDevices[i].label);

          }
          // filterCameraDevices[backCamIndex] = this.availableDevices[i];
          // console.log("back2" + this.availableDevices[i].label);
        }else if(this.availableDevices[i].label.indexOf("front")>=0 && !front){
          front=true;
          filterCameraDevices.push(this.availableDevices[i]);
          // console.log("front" + this.availableDevices[i].label);
        }else if((this.availableDevices[i].label.indexOf("Πίσω κάμερα")>=0 || this.availableDevices[i].label.indexOf("Back Camera")>=0) && !back){
          back=true;
          filterCameraDevices.push(this.availableDevices[i]);
          if(!this.foundBackCam && this.deviceSelected != this.availableDevices[i].deviceId){
            this.deviceSelected = this.availableDevices[i].deviceId;
            this.deviceCurrent = this.availableDevices[i];
            this.foundBackCam = true;
          }
          // console.log("Πίσω κάμερα" + this.availableDevices[i].label);
        }else if((this.availableDevices[i].label.indexOf("υπερευρεία")>=0 || this.availableDevices[i].label.indexOf("Wide")>=0)){
          filterCameraDevices.push(this.availableDevices[i]);
        }else if((this.availableDevices[i].label.indexOf("Μπροστινή κάμερα")>=0 || this.availableDevices[i].label.indexOf("Front Camera")>=0) && !front){
          front=true;
          filterCameraDevices.push(this.availableDevices[i]);
          // console.log("Μπροστινή κάμερα" + this.availableDevices[i].label);
        }
      }
    }
    if(filterCameraDevices && filterCameraDevices.length>0){
      this.availableDevices = filterCameraDevices
    }
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }
}

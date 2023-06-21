import { Component, OnDestroy, OnInit } from '@angular/core';
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { environment } from "@insis-portal/environments/environment";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import * as _ from "lodash";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';
import { Subject } from 'rxjs';
import { SpinnerService } from '@insis-portal/services/spinner.service';
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
  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo = null;
  deviceSelected: string;
  hasDevices: boolean;

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
    svg.setAttribute("style", "display: block; float: right; fill: #383b38");
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
    for(let i=0; i<this.availableDevices.length; i++ ){
      if(this.availableDevices[i] == this.deviceCurrent){
        index=i;
      }
    }
    index = (index+1) % this.availableDevices.length;
    this.deviceSelected = this.availableDevices[index].deviceId;
    this.deviceCurrent = this.availableDevices[index] || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device ?  (device.deviceId ?  device.deviceId: ''): '';
    if (this.deviceSelected === selectedStr) { return; };
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.deviceCurrent = this.availableDevices[0]? this.availableDevices[0] : null;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
}

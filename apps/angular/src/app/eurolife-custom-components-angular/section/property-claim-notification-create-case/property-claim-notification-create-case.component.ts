import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IndexedValue } from '@impeo/ice-core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
} from '@impeo/ng-ice';
import * as jwt_token from 'jwt-decode';
import * as _ from "lodash";
import { LocalStorageService } from '../../../services/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { environment } from "../../../../environments/environment";



interface Token {
  GeneratedToken: string;
}

@Component({
  selector: 'app-property-claim-notification-create-case',
  templateUrl: './property-claim-notification-create-case.component.html',
  styleUrls: ['./property-claim-notification-create-case.component.scss'],
})
export class PropertyClaimNotificationCreateCaseComponent
  extends SectionComponentImplementation
  implements OnInit, OnDestroy
{

  myinput: any;
  errorMsg: String = '';
  showField: boolean;
  regexpios: RegExp = undefined;
  @ViewChild('messageInput') messageInput: ElementRef;
  search: string;   // text to search
  regexp: RegExp;
  jwt_data: any;
  NgdialogRef: NgbModalRef;
  private destroy$ = new Subject<void>();
  checked: boolean;
  contentPropertyData: any[] = [];
  contentPropertyLoaded: boolean = false;
  data: any;


  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService,
    private zone:NgZone,
    public modalService: ModalService,
    public ngbModal: NgbModal
  ) {
    super(parent);
    this.zone.run(() => { console.log('Do change detection here'); });
  }

  ngOnInit(): void {


    this.getData();
    //Accident items
    this.context.iceModel.elements['property.claim.notification.accidentDate.input'].setSimpleValue(null);
    this.context.iceModel.elements['property.claim.notification.claimType.dropdown'].setSimpleValue(null);
    this.context.iceModel.elements['property.claim.notification.description.input'].setSimpleValue(null);

    //Communication item
    this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));//todo to change for property element.
    this.context.iceModel.elements['property.claim.notification.MobilePhone'].setSimpleValue(this.jwt_data.extension_Mobile);
    this.context.iceModel.elements['property.claim.notification.Email'].setSimpleValue(this.jwt_data.emails[0]);


    this.context.iceModel.elements["property.claim.step"].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)==2) {
        this.getData();
      }

    });
  }

  private getData() {
    this.data = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if (!!this.data) {
      this.contentPropertyData=[];
      for (const contract of this.data) {
        if (contract.Branch === 'ΠΕΡΙΟΥΣΙΑΣ' && contract.checked === true) {
          this.contentPropertyData.push(contract);
          this.contentPropertyLoaded = true;
          let address:string=contract.ContractPropertyCoolgenDetails.PropertyStreet+","+contract.ContractPropertyCoolgenDetails.PropertyZipCode+","+contract.ContractPropertyCoolgenDetails.PropertyCity;
          this.iceModel.elements["property.claim.notification.PolicyNumberHeader"].setSimpleValue(contract.ContractKey);
          this.iceModel.elements["property.claim.notification.PropertyAddress"].setSimpleValue(address.toString());
          this.iceModel.elements["property.claim.notification.StartDate"].setSimpleValue(contract.StartDate);
        }
      }

    }
  }

  getDataList(){
    return this.contentPropertyData;
  }

  getPropertyContentLoaded(){
    return this.contentPropertyLoaded;
  }


  getGridColumnClass(col: any): string {
    let result: any;
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
    if (this.context.iceModel.elements[col.css]) {
      let dt_name = this.context.iceModel.elements[col.css].recipe.dtName;
      let dt = this.page.iceModel.dts[dt_name];
      if (dt) {
        result = dt.evaluateSync();
        if (result.elementClass) {
          return result.elementClass;
        }

      }
    }

    if (col.css) css = css + " " + col.css;
    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.internalCol;
    if (col.css) css = css + " " + col.css;
    return css;
  }

  get elementClass(): string {
    return '';
  }

  getSectionClass(row: any) {
    let result: any;
    if (row.css) {
      if (this.context.iceModel.elements[row.css] != undefined) {
        let dt_name = this.context.iceModel.elements[row.css].recipe.dtName;
        let dt = this.page.iceModel.dts[dt_name];
        if (dt) {
          result = dt.evaluateSync();
          if (result.defaultValue) {
            return result.defaultValue;
          }
          else {
            return 'section-breaks-gen';
          }

        }
      }else{
        return row.css;
      }

    }
    return null;
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

  submit(text: string): void {
    this.search = text;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

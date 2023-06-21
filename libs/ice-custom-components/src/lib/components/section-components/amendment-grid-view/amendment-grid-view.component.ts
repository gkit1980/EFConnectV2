import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import * as jwt_token from 'jwt-decode';


@Component({
  selector: 'app-amendment-grid-view',
  templateUrl: './amendment-grid-view.component.html',
  styleUrls: ['./amendment-grid-view.component.scss']
})
export class AmendmentGridViewComponent extends SectionComponentImplementation implements OnInit{


  jwt_data: any;

  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService) {
    super(parent);
  }
  ngOnInit() {
    this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));
    this.context.iceModel.elements['customer.details.MobilePhone'].setSimpleValue(this.jwt_data.extension_Mobile);
    this.context.iceModel.elements['customer.details.Email'].setSimpleValue(this.jwt_data.emails[0]);

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

  get showSection(): boolean {

      if(this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null)==true)
      return true;
      else
      return false;
    }


}

import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-consent-footer',
  templateUrl: './consent-footer.component.html',
  styleUrls: ['./consent-footer.component.scss']
})
export class ConsentFooterComponent extends SectionComponentImplementation implements OnInit {

  jwt_data: any;

  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService) {
    super(parent);
  }

  ngOnInit() 
  {
  this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));
  
  }

  getGridColumnClass(col: any): string 
  {
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

  getGridInternalColumnClass(col: any): string 
  {
      var css = col.arrayElements ? "col-md-12" : "col-md-" + col.internalCol;
      if (col.css) css = css + " " + col.css;
      return css;
  }
  
  get elementClass(): string 
  {
    return '';
  }

  getSectionClass(row: any) 
  {
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
      }else
      {
        return row.css;
      }

    }
    return null;
  }




}

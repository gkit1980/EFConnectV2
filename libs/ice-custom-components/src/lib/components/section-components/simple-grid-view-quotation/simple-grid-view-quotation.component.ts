import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Subscription } from 'rxjs';
import { IndexedValue } from "@impeo/ice-core";


@Component({
  selector: 'app-simple-grid-view-quotation',
  templateUrl: './simple-grid-view-quotation.component.html',
  styleUrls: ['./simple-grid-view-quotation.component.scss']
})
export class SimpleGridViewQuotationComponent extends SectionComponentImplementation implements OnInit {

  jwt_data: any;
  quotationlabel:string;
  quotation: string


  private subscription1$: Subscription;
  private subscriptions: Subscription[] = [];


  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef) {
    super(parent);
  }

  ngOnInit() {
    this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));
    this.context.iceModel.elements['customer.details.MobilePhone'].setSimpleValue(this.jwt_data.extension_Mobile);
    this.context.iceModel.elements['customer.details.Email'].setSimpleValue(this.jwt_data.emails[0]);

    ///This is only for vanilla ul !!!!

    try {
      const fundValExecEnded = this.context.iceModel.elements['fundvaluation.execution'].getValue().forIndex(null);
      if (fundValExecEnded === true) {
        this.quotationlabel = this.recipe.quotationlabel;
        this.quotation = this.formatDate(
          this.context.iceModel.elements[this.recipe.quotation].getValue().values[0].value
        );
      } else {
        this.quotationlabel = null;
        this.quotation = null;
      }
    } catch (err) {
      this.quotationlabel = null;
      this.quotation = null;
    }

    //Subscribe
    this.subscription1$ = this.context.iceModel.elements['fundvaluation.execution'].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true) {
          this.quotationlabel = this.recipe.quotationlabel;
          this.quotation = this.formatDate(
            this.context.iceModel.elements[this.recipe.quotation].getValue().values[0].value
          );
        }
      }
    );

    this.subscriptions.push(this.subscription1$);
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
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

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }


  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


}

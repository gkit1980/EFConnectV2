import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import {LifecycleEvent } from '@impeo/ice-core';
import { get } from 'lodash';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent extends SectionComponentImplementation implements OnInit {

  jwt_data: any;

  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef) {
    super(parent);
  }
  ngOnInit() {
    this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));
    this.context.iceModel.elements['customer.details.MobilePhone'].setSimpleValue(this.jwt_data.extension_Mobile);
    this.context.iceModel.elements['customer.details.Email'].setSimpleValue(this.jwt_data.emails[0]);

    //Check Marketing Consents



    this.CheckMarketConsents();

    //refresh reasons
    this.context.$lifecycle.subscribe(
      (e: LifecycleEvent) => {

        const actionName = get(e, ['payload', 'action']);

       if (actionName.includes("actionGetCustomerFullData") && e.type === 'ACTION_FINISHED')
       {
        this.CheckMarketConsents();
       }


  })

}

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }

  ngAfterViewInit()
  {
 if(this.localStorage.getDataFromLocalStorage("refreshStatus") == 1)
    this.CheckMarketConsents();
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

  CheckMarketConsents()
  {
   //Market Consents  - Group
   if(this.context.iceModel.elements['preferences.privacy.group.consent.simple'].getValue().forIndex(null)==true
      && this.context.iceModel.elements['preferences.privacy.group.consent.profile'].getValue().forIndex(null)==true)
   this.context.iceModel.elements['preferences.privacy.group.products'].setSimpleValue("ΝΑΙ ΓΙΑ ΑΠΛΕΣ ΚΑΙ ΣΤΟΧΕΥΜΕΝΕΣ* ΠΡΟΩΘΗΤΙΚΕΣ ΕΝΕΡΓΕΙΕΣ");

   if(this.context.iceModel.elements['preferences.privacy.group.consent.simple'].getValue().forIndex(null)==true
      && this.context.iceModel.elements['preferences.privacy.group.consent.profile'].getValue().forIndex(null)==false)
   this.context.iceModel.elements['preferences.privacy.group.products'].setSimpleValue("ΝΑΙ ΓΙΑ ΑΠΛΕΣ ΠΡΟΩΘΗΤΙΚΕΣ ΕΝΕΡΓΕΙΕΣ");

   if(this.context.iceModel.elements['preferences.privacy.group.consent.simple'].getValue().forIndex(null)==false
   && this.context.iceModel.elements['preferences.privacy.group.consent.profile'].getValue().forIndex(null)==false)
    this.context.iceModel.elements['preferences.privacy.group.products'].setSimpleValue("ΟΧΙ ");


   //Market Consents -  Third Party

   if(this.context.iceModel.elements['preferences.privacy.group.consent.thirdparty'].getValue().forIndex(null)==false)
    this.context.iceModel.elements['preferences.privacy.brokers.products'].setSimpleValue("ΟΧΙ");
   else
   this.context.iceModel.elements['preferences.privacy.brokers.products'].setSimpleValue("ΝΑΙ");
  }

}

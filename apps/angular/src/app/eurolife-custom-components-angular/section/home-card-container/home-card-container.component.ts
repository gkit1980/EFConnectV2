import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LocalStorageService } from '../../../services/local-storage.service';
import { environment } from "./../../../../environments/environment";
import { IndexedValue, LifecycleEvent } from "@impeo/ice-core";
import { Subscription } from 'rxjs';
import { get } from 'lodash';

@Component({
  selector: 'app-home-card-container',
  templateUrl: './home-card-container.component.html',
  styleUrls: ['./home-card-container.component.scss']
})
export class HomeCardContainerComponent extends SectionComponentImplementation implements OnInit {

  jwt_data: any;
  condition:boolean;
  showSkeletonAmendmentScreen: boolean;
  private subscription1$: Subscription;
  private subscription2$: Subscription;
  private subscription3$: Subscription;
  private subscriptions: Subscription[] = [];


  @ViewChild('nextButton') nextButton: TemplateRef<any>;


  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService) {
    super(parent);
  }
  ngOnInit() {

    this.condition= this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null);
    this.showSkeletonAmendmentScreen=true;


    this.subscription1$ = this.context.iceModel.elements['amendments.showAmendments'].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true) {
          //this.cdr.detectChanges();
          this.condition = true;
          this.showSkeletonAmendmentScreen = false;
        } else {
          this.condition = false;
          this.showSkeletonAmendmentScreen = false;
        }
      },
      (err) => console.error('subscription1$ got an error: ' + err)
    );
    this.subscriptions.push(this.subscription1$);

    this.subscription2$ = this.context.$lifecycle.subscribe(
      (e: LifecycleEvent) => {

        const actionName = get(e, ['payload', 'action']);
9
        if ( (actionName.includes('actionAmendmentsOnInit') || actionName.includes('actionGetPolicies')) && e.type=="ACTION_FINISHED" ) {
          if (this.context.iceModel.elements['amendments.showAmendments'].getValue().forIndex(null) == true) {
            this.condition = true;
            this.showSkeletonAmendmentScreen = false;
          } else {
            this.condition = false;
            this.showSkeletonAmendmentScreen = false;
          }
        }
      },
      (err) => console.error('subscription2$ got an error: ' + err)
    );
    this.subscriptions.push(this.subscription2$);

    this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));
    this.context.iceModel.elements['customer.details.MobilePhone'].setSimpleValue(this.jwt_data.extension_Mobile);
    this.context.iceModel.elements['customer.details.Email'].setSimpleValue(this.jwt_data.emails[0]);


  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  getGridColumnClass(col: any): string {
    var css = col.arrayElements ? "col-sm-12" : "col-sm-" + col.col;
    // if (col.css) {
    //   let dt = col.iceModel.dts["name of dt"];
    //   let dta = new DtAccessor(dt, this.iceModel);
    //   let result = dta.getOutputValue(null);
    // }
    if (col.css) css = css + " " + col.css;
    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-sm-12" : "col-sm-" + col.internalCol;
    if (col.css) css = css + " " + col.css;
    return css;
  }

  get elementClass(): string {
    return '';
  }

  getSectionClass(row: any) {
    let result: any;
    if (row.css) {
      if (this.context.iceModel.elements[row.css]) {
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
      }

    }
    return null;
  }

  get showSection(): boolean {

      //ios bug
      this.subscription3$ = this.context.iceModel.elements["amendments.showAmendments"].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) === true)
        {
         //this.cdr.detectChanges();
         return true;
        }
        else
        return false;
      });
      this.subscriptions.push(this.subscription3$);

    if(this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null)==true)
    return true;
    else
    return false;
  }




  icon():string
  {
      let icon = environment.sitecore_media + "C8705EB508D542E59548EF002F938768" + ".ashx";
      return icon;
  }

  handleSVGIndexIcon(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }








}

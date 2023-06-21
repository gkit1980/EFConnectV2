import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit, TemplateRef, ViewChild,ChangeDetectorRef  } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { environment } from "@insis-portal/environments/environment";
import { IndexedValue, ItemElement, ValueOrigin } from "@impeo/ice-core";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-card-container-amendment',
  templateUrl: './home-card-container-amendment.component.html',
  styleUrls: ['./home-card-container-amendment.component.scss']
})
export class HomeCardContainerAmendmentComponent extends SectionComponentImplementation implements OnInit {

  jwt_data: any;
  condition:boolean=false;
  private subscription1$: Subscription;
  private subscription2$: Subscription;
  private subscriptions: Subscription[] = [];


  @ViewChild('nextButton') nextButton: TemplateRef<any>;


  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService,private cdr: ChangeDetectorRef) {
    super(parent);
  }
  ngOnInit() {

    this.condition= this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null);
    this.subscription1$ = this.context.iceModel.elements["amendments.showAmendments"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) === true)
      {
       //this.cdr.detectChanges();
      this.condition=true;
      }
      else
      return false;
    });
    this.subscriptions.push(this.subscription1$);


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


  get showSection(): boolean {


     //ios bug
     this.subscription2$ = this.context.iceModel.elements["amendments.showAmendments"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) === true)
      {
       //this.cdr.detectChanges();
       return true;
      }
      else
      return false;
    });
    this.subscriptions.push(this.subscription2$);

    if(this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null)==true)
    return true;
    else
    return false;
  }



}


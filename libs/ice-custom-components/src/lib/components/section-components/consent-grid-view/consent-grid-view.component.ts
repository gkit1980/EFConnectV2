import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jwt_token from 'jwt-decode';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { HostListener,HostBinding} from '@angular/core';

@Component({
  selector: 'app-consent-grid-view',
  templateUrl: './consent-grid-view.component.html',
  styleUrls: ['./consent-grid-view.component.scss']
})
export class ConsentGridViewComponent extends SectionComponentImplementation implements OnInit {

  jwt_data: any;
  disableBtn:boolean=true;
  top:number;
  offSetHeight:number;
  scrollHeight:number;
  @ViewChild('sectioncontainer') messagecontainer: ElementRef;


  constructor(parent: IceSectionComponent, private localStorage: LocalStorageService) {
    super(parent);
  }

  ngOnInit()
  {
  //window.addEventListener('scroll', this.scrollEvent, true);
  this.jwt_data = jwt_token(this.localStorage.getDataFromLocalStorage('token'));

  }

  getGridColumnClass(col: any): string
  {
    let result: any;
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
   ///additional check

   if (col.css) css = css + " " + col.css;
    if (col.css && this.context.iceModel.elements["consent.page.index"].getValue().forIndex(null)==2)
    {
      css = css.replace('consent-grey-background','')
    }


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



onScroll()
{
  if(this.context.iceModel.elements["consent.initial.page.state"].getValue().forIndex(null)==true)
  {
      this.top=this.messagecontainer.nativeElement.scrollTop;
      this.offSetHeight=this.messagecontainer.nativeElement.offsetHeight;
      this.scrollHeight=this.messagecontainer.nativeElement.scrollHeight;
      if(this.top === 0){
        this.context.iceModel.elements["consent.button.enabled"].setSimpleValue(false);
      }
      let index = this.context.iceModel.elements["consent.page.index"].getValue().forIndex(null);
      if(this.top>this.scrollHeight-this.offSetHeight-1 && index === 1){
          this.context.iceModel.elements["consent.button.enabled"].setSimpleValue(true);
      }
   }

   else
   {
    this.context.iceModel.elements["consent.button.enabled"].setSimpleValue(true);
   }
}

showNote(): boolean {
  if (
    this.context.iceModel.elements["consent.page.index"]
      .getValue()
      .forIndex(null) == 1
  )
    return true;
  else return false;
}

}

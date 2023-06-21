import { Component } from "@angular/core";
import {
  SectionComponentImplementation,
  IceSectionComponent,
  ElementComponentImplementation
} from "@impeo/ng-ice";
import { environment } from "@insis-portal/environments/environment";
import { NgbModalRef, NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemElement, IndexedValue, ValueOrigin } from "@impeo/ice-core";
import { IceContextService } from "@impeo/ng-ice";

@Component({
  selector: "app-icon-output-consent",
  templateUrl: "./icon-output-consent.component.html",
  styleUrls: ["./icon-output-consent.component.scss"]
})
export class IconOutputConsentComponent extends ElementComponentImplementation {

 // icon:string;
  iconCode:string="";
  isConsent: boolean =false;



  constructor(public ngbModal: NgbModal,private contextService:IceContextService) {
    super();
  }


  ngOnInit()
  {
     this.iconCode = this.getRecipeParam("iconCode");
     this.isConsent=this.getRecipeParam("isConsent");
  }

  icon() {
    // Read first class
    let icon = this.getIcon(this.iconCode);
    return icon;
  }

  get text() {
    // Read first class
    let text = this.getRecipeParam("text");
    return text;
  }

  get AdditionalClasses() {
    // Read first class
    let AdditionalClasses = this.getRecipeParam("AdditionalClasses");
    return AdditionalClasses;
  }


  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {

    svg.setAttribute("style", "display: block");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    return svg;
  }

  async back()
  {
   if( this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==1)
   {
  ///needs code here...execute the gdpr action because redirect to first dialog
  let action = (await this.contextService.getContext("customerArea")).iceModel.actions['actionExecuteGdprRule'];
  if (action != null) {
    action.executionRules[0].execute();

  }


   let element=this.context.iceModel.elements['consent.flag.openfirstdialog'] as ItemElement;
   element.setValue(new IndexedValue(element,true,null,ValueOrigin.UI));

   }
   else{
    this.element.iceModel.elements["consent.page.index"].setSimpleValue(1);
    this.element.iceModel.elements["consent.showcloseicon"].setSimpleValue(true);
   }


  }

  isConsentWithPageIndex():any{
     if(this.isConsent &&
          (this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==1 || this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==2))
    // return 'icon-for-consents icon-for-consents-back';
    // else
     return 'icon-for-consents';


  }

}

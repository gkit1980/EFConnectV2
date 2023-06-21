import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../../section-components/motor-custom-table/motor-custom-table.section.component';
import { Overlay } from '@angular/cdk/overlay';
import { IcePrincipalService } from '@impeo/ng-ice';
import { IceButtonComponent } from '@impeo/ng-ice';
import { IndexedValue, ValueOrigin, ItemElement } from '@impeo/ice-core';


@Component({
  selector: "app-eurolife-consent-button",
  templateUrl: "./eurolife-consent-button.component.html",
  styleUrls: ["./eurolife-consent-button.component.scss"]
})
export class EurolifeConsentButtonComponent extends IceButtonComponent
  implements OnInit {
  isForSubmit: boolean = true;
  numberOfPoliciesToSubmit: number = 0;
  buttonClass: string;
  dialogRef: MatDialogRef<MotorCustomTableComponent>;
  labelname:string="";
  editmode:boolean=false;



  constructor(
    public dialog: MatDialog,
    private overlay: Overlay,
    private icePrincipalService: IcePrincipalService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.labelname=this.element.recipe["labelname"];

    this.context.iceModel.elements["consent.page.index"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) ==1 && this.element.name=="consent.details.right.button")
      {
        this.labelname=this.element.recipe["labelname"];
        if(this.context.iceModel.elements["consent.button.enabled"].getValue().forIndex(null)==true)
        {
          this.editmode=true;
        }
      }
    });



   if(this.element.name=="consent.details.right.button" && this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==1)
   {
      // // subscribe to the element which close the dialog
    this.context.iceModel.elements["consent.button.enabled"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
        this.editmode=true;
      }
    });

    if(this.context.iceModel.elements["consent.button.enabled"].getValue().forIndex(null)==true)
    this.editmode=true;



   }



   if(this.element.name=="consent.details.left.button" )
   {
    this.editmode=true;
   }


   //Condition for enabling right consent button while you toggle at least one contract
   this.context.iceModel.elements["consent.number.submition"].$dataModelValueChange.subscribe((value: IndexedValue) => {

    if (value.element.getValue().forIndex(null)>0 && this.element.name=="consent.details.right.button" && this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==2)
    {
      this.editmode=true;
    }

    if (value.element.getValue().forIndex(null)==0 && this.element.name=="consent.details.right.button" && this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==2)
    {
      this.editmode=false;
    }


  });

}



  get additionalClasses() {
    let additionalClasses = this.element.recipe["additionalClasses"];

    // getRecipeParam('additionalClasses');
    if (additionalClasses == null) return "";

     ///im tired with conditions...
     if(this.element.name=="consent.details.right.button" && this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==1)
      return additionalClasses + " justify-content-center";
     else
      return additionalClasses;
  }

  get hideButton(): boolean {
    if (this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)<2 && this.element.name=="consent.details.left.button")
      return false;
    else
      return true;
  }

  get imageSource() {
    let imageSource = this.element.recipe["buttonIcon"];
    if (imageSource == null) return "";
    return imageSource;
  }

  get alignmentClass(): string {
      return null;
  }

  onClick() {

  this.context.iceModel.elements["consent.initial.page.state"].setSimpleValue(false);

  //Consent has 3 pages so the index should not overpass the number=3
  if(this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)<3)
  this.element.iceModel.elements["consent.page.index"].setSimpleValue(this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)+1);

  //Conditions for each

      if (this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)>=3 && this.element.name=="consent.details.right.button")
    {

      this.element.setSimpleValue(this.element.recipe['defaultValue'].StaticValueRule.value);
      super.onClick();
      this.element.iceModel.elements["consent.succesfull.submition"].setSimpleValue(true);
    }


  if (this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==2 && this.element.name=="consent.details.right.button")
    {
    let srollableElement = document.getElementById('height-scroll')
    srollableElement.scrollTo(0, 0);
    this.labelname="ΥΠΟΒΟΛΗ";
    this.element.iceModel.elements["consent.number.submition"].setSimpleValue(0);
    this.editmode=false;
    }
  if(this.element.name=="consent.details.left.button" && this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)>1)
    {
      let element= this.element.iceModel.elements["consent.popupdialog"] as ItemElement;
     // this.element.iceModel.elements["consent.popupdialog"].setSimpleValue(true);
      element.setValue(new IndexedValue(element,true,null,ValueOrigin.UI));
    }
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "27.4");

    return svg;
  }

  get svgFillColor() {
    let svgFillColor = this.element.recipe["svgFillColor"];
    if (svgFillColor == null) return "";
    return svgFillColor;
  }

  getVisibillityNumberOfPolicies():any{
   if(this.element.name=="consent.details.left.button")
   return "button-content hide-number"
   else
   {
    if(this.element.iceModel.elements["consent.page.index"].getValue().forIndex(null)==1)
      return "button-content hide-number"
    else
      return "button-content";
   }

  }

   getNumberOfPolicies() : number
   {
     return this.context.iceModel.elements["consent.number.submition"].getValue().forIndex(null);
   }


}

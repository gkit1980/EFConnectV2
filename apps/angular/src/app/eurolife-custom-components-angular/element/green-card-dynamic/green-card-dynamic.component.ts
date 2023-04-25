import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ElementComponentImplementation, NgIceContext } from "@impeo/ng-ice";
import * as _ from "lodash";
import { environment } from "../../../../environments/environment";
import { IndexedValue, ItemElement, ValueOrigin } from "@impeo/ice-core";

@Component({
  selector: "app-green-card-dynamic",
  templateUrl: "./green-card-dynamic.component.html",
  styleUrls: ["./green-card-dynamic.component.scss"]
})
export class GreenCardDynamicComponent extends ElementComponentImplementation implements AfterViewInit {
  //value: any;
  charLength: any = 0;
  errorStateMatcher: any;
  show: boolean = false;
  dynamicComponent: any = false;
  varIceContext: NgIceContext;
  numOf: number;
  driverNumOf: number;
  isSubmitted: boolean = false;
  textError:string;
  defaultHeaderDriver: string = "";
  public error: boolean = false;
  isEnableBack: boolean= true;
  isEnabledArrow:boolean=false;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;



  @ViewChild('otherDriver') otherDriver: ElementRef;


  constructor() {
    super();
  }

  ngOnInit() {



    if (!this.dynamicComponent) {
      // subscribe to the element that shows the components that add 'other' driver

        this.context.iceModel.elements[ "greencard.motor.other.show.driver"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null) == true)
          {
            //At initialization the dialog is open..this is only for static component
            this.context.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(true);
            this.show = true;
            this.isSubmitted=false;
            this.context.iceModel.elements["greencard.motor.other.addition.enabled"].setSimpleValue(false);
          }
          else
          this.show = false;

        });


        this.context.iceModel.elements["greencard.motor.other.opendialog"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null) == true)
          {
            this.isEnabledArrow=false;
          }
          else
          this.isEnabledArrow=true;
        });



        let driverIndex = this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null);
        if (driverIndex === 1)
          this.defaultHeaderDriver = "ΠΡΩΤΟΣ ΟΔΗΓΟΣ";
        else
          this.defaultHeaderDriver = "ΔΕΥΤΕΡΟΣ ΟΔΗΓΟΣ";

      }
    else
    {
      // subscribe to the element that shows the components that add 'other' driver
      this.varIceContext.iceModel.elements["greencard.motor.other.show.driver"].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (value.element.getValue().forIndex(null) == true)
        {
        //At initialization the dialog is open..this is only for static component
        this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(true);
        this.show = true;
        this.isSubmitted=false;
        this.varIceContext.iceModel.elements["greencard.motor.other.addition.enabled"].setSimpleValue(false);
        }
        else this.show = false;
      });



        let driverIndex = this.varIceContext.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null);
        if (driverIndex === 1)
        {
          this.defaultHeaderDriver = "ΠΡΩΤΟΣ ΟΔΗΓΟΣ";
        } else
        {
          this.defaultHeaderDriver = "ΔΕΥΤΕΡΟΣ ΟΔΗΓΟΣ";
        }
        this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(true);



        this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null) == true)
          {
            this.isEnabledArrow=false;
          }
          else
          this.isEnabledArrow=true;
        });

    }
  }


  ngAfterViewInit() {
    if (this.dynamicComponent)
    {
      this.otherDriver.nativeElement.id = "dynamic-component-" + this.numOf;
   }
  }

  deleteDriver() {
    if (this.dynamicComponent) {


      var el = document.getElementById(this.otherDriver.nativeElement.id);
      el.remove();
      this.value = "";

      let static_elements: HTMLCollection= document.getElementsByClassName("static-component");
      let dynamic_elements: HTMLCollection= document.getElementsByClassName("dynamic-component");

      if(static_elements.length==0 && dynamic_elements.length==0)
      {
      this.varIceContext.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue("");
      this.varIceContext.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }


      if(static_elements.length==1 && dynamic_elements.length==0)
      {
      let el : HTMLSelectElement = static_elements[0] as HTMLSelectElement;
      var driver1:string=el.innerText;
      this.varIceContext.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.varIceContext.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }

      if(static_elements.length==0 && dynamic_elements.length==1)
      {
      let el : HTMLSelectElement = dynamic_elements[0] as HTMLSelectElement;
      var driver1:string=el.innerText;
      this.varIceContext.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.varIceContext.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }

      this.varIceContext.iceModel.elements["greencard.motor.other.delete.driver"].setSimpleValue(true);
      this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(false);
    }
    else
    {
      var el = document.getElementById("static-component");
      el.remove();
      this.value = "";

      let static_elements: HTMLCollection= document.getElementsByClassName("static-component");
      let dynamic_elements: HTMLCollection= document.getElementsByClassName("dynamic-component");

      if(static_elements.length==0 && dynamic_elements.length==0)
      {

      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue("");
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }


      if(static_elements.length==1 && dynamic_elements.length==0)
      {
      let el : HTMLSelectElement = static_elements[0] as HTMLSelectElement;
      var driver1:string=el.innerText;
      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }

      if(static_elements.length==0 && dynamic_elements.length==1)
      {
      let el : HTMLSelectElement = dynamic_elements[0] as HTMLSelectElement;
      var driver1:string=el.innerText;
      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }

      this.context.iceModel.elements["greencard.motor.other.delete.driver"].setSimpleValue(false);
      this.context.iceModel.elements["greencard.motor.other.drivers.number"].setSimpleValue(this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null) - 1);
      this.context.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(false);
    }
  }

  submitDriver() {
    if(this.value==undefined || this.value=="")
    {
      this.error = true;
      this.textError="Το πεδίο ειναι υποχρεωτικό!"
      return;
    }
    else
    this.error = false;


    this.isSubmitted = true;

    let static_elements: HTMLCollection= document.getElementsByClassName("static-component");
    let dynamic_elements: HTMLCollection= document.getElementsByClassName("dynamic-component");


    if(this.dynamicComponent)
    {
      this.varIceContext.iceModel.elements["greencard.motor.other.addition.enabled"].setSimpleValue(true);
      this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(false);

 //     this.varIceContext.iceModel.elements["greencard.motor.other.driver.isSubmitted"].setSimpleValue(true);

    }
    else
    {
      this.context.iceModel.elements["greencard.motor.other.addition.enabled"].setSimpleValue(true);
      this.context.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(false);

//      this.context.iceModel.elements["greencard.motor.other.driver.isSubmitted"].setSimpleValue(true);
    }

    //cases..pure Javascript

    if(static_elements.length==1 && dynamic_elements.length==0)
    {
      //var document1=static_elements[0].getElementsByClassName("myInput");

     let el : HTMLSelectElement = static_elements[0] as HTMLSelectElement;
     var driver1:string=el.innerText;
     this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
     this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
    }


    if(static_elements.length==1 && dynamic_elements.length==1)
    {
      let el1 : HTMLSelectElement = static_elements[0] as HTMLSelectElement;
      let el2 : HTMLSelectElement = dynamic_elements[0] as HTMLSelectElement;

      var driver1:string=el1.innerText;
      var driver2:string=el2.innerText;

      if(this.dynamicComponent)
      {
      this.varIceContext.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.varIceContext.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue(driver2);
      }
      else
      {
      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue(driver2);
      }

    }

    if(static_elements.length==0 && dynamic_elements.length==1)
    {
      let el1 : HTMLSelectElement = dynamic_elements[0] as HTMLSelectElement;
      var driver1:string=el1.innerText;
      if(this.dynamicComponent)
      {
      this.varIceContext.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.varIceContext.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }
      else
      {
      this.context.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.context.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue("");
      }

    }

    if(static_elements.length==0 && dynamic_elements.length==2)
    {
      let el1 : HTMLSelectElement = dynamic_elements[0] as HTMLSelectElement;
      let el2 : HTMLSelectElement = dynamic_elements[1] as HTMLSelectElement;

      var driver1:string=el1.innerText;
      var driver2:string=el2.innerText;
      this.varIceContext.iceModel.elements["greencard.motor.other.driver1"].setSimpleValue(driver1);
      this.varIceContext.iceModel.elements["greencard.motor.other.driver2"].setSimpleValue(driver2);
    }


  }

  editDriver() {

    if (this.dynamicComponent)
    {
      if(!this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].getValue().forIndex(null))
      {
      this.isSubmitted = false;
      this.varIceContext.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(true);
      }
    }
    else
    {
      if(!this.context.iceModel.elements["greencard.motor.other.opendialog"].getValue().forIndex(null))
      {
      this.isSubmitted = false;
      this.context.iceModel.elements["greencard.motor.other.opendialog"].setSimpleValue(true);
      }
    }

  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "30");

    return svg;
  }
  handleSVGUser(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  validateLatin(event: any) {

    this.regexp = new RegExp(/^[A-Za-z\s]+$/);
    let x:string =event.key;
    this.validateRegex = this.regexp.test(x);
    if (this.validateRegex) {

      this.error = false;
      this.isEnableBack=false;

      if(this.value==undefined || this.value=="")   //extra condition
      this.isEnableBack=true;
      else
      {
        if(this.value.length==1 && x=="Backspace")
        this.isEnableBack=true;
      }

       return true;


    }
    else {

      if(this.value.length==0)
      this.isEnableBack=true;

      this.error = true;
      this.textError="Επιτρέπονται μόνο λατινικοί χαρακτήρες"
      return false;

    }


  }



  get labelClass() {
    if(this.dynamicComponent)
    return 'dynamic-component';
    else
    return 'static-component';
  }




}

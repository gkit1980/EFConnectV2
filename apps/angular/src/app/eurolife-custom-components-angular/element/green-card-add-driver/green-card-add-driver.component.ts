import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { GreenCardDynamicComponent } from '../../element/green-card-dynamic/green-card-dynamic.component';
import { IndexedValue} from "@impeo/ice-core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-green-card-add-driver',
  templateUrl: './green-card-add-driver.component.html',
  styleUrls: ['./green-card-add-driver.component.scss']
})
export class GreenCardAddDriverComponent extends ElementComponentImplementation  {

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  componentRef:any;
  // varIceContext: NgIceContext;
  show :boolean =false;
  counter:number=0;
  isEnableBack:boolean=true;
  // varIceContext:NgIceContext;



  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }


  ngOnInit() {

        // subscribe to the element that removes the additional driver
        this.context.iceModel.elements["greencard.motor.other.delete.driver"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null) == true)
          {
              this.context.iceModel.elements["greencard.motor.other.delete.driver"].setSimpleValue(false);
              this.context.iceModel.elements["greencard.motor.other.drivers.number"].setSimpleValue(this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null)-1);
          }
        });

        // subscribe to the element that shows the components that add 'other' driver
        this.context.iceModel.elements["greencard.motor.other.show.driver"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null) == true)
          this.show=true;
          else
          this.show=false;
        });

          // subscribe to the element that shows the css class the components that add 'other' driver
          this.context.iceModel.elements["greencard.motor.other.opendialog"].$dataModelValueChange.subscribe((value: IndexedValue) => {
            if (value.element.getValue().forIndex(null) == true)
              {
              if(this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null)<=2)
               this.isEnableBack=true;
               else
               this.isEnableBack=false;
              }
            else
            {
              if(this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null)<2)
              this.isEnableBack=false;
              else
              this.isEnableBack=true;
            }
          });


  }

  ngOnDestroy()
  {
    this.context.iceModel.elements["greencard.motor.other.drivers.number"].setSimpleValue(1);
  }


  addElement() {
     // create the component factory...only once you can create it

     if(this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null)<2 && this.context.iceModel.elements["greencard.motor.other.addition.enabled"].getValue().forIndex(null)==true)
     {
     this.counter++;
     this.context.iceModel.elements["greencard.motor.other.drivers.number"].setSimpleValue(this.context.iceModel.elements["greencard.motor.other.drivers.number"].getValue().forIndex(null)+1);
     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GreenCardDynamicComponent);
     // add the component to the view
     this.componentRef = this.container.createComponent(componentFactory);
     // pass some data to the component
     this.componentRef.instance.varIceContext = this.context;
     this.componentRef.instance.dynamicComponent=true;
     this.componentRef.instance.numOf=this.counter;
     this.componentRef.instance.show=true;
     }

  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "30");

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

}

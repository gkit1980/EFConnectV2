import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import * as _ from 'lodash';
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ItemElement, ValueOrigin, IndexedValue, LifecycleType } from "@impeo/ice-core";
import { RECAPTCHA_SETTINGS } from "ng-recaptcha";

@Component({
  selector: "app-consents-cards",
  templateUrl: "./consents-cards.component.html",
  styleUrls: ["./consents-cards.component.scss"]
})
export class ConsentsCardsComponent extends ElementComponentImplementation implements OnInit {

  items: any[];
  gdprItems: any[]=[];
  GdprData: any;
  counter:number=0;

  //All the possible answers from Eurtolife Services
  answers:any[]=[
      {
        "Id":101001,
        "Code":"noanswer"
      },
      {
        "Id":101002,
        "Code":"consent"
      },
      {
      "Id":101003,
      "Code":"noconsent"
      }
  ]

  selectedContracts:any[] =[];

  constructor() {
    super();
  }

  ngOnInit() {


    this.addItems();
    this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.ACTION_FINISHED) {    ///Check  change with DATASTORE_ASSIGN

        //fill the items
        this.gdprItems=[];
        this.addItems();
      }
    });

  }

  addItems()
  {

    if (this.element.recipe["dataStorePropertyItems"] == null) {
      return;
    }

    this.items = _.get(this.context.dataStore, this.element.recipe["dataStorePropertyItems"]);

    if(this.items==undefined)
    return;

    this.GdprData= _.get(this.context.dataStore, this.element.recipe["dataStorePropertyGdprData"]);
    // let participantId=this.GdprData.ParticipantId;
    for(let answer of this.GdprData.Answers)
    {
       if(answer.AnswerId=="101001" && answer.SensitiveSource.IsSameCustomer=="1")
          for(let item of this.items)
          {
            if(item.ContractKey== answer.SensitiveSource.ContractKey)
                 this.gdprItems.push(item)
          }
    }

    this.context.iceModel.elements["consent.number.contracts"].setSimpleValue(this.gdprItems.length);

    this.context.iceModel.elements["consent.page.index"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == 2)
      {
        this.counter=0;
      }
    });
  }


  showSpecificDescription(item: any): string {
    if (
      item.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ" ||
      item.Branch == "ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ"
    ) {
      return "Λοιποί Κλάδοι Γενικών Ασφαλειών";
    } else {
      return item.ProductDescritpion;
    }
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; float: right; fill: #383b38");
    svg.setAttribute("width", "29");
    svg.setAttribute("height", "30");

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "64");
    svg.setAttribute("height", "64");

    return svg;
  }

  showConsentCards():boolean
  {
    if(this.context.iceModel.elements["consent.page.index"].getValue().forIndex(null)==1)
    return false;
    else return true;
  }

  public toggle(event: MatSlideToggleChange,i:any) {
    if(event.checked)
    {
        this.counter++;
        this.context.iceModel.elements["consent.number.submition"].setSimpleValue(this.context.iceModel.elements["consent.number.submition"].getValue().forIndex(null)+1);
        this.context.dataStore.data.GdprData.Answers.forEach((item:any,index:any)=>
        {
          if(item.SensitiveSource.ContractKey==i.ContractKey)
            _.set(this.context.dataStore.data.GdprData.Answers[index], 'AnswerId','101002');   //consent
        })
        if( this.counter== this.context.iceModel.elements["consent.number.contracts"].getValue().forIndex(null))
          this.context.iceModel.elements["consent.succesfull.difference.contracts"].setSimpleValue(true);
        else
          this.context.iceModel.elements["consent.succesfull.difference.contracts"].setSimpleValue(false);
    }
    else
    {
      this.counter--;
      this.context.iceModel.elements["consent.succesfull.difference.contracts"].setSimpleValue(false);

      this.context.dataStore.data.GdprData.Answers.forEach((item:any,index:any)=>
      {
        if(item.SensitiveSource.ContractKey==i.ContractKey)
          _.set(this.context.dataStore.data.GdprData.Answers[index], 'AnswerId','101001');   //noanswer
      })
    this.context.iceModel.elements["consent.number.submition"].setSimpleValue(this.context.iceModel.elements["consent.number.submition"].getValue().forIndex(null)-1);
    }
}


}

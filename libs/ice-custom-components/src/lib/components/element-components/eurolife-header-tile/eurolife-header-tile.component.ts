import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import * as moment from "moment";
import { LifecycleEvent} from "@impeo/ice-core";
import { get } from 'lodash';


@Component({
  selector: 'app-eurolife-header-tile',
  templateUrl: './eurolife-header-tile.component.html',
  styleUrls: ['./eurolife-header-tile.component.scss']
})
export class EurolifeHeaderTileComponent extends ElementComponentImplementation implements OnInit {

  elementLabel: string;
  elementValue: any;
  mylabel: string;
  notificationText: string;
  elementValueArray: any[] = [];
  refreshStatus: number;
  groupHealth: boolean =false;    //περιπτωση ΑΤΟΜΙΚΟΥ /ΟΜΑΔΙΚΟΥ ΣΥΜΒΟΛΑΙΟΥ

  constructor(
    private localStorage: LocalStorageService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if(this.context.iceModel.elements["selectedcontractbranch"].getValue().values[0].value==99)   //περιπτωση ΑΤΟΜΙΚΟΥ /ΟΜΑΔΙΚΟΥ ΣΥΜΒΟΛΑΙΟΥ
    this.groupHealth=true;

    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");
    let dt_name = this.getRecipeParam("dtName");
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      let result = dt.evaluateSync();
      if (dt_name === "dt_policy_details_second_tile_subheader") {
        if (this.context.iceModel.elements["policies.details.frequencyOfPayment"].getValue().values[0].value == "EΦΑΠΑΞ")
        {
          this.elementLabel = this.context.iceModel.recipe.elements[result["element"]].labelForEfapax;
        }
        else if(this.context.iceModel.elements["selectedcontractbranch"].getValue().values[0].value==99)    //Group Health case
        {
         this.elementLabel=this.resource.resolve("elements."+ result["element"]+".label");
        }
        else {
          this.mylabel = this.context.iceModel.recipe.elements[result["element"]].label.ResourceLabelRule.key;
          this.elementLabel = this.mylabel.slice(1, this.mylabel.length);
        }
      }
      else {
        this.mylabel = this.context.iceModel.recipe.elements[result["element"]].label.ResourceLabelRule.key;
        this.elementLabel = this.mylabel.slice(1, this.mylabel.length);
      }
      try {
        if (this.context.iceModel.elements[result["element"]].getValue().values[0].value.length) {
          for (let i = 0; i < this.context.iceModel.elements[result["element"]].getValue().values[0].value.length; i++) {
            if (this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].firstName && this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].lastName) {
              this.elementValueArray.push(this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].firstName + " " + this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].lastName);
            }

            // this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value[0].firstName + " " + this.context.iceModel.elements[result["element"]].getValue().values[0].value[0].lastName;
          }
          if (this.elementValueArray.length >= 1) {
            for (let j = 0; j < this.elementValueArray.length; j++) {
              if (this.elementValue == undefined) {
                this.elementValue = "";
                this.elementValue += this.elementValueArray[j] + " ";
              } else {
                if (this.elementValue != this.elementValueArray[j]) {
                  this.elementValue += this.elementValueArray[j] + " ";
                }

              }
            }
          } else {
            this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value;
             ///!!!! Group Health first tile special occasion
             if(this.context.iceModel.elements['selectedcontractbranch'].getValue().forIndex(null)==99 && dt_name === "dt_policy_details_first_tile_subheader")
             this.elementValue = this.context.iceModel.elements["policies.details.grouphealth.InsuredFirstName"].getValue().forIndex(null) + " "+
                                 this.context.iceModel.elements["policies.details.grouphealth.InsuredLastName"].getValue().forIndex(null);
          }
        } else {
          this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value;
          if (this.elementValue instanceof Date) {
            this.elementValue = moment(this.elementValue).format('DD/MM/YYYY');
          }
        }
      } catch (error) {

      }


      // if (this.elementValue instanceof Date) {
      //   this.elementValue = moment(this.elementValue).format('DD/MM/YYYY');
      // }
    }

    //Only for Refresh...the WriteFromOther is being executed for the purpose of refresh
    this.context.$lifecycle.subscribe((e:LifecycleEvent) => {

      const actionName = get(e, ['payload', 'action']);


      if (actionName.includes("actionWriteFromOtherForRefresh") && this.refreshStatus==1) {
      //  this.context.$actionEnded.observers.pop();
        let dt_name = this.getRecipeParam("dtName");
        let dt = this.page.iceModel.dts[dt_name];
        if (dt) {
          let result = dt.evaluateSync();
          if (dt_name === "dt_policy_details_second_tile_subheader") {
            if (this.context.iceModel.elements["policies.details.frequencyOfPayment"].getValue().values[0].value == "EΦΑΠΑΞ") {
              this.elementLabel = this.context.iceModel.recipe.elements[result["element"]].labelForEfapax;
            }
            else {
              this.mylabel = this.context.iceModel.recipe.elements[result["element"]].label.ResourceLabelRule.key;
              this.elementLabel = this.mylabel.slice(1, this.mylabel.length);
            }
          }
          else {
            this.mylabel = this.context.iceModel.recipe.elements[result["element"]].label.ResourceLabelRule.key;
            this.elementLabel = this.mylabel.slice(1, this.mylabel.length);
          }
          if (this.context.iceModel.elements[result["element"]].getValue().values[0].value.length) {
            for (let i = 0; i < this.context.iceModel.elements[result["element"]].getValue().values[0].value.length; i++)
            {
              if (this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].firstName && this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].lastName) {
                this.elementValueArray.push(this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].firstName + " " + this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].lastName);
              }

              // this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value[0].firstName + " " + this.context.iceModel.elements[result["element"]].getValue().values[0].value[0].lastName;
            }
            if (this.elementValueArray.length >= 1) {
              for (let j = 0; j < this.elementValueArray.length; j++) {
                if (this.elementValue == undefined) {
                  this.elementValue = "";
                  this.elementValue += this.elementValueArray[j] + " ";
                } else {
                  this.elementValue += this.elementValueArray[j] + " ";
                }
              }
            } else
            {
              this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value;
                ///!!!! Group Health first tile special occasion
             if(this.context.iceModel.elements['selectedcontractbranch'].getValue().forIndex(null)==99 && dt_name === "dt_policy_details_first_tile_subheader")
             this.elementValue = this.context.iceModel.elements["policies.details.grouphealth.InsuredFirstName"].getValue().forIndex(null) + " "+
                                 this.context.iceModel.elements["policies.details.grouphealth.InsuredLastName"].getValue().forIndex(null);
            }
          } else {
            this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value;
            if (this.elementValue instanceof Date) {
              this.elementValue = moment(this.elementValue).format('DD/MM/YYYY');
            }
          }
        }
        //this.SpinnerService.stop();
      }
    });



  }


  getElementValue() :string
  {
    this.elementValueArray=[];
    let dt_name = this.getRecipeParam("dtName");
    let dt = this.page.iceModel.dts[dt_name];
    if(dt)
    {
      let result = dt.evaluateSync();
      try
      {
          //Bug: this fix sshould be updated from backend...its temporary!!!!!!
          if(dt_name === "dt_policy_details_third_tile_subheader" && result["element"]=="policies.details.grouphealth.CustomerName" &&
          this.context.iceModel.elements['policies.details.ContractKey'].getValue().forIndex(null)=="1050000000")
          {
            this.elementValue="Όμιλος Εurobank";
          }else if(dt_name === "dt_policy_details_third_tile_subheader" && result["element"]=="policies.details.grouphealth.CustomerName" &&
          this.context.iceModel.elements['policies.details.ContractKey'].getValue().forIndex(null)=="2040000119")
          {
            this.elementValue="Latsco Family Office";
          }else if(dt_name === "dt_policy_details_third_tile_subheader" && result["element"]=="policies.details.grouphealth.CustomerName" &&
          this.context.iceModel.elements['policies.details.ContractKey'].getValue().forIndex(null)=="1018000000")
          {
            this.elementValue="doValue";
          }
          //end
          else
          {
              if (this.context.iceModel.elements[result["element"]].getValue().values[0].value!= null)
              {
                  for (let i = 0; i < this.context.iceModel.elements[result["element"]].getValue().values[0].value.length; i++)
                  {
                    if (this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].firstName && this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].lastName)
                    {
                      this.elementValueArray.push(this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].firstName + " " + this.context.iceModel.elements[result["element"]].getValue().values[0].value[i].lastName);
                    }

                    // this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value[0].firstName + " " + this.context.iceModel.elements[result["element"]].getValue().values[0].value[0].lastName;
                  }
                  if (this.elementValueArray.length >= 1)
                  {
                    this.elementValue='';
                    for (let j = 0; j < this.elementValueArray.length; j++)
                      this.elementValue += this.elementValueArray[j] + " ";
                  }
                  else
                  {
                    this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value;
                    ///!!!! Group Health first tile special occasion
                    if(this.context.iceModel.elements['selectedcontractbranch'].getValue().forIndex(null)==99 && dt_name === "dt_policy_details_first_tile_subheader")
                    this.elementValue = this.context.iceModel.elements["policies.details.grouphealth.InsuredFirstName"].getValue().forIndex(null) + " "+
                                        this.context.iceModel.elements["policies.details.grouphealth.InsuredLastName"].getValue().forIndex(null);
                  }
                  if (this.elementValue instanceof Date)
                  this.elementValue = moment(this.elementValue).format('DD/MM/YYYY');

              }
              else
              {
                this.elementValue = this.context.iceModel.elements[result["element"]].getValue().values[0].value;
                  ///!!!! Group Health first tile special occasion
                  if(this.context.iceModel.elements['selectedcontractbranch'].getValue().forIndex(null)==99 && dt_name === "dt_policy_details_first_tile_subheader")
                  this.elementValue = this.context.iceModel.elements["policies.details.grouphealth.InsuredFirstName"].getValue().forIndex(null) + " "+
                                      this.context.iceModel.elements["policies.details.grouphealth.InsuredLastName"].getValue().forIndex(null);

                if (this.elementValue instanceof Date)
                this.elementValue = moment(this.elementValue).format('DD/MM/YYYY');
              }
          }
        return this.elementValue;
      }
       catch (error) {

      }
    }
    else
    return null;


  }

}

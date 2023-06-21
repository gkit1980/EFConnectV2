import { ElementComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { OutputComponent } from '@impeo/ng-ice';
import * as moment from "moment";
import { ViewModeRule } from '@impeo/ice-core';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-eurolife-output',
  templateUrl: './eurolife-output.component.html',
  styleUrls: ['./eurolife-output.component.scss']
})
export class EurolifeOutputComponent extends ElementComponentImplementation {

  get additionalClasses(): string {
    const result: string = this.element.recipe['additionalClasses'];
    if (!result) {
      return '';
    }

    return result;
  }

  get showhr() {
    // If no label then don't show horizontal line
    return this.label == "" ? false : true;
  }

  get valueClass() {
    let dt_name = this.getRecipeParam("valueClass");
    if (dt_name == null) return '';
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.getOutputValue(null);

    return result;
  }

  get labelClass() {
    let dt_name = this.getRecipeParam("labelClass");
    if (dt_name == null) return '';
    let dt = this.page.iceModel.dts[dt_name];
    let result = dt.getOutputValue(null);

    return result;
  }

  get values() {

    if (this.value instanceof Date) {
      return moment(this.value).format('DD/MM/YYYY');
    }

    // Only investment products purposes
    const typeValue = this.element.recipe['typeValue'];      //vanila ul -- policies.details.ulVanilla.TotalSurrenderValue

    if (typeValue=='totalsurrender' && this.value==0 && this.element.name=="policies.details.ulVanilla.TotalSurrenderValue")          //vanila ul -- policies.details.ulVanilla.TotalSurrenderValue
      return "Εμφανίζεται μετά την διετία";

    if (typeValue=='totalsurrender' && this.value==0 && this.element.name=="policies.details.tipp.TotalSurrenderValue")          //tipp -- policies.details.tipp.TotalSurrenderValue
    return "Εμφανίζεται μετά τον μήνα";

    //specific cases...this update should be done from backend
    if (this.element.name=="policies.details.grouphealth.CustomerName" && this.context.iceModel.elements['policies.details.ContractKey'].getValue().forIndex(null)=="1050000000")          //tipp -- policies.details.tipp.TotalSurrenderValue
    return "Όμιλος Εurobank";
    if (this.element.name=="policies.details.grouphealth.CustomerName" && this.context.iceModel.elements['policies.details.ContractKey'].getValue().forIndex(null)=="2040000119")          //tipp -- policies.details.tipp.TotalSurrenderValue
    return "Latsco Family Office";
    if (this.element.name=="policies.details.grouphealth.CustomerName" && this.context.iceModel.elements['policies.details.ContractKey'].getValue().forIndex(null)=="1018000000")          //tipp -- policies.details.tipp.TotalSurrenderValue
    return "doValue";


    if (typeValue=='surrender' || typeValue=='totalsurrender')
    {
      let valueFormatted=  new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(this.value);
      return valueFormatted + " €";
    }

    //end investment products

    return this.value;
  }

  get isVisible(): boolean {

    if (this.value instanceof Date) {                        ///not show
      var yyyy = this.value.getFullYear().toString();
      if (yyyy=="0" || yyyy=="1")
          return false;
    }

    if (typeof this.value=='string')
     {
      var valstr = this.value.trim();
      return valstr!="";
     }

    return this.value != null;
  }

get isContentLoaded(): boolean
{

 if(this.isVisible)
 {
  var el = document.getElementById("skeleton");
  if(el!=null) el.remove();
  return true;
 }
 else
 return false;
}




}

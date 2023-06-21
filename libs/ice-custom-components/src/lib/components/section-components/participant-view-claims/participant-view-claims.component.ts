import {
  SectionComponentImplementation,
  IceSectionComponent
} from "@impeo/ng-ice";
import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { LifecycleType } from "@impeo/ice-core";

@Component({
  selector: "app-participant-view-claims",
  templateUrl: "./participant-view-claims.component.html",
  styleUrls: ["./participant-view-claims.component.scss"]
})
export class ParticipantViewClaimsComponent extends SectionComponentImplementation {
  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  items: any[];
  data: any[] = [];
  mySubscription: any;
  currentContract: any;
  flag: boolean = true;
  dependants: any[] = [];
  insured: any[] = [];
  show: boolean;
  showDependants: boolean;
  branch: string;
  header: string;
  headers: any = [];

  FatherName = "elements.policy.participants.items.FatherName.label";
  BirthDate = "elements.policy.participants.items.BirthDate.label";
  Insured = "elements.policy.participants.items.Insured.label";
  FirstName2 = "elements.policy.participants.items.FirstName2.label";
  LastName = "elements.policy.participants.items.LastName.label";
  Dependants = "elements.policy.participants.items.Dependants.label";
  FathersName = "elements.policy.participants.items.FathersName.label";
  RelationPolicy = "elements.policy.participants.items.RelationPolicy.label";
  Birthday = "elements.policy.participants.items.Birthday.label";

  ngOnInit() {
    this.show = false;
    super.ngOnInit();
    this.addItems();
  }

  private addItems(): any {
    if (this.recipe.dataStoreProperty == null) {
      return;
    }
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);

    ///get Participants
    if (this.insured.length == 0) {
      let indexValue = this.iceModel.elements[
        "policy.contract.general.info.indexHolder"
      ].getValue().values[0].value;
      if (
        this.items[indexValue].Branch == "ΖΩΗΣ" ||
        this.items[indexValue].Branch == "ΥΓΕΙΑΣ"
      ) {
        if (this.items != undefined) {
          if (this.items[indexValue].Participants) {
            for (
              var i = 0;
              i < this.items[indexValue].Participants.length;
              i++
            ) {
              if (
                this.items[indexValue].Participants[i].Relationship.startsWith(
                  "ΑΣΦ"
                )
              ) {
                this.insured.push(this.items[indexValue].Participants[i]);
                this.branch = this.items[indexValue].Branch;
              }
            }
          }
        }
      }
    }
    this.show = true;
    //end get participants
  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? "col-md-12" : "col-md-" + col.col;
  }

  formatDate(date: any) {
    if (date != null || date != undefined) {
      return new Date(date);
    }
  }

  getSectionClass(): any {
    let result: any;

    let dt_name = this.context.iceModel.elements[
      "policies.details.border.titles.color"
    ].recipe.dtName;
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      result = dt.evaluateSync();
      if (result.defaultValue) {
        return result.defaultValue;
      } else {
        return "section-breaks-gen";
      }
    }
    return null;
  }

  private indexFunction(): any {
    let indexValue = this.iceModel.elements[
      "policy.claims.selectedContractIndex"
    ].getValue().values[0].value;
    if (this.items == null) return;
    this.currentContract = this.items[indexValue];
  }

  getSectionBreaksClass(): any
  {
    if(this.branch === 'ΖΩΗΣ')
        return 'section_breaks_life'
    if(this.branch ==="ΥΓΕΙΑΣ")
        return 'section_breaks_life';
       else return "";
  }


}

import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { LifecycleType,LifecycleEvent } from '@impeo/ice-core';
import { LocalStorageService } from "../../../services/local-storage.service";

@Component({
  selector: 'app-participants-view',
  templateUrl: './participants-view.component.html',
  styleUrls: ['./participants-view.component.scss']
})
export class ParticipantsViewComponent extends SectionComponentImplementation {

  constructor(parent: IceSectionComponent,private localStorage: LocalStorageService) {
    super(parent);
  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
  };

  items: any[];
  data: any[] = [];
  mySubscription: any;
  currentContract: any;
  flag: boolean = true;
  dependants: any[] = [];
  insured: any[] = [];
  show: boolean;
  showDependants: boolean;
  showGroupHealth: boolean= false;
  branch: string;
  header: string;
  headers: any = [];
  headersDependants: any = ['Ονοματεπώνυμο', 'Όνομα Πατρός', 'Συγγένεια', 'Ημερομηνία Γέννησης'];
  headersGroupHealthDependants: any = ['Ονοματεπώνυμο','Συγγένεια','Ημερομηνία Γέννησης','Ημερομηνία Ασφάλισης'];

  FatherName = 'elements.policy.participants.items.FatherName.label';
  BirthDate = 'elements.policy.participants.items.BirthDate.label';
  Insured = 'elements.policy.participants.items.Insured.label';
  FirstName2 = 'elements.policy.participants.items.FirstName2.label';
  LastName = 'elements.policy.participants.items.LastName.label';
  Dependants = 'elements.policy.participants.items.Dependants.label';
  FathersName = 'elements.policy.participants.items.FathersName.label';
  RelationPolicy = 'elements.policy.participants.items.RelationPolicy.label';
  Birthday = 'elements.policy.participants.items.Birthday.label';

  //Group Health purpose
  TaxCode='elements.customer.details.TaxCode.label';
  MobilePhone= 'elements.customer.MobilePhone.label';
  PhoneNumber= 'elements.customer.PhoneNumber1.label';
  Email= 'elements.customer.Email.label';





  ngOnInit() {

    this.show = false;

    //claim details
    if (this.iceModel.elements["policy.claims.selectedBranch"].getValue().forIndex(null) == 1)
      this.show = true;

    this.addItems();

    //policy details
    if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) > 0) {
      this.show = true;
    } else {
      this.show = false;
    }

    //GroupHealth
    if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) == 99)
     this.showGroupHealth=true;



    this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.ICE_MODEL_READY) {

        this.addItems();
        this.flag = false;
        this.indexFunction();
      }
    });
    // this.filterDependants();

  }

  formatDate(date: any) {
    if (date != null || date != undefined) {
      return new Date(date);
    }

  }

  getSectionClass(): any {
    let result: any;

    let dt_name = this.context.iceModel.elements["policies.details.border.titles.color"].recipe.dtName;
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

    return null;
  }

  filterDependants() {

    if (window.location.href.includes('viewClaimDetails'))
      return null;

      //Header Dependants
      if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) == 99)
      this.headers = this.headersGroupHealthDependants;
      else
      this.headers = this.headersDependants;

     this.header = 'Εξαρτώμενα Μέλη';

    if (this.dependants.length == 0) {
      let indexValue = this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;

      if (this.items != undefined) {
        if (this.items[indexValue].Participants) {
          for (var i = 0; i < this.items[indexValue].Participants.length; i++) {
            if (this.items[indexValue].Participants[i].Relationship === 'ΤΕΚΝΟ'
               || this.items[indexValue].Participants[i].Relationship === 'ΣΥΖΥΓΟΣ'
               || this.items[indexValue].Participants[i].Relationship === 'Τέκνο'
               || this.items[indexValue].Participants[i].Relationship === 'Σύζυγος'
               ) {
             //this.dependants.push(this.items[indexValue].Participants[i]);
             this.dependants=[...this.dependants,this.items[indexValue].Participants[i]];
            }
          }
        }

      }
    }
    return this.dependants;
  }

  getItemLength(item: any): boolean {
    if (item) {
      return true;
    }
    else {
      return false;
    }

  }

  filterInsured()
  {

    if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) == 99)
    {
      //Ομαδικά Συμβόλαια
      if (this.insured.length == 0)
      {
        let insuredGroupHealth= {
            FirstName : this.iceModel.elements["policies.details.grouphealth.InsuredFirstName"].getValue().values[0].value,
            LastName :  this.iceModel.elements["policies.details.grouphealth.InsuredLastName"].getValue().values[0].value,
            FatherName :  this.iceModel.elements["policies.details.grouphealth.InsuredFatherName"].getValue().values[0].value,
            TaxCode: this.iceModel.elements["customer.details.TaxCode"].getValue().values[0].value,
            MobilePhone:  this.iceModel.elements["customer.MobilePhone"].getValue().values[0].value,
            PhoneNumber:  this.iceModel.elements["customer.PhoneNumber1"].getValue().values[0].value,
            Email:  this.iceModel.elements["customer.Email"].getValue().values[0].value
           }
        this.insured= [...this.insured,insuredGroupHealth]
       }

      return this.insured;
    }
    else   //Ατομικα Συμβολαια
    {

        if (this.insured.length == 0)
        {
          let indexValue = this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;


          if (this.items != undefined)
          {
            if (this.items[indexValue].Participants)
            {
              for (var i = 0; i < this.items[indexValue].Participants.length; i++) {
                if (this.items[indexValue].Participants[i].Relationship.includes('ΑΣΦΑΛΙΣΜΕΝΟΣ'))
                {
                  {
                   // this.insured.push(this.items[indexValue].Participants[i]);
                    this.insured= [...this.insured,this.items[indexValue].Participants[i]];
                    this.branch = this.items[indexValue].Branch;
                  }
                }
              }
            }

          }
        }
        return this.insured;
    }
  }

  private indexFunction(): any {

    let indexValue = this.iceModel.elements["policy.claims.selectedContractIndex"].getValue().values[0].value;
    if (this.items == null) return;
    this.currentContract = this.items[indexValue];
    return this.currentContract;
  }


  private addItems(): any {

    if (this.recipe.dataStoreProperty == null) {
      return;
    }
    //dataStoreProperty comes from the page

    if (!this.items) {
      if (this.context.dataStore.data.clientContractsWithParticipants) {
        this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
        return;
      }
      this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

        const actionName = _.get(e, ['payload', 'action']);

        if (actionName.includes("actionGetPolicies") && e.type==="ACTION_FINISHED") {
          this.context.iceModel.elements['triggerActionGetParticipants'].setSimpleValue(1);
         // this.context.$actionEnded.observers.pop();
        }
        else {
          if (this.context.dataStore.data.clientContractsWithParticipants) {
            this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
          }
        }
      });
    } else {
      this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    }



  }


}

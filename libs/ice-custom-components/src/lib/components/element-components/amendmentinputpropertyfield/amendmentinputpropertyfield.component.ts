import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { IndexedValue } from '@impeo/ice-core';
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-amendmentinputpropertyfield',
  templateUrl: './amendmentinputpropertyfield.component.html',
  styleUrls: ['./amendmentinputpropertyfield.component.scss']
})


export class AmendmentinputpropertyfieldComponent extends ElementComponentImplementation implements OnInit {
  myinput: any;
  errorMsg: String = '';
  showField: boolean;
  regexpios: RegExp = undefined;
  @ViewChild('messageInput') messageInput: ElementRef;
  search: string;   // text to search
  regexp: RegExp;


  ngOnInit(): void {


    Observable.fromEvent(this.messageInput.nativeElement, 'keyup')
      // get value
      .map((evt: any) => evt.target.value)
      // text length must be > 2 chars
      //.filter(res => res.length > 2)
      // emit after 0,5s of silence
      .debounceTime(500)
      // emit only if data changes since the last emit
      // .distinctUntilChanged()
      // subscription
      .subscribe((text: string) => this.submit(text));




    this.context.iceModel.elements["amendments.step2"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {

        this.myinput = '';
        this.messageInput.nativeElement.value = "";
        //property values
        this.context.iceModel.elements["amendments.property.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.subcategory.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);

        //nullable values from different amendments
        this.context.iceModel.elements["amendments.health.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.health.subcategory.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.life.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.life.subcategory.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.context.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.context.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.context.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.context.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock1`].setSimpleValue(false);
        this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock2`].setSimpleValue(false);
        this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock3`].setSimpleValue(false);
      }
    });
  }

  submit(text: string) {

    this.search = text;
    this.onInputChange(this.search)


  }


  async onInputChange(myinput: any) {
    this.errorMsg = null;
    let myElementName = this.getComponentRecipe().elementName;

    //New Way for Safari Satisfaction
    if (myElementName === "amendmentsNewInsuredValue") {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(myinput);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(null);
      }
    }
    else if (myElementName === "amendmentsInsuredComments")
    {
      this.value = myinput;
      // this.regexp = new RegExp(/^[Α-Ω 0-9]{0,50}?$/);
      // let validateRegex = this.regexp.test(this.value);
      // if (!validateRegex)
      // {
      //   this.errorMsg = 'Επιτρέπονται κεφαλαία γράμματα, Ελληνικοί χαρακτήρες';
      //   this.page.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(null);
      // }
      if (this.value == "")
        this.page.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(null);
      else
        this.page.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(myinput);

    }
    else if (myElementName === "amendmentsNewApartmentNumber")
    {
      this.value = myinput;
      // this.regexp = new RegExp(/^[Α-Ω 0-9]{0,50}?$/);
      // let validateRegex = this.regexp.test(this.value);

      // if (!validateRegex)
      // {
      // this.errorMsg = 'Επιτρέπονται κεφαλαία γράμματα, Ελληνικοί χαρακτήρες';
      // this.page.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(null);
      // }
      if (this.value == "")
        this.page.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(null);
      else
        this.page.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(myinput);

    }
    else if (myElementName === "amendmentsNewConstructionYear")
    {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(myinput);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(null);
      }
    }
    else if (myElementName === "amendmentsNewParkingNumber")
    {
      this.value = myinput;
      // this.regexp = new RegExp(/^[Α-Ω 0-9]{0,50}?$/);
      // let validateRegex = this.regexp.test(this.value);

      // if (!validateRegex)
      // {
      // this.errorMsg = 'Επιτρέπονται κεφαλαία γράμματα, Ελληνικοί χαρακτήρες';
      // this.page.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(null);
      // }
      if (this.value == "")
        this.page.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(null);
      else
        this.page.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(myinput);
    }
    else if(myElementName === "amendmentsNewBuildingMeasures")
    {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(myinput);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(null);
      }
    }
    else if(myElementName === "amendmentsNewStorageNumber")
    {
      this.value = myinput;
      // this.regexp = new RegExp(/^[Α-Ω 0-9]{0,50}?$/);
      // let validateRegex = this.regexp.test(this.value);

      // if (!validateRegex)
      // {
      // this.errorMsg = 'Επιτρέπονται κεφαλαία γράμματα, Ελληνικοί χαρακτήρες';
      // this.page.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(null);
      // }
      if (this.value == "")
        this.page.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(null);
      else
        this.page.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(myinput);
    }
    else if(myElementName === "amendmentsNewStorageMeasures")
    {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(myinput);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(null);
      }
    }else if(myElementName === "amendmentsNewParkingMeasures")
    {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(myinput);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(null);
      }
    }else if(myElementName === "amendmentsNewPropertyCode")
    {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(myinput);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(null);
      }
    }
    else {
      //Do nothing

    }

  }
}

import { ElementComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit, Input } from '@angular/core';
import { IndexedValue } from '@impeo/ice-core';

@Component({
  selector: 'app-eurolife-dropdown',
  templateUrl: './eurolife-dropdown.component.html',
  styleUrls: ['./eurolife-dropdown.component.scss']
})


export class EurolifeDropdownComponent extends ElementComponentImplementation implements OnInit {
  options: any = [];
  showOptions: boolean = false;
  secondDriver: String = null;
  thirdDriver: String = null;
  selectedValue: any;

  ngOnInit() {

    this.showOptions = false; //it should be false
    //This is for second driver dob
    this.page.iceModel.elements["amendments.2nd.driver"].setSimpleValue("0");
    let dt = this.page.iceModel.dts["dt_amendments_second_driver_view_mode"];
    if (dt) {
      let result = dt.evaluateSync();
    }
    //This is for second driver licence date
    this.page.iceModel.elements["amendments.licence.2nd.driver"].setSimpleValue("0");
    let dtLicence = this.page.iceModel.dts["dt_amendments_second_licence_view_mode"];
    if (dtLicence) {
      let resultLicence = dtLicence.evaluateSync();
    }
    //This is for third driver dob
    this.page.iceModel.elements["amendments.3rd.driver"].setSimpleValue("0");
    let dt3rddriver = this.page.iceModel.dts["dt_amendments_third_driver_view_mode"];
    if (dt3rddriver) {
      let result = dt3rddriver.evaluateSync();
    }
    //This is for third driver licence date
    this.page.iceModel.elements["amendments.licence.3rd.driver"].setSimpleValue("0");
    let dt3rddriverLicence = this.page.iceModel.dts["dt_amendments_third_licence_view_mode"];
    if (dt3rddriverLicence) {
      let resultLicence = dt3rddriverLicence.evaluateSync();
    }
    //This is for the amendment for changing driver info
    if (this.getComponentRecipe().elementName === "amendmentChangeLicenceDate" || this.getComponentRecipe().elementName === "amendmentChangeDriverDOB") {
      if (this.element.iceModel.elements["policies.details.Bdriver"].getValue().forIndex(null) != 0) {
        this.showOptions = true;
        this.options = ['1ος Οδηγός'];
        if (this.element.iceModel.elements["policies.details.Bdriver"].getValue().forIndex(null) != 0) {
          this.secondDriver = '2ος Οδηγός'
          this.options.push(this.secondDriver);
        }
        if (this.element.iceModel.elements["policies.details.Cdriver"].getValue().forIndex(null) != 0) {
          this.thirdDriver = '3ος Οδηγός'
          this.options.push(this.thirdDriver);
        }
      }
    }

    //Property Amendments
    if (this.getComponentRecipe().elementName === "amendmentChangeFrequencyOfPayment")
    {
      this.showOptions = true;
      if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null)!== null)
        {
        if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null) === 'ΕΤΗΣΙΑ'){
          this.options.push('ΤΡΙΜΗΝΗ');
          this.options.push('ΕΞΑΜΗΝΗ');
        }
        else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null) === 'ΕΞΑΜΗΝΗ') {
          this.options.push('ΤΡΙΜΗΝΗ');
          this.options.push('ΕΤΗΣΙΑ');
        }
        else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null) === 'ΤΡΙΜΗΝΗ') {
          this.options.push('ΕΞΑΜΗΝΗ');
          this.options.push('ΕΤΗΣΙΑ');
        }
        else{
          this.options.push('ΤΡΙΜΗΝΗ');
          this.options.push('ΕΞΑΜΗΝΗ');
          this.options.push('ΕΤΗΣΙΑ');
        }
      }
    }

        //Health-Life-Finance Amendments
      if (this.getComponentRecipe().elementName === "amendmentLifeChangeFrequencyOfPayment")
      {
        this.showOptions = true;
        if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null)!== null)
          {
          if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null).includes('ΕΤΗΣΙΑ')){
            this.options.push('ΜΗΝΙΑΙΑ');
            this.options.push('ΤΡΙΜΗΝΗ');
            this.options.push('ΕΞΑΜΗΝΗ');
          }
          else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null).includes('ΕΞΑΜΗΝΗ')) {
            this.options.push('ΜΗΝΙΑΙΑ');
            this.options.push('ΤΡΙΜΗΝΗ');
            this.options.push('ΕΤΗΣΙΑ');
          }
          else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null).includes('ΤΡΙΜΗΝΗ')) {
            this.options.push('ΜΗΝΙΑΙΑ');
            this.options.push('ΕΞΑΜΗΝΗ');
            this.options.push('ΕΤΗΣΙΑ');
          }
          else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null).includes('ΜΗΝΙΑΙΑ')) {
            this.options.push('ΤΡΙΜΗΝΗ');
            this.options.push('ΕΞΑΜΗΝΗ');
            this.options.push('ΕΤΗΣΙΑ');
          }
          else{
            this.options.push('ΜΗΝΙΑΙΑ');
            this.options.push('ΤΡΙΜΗΝΗ');
            this.options.push('ΕΞΑΜΗΝΗ');
            this.options.push('ΕΤΗΣΙΑ');
          }
        }
        if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null).includes('ΜΕΤΡΗΤΑ')){
          var index =  this.options.indexOf('ΜΗΝΙΑΙΑ');
          if (index !== -1) {
            this.options.splice(index, 1);
          }
        }
      }



    else if (this.element.iceModel.elements["request.amendment.change.fop"].getValue().forIndex(null) === 1) {
      //This is for change in frequency of payment
      this.options = [];
      this.showOptions = true;
      this.findOptions();
    }
    else {
      //Do nothing
    }
    this.context.iceModel.elements["amendments.step2"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {

        this.selectedValue = 'Επιλέξτε';
        this.context.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
      }
    });

  }

  validateOnChange(event: any) {
    let myElementName = this.getComponentRecipe().elementName;
    if (myElementName === "amendmentChangeDriverDOB") {
      //This is for first driver
      if (event.value === '1ος Οδηγός') {
        var currentValue = this.page.iceModel.elements["amendments.intermediate.dob"].getValue().forIndex(null);
        this.page.iceModel.elements["amendments.2nd.driver"].setSimpleValue("1");
        this.page.iceModel.elements["amendments.driver.new.input"].setSimpleValue(event.value);
        this.page.iceModel.elements["amendments.driver.current.dob.value"].setSimpleValue(currentValue);
      }
      //This is for second driver
      else if (event.value === this.secondDriver) {
        var currentValue = this.page.iceModel.elements["amendments.second.driver.dob.value"].getValue().forIndex(null);
        this.page.iceModel.elements["amendments.2nd.driver"].setSimpleValue("1");
        this.page.iceModel.elements["amendments.driver.new.input"].setSimpleValue(event.value)
        this.page.iceModel.elements["amendments.driver.current.dob.value"].setSimpleValue(currentValue);

      }
      //This is for third driver
      else {
        var currentValue = this.page.iceModel.elements["amendments.third.driver.dob.value"].getValue().forIndex(null);
        this.page.iceModel.elements["amendments.3rd.driver"].setSimpleValue("1");
        this.page.iceModel.elements["amendments.driver.new.input"].setSimpleValue(event.value);
        this.page.iceModel.elements["amendments.driver.current.dob.value"].setSimpleValue(currentValue);

      }

    }
    else if (myElementName === "amendmentChangeLicenceDate") {
      //This is for first driver
      if (event.value === '1ος Οδηγός') {
        var currentValue = this.page.iceModel.elements["amendments.intermediate.licence"].getValue().forIndex(null);
        this.page.iceModel.elements["amendments.licence.2nd.driver"].setSimpleValue("1");
        this.page.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(event.value);
        this.page.iceModel.elements["amendments.driver.licence.current.value"].setSimpleValue(currentValue);
      }
      //This is for second driver
      else if (event.value === this.secondDriver) {
        var currentValue = this.page.iceModel.elements["amendments.second.driver.date.licence.value"].getValue().forIndex(null);
        this.page.iceModel.elements["amendments.licence.2nd.driver"].setSimpleValue("1");
        this.page.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(event.value);
        this.page.iceModel.elements["amendments.driver.licence.current.value"].setSimpleValue(currentValue);
      }
      //This is for third driver
      else {
        var currentValue = this.page.iceModel.elements["amendments.third.driver.date.licence.value"].getValue().forIndex(null);
        this.page.iceModel.elements["amendments.licence.3rd.driver"].setSimpleValue("1");
        this.page.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(event.value);
        this.page.iceModel.elements["amendments.driver.licence.current.value"].setSimpleValue(currentValue);
      }
    }else if(myElementName === "amendmentLifeChangeFrequencyOfPayment"){
      this.mapValues(event.value, "amendments.health.life.finance.frequencyOfPayment.input");
    }
    else {
      this.mapValues(event.value, "amendments.frequencyOfPayment.input");
      // this.page.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(event.value);
    }

  }

  mapValues(values: any, elementName: string) {
    if (values === 'ΜΗΝΙΑΙΑ') {
      this.page.iceModel.elements[elementName].setSimpleValue(1);
    }else if (values === 'ΤΡΙΜΗΝΗ') {
      this.page.iceModel.elements[elementName].setSimpleValue(3);
    }
    else if (values === 'ΕΞΑΜΗΝΗ') {
      this.page.iceModel.elements[elementName].setSimpleValue(6);
    }
    else {
      this.page.iceModel.elements[elementName].setSimpleValue(12);
    }

  }

  findOptions(): any {
    if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null) === 'ΤΡΙΜΗΝΗ') {
      this.options.push('ΕΞΑΜΗΝΗ');
      this.options.push('ΕΤΗΣΙΑ');
    }
    else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null) === 'ΕΞΑΜΗΝΗ') {
      this.options.push('ΤΡΙΜΗΝΗ');
      this.options.push('ΕΤΗΣΙΑ');
    }
    else if (this.element.iceModel.elements["policies.details.frequencyOfPayment"].getValue().forIndex(null) === 'ΕΤΗΣΙΑ') {
      this.options.push('ΤΡΙΜΗΝΗ');
      this.options.push('ΕΞΑΜΗΝΗ');
    }
    else {
      //do Nothing
    }

  }

}




import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { IndexedValue } from '@impeo/ice-core';
import { Observable } from "rxjs/Rx";
import { ArrayElement } from '@impeo/ice-core';

@Component({
  selector: 'app-amendmentinputfield',
  templateUrl: './amendmentinputfield.component.html',
  styleUrls: ['./amendmentinputfield.component.scss']
})


export class AmendmentinputfieldComponent extends ElementComponentImplementation implements OnInit {
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

        const documentsElement = this.context.iceModel.elements['documents'] as ArrayElement;
        documentsElement.reset();
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);
        //motor values
        this.context.iceModel.elements["amendments.motor.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.motor.subcategory.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.driver.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.mileage.new.input"].setSimpleValue(null);

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
    if (myElementName === "amendmentsNewLicencePlate") {
      this.value = myinput;
      if (this.value == "") {
        this.page.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.plate.new.input"].setSimpleValue(myinput);
      }

      this.regexp = new RegExp(/^[Α-Ω]{0,3}[0-9]{0,4}?$/);
      let validateRegex = this.regexp.test(this.value);
      if (!validateRegex) {
        this.errorMsg = 'Επιτρέπονται κεφαλαία γράμματα, Ελληνικοί χαρακτήρες και αριθμοί';
        this.page.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
      }


      ///*Old
      //   if (!(this.context.iceModel.elements["amendments.verifyLicencePlate"].getValue().forIndex(null)))
      //   {
      //     this.errorMsg = 'Επιτρέπονται κεφαλαία γράμματα, Ελληνικοί χαρακτήρες και αριθμοί';
      //  //   this.page.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
      //   }
      // }
    }

    else if (myElementName === "amendmentsNewCapital") {
      myinput = +(myinput.replace(/\D/g, ''));
      this.value = myinput;
      this.page.iceModel.elements["amendments.capital.new.input"].setSimpleValue(myinput);
      if (this.value) {
        var currentValue: any;
        currentValue = this.context.iceModel.elements["amendments.capital.current.value"].getValue().forIndex(null);
        currentValue = +(currentValue.replace(/\D/g, ''));
        if (this.value >= currentValue) {
          this.errorMsg = 'Το νέο κεφάλαιο θα πρέπει να είναι μικρότερο από το τρέχον';
          this.page.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
        }
        if (this.value === 3000) {
          this.errorMsg = 'Ελάχιστη ασφαλισμένη αξία 3.000€';
          this.page.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
        }
        if (this.value < 3000) {
          this.errorMsg = 'Δεν πρέπει να είναι μικρότερο από 3000';
          this.page.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
        }
        // else {
        //   this.errorMsg = null;
        // }

      }
      else {
        this.page.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
      }
    }
    else if (myElementName === "amendmentsNewLargestCapital") {
      myinput = +(myinput.replace(/\D/g, ''));
      this.value = myinput;
      this.page.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(myinput);
      if (this.value) {
        var currentValue: any;
        currentValue = this.context.iceModel.elements["amendments.largest.capital.current.value"].getValue().forIndex(null);
        currentValue = +(currentValue.replace(/\D/g, ''));
        if (this.value <= currentValue) {
          this.errorMsg = 'Το νέο κεφάλαιο θα πρέπει να είναι μεγαλύτερο από το τρέχον';
          this.page.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
        }
        else if (this.value > 100000) {
          this.errorMsg = 'Μέγιστη ασφαλισμένη αξία 100.000€';
          this.page.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
        }
        else {
          this.errorMsg = null;
        }
      }
      else {
        this.page.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
      }
    }
    else if (myElementName === "amendmentsNewDriverDOB") {
      this.value = myinput;
      if (this.value) {
        if (isNaN(+this.value)) {
          this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
          this.page.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
        }
        else {
          this.context.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(myinput);
        }
      }
      else {
        this.page.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
      }
    }



    // else if (myElementName === "amendmentsNewDriverDOB")
    // {
    //   this.value = myinput;
    //   if (this.value) {
    //     let action = this.context.iceModel.actions['actionValidateNewDOB'];
    //     if (action != null) {
    //       let executionRule = action.executionRules[0];
    //       this.context.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(myinput);
    //       let executionRuleResultData =await this.context.executeExecutionRule(executionRule);
    //       if (!(this.context.iceModel.elements["amendments.verifyDOB"].getValue().forIndex(null))) {
    //         this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
    //         this.page.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
    //       }

    //     }
    //   }
    //   else {
    //     this.page.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
    //   }
    //   // this.page.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(myinput);
    //   // if (this.value === "") {
    //   //   this.page.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
    //   // }
    // }
    else if (myElementName === "amendmentsNewDriverLicenceDate") {
      this.value = myinput;
      if (this.value) {
        if (isNaN(+this.value)) {
          this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
          this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
        }
        else {
          this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(myinput);
        }
      }
      else {
        this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      }
      // this.value = myinput;
      // this.value = myinput;
      // if (this.value) {
      //   let action = this.context.iceModel.actions['actionValidateNewLicenceDate'];
      //   if (action != null) {
      //     let executionRule = action.executionRules[0];
      //     this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(myinput);
      //     let executionRuleResultData = await this.context.executeExecutionRule(executionRule);
      //     if (!(this.context.iceModel.elements["amendments.verifyLicenceDate"].getValue().forIndex(null))) {
      //       this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
      //       this.page.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      //     }

      //   }
      // }
      // else {
      //   this.page.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      // }
      // this.page.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(myinput);
      // if (this.value === "") {
      //   this.page.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      // }
    }
    else {
      //Do nothing
    }

  }
}

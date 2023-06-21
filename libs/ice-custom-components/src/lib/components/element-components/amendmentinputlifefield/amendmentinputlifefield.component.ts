import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { IndexedValue } from '@impeo/ice-core';
import { Observable, Subject } from "rxjs/Rx";
import { ArrayElement } from '@impeo/ice-core';


@Component({
  selector: 'app-amendmentinputlifefield',
  templateUrl: './amendmentinputlifefield.component.html',
  styleUrls: ['./amendmentinputlifefield.component.scss']
})


export class AmendmentinputlifefieldComponent extends ElementComponentImplementation implements OnInit {
  myinput: any;
  errorMsg: String = '';
  showField: boolean;
  regexpios: RegExp = undefined;
  @ViewChild('messageInput') messageInput: ElementRef;
  search: string;   // text to search
  regexp: RegExp;
  data: any;
  contractKey:any;
  private destroy$ = new Subject<void>();
  defaultInput: number = 100;
  showit:boolean;

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



    this.data = this.context.dataStore;
    this.contractKey = this.context.iceModel.elements["amendments.details.PolicyNumberHeader"].getValue().forIndex(null);

    this.context.iceModel.elements["amendments.step2"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {

        this.myinput = "";
        this.messageInput.nativeElement.value = "";

        const documentsElement = this.context.iceModel.elements['documents'] as ArrayElement;
        documentsElement.reset();
        this.context.iceModel.elements['amendments.upload.file'].setSimpleValue(false);
        //life-health-finance values
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

        //nullable values from different amendments
        this.context.iceModel.elements["amendments.motor.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.motor.subcategory.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.category.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["amendments.property.subcategory.dropdown"].setSimpleValue(null);
      }
    });

    if(this.element.name.includes('percentage') && this.context.iceModel.elements[this.element.name].getValue().values[0].value){
      this.messageInput.nativeElement.value = this.context.iceModel.elements[this.element.name].getValue().values[0].value;
    }

    this.context.iceModel.elements[this.element.name].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null)) {

        this.messageInput.nativeElement.value = this.context.iceModel.elements[this.element.name].getValue().values[0].value;
      }
    });

  }

  focusOutFunction() {
    this.showit = true;
  }

  submit(text: string) {

    this.search = text;
    this.onInputChange(this.search)


  }

  getCurrentAmount(): any{
      let currentAmount;
      for(let contract of this.data.clientContracts){
        if(contract.RequestID == parseInt(this.contractKey)){
          currentAmount = contract.Receipts[0].RunningAmount
          break;
        }
      }
      return currentAmount;
  }

  async onInputChange(myinput: any) {
    const _this = this;
    this.errorMsg = null;
    let myElementName = this.getComponentRecipe().elementName;
    //New Way for Safari Satisfaction
    //TODO put beneficiaries inputs

    if (myElementName === "amendmentsNewDecreaseValue") {
      this.value = myinput;
      let currentAmount = this.getCurrentAmount();

      if (this.value == "") {
        this.page.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
      }
      if (this.value >= currentAmount) {
        this.errorMsg = 'Η νέα δόση πρέπει να είναι μικρότερη της τρέχουσας';
        this.page.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
      } else {
        this.page.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(myinput);
      }
    } else if (myElementName === "amendmentsNewIncreaseValue") {
      this.value = myinput;
      let currentAmount = this.getCurrentAmount();
      if (this.value == "") {
        this.page.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
      }
      if (isNaN(+this.value)) {
        this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
        this.page.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
      }
      if (this.value <= currentAmount) {
        this.errorMsg = 'Η νέα δόση πρέπει να είναι μεγαλύτερη της τρέχουσας';
        this.page.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
      }else {
        this.page.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(myinput);
      }
    } else if (myElementName === "amendmentsNewBirthdateValue") {
      this.value = myinput;

      if (this.value == "") {
        this.page.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
      }
      else {
        this.page.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(myinput);
      }

      let regexp = new RegExp(/^([0-2]\d{1}|3[0-1])\/(0\d{1}|1[0-2])\/(19|20)\d{2}/);
      let validateRegex = regexp.test(this.value);
      if (!validateRegex) {
        this.errorMsg = 'Η ημερομηνία γέννησης πρέπει να είναι της μορφής HH/MM/EEEE';
        this.page.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
      }
    }else if (myElementName === "amendmentsExtraPaymentValue") {
        this.value = myinput;
        if (this.value == "") {
          this.page.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        }
        if (isNaN(+this.value)) {
          this.errorMsg = 'Επιτρέπονται μόνο αριθμοί';
          this.page.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        }
        else {
          this.page.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(myinput);
        }
    }else if (myElementName === "amendmentsNameValue") {
        this.value = myinput;
        let regexp = new RegExp(/^[Α-Ω A-Z]{0,50}?$/);
        let validateRegex = regexp.test(this.value);
        if (!validateRegex) {
          this.errorMsg = 'Επιτρέπονται μόνο κεφαλαία γράμματα, Ελληνικοί και Λατινικοί χαρακτήρες';
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }
        if (this.value == "" || this.value == null) {
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }
        else {
          this.page.iceModel.elements[this.element.name].setSimpleValue(myinput);
        }
        this.checkIfBeneficiariesInputsIsFilled();
    }else if (myElementName === "amendmentsPercentageValue1" || myElementName === "amendmentsPercentageValue2" || myElementName === "amendmentsPercentageValue3") {
        this.value = myinput;

        if (isNaN(+this.value) || this.value % 1 != 0) {
          this.errorMsg = 'Επιτρέπονται μόνο ακέραιοι αριθμοί';
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }else if ( this.value < 0 || this.value > 100) {
          this.errorMsg = 'Επιτρέπονται μόνο ακέραιοι αριθμοί από 0 έως 100';
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }

        // if(this.value < 100 || this.value > 100){
        //   this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        // }else{
        //   this.errorMsg="";
        // }

        if(!this.checkPercentage(myinput)){
          //this.errorMsg = 'Το άθροισμα των ποσοστών των δικαιούχων πρέπει να ισούται με 100%';
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }

        if (this.value == "" || this.value == null) {
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }else {
          this.page.iceModel.elements[this.element.name].setSimpleValue(myinput);
        }

        this.checkIfBeneficiariesInputsIsFilled();

    }else if (myElementName === "amendmentsRelationshipValue") {
        this.value = myinput;
        if (this.value == ""|| this.value == null) {
          this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        }
        else {
          this.page.iceModel.elements[this.element.name].setSimpleValue(myinput);
        }
        this.checkIfBeneficiariesInputsIsFilled();
    }else {
        //Do nothing

    }
  }


  checkIfBeneficiariesInputsIsFilled():void{
    let filledBeneficiariesInputs=0;
    for(let i=1; i<=3; i++ ){
      if( this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.name.input${i}`].getValue().values[0].value != null &&
      this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.relationship.input${i}`].getValue().values[0].value != null &&
      this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.relationship.input${i}`].getValue().values[0].value != '-' &&
      this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${i}`].getValue().values[0].value != null){
        filledBeneficiariesInputs+=1;
      }
    }
    if(this.page.iceModel.elements["amendments.beneficiaries.length"].getValue().values[0].value == filledBeneficiariesInputs){
      this.page.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(true);
    }else {
      this.page.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
    }
  }

  checkPercentage(myInput: string):boolean{
    this.checkPercentageInput(myInput);
    let perc0 = this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].getValue().values[0].value ? this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].getValue().values[0].value : 0;
    let perc1 = this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].getValue().values[0].value ? this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].getValue().values[0].value : 0;
    let perc2 = this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].getValue().values[0].value ? this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].getValue().values[0].value : 0;
    let sum=0;
    if(this.element.name.includes("1")){
      sum = perc1 + perc2;
    }else if(this.element.name.includes("2")){
      sum = perc0 + perc2;
    }else if(this.element.name.includes("3")){
      sum = perc0 + perc1;
    }
    if(sum+ parseInt(myInput)!=100){
      if(parseInt(myInput) != 100){
        this.errorMsg = 'Το άθροισμα των ποσοστών των δικαιούχων πρέπει να ισούται με 100%';
        this.page.iceModel.elements[this.element.name].setSimpleValue(null);
        return false;
      }



    }else{
      this.errorMsg = '';
      return true;
    }

  }


  checkPercentageInput(myInput: string){
    let lockArrayOfBeneficiaries=[];
    lockArrayOfBeneficiaries[0] = this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock1`].getValue().values[0].value;
    lockArrayOfBeneficiaries[1] = this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock2`].getValue().values[0].value;
    lockArrayOfBeneficiaries[2] = this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock3`].getValue().values[0].value;
    let perc0 = this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].getValue().values[0].value ? this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].getValue().values[0].value : 0;
    let perc1 = this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].getValue().values[0].value ? this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].getValue().values[0].value : 0;
    let perc2 = this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].getValue().values[0].value ? this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].getValue().values[0].value : 0;

    let indexOfInput = this.element.name.slice(-1);
    if(this.context.iceModel.elements['amendments.beneficiaries.length'].getValue().values[0].value == 1){
      this.context.iceModel.elements[this.element.name].setSimpleValue(100);
    }else if(this.context.iceModel.elements['amendments.beneficiaries.length'].getValue().values[0].value == 2){
      if(indexOfInput == '1'){
        if(perc1>0){
          if(!lockArrayOfBeneficiaries[1]){
            if(perc1 + parseInt(myInput)!=100){
              this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].setSimpleValue(100- parseInt(myInput));
            }
          }
        }else if(perc2>0){
          if(!lockArrayOfBeneficiaries[2]){
            if(perc2 + parseInt(myInput)!=100){
              this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].setSimpleValue(100- parseInt(myInput));
            }
          }
        }
      }else if(indexOfInput == '2'){
        if(perc0>0){
          if(!lockArrayOfBeneficiaries[0]){
            if(perc0 + parseInt(myInput)!=100){
              this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].setSimpleValue(100- parseInt(myInput));
            }
          }
        }else if(perc2>0){
          if(!lockArrayOfBeneficiaries[2]){
            if(perc2 + parseInt(myInput)!=100){
              this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].setSimpleValue(100- parseInt(myInput));
            }
          }
        }
      }else if(indexOfInput == '3'){
        if(perc0>0){
          if(!lockArrayOfBeneficiaries[0]){
            if(perc0 + parseInt(myInput)!=100){
              this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].setSimpleValue(100- parseInt(myInput));
            }
          }
        }else if(perc1>0){
          if(!lockArrayOfBeneficiaries[1]){
            if(perc1 + parseInt(myInput)!=100){
              this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].setSimpleValue(100- parseInt(myInput));
            }
          }
        }
      }
    }else if(this.context.iceModel.elements['amendments.beneficiaries.length'].getValue().values[0].value == 3){
      if(indexOfInput == '1'){
        if(!lockArrayOfBeneficiaries[1] && !lockArrayOfBeneficiaries[2]){
          if(perc1 + perc2 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].setSimpleValue(~~((100- parseInt(myInput))/2));
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].setSimpleValue(~~((100- parseInt(myInput))/2) + (100- parseInt(myInput))%2);
          }
        }else if(!lockArrayOfBeneficiaries[1]){
          if(perc1 + perc2 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].setSimpleValue(100- parseInt(myInput) - perc2);
          }
        }else if(!lockArrayOfBeneficiaries[2]){
          if(perc1 + perc2 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].setSimpleValue(100- parseInt(myInput)- perc1);
          }
        }
      }else if(indexOfInput == '2'){
        if(!lockArrayOfBeneficiaries[0] && !lockArrayOfBeneficiaries[2]){
          if(perc0 + perc2 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].setSimpleValue(~~((100- parseInt(myInput))/2));
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].setSimpleValue(~~((100- parseInt(myInput))/2) + (100- parseInt(myInput))%2);
          }
        }else if(!lockArrayOfBeneficiaries[0]){
          if(perc0 + perc2 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].setSimpleValue(100- parseInt(myInput) - perc2);
          }
        }else if(!lockArrayOfBeneficiaries[2]){
          if(perc0 + perc2 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input3"].setSimpleValue(100- parseInt(myInput)- perc0);
          }
        }
      }else if(indexOfInput == '3'){
        if(!lockArrayOfBeneficiaries[0] && !lockArrayOfBeneficiaries[1]){
          if(perc0 + perc1 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].setSimpleValue(~~((100- parseInt(myInput))/2));
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].setSimpleValue(~~((100- parseInt(myInput))/2) + (100- parseInt(myInput))%2);
          }
        }else if(!lockArrayOfBeneficiaries[0]){
          if(perc0 + perc1 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input1"].setSimpleValue(100- parseInt(myInput) - perc1);
          }
        }else if(!lockArrayOfBeneficiaries[1]){
          if(perc0 + perc1 + parseInt(myInput) != 100){
            this.context.iceModel.elements["amendments.health.life.finance.addBeneficiaries.percentage.input2"].setSimpleValue(100- parseInt(myInput)- perc0);
          }
        }
      }
    }
  }
}

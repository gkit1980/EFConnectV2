import { Component, OnInit, ElementRef, ViewChild,Inject } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-property-clailm-notification-input-field',
  templateUrl: './property-clailm-notification-input-field.component.html',
  styleUrls: ['./property-clailm-notification-input-field.component.scss']
})


export class PropertyClaimNotificationInputFieldComponent extends MaterialElementComponentImplementation implements OnInit {
  myinput: any;
  errorMsg: String = '';
  showField: boolean;
  regexpios: RegExp = undefined;
  @ViewChild('messageInput') messageInput: ElementRef;
  search: string;   // text to search
  regexp: RegExp;
  myElementName: any;

  constructor(@Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) defaults: MatFormFieldDefaultOptions) {
    super(defaults);
  }

  ngOnInit(): void {

    this.myElementName = this.getComponentRecipe().elementName;
    this.setComponentValue(this.element.getValue().forIndex(null))
    this.onComponentValueChange();
    this.myinput=this.element.getValue().forIndex(null);
    // this.messageInput.nativeElement.innerText= this.value;



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

  }

  submit(text: string) {

    this.search = text;
    this.onInputChange(this.search)


  }
  // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  async onInputChange(myinput: any) {
    this.errorMsg = null;
    let myElementName = this.getComponentRecipe().elementName;

    //New Way for Safari Satisfaction
    if (myElementName === "accidentDate") {
      this.value = myinput;
      if (this.value == "") {
        this.errorMsg = 'Συμπληρώστε το πεδίο';
        this.context.iceModel.elements["property.claim.notification.accidentDate.input"].setSimpleValue(null);
        this.context.iceModel.elements['property.notification.submit.step'].setSimpleValue(true);
      }
      else {
        this.context.iceModel.elements["property.claim.notification.accidentDate.input"].setSimpleValue(myinput);
      }
    }
    else if (myElementName === "description")
    {
      this.value = myinput;
      if (this.value == ""){
        this.errorMsg = 'Συμπληρώστε το πεδίο';
        this.context.iceModel.elements["property.claim.notification.description.input"].setSimpleValue(null);
        this.context.iceModel.elements['property.notification.submit.step'].setSimpleValue(true);
      }else
        this.context.iceModel.elements["property.claim.notification.description.input"].setSimpleValue(myinput);

    }else if (myElementName === "customerEmail")
    {
      this.value = myinput;
      this.regexp = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
      let validateRegex = this.regexp.test(this.value);
      if (!validateRegex)
      {
        this.errorMsg = 'Συμπληρώστε ένα έγκυρο e-mail';
        this.page.iceModel.elements["property.claim.notification.Email"].setSimpleValue(null);
      }
      if (this.value == ""){
        this.errorMsg = 'Συμπληρώστε το πεδίο';
        this.context.iceModel.elements["property.claim.notification.Email"].setSimpleValue(null);
        this.context.iceModel.elements["property.notification.submit.step"].setSimpleValue(true);
      }else
        this.context.iceModel.elements["property.claim.notification.Email"].setSimpleValue(myinput);

    }else if (myElementName === "claimType")
    {
      this.value = myinput;
      if (this.value == ""){
        this.errorMsg = 'Συμπληρώστε το πεδίο';
        this.context.iceModel.elements["property.claim.notification.claimType.dropdown"].setSimpleValue(null);
        this.context.iceModel.elements["property.notification.submit.step"].setSimpleValue(true);
      }else
        this.context.iceModel.elements["property.claim.notification.claimType.dropdown"].setSimpleValue(myinput);

    }else if (myElementName === "customerPhone")
    {
      this.value = myinput;
      this.regexp = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
      let validateRegex = this.regexp.test(this.value);
      if (!validateRegex)
      {
        this.errorMsg = 'Συμπληρώστε ένα έγκυρο αριθμο τηλεφώνου';
        this.page.iceModel.elements["property.claim.notification.MobilePhone"].setSimpleValue(null);
      }
      if (this.value == ""){
        this.errorMsg = 'Συμπληρώστε το πεδίο';
        this.context.iceModel.elements["property.claim.notification.MobilePhone"].setSimpleValue(null);
        this.context.iceModel.elements["property.notification.submit.step"].setSimpleValue(true);
      }else
        this.context.iceModel.elements["property.claim.notification.MobilePhone"].setSimpleValue(myinput);

    }
    else {
      //Do nothing

    }

  }
}


import { Component, OnInit, Inject } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import * as _ from 'lodash';


@Component({
  selector: 'app-green-card-fullname',
  templateUrl: './green-card-fullname.component.html',
  styleUrls: ['./green-card-fullname.component.scss']
})
export class GreenCardFullnameComponent extends MaterialElementComponentImplementation {

  public error: boolean = false;
  visible:boolean = true;

  constructor(@Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) defaults: MatFormFieldDefaultOptions) {
    super(defaults);
  }

  ngOnInit(): void{
    super.ngOnInit();

    this.context.iceModel.elements["greencard.motor.security.fullname"].$dataModelValueChange.subscribe((value: any) => {
      if (value.element.getValue().forIndex(null)) {

        this.visible =false;
      }
    });
    if( this.context.iceModel.elements["greencard.motor.security.fullname"].getValue().values[0].value){
      this.visible =false;
    }else{
      this.visible = true;
    }
  }

  onBlur(event: any) {
    if (_.isString(this.value) && _.isEmpty(this.value)){
      this.value = null;
      this.visible =true;
    }else{
      this.visible =false;
    }
    this.onComponentValueChange();
  };

  onFocus(event: any) {
    if (_.isString(this.value) && _.isEmpty(this.value)){
      this.visible =true;
    }else{
      this.visible =false;
    }
    this.resetValidation();
  };

  validateLatin(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;

    if ((charCode === 8) || (charCode === 32) || // Backspace and space
      (charCode >= 48 && charCode <= 57) || // 0 - 9
      (charCode >= 65 && charCode <= 90) || // a - z
      (charCode >= 97 && charCode <= 122)) { // A - Z
      this.error = false;
      return true;
    }
    this.error = true;
    return false;
  }

  onInputChange(myValue: any) {
    this.context.iceModel.elements["greencard.motor.security.fullname"].setSimpleValue(myValue);
    this.visible =false;
  }





}

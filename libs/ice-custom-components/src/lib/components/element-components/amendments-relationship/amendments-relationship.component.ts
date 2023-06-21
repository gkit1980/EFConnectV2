import { Component, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-amendments-relationship',
  templateUrl: './amendments-relationship.component.html',
  styleUrls: ['./amendments-relationship.component.scss']
})
export class AmendmentsRelationshipComponent extends MaterialSelectComponentImplementation{

  appearance: MatFormFieldAppearance;
  isInput: boolean = true;
  options:any=[];


  constructor( private activateRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.options=this.context.iceModel.lists['amendments.relationship.listValues'].getItems()

  }

  onBlur(){
    this.triggerComponentValidation();
  }

  onChange(e:any){
    this.element.setSimpleValue(e.value);
    this.onComponentValueChange();
    this. checkIfBeneficiariesInputsIsFilled();
  }

  compare(first: any, second: any) : boolean
  {
   return true;
  }

  checkIfBeneficiariesInputsIsFilled(){
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

}

import { Component, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-property-claim-type',
  templateUrl: './property-claim-type.component.html',
  styleUrls: ['./property-claim-type.component.scss']
})
export class PropertyClaimTypeComponent extends MaterialSelectComponentImplementation{

  appearance: MatFormFieldAppearance;
  isInput: boolean = true;
  options:any=[];
  // placeholder:any="ΕΠΙΛΟΓΗ ΖΗΜΙΑΣ";


  constructor( private activateRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.options=this.context.iceModel.lists['property.notification.claimType.listValues'].getItems()

  }

  onBlur(){
    this.triggerComponentValidation();
  }

  onChange(e:any){
    this.element.setSimpleValue(e.value);
    this.onComponentValueChange();
  }

  compare(first: any, second: any) : boolean
  {
   return true;
  }

}

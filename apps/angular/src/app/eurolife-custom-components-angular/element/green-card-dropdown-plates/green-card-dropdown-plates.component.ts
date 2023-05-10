import { Component, OnInit } from '@angular/core';
import { LifecycleType } from '@impeo/ice-core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-green-card-dropdown-plates',
  templateUrl: './green-card-dropdown-plates.component.html',
  styleUrls: ['./green-card-dropdown-plates.component.scss']
})
export class GreenCardDropdownPlatesComponent extends MaterialSelectComponentImplementation{
  appearance: MatFormFieldAppearance;
  isInput: boolean = true;
  plateNo: string;
  fromUrl: boolean = false

  constructor( private activateRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {

    this.activateRoute.queryParams.subscribe((params: any) => {
      if(params['plate']){
        this.plateNo = params['plate'];

        this.fromUrl = true;
      }
    })

    if (this.context.dataStore.data.clientContracts!=null) {
      this.options=[];

      for (var index = 0; index < this.context.dataStore.data.clientContracts.length; index++)
      {
      var  branch = this.context.dataStore.data.clientContracts[index].Branch;
          if (branch == 'ΑΥΤΟΚΙΝΗΤΩΝ' && this.context.dataStore.data.clientContracts[index].hasOwnProperty("ContractMotorDetails"))
          {
          var item={
                      value : this.context.dataStore.data.clientContracts[index].ContractMotorDetails.VehicleLicensePlate,
                      label : this.context.dataStore.data.clientContracts[index].ContractMotorDetails.VehicleLicensePlate
          };
          this.options.push(item);
          };
      }

      if (this.fromUrl || this.options.length === 1){
        if (!this.fromUrl){
          this.plateNo = this.options[0].value
          this.element.setSimpleValue(this.options[0].value);
          this.isInput = true;
        }else{
          this.element.setSimpleValue(this.plateNo);
        }
      }else{
        this.isInput = false
        if(this.options.length!=0)
      this.element.setSimpleValue(this.options[0].value);
      }
    }
    this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.ICE_MODEL_READY && event.payload.hasOwnProperty('clientContracts') &&  this.context.dataStore.data.clientContracts!=null) {

        this.options=[];

        for (var index = 0; index < this.context.dataStore.data.clientContracts.length; index++)
        {
        var  branch = this.context.dataStore.data.clientContracts[index].Branch;
            if (branch == 'ΑΥΤΟΚΙΝΗΤΩΝ' && this.context.dataStore.data.clientContracts[index].hasOwnProperty("ContractMotorDetails"))
            {
            var item={
                        value : this.context.dataStore.data.clientContracts[index].ContractMotorDetails.VehicleLicensePlate,
                        label : this.context.dataStore.data.clientContracts[index].ContractMotorDetails.VehicleLicensePlate
            };
            this.options.push(item);
            };
        }

      }
      if (this.fromUrl || this.options.length === 1){
        if (!this.fromUrl){
          this.plateNo = this.options[0].value;
          this.element.setSimpleValue(this.options[0].value);
          this.isInput = true;
        }else{
          this.element.setSimpleValue(this.plateNo);
        }
      }else{
        this.isInput = false;
        if(this.options.length!=0)
      this.element.setSimpleValue(this.options[0].value);
      }
    });


   }

   ngOnDestroy(){

    this.context.iceModel.elements["greencard.motor.check.duration"].setSimpleValue(true);   //checkbox should be initialized
   }

  onBlur(){
    this.triggerComponentValidation();
  }

  onChange(e:any){
    this.element.setSimpleValue(e.value);
    this.context.iceModel.elements["greencard.state"].setSimpleValue(false);
    this.onComponentValueChange();
  }

  compare(first: any, second: any) : boolean
  {
   return true;
  }

}

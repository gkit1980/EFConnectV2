
import { DateAdapter } from '@angular/material/core';
import { RangeRule,LifecycleType,IndexedValue } from '@impeo/ice-core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import * as moment from "moment";
import { Component, AfterViewInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SpinnerService } from '../../../services/spinner.service';



@Component({
  selector: 'app-green-card-datepicker',
  templateUrl: './green-card-datepicker.component.html',
  styleUrls: ['./green-card-datepicker.component.scss']
})
export class GreenCardDatepickerComponent extends MaterialElementComponentImplementation  {



      public adapter:DateAdapter<any>;
      public date:any;
      public dateFormat:any;
      public min: any;
      public max: any;
      public: any;
      isDisabledCustom:boolean=true;
      visible:boolean=false;

      constructor( @Inject(DateAdapter) adapter: DateAdapter<any>,
                   @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS)   defaults: MatFormFieldDefaultOptions,
                   private spinnerService: SpinnerService,)
        {
        super(defaults);
        this.adapter = adapter;
        this.dateFormat = 'YYYY-MM-DD';



      }



      ngOnInit() {
        if (this.element.name=="greencard.motor.duration.to") {
            this.visible=true;
        }
        super.ngOnInit();
        var locale = this.context.iceResource.locales[0];
        this.adapter.setLocale(locale);
        this.dateFormat = 'YYYY-MM-DD';
        this.dateFormat = this.resource.resolve('formats.date.default', this.dateFormat);


        if(this.element.name=="greencard.motor.duration.from")
        {
          var today=new Date();
          this.setComponentValue(today)
          this.onComponentValueChange();
          this.min=today;

          //initialization
          if(this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null)!=null ||
          this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null)!=undefined)
          {
            let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
            let newEndDate = Date.parse(endDate);
            var maxdate = new Date(newEndDate);
            var dateOffset = (24*60*60*1000) * 14; //14 days
            maxdate.setTime(maxdate.getTime() - dateOffset);
            this.max=maxdate;
          }

          //subscribe for the max date of from datepicker
          this.context.iceModel.elements["greencard.motor.contract.expirationdate"].$dataModelValueChange.subscribe((value: IndexedValue) => {

           let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
           let newEndDate = Date.parse(endDate);
           var maxdate = new Date(newEndDate);
           var dateOffset = (24*60*60*1000) * 14; //14 days
           maxdate.setTime(maxdate.getTime() - dateOffset);
           this.max=maxdate;

          });




        }

        if(this.element.name=="greencard.motor.duration.to")
        {

            if(this.context.iceModel.elements["greencard.plate.dropdown"].getValue().forIndex(null)!="" &&
                this.context.iceModel.elements["greencard.plate.dropdown"].getValue().forIndex(null)!=null)
                {
                    for (var index = 0; index < this.context.dataStore.data.clientContracts.length; index++)
                    {
                        var  branch = this.context.dataStore.data.clientContracts[index].Branch;
                        if (branch == 'ΑΥΤΟΚΙΝΗΤΩΝ' &&
                        this.context.iceModel.elements["greencard.plate.dropdown"].getValue().forIndex(null)==this.context.dataStore.data.clientContracts[index].ContractMotorDetails.VehicleLicensePlate)
                        {
                          var expirationDate=moment(this.context.dataStore.data.clientContracts[index].ContractMotorDetails.ExpirationDate).toDate();
                          //var expirationDate=moment(new Date()).add(90,'days').toDate();   //Debug purpose
                          this.context.iceModel.elements["greencard.motor.contract.expirationdate"].setSimpleValue(expirationDate);
                          this.setComponentValue(expirationDate);
                          this.visible=false;
                          this.onComponentValueChange();

                          let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
                          let newEndDate = Date.parse(endDate);
                          var Expdate = new Date(newEndDate);

                          this.min=moment(Expdate).subtract(14,'days');;
                          this.max=Expdate;

                        };
                    }
                }



        }



        // subscribe to the element that change the plate from dropdown list
        this.context.iceModel.elements["greencard.plate.dropdown"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null) !=null && this.element.name=="greencard.motor.duration.to")
          {


              for (var index = 0; index < this.context.dataStore.data.clientContracts.length; index++)
              {
                  var  branch = this.context.dataStore.data.clientContracts[index].Branch;
                  if (branch == 'ΑΥΤΟΚΙΝΗΤΩΝ' &&
                  value.element.getValue().forIndex(null)==this.context.dataStore.data.clientContracts[index].ContractMotorDetails.VehicleLicensePlate)
                  {
                    var expirationDate=moment(this.context.dataStore.data.clientContracts[index].ContractMotorDetails.ExpirationDate).toDate();
                    this.context.iceModel.elements["greencard.motor.contract.expirationdate"].setSimpleValue(expirationDate);
                    this.setComponentValue(expirationDate);
                    this.visible=false;
                    this.onComponentValueChange();


                    let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
                    let newEndDate = Date.parse(endDate);
                    var maxdate = new Date(newEndDate);
                    this.min=moment(new Date()).add(14,'days');
                    this.max=maxdate;

                  };
              }

          }


          // if (value.element.getValue().forIndex(null) !=null && this.element.name=="greencard.motor.duration.from")
          // {

          //   var today=new Date();
          //   this.setComponentValue(today)
          //   this.onComponentValueChange();
          //   this.min=today;
          //   this.max=moment(new Date()).add(14,'days');
          // }



        });


        ///check the minimum value of second datepicker

        this.context.iceModel.elements["greencard.motor.duration.from"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (this.element.name=="greencard.motor.duration.to")
          {
            var calculatedDay=moment(value.element.getValue().forIndex(null)).add(14,'days');
            this.min=calculatedDay.toDate();



            let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
            let newEndDate = Date.parse(endDate);
            var maxdate = new Date(newEndDate);
            this.max=maxdate;
          }
        });



       ///check the max value of first datepicker

       this.context.iceModel.elements["greencard.motor.duration.to"].$dataModelValueChange.subscribe((value: IndexedValue) => {
        if (this.element.name=="greencard.motor.duration.from")
        {
           var calculatedStartDay=moment(this.context.iceModel.elements["greencard.motor.duration.from"].getValue().forIndex(null));
           this.min=calculatedStartDay.toDate();


          let calculatedEndDate =moment(this.context.iceModel.elements["greencard.motor.duration.to"].getValue().forIndex(null)).subtract(14,'days');
          this.max=calculatedEndDate.toDate();
        }
      });


      //////


        //subscribe the value of checkbox
        this.context.iceModel.elements["greencard.motor.check.duration"].$dataModelValueChange.subscribe((value: IndexedValue) => {
          if (value.element.getValue().forIndex(null)==true)
          {
           this.isDisabledCustom=true;
            if( this.element.name=="greencard.motor.duration.to")
            {
            var expirationdate=moment(this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null)).toDate();
            this.setComponentValue(expirationdate);
            this.visible=false;

            //Bug fix...
            this.onComponentValueChange()
            let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
            let newEndDate = Date.parse(endDate);
            var Expdate = new Date(newEndDate);
            this.min=moment(Expdate).subtract(14,'days');;
            this.max=Expdate;
            //end bug fix..

            }
          }
          else
          {

            this.isDisabledCustom=false;
            if( this.element.name=="greencard.motor.duration.to")
            {
            var expirationdate=moment(this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null)).toDate();
            this.setComponentValue(expirationdate);
            this.visible=false;

            //Bug fix...
            this.onComponentValueChange()
            let endDate:string =this.context.iceModel.elements["greencard.motor.contract.expirationdate"].getValue().forIndex(null);
            let newEndDate = Date.parse(endDate);
            var Expdate = new Date(newEndDate);

           var startDate:string=this.context.iceModel.elements["greencard.motor.duration.from"].getValue().forIndex(null);
           let newStartDate = Date.parse(startDate);
           var stdate = new Date(newStartDate);


            this.min=moment(stdate).add(14,'days');;
            this.max=Expdate;
            //end bug fix..


          }
        }
        });




}

      setComponentValue(value: any)
      {
        if (value == null)
        {
          this.date = null;
        }
      else {
          if (!_.isDate(value))
              return console.warn("cannot set non-date value '" + value + "' on component\t\t\t\t'" + this.componentName + "' for element '" + this.element.name + "'");
          this.date = moment(value);
          //SOS!!!!
          let initialState=this.context.iceModel.elements["greencard.state"].getValue().forIndex(null);
          if(initialState==false)
          this.element.action.execute();
          }
      }

      get rangeRule():RangeRule
      {
        return this.element['rangeRule'];
      }

      get dateString(): string
      {
        return this.date && this.date.isValid() ? this.date.format(this.dateFormat) : '';
      }


      getComponentValue():any{

        return this.date && this.date.isValid() ? this.date.toDate() : null;

      }

      onDateEntered()
      {
      if (!(this.date && this.date.isValid()))
      this.date = null;

      this.onComponentValueChange();

      }

      onBlur(event: any)
      {
        this.onDateEntered();

      }


      onFocus(){
        this.resetValidation();
      }


    *initializeRanges()
      {
      yield this.rangeRule.getMin;
      yield this.rangeRule.getMax;
      }



}

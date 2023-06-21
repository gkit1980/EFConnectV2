import { DateAdapter } from '@angular/material/core';
import { RangeRule,IndexedValue } from '@impeo/ice-core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import * as moment from "moment";
import { Component, Inject } from '@angular/core';
import * as _ from 'lodash';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-property-notification-datepicker',
  templateUrl: './property-notification-datepicker.component.html',
  styleUrls: ['./property-notification-datepicker.component.scss']
})
export class PropertyNotificationDatepickerComponent extends MaterialElementComponentImplementation{

  public adapter:DateAdapter<any>;
  public date:any;
  public dateFormat:any;
  public min: any;
  public max: any;
  public: any;
  isDisabledCustom:boolean=false;
  private destroy$ = new Subject<void>();


  constructor( @Inject(DateAdapter) adapter: DateAdapter<any>,
               @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS)   defaults: MatFormFieldDefaultOptions,
               private spinnerService: SpinnerService,)
    {
    super(defaults);
    this.adapter = adapter;
    this.dateFormat = 'YYYY-MM-DD';
  }


  ngOnInit() {
    super.ngOnInit();
    var locale = this.context.iceResource.locales[0];
    this.adapter.setLocale(locale);
    this.dateFormat = 'YYYY-MM-DD';
    this.dateFormat = this.resource.resolve('formats.date.default', this.dateFormat);

    var today=new Date();
    this.setComponentValue(today)
    this.onComponentValueChange();
    this.max=today;



    this.context.iceModel.elements['property.claim.step'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem === 2 ) {

          let newStartDate = Date.parse(this.context.iceModel.elements["property.claim.notification.StartDate"].getValue().forIndex(null));
          this.min=new Date(newStartDate);
          }
        },
        (err: any) =>
          console.error('PropertyClaimSubmitButtonComponent property.claim.step', err)
      );




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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

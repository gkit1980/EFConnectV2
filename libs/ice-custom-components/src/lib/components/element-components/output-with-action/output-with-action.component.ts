import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as moment from 'moment';


@Component({
  selector: 'output-with-action.mixin.scss',
  templateUrl: './output-with-action.component.html'
})
export class OutputWithActionComponent extends ElementComponentImplementation implements OnInit {

  static componentName = 'OutputWithAction';
  defaultValue:string;

  get textValue(): string {
    if( this.value != null)
     return  this.convertValueToString();
     else
     {
      var time=this.setCurrentTimeSpan();
      this.value = time;
      this.applyComponentValueToDataModel();
      return time;
     }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  executeAction() {
    if (!this.element.action) return;
    this.element.action.execute();
  }

  protected getSupportedTypes(): string[] { return ['date', 'text']; }


  private convertValueToString(): string {
    if (this.element.type === 'date') {
      const dateFormat = this.resource.resolve('formats.date.default', 'DD-MM-YY');
      return moment(this.value).format(dateFormat);
    }
    return this.value;
  }

  private setCurrentTimeSpan() : string
  {
    var date=new Date();
    var hh = date.getHours();
    var mm= date.getMinutes();
  //const dateFormat = this.resource.resolve('formats.date.default', 'DD-MM-YY');

    if(mm<=15 && mm>=0)
       mm=15;
    if (mm > 15 && mm <= 30)
       mm = 30;
    if (mm <= 45 && mm > 30)
       mm = 45;
    if (mm>45)
       {
       hh++;
       mm=0;
       }
       if(mm==0)
       return hh+":"+mm+mm;
       else
      return hh + ":" + mm;

  }
}


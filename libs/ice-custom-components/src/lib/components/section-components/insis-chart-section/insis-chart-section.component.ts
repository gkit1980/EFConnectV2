import {Component, OnDestroy, OnInit} from '@angular/core';
import {SectionComponentImplementation} from '@impeo/ng-ice';
import {IceConsole, IceElement} from '@impeo/ice-core';
import {get, uniq, set, cloneDeep, merge, has, extend} from 'lodash';
import {debounceTime} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';
import _ from 'lodash';


enum ChartTypes {
  line = 'line',
  bar = 'bar',
  pie = 'pie',
  horizontalbar='horizontalbar'
}


@Component({
  selector: 'insis-chart-section',
  templateUrl: './insis-chart-section.component.html',
  styleUrls: ['./insis-chart-section.component.scss']
})
export class InsisChartSectionComponent extends SectionComponentImplementation implements OnInit {

  static componentName = 'InsisChart';

  options: any;
  private $dataStoreUpdate = new BehaviorSubject<any>(null);
  private changeDataStoreSubscription: Subscription;
  private isInitialized = false;
  xAxisData:any=[];
  data1:any=[];
  data2:any=[];


  ngOnInit(): void {
   

   
    this.changeDataStoreSubscription = this.context.dataStore.subscribe(this.datastorePath, {
      next: () => {
        if (!this.isInitialized) 
        {
          const dataStoreData = _.get(this.context.dataStore.data, this.datastorePath);
          this.setOptions(dataStoreData);
         // this.$reevaluate.next();
        }
        this.$dataStoreUpdate.next(this.context.dataStore.get(this.datastorePath));
      },
    });

 
    const dataStoreData = _.get(this.context.dataStore.data, this.datastorePath);

    

    



  }

  ngOnDestroy(): void {
  
}

setOptions(data:any)
{
 
  
   ///line Chart
   if(this.chartType==ChartTypes.line)
   {
  
  this.xAxisData=data.Periods;
  this.options = {
    legend: {
      data: data.Fundnames,
      align: 'left',
    },
    tooltip: {},
    xAxis: {
      data: data.Periods,
      silent: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: {},
    series:[]
  };

   for(let item of data.Funds)
      {
               var fundDetails={
                 name: item.fundname,
                 type: 'line',
                 data: item.values,
                 animationDelay: (idx) => idx * 10,
               }
               this.options.series.push(fundDetails);
      }
  
    }
     //end line chart  
    if(this.chartType==ChartTypes.bar)
    {
        

      this.options = {
        legend: {
          data: data.FundsNames,
          align: 'left',
        },
        tooltip: {},
        xAxis: [{
          data: data.FundsNames,
          axisTick: {
            alignWithLabel: true,
            show: false
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: []
      };
      
      let dataSeries :any=[];
      for(let item of data.FundsPercentage)
        dataSeries.push(item.value);
  
      this.options.series=
        [  
          {
            type: ChartTypes.bar,
            barWidth: '30%',
            data: dataSeries,
          }
        ]
  
    }
}


get recipeParams(): { elements?: string[] } {
    return get(this.recipe, ['component', InsisChartSectionComponent.componentName], {});
}

get chartType(): ChartTypes {
    return get(this.recipeParams, 'type', ChartTypes.line);
}

get datastorePath():string {
  return get(this.recipeParams, 'datastorePath','chart');
}

get dataAxis(): string {
    return get(this.recipeParams, 'dataAxis', 'yAxis');
}

get labels(): string[] {
    const labelElement = get(this.recipeParams, 'label', '');
    return this.getElementValues(this.context.iceModel.elements[labelElement]);
}

get legendLabels(): string[] {
    const labelElement = get(this.recipeParams, 'legendLabels', '');
    return this.getElementValues(this.context.iceModel.elements[labelElement]);
}

get chartTitle() {
return get(this.recipe, `component.InsisChart.title`);
}

get chartSubTitle() {
  return get(this.recipe, `component.InsisChart.subTitle`);
}

get chartInfomation() {
  return get(this.recipe, `component.InsisChart.information`);
}



getElementValues(element: IceElement): any[] {
    if (!element) return [];
    return [...element.getValue().values.map(indexed => indexed.value)];
}





}

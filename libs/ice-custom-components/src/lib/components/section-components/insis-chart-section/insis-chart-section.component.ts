import {Component, OnDestroy, OnInit} from '@angular/core';
import {SectionComponentImplementation} from '@impeo/ng-ice';
import {IceConsole, IceElement} from '@impeo/ice-core';
import {get, uniq, set, cloneDeep, merge, has, extend} from 'lodash';
import {EChartOption} from 'echarts';
import {debounceTime} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';
import _ from 'lodash';


enum ChartTypes {
  line = 'line',
  bar = 'bar',
  pie = 'pie'
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
          this.setOptions();
         // this.$reevaluate.next();
        }
        this.$dataStoreUpdate.next(this.context.dataStore.get(this.datastorePath));
      },
    });

 
    const dataStoreData = _.get(this.context.dataStore.data, this.datastorePath);

    

    



  }

  ngOnDestroy(): void {
  
}

setOptions()
{
  for (let i = 0; i < 100; i++) {
    this.xAxisData.push('category' + i);
    this.data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    this.data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
  }

  this.options = {
    legend: {
      data: ['Fund1', 'Fund2'],
      align: 'left',
    },
    tooltip: {},
    xAxis: {
      data: this.xAxisData,
      silent: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: {},
    series: [
      {
        name: 'Fund1',
        type: 'line',
        data: this.data1,
        animationDelay: (idx) => idx * 10,
      },
      {
        name: 'Fund2',
        type: 'line',
        data: this.data2,
        animationDelay: (idx) => idx * 10 + 100,
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 5,
  };

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
    return this.getResourceFromParam('title');
}

get chartSubTitle() {
    return this.getResourceFromParam('subTitle');
}

get chartInfomation() {
    return this.getResourceFromParam('information');
}



getElementValues(element: IceElement): any[] {
    if (!element) return [];
    return [...element.getValue().values.map(indexed => indexed.value)];
}



private getResourceFromParam(paramName: string): string | false {
  const key = get(this.recipeParams, paramName, false);
  if (!key) return false;
  return this.resource.resolve(key);
}

}

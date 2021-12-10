import {Component, OnDestroy, OnInit} from '@angular/core';
import {SectionComponentImplementation} from '@impeo/ng-ice';
import {IceConsole, IceElement} from '@impeo/ice-core';
import {get, uniq, set, cloneDeep, merge, has, extend} from 'lodash';
import {EChartOption} from 'echarts';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';


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
  private changeElementSubscriptions: Subscription[] = [];


  ngOnInit(): void {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    this.options = {
      legend: {
        data: ['bar', 'bar2'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }

  ngOnDestroy(): void {
    this.changeElementSubscriptions.forEach(subscription => {
        subscription.unsubscribe();
    });
    this.changeElementSubscriptions.length = 0;
}


get recipeParams(): { elements?: string[] } {
    return get(this.recipe, ['component', InsisChartSectionComponent.componentName], {});
}

get chartType(): ChartTypes {
    return get(this.recipeParams, 'type', ChartTypes.line);
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

private getDataProvidingElements(recipe: any): IceElement[] {
    let elements = get(recipe, 'elements');
    if (!elements) {
        IceConsole.error('Missing data elements for Chart Section!');
        return [];
    }

    elements = elements.map(elementName => {
        return get(this.context.iceModel.elements, elementName);
    }).filter(element => !!element);
    return uniq(elements);
}

private getResourceFromParam(paramName: string): string | false {
  const key = get(this.recipeParams, paramName, false);
  if (!key) return false;
  return this.resource.resolve(key);
}

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { IceElement } from '@impeo/ice-core';
import { get, uniq, cloneDeep, merge, has } from 'lodash';
import { EChartOption } from 'echarts';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// shorter namespace alias
import SeriesBar = echarts.EChartOption.SeriesBar;
import SeriesLine = echarts.EChartOption.SeriesLine;
import Series = echarts.EChartOption.Series;
import SeriesPie = echarts.EChartOption.SeriesPie;

enum SerieStackName {
  one,
  two,
  tree,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
}

enum ChartTypes {
  line = 'line',
  bar = 'bar',
  pie = 'pie',
}

const INITIAL_BASE_OPTIONS: EChartOption<Series> = {
  backgroundColor: '#EEEEEE',
  color: [
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#2f4554',
    '#c23531',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3',
  ],
  legend: {
    data: [],
    left: 10,
    top: 10,
  },
  tooltip: {},
  toolbox: {
    feature: {
      magicType: {
        type: ['stack'],
        title: {
          stack: 'Stack',
        },
      },
      saveAsImage: {
        type: '.png',
        title: 'Save',
      },
      restore: {
        title: 'Restore',
      },
    },
  },
};

const INITIAL_LINE_OPTIONS: EChartOption<SeriesLine> = {
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'category',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  grid: {
    left: 40,
    right: 30,
  },
  series: [],
};
const INITIAL_LINE_SERIES: SeriesLine = { type: 'line', data: [] };

const INITIAL_BAR_OPTIONS: EChartOption<SeriesBar> = {
  yAxis: {
    name: 'Y Axis',
    axisLine: { onZero: true },
    splitLine: { show: false },
    splitArea: { show: false },
  },
  xAxis: {
    inverse: false,
    splitArea: { show: false },
  },
  grid: {
    left: 120,
    right: 30,
  },
  tooltip: {},
  series: [],
};
const INITIAL_BAR_SERIES: SeriesBar = {
  name: 'bar',
  type: 'bar',
  stack: 'one',
  data: [],
};

const INITIAL_PIE_OPTIONS: EChartOption<SeriesBar> = {
  grid: {
    left: 100,
  },
  series: [],
};
const INITIAL_PIE_SERIES: SeriesPie = {
  name: 'pie',
  type: 'pie',
  data: [],
};

const CHART_OPTIONS: { [key in keyof typeof ChartTypes]?: any } = {
  line: INITIAL_LINE_OPTIONS,
  bar: INITIAL_BAR_OPTIONS,
  pie: INITIAL_PIE_OPTIONS,
};
const CHART_SERIES_OPTIONS: { [key in keyof typeof ChartTypes]?: any } = {
  line: INITIAL_LINE_SERIES,
  bar: INITIAL_BAR_SERIES,
  pie: INITIAL_PIE_SERIES,
};

@Component({
  selector: 'insis-chart',
  templateUrl: './insis-chart.component.html',
})
export class InsisChartComponent extends SectionComponentImplementation
  implements OnInit, OnDestroy {
  static componentName = 'InsisChart';

  /**
   * Initialize the Chart component with the correct set of Options based on the type
   * of chart you want to draw.
   */
  initialChartOption: EChartOption<Series>;
  initialSeriesOptions: Series;
  mergeOptions: EChartOption<Series>;

  private changeElementSubscriptions: Subscription[] = [];

  ngOnInit(): void {
    super.ngOnInit();

    const elements = this.getDataProvidingElements(this.recipeParams);
    elements.forEach((element) => {
      this.changeElementSubscriptions.push(
        element.$dataModelValueChange.pipe(debounceTime(20)).subscribe(this.elementChangedHandler)
      );
    });

    this.initialChartOption = merge(
      cloneDeep(INITIAL_BASE_OPTIONS),
      cloneDeep(get(CHART_OPTIONS, this.chartType))
    );
    this.initialSeriesOptions = cloneDeep(get(CHART_SERIES_OPTIONS, this.chartType));

    let labels = this.labels;

    if (has(this.recipeParams, 'legendLabels')) labels = this.legendLabels;

    this.initialChartOption = merge(this.initialChartOption, {
      legend: {
        data: [...labels],
        left: 10,
      },
    });

    if (has(this.initialChartOption, 'xAxis'))
      this.initialChartOption.xAxis = merge(this.initialChartOption.xAxis, {
        data: [...this.labels],
      });

    if (has(this.initialChartOption, 'yAxis'))
      this.initialChartOption.yAxis = merge(this.initialChartOption.yAxis, {
        data: [...this.labels],
      });

    if (has(this.initialChartOption, [this.dataAxis]))
      this.initialChartOption[this.dataAxis] = merge(this.initialChartOption[this.dataAxis], {
        type: 'value',
      });

    this.updateChartVisualization();
  }

  ngOnDestroy(): void {
    this.changeElementSubscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.changeElementSubscriptions.length = 0;
  }

  get recipeParams(): { elements?: string[] } {
    return get(this.recipe, ['component', InsisChartComponent.componentName], {});
  }

  get chartType(): ChartTypes {
    return get(this.recipeParams, 'type', ChartTypes.line);
  }

  get dataAxis(): string {
    return get(this.recipeParams, 'dataAxis', 'yAxis');
  }

  get labels(): string[] {
    const labelElement = get(this.recipeParams, 'label', '');
    return this.getElementValues(this.iceModel.elements[labelElement]);
  }

  get legendLabels(): string[] {
    const labelElement = get(this.recipeParams, 'legendLabels', '');
    return this.getElementValues(this.iceModel.elements[labelElement]);
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

  elementChangedHandler(event) {
    console.log('Change element subscription !!!');
    this.updateChartVisualization();
  }

  getElementValues(element: IceElement): any[] {
    if (!element) return [];
    return [...element.getValue().values.map((indexed) => indexed.value)];
  }

  private getDataProvidingElements(recipe: any): IceElement[] {
    const elements = get(recipe, 'elements')
      .map((elementName) => {
        return get(this.iceModel.elements, elementName);
      })
      .filter((element) => !!element);
    return uniq(elements);
  }

  private updateSeries(series: any[]) {
    const mergeOptions = {
      series: [],
    };

    series.forEach((serie, index) => {
      const data = {
        ...this.initialSeriesOptions,
        data: [...serie],
        stack: SerieStackName[index],
        name: this.legendLabels[index],
      };
      mergeOptions.series.push(data);
    });

    // TODO really not the optimal solution, but rather a fast one since in pie charts you should normally have only one data entry point
    if (this.chartType === ChartTypes.pie) {
      mergeOptions.series[0].data = mergeOptions.series[0].data.map((value, index) => {
        return { name: this.labels[index], value };
      });
      delete mergeOptions.series[0].name;
    }

    this.mergeOptions = mergeOptions;
  }

  private updateChartVisualization() {
    const elements = this.getDataProvidingElements(this.recipeParams);
    const values = elements.map((element) => this.getElementValues(element));
    this.updateSeries(values);
  }

  private getResourceFromParam(paramName: string): string | false {
    const key = get(this.recipeParams, paramName, false);
    if (!key) return false;
    return this.resource.resolve(key);
  }
}

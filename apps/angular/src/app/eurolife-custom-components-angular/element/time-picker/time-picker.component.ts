import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { ItemElement } from '@impeo/ice-core';
import * as _ from 'lodash';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html'
})
export class TimePickerComponent extends ElementComponentImplementation implements OnInit {

  static componentName = 'TimePicker';

  public selectedTime: string;
  public times: string[];

  private get numberOfPages() { return Number(this.getRecipeParam('pages', '1')); }
  private currentPage = 1;

  get hasNoPrev(): boolean { return this.currentPage === 0; }
  get hasNoNext(): boolean { return this.currentPage === this.numberOfPages; }

  ngOnInit() {
    super.ngOnInit();
    this.setTimes();
  }


  selected(time: string) {
    this.value = time;
    this.applyComponentValueToDataModel();
  }


  getclass(time: string): string {
    return time === this.value ? 'selected' : null;
  }


  goToPrev(): void {
    if (this.currentPage === 1)
    {
      this.context.iceModel.elements["clicktocall.go-to-calendar"].setSimpleValue(null);
      this.context.iceModel.elements["clicktocall.go-to-time-picker"].setSimpleValue(null);
      return;
    }

    this.currentPage--;
    this.setTimes();
  }


  goToNext(): void {
    if (this.currentPage === this.numberOfPages) return;
    this.currentPage++;
    this.setTimes();
  }


  protected getSupportedTypes(): string[] { return ['text']; }


  private setTimes(): void {
    if ((<ItemElement>this.element).valuesRule != null) this.timesFromList();
    else this.timesFromRecipe();
    this.setTimesForPage();
  }


  private timesFromList(): void {
    this.times = _.map((<ItemElement>this.element).valuesRule.getOptions(null), (item: any) => {
      return item.label;
    });
  }


  private timesFromRecipe(): void {
    const minHour = Number(this.getRecipeParam('minHour', '9'));
    const maxHour = Number(this.getRecipeParam('maxHour', '17'));
    this.times = [];
    for (let i = minHour; i < maxHour; i++) {
      this.times.push(`${i}:00`);
      this.times.push(`${i}:15`);
      this.times.push(`${i}:30`);
      this.times.push(`${i}:45`);
    }
    this.times.push(`${maxHour}:00`);
  }


  private setTimesForPage(): void {
    if (this.numberOfPages === 1) return;
    let itemsPerPage = this.times.length / this.numberOfPages;
    itemsPerPage += itemsPerPage % 3;
    const startIndex = itemsPerPage * (this.currentPage - 1);
    let endIndex = startIndex + itemsPerPage;
    if (endIndex >= this.times.length) endIndex = this.times.length;
    this.times = this.times.slice(startIndex, endIndex);
  }
}




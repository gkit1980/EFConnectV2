import { SectionComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { get, map } from 'lodash';

interface Col {
  size?: string;
  'size.xs'?: string;
  'size.sm'?: string;
  caption?: string;
  element: string;
}

@Component({
  selector: 'insis-datagrid-section',
  templateUrl: './insis-datagrid-section.component.html'
})
export class InsisDatagridSectionComponent extends SectionComponentImplementation
  implements OnInit {
  static componentName = 'InsisDatagridSection';

  defaults = {
    size: 'auto',
    align: 'start center'
  };

  dataSource: MatTableDataSource<any>;

  cols: Col[];

  get showFilter() {
    return this.getRecipeParam('showFilter', false);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.cols = this.getRecipeParam('cols');
    const element = this.context.iceModel.elements[this.getRecipeParam('arrayElement')];
    element.$dataModelValueChange.subscribe(e => {
      const data = this.context.dataModel.getValue(this.getRecipeParam('arrayElement'));
      this.dataSource = new MatTableDataSource<any>(data);
    });
  }

  getProp(item, type = 'size', mediaQuery = null) {
    let path = type;
    if (mediaQuery) {
      path += '.' + mediaQuery;
    }

    let value = get(item, path);
    if (typeof value === 'undefined') {
      value = mediaQuery ? this.getProp(item, type) : this.defaults[type];
    }

    return value;
  }

  getLabel(col: Col): string {
    const key = get(col, 'caption', '');
    return this.resource.resolve(key, null);
  }

  getColsNames() {
    return map(this.getRecipeParam('cols'), item => item.element);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRecipeParam(paramName: string, defaultValue?) {
    return get(
      this.recipe,
      `component.${InsisDatagridSectionComponent.componentName}.${paramName}`,
      defaultValue
    );
  }
}

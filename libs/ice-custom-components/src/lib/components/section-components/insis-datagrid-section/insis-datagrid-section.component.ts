import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageElement } from '@impeo/ice-core';
import { IceSectionComponent, SectionComponentImplementation } from '@impeo/ng-ice';
import { get, map } from 'lodash';
import { debounceTime, map as rxMap } from 'rxjs/operators';

interface Col {
  size?: string;
  'size.xs'?: string;
  'size.sm'?: string;
  caption?: string;
  elements: any[];
  hide: boolean;
  'hide.xs': boolean;
  'hide.sm': boolean;
}

@Component({
  selector: 'insis-datagrid-section',
  templateUrl: './insis-datagrid-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsisDatagridSectionComponent extends SectionComponentImplementation
  implements OnInit {
  static componentName = 'InsisDatagridSection';

  defaults = {
    size: 'auto',
    align: 'start center',
    hide: false,
  };

  dataSource: MatTableDataSource<any>;

  cols: Col[];

  @ViewChildren('rows', { read: ViewContainerRef })
  rows: QueryList<any>;

  get showFilter() {
    return this.getRecipeParam('showFilter', false);
  }

  constructor(parent: IceSectionComponent, private changeDetectorRef: ChangeDetectorRef) {
    super(parent);
  }

  //
  //
  ngOnInit(): void {
    super.ngOnInit();
    const grid = this.getRecipeParam('grid');
    this.cols = get(grid, ['rows', 0, 'cols'], []);
    const element = this.context.iceModel.elements[this.getRecipeParam('arrayElement')];

    const getData = () => this.context.dataModel.getValue(this.getRecipeParam('arrayElement'));

    this.changeDetectorRef.markForCheck();
    this.dataSource = new MatTableDataSource<any>(getData());

    element.$dataModelValueChange
      .pipe(
        debounceTime(50),
        rxMap(() => getData())
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.changeDetectorRef.markForCheck();
      });
  }

  onChildNodeAdded(): void {
    this.rows.forEach((row: any, index: number) => {
      let visible = false;
      this.getColsNames().forEach((colName) => {
        if (
          (this.section.elements.find((element) => element.name === colName).indexedElements[index]
            .element as PageElement).viewModeRule.getViewMode({ index: [index] }) !== 'hidden'
        )
          visible = true;
      });
      if (!visible) row.element.nativeElement.classList.add('hide-row');
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
    const resource = this.resource.resolve(key, null);
    return resource || get(col.elements, [0, 'name'], '');
  }

  getColLabel(col: Col): string {
    const key = get(col, 'caption', '');
    const resource = this.resource.resolve(key, null);
    return resource;
  }

  getColsNames() {
    return map(this.cols, (item) => this.getLabel(item));
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

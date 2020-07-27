import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewContainerRef,
  ChangeDetectionStrategy,
  Host,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { get, map } from 'lodash';
import { PageElement } from '@impeo/ice-core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { map as rxMap, debounceTime } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  get showFilter() {
    return this.getRecipeParam('showFilter', false);
  }

  get showPagination() {
    return this.getRecipeParam('showPagination', false);
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

    if (this.showPagination) {
      this.paginator.length = this.context.dataStore.get(
        `${this.context.definition}.pagination.${this.getRecipeParam('resultsLengthPath')}`
      );
      this.paginator.pageSize = this.context.dataStore.get(
        `${this.context.definition}.pagination.${this.getRecipeParam('pageSizePath')}`
      );
      this.initializePaginatorLabel();
    }

    element.$dataModelValueChange
      .pipe(
        debounceTime(50),
        rxMap(() => getData())
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<any>(data);

        if (this.showPagination) {
          this.paginator.length = this.context.dataStore.get(
            `${this.context.definition}.pagination.${this.getRecipeParam('resultsLengthPath')}`
          );

          this.paginator.pageIndex = this.context.dataStore.get(
            `${this.context.definition}.pagination.${this.getRecipeParam('pageIndexPath')}`
          );
        }

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

  onPageChanged($event) {
    this.context.dataStore.set(
      `${this.context.definition}.pagination.${this.getRecipeParam('offsetPath')}`,
      $event.pageIndex * this.paginator.pageSize
    );

    this.context.dataStore.set(
      `${this.context.definition}.pagination.${this.getRecipeParam('pageIndexPath')}`,
      this.paginator.pageIndex
    );

    this.context.iceModel.actions[this.getRecipeParam('paginationAction')].execute();
  }

  initializePaginatorLabel() {
    const paginationObjects = this.resource.resolve(
      this.getRecipeParam('paginationObjects'),
      null,
      ''
    );
    const paginationSeparator = this.resource.resolve(
      this.getRecipeParam('paginationSeparators'),
      null,
      'of'
    );
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return `0 - ${length} ${paginationSeparator} ${length} ${paginationObjects}`;
      }

      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${
        startIndex + 1
      } - ${endIndex} ${paginationSeparator} ${length} ${paginationObjects}`;
    };
  }
}

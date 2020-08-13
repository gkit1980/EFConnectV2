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

@Component({
  selector: 'insis-paginator-section',
  templateUrl: './insis-paginator-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsisPaginatorSectionComponent extends SectionComponentImplementation
  implements OnInit {
  static componentName = 'InsisPaginatorSection';
  get prefix() {
    return this.getRecipeParam('scopeToDefinition', true) ? `${this.context.definition}.` : '';
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(parent: IceSectionComponent, private changeDetectorRef: ChangeDetectorRef) {
    super(parent);
  }

  //
  //
  ngOnInit(): void {
    super.ngOnInit();

    const lengthPath = `${this.prefix}${this.getRecipeParam(
      'resultsLengthDatastorePath',
      'results-length'
    )}`;
    this.paginator.length = this.context.dataStore.get(lengthPath);
    const sizePath = `${this.prefix}${this.getRecipeParam('pageSizeDatastorePath', 'page-size')}`;
    this.paginator.pageSize = this.context.dataStore.get(sizePath);
    this.paginator.pageIndex = this.context.dataStore.get(
      `${this.prefix}${this.getRecipeParam('pageIndexDatastorePath', 'page-index')}`
    );

    this.initializePaginatorLabel();
    this.context.dataStore.subscribe(lengthPath, {
      next: () => {
        this.paginator.length = this.context.dataStore.get(lengthPath);
        this.paginator.pageSize = this.context.dataStore.get(sizePath);
        this.paginator.pageIndex = this.context.dataStore.get(
          `${this.prefix}${this.getRecipeParam('pageIndexDatastorePath', 'page-index')}`
        );
      },
    });
  }

  getRecipeParam(paramName: string, defaultValue?) {
    return get(
      this.recipe,
      `component.${InsisPaginatorSectionComponent.componentName}.${paramName}`,
      defaultValue
    );
  }

  onPageChanged($event) {
    this.context.dataStore.set(
      `${this.prefix}${this.getRecipeParam('offsetDatastorePath', 'offset')}`,
      $event.pageIndex * this.paginator.pageSize
    );

    this.context.dataStore.set(
      `${this.prefix}${this.getRecipeParam('pageIndexDatastorePath', 'page-index')}`,
      this.paginator.pageIndex
    );

    this.context.iceModel.actions[this.getRecipeParam('paginationAction')].execute();
  }

  initializePaginatorLabel() {
    const paginationObjects = this.resource.resolve(
      this.getRecipeParam('paginationObjectsKey'),
      null,
      ''
    );
    const paginationSeparator = this.resource.resolve(
      this.getRecipeParam('paginationSeparatorKey'),
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

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { get } from 'lodash';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
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

  get pageIndexDatastorePath() {
    return `${this.prefix}${this.getRecipeParam('pageIndexDatastorePath', 'page-index')}`;
  }

  get pageSizeDatastorePath() {
    return `${this.prefix}${this.getRecipeParam('pageSizeDatastorePath', 'page-size')}`;
  }

  get offsetDatastorePath() {
    return `${this.prefix}${this.getRecipeParam('offsetDatastorePath', 'offset')}`;
  }

  get resultsLengthDatastorePath() {
    return `${this.prefix}${this.getRecipeParam('resultsLengthDatastorePath', 'results-length')}`;
  }

  get searchCriteriaChangedDatastorePath() {
    return `${this.prefix}${this.getRecipeParam(
      'searchCriteriaChangedDatastorePath',
      'search-criteria-changed'
    )}`;
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(parent: IceSectionComponent, private changeDetectorRef: ChangeDetectorRef) {
    super(parent);
  }

  //
  //
  ngOnInit(): void {
    super.ngOnInit();

    this.paginator.length = this.context.dataStore.get(this.resultsLengthDatastorePath);
    this.paginator.pageSize = this.context.dataStore.get(this.pageSizeDatastorePath);
    this.paginator.pageIndex = this.context.dataStore.get(this.pageIndexDatastorePath);

    this.initializePaginatorLabel();

    this.context.dataStore.subscribe(this.resultsLengthDatastorePath, {
      next: () => {
        this.paginator.length = this.context.dataStore.get(this.resultsLengthDatastorePath);
        this.paginator.pageSize = this.context.dataStore.get(this.pageSizeDatastorePath);
        this.paginator.pageIndex = this.context.dataStore.get(this.pageIndexDatastorePath);
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
    if (this.context.dataStore.get(this.searchCriteriaChangedDatastorePath) === -1) {
      this.resetPaginator();
    } else {
      this.context.dataStore.set(
        this.offsetDatastorePath,
        $event.pageIndex * this.paginator.pageSize
      );

      this.context.dataStore.set(this.pageIndexDatastorePath, this.paginator.pageIndex);
    }
    this.context.iceModel.actions[this.getRecipeParam('paginationAction')].execute();
  }

  resetPaginator() {
    this.context.dataStore.set(this.pageIndexDatastorePath, 0);
    this.context.dataStore.set(this.offsetDatastorePath, 0);
    this.context.dataStore.set(this.searchCriteriaChangedDatastorePath, 0);
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

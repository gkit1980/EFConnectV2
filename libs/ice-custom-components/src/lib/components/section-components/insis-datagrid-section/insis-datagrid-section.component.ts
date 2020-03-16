import { SectionComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { ItemElement, SectionViewMode } from '@impeo/ice-core';
import { MatTableDataSource } from '@angular/material';
import { IceConsole, IceElement } from '@impeo/ice-core';
import * as _ from 'lodash';

@Component({
  selector: 'insis-datagrid-section',
  templateUrl: './insis-datagrid-section.component.html'
})
export class InsisDatagridSectionComponent extends SectionComponentImplementation
  implements OnInit {
  static componentName = 'InsisDatagridSection';

  dataSource: MatTableDataSource<any>;

  elements: string[];

  selectedRow: any;

  selectionElement: IceElement;

  //
  //
  get showSection() {
    return this.section.viewModeRule.getViewMode() !== SectionViewMode.HIDDEN;
  }

  //
  //
  getRecipeParam(paramName: string) {
    return _.get(
      this.recipe,
      `component.${InsisDatagridSectionComponent.componentName}.${paramName}`
    );
  }

  //
  //
  getWidthDesktop(colIndex: number) {
    return this.getRecipeParam('columnWidthsDesktop')
      ? this.getRecipeParam('columnWidthsDesktop')[colIndex]
      : (this.getRecipeParam('columnWidthsDesktop') as Array<string>).length;
  }

  //
  //
  getWidthMobile(colIndex: number) {
    return this.getRecipeParam('columnWidthsMobile')
      ? this.getRecipeParam('columnWidthsMobile')[colIndex]
      : (this.getRecipeParam('columnWidthsMobile') as Array<string>).length;
  }

  //
  //
  ngOnInit(): void {
    super.ngOnInit();

    this.elements = this.getRecipeParam('elements');

    if (!this.elements)
      return IceConsole.error(`no 'elements' in recipe for section of '${this.page.name}'`);

    if (this.getRecipeParam('selectionElement')) {
      this.selectionElement = this.iceModel.elements[this.getRecipeParam('selectionElement')];
      if (!this.selectionElement) {
        IceConsole.warn(`Section '${this.section.name}' \
					cannot set selection to unknown element '${this.getRecipeParam('selectionElement')}'`);
      }
    }

    const data = this.context.dataModel.getValue(this.getRecipeParam('arrayElement'));

    this.dataSource = new MatTableDataSource<any>(data);
  }

  //
  //
  getLabel(col: string, colIndex: number): string {
    return this.resource.resolve(this.getRecipeParam('labels')[colIndex], null);
  }

  //
  //
  selectRow(row: any): void {
    this.selectedRow = row;
    if (!this.selectionElement) return;
    const index = _.indexOf(this.dataSource.data, row);
    this.selectionElement.setSimpleValue(index);
  }

  //
  //
  protected resolveIndexPath(path: string, index: number[]): string {
    _.forEach(index, idx => {
      path = _.replace(path, '~', `[${idx}]`);
    });
    return path;
  }
}

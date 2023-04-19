import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { IceSection } from '@impeo/ice-core';
import { get, map } from 'lodash';

@Component({
  templateUrl: './insis-form-flex-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsisFormFlexSectionComponent extends SectionComponentImplementation {
  static componentName = 'InsisFormFlexSection';

  defaults = {
    layout: 'row wrap',
    size: 'auto',
    offset: '',
    align: '',
    gap: '',
  };

  //
  //
  getCSS() {
    return get(this.recipe, `component.InsisFormFlexSection.css`, '');
  }

  //
  //
  getCols(row) {
    return get(row, 'cols', []);
  }

  //
  //
  getElements(col) {
    return get(col, 'elements', []);
  }

  //
  //
  getSections(col): IceSection[] {
    return map(get(col, 'sections', []), (childSection: any) => {
      return this.getSubSection(childSection.name);
    });
  }

  //
  //
  getRows(): string {
    return get(this.recipe, `component.InsisFormFlexSection.grid.rows`, []);
  }

  //
  //
  getBehaviourForEmptyRows(): string {
    return get(this.recipe, `component.InsisFormFlexSection.behaviourForEmptyRows`);
  }

  //
  //
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
}

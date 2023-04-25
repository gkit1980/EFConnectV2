import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IndexedValue } from '@impeo/ice-core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
} from '@impeo/ng-ice';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-eclaims-grid-view',
  templateUrl: './eclaims-grid-view.component.html',
  styleUrls: ['./eclaims-grid-view.component.scss'],
})
export class EclaimsGridViewComponent
  extends SectionComponentImplementation
  implements OnInit, OnDestroy, AfterViewChecked
{
  private destroy$ = new Subject<void>();
  private isSubmit = false;

  constructor(parent: IceSectionComponent, private cdr: ChangeDetectorRef) {
    super(parent);
  }

  ngOnInit(): void {
    const stepVal = this.context.iceModel.elements['eclaims.step']
      .getValue()
      .forIndex(null);



    if ( stepVal === 3 || stepVal === 31 ) {
      this.isSubmit = true;
    }

    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value: IndexedValue) => {
          const valElem = value.element.getValue().forIndex(null);
          if (valElem === 3 || valElem === 31) {
            this.isSubmit = true;
          } else {
            this.isSubmit = false;
          }
        },
        (err: any) =>
          console.error('EclaimsGridViewComponent eclaims.step', err)
      );


  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGridColumnClass(col: any): string {
    let result: any;
    let css = col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;

    if (this.context.iceModel.elements[col.css]) {
      let dt_name = this.context.iceModel.elements[col.css].recipe.dtName;
      let dt = this.page.iceModel.dts[dt_name];
      if (dt) {
        result = dt.evaluateSync();
        if (result.elementClass) {
          return result.elementClass;
        }
      }
    }

    if (col.css) {
      css = css + ' ' + col.css;
    }

    return css;
  }

  getGridInternalColumnClass(col: any): string {
    let css = col.arrayElements ? 'col-md-12' : 'col-md-' + col.internalCol;

    if (col.css) {
      css = css + ' ' + col.css;
    }

    return css;
  }

  get elementClass(): string {
    return '';
  }

  getSectionClass(row: any): any {
    let result: any;

    if (this.isSubmit) {
      return 'group-claims-submit';
    }

    if (!!row.css) {
      return row.css;
    }

    return null;
  }
}

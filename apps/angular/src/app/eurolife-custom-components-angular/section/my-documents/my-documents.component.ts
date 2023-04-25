import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from "lodash";
import { LifecycleType } from '@impeo/ice-core';
import { Subscription } from 'rxjs';

export interface Data {
  docType: string;
  year: number;
  url: string
}

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss']
})


export class MyDocumentsComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  allYears1 = 'sections.myDocument.allYears1.label';
  allDocuments = 'sections.myDocument.allDocuments.label';
  documentType1 = 'sections.myDocument.documentType1.label';
  year = 'sections.myDocument.year.label';
  download1 = 'sections.myDocument.download1.label';
  allYears2 = 'sections.myDocument.allYears2.label';
  documentType2 = 'sections.myDocument.documentType2.label';
  download2 = 'sections.myDocument.download2.label';
  loadMore = 'sections.myDocument.loadMore.label';

  Data: any = [];
  filterDocs: any[] = [];
  filterYears: any[] = [];
  selectedYear: number = 0;
  selectedDoc: string = 'none';

  displayedColumns: string[] = ['docType', 'year', 'url'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  InitShowDataNumber: number = 0;
  items: any = [];
  MobileDataArray: any = [];
  filteredData: any = [];
  contentLoaded: boolean = false;

  showSpinnerBtnArr: boolean[] = [];
  private addItemsSubs: Subscription;
  private subscription: Subscription = new Subscription();

  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Σειρές";
    this.paginator._intl.getRangeLabel = function (page, pageSize, length) {
      if (length === 0 || pageSize === 0) {
        return '0 από ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' από ' + length;
    };
    let action = this.context.iceModel.actions[this.recipe['getStatements']];
    if (action != null) {
      action.executionRules[0].execute();
    }
    this.addItems();
  }

  onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  onOptionChange() {
    this.filteredData = this.Data
    if (this.selectedDoc === 'none' && this.selectedYear === 0) {
      this.filteredData = this.Data
      this.dataSource = new MatTableDataSource<Data>(this.filteredData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const sortState: Sort = { active: 'year', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    } else {
      if (this.selectedDoc !== 'none') {
        this.filteredData = this.filteredData.filter((item: any) => item.docType === this.selectedDoc)
      }
      if (this.selectedYear !== 0) {
        this.filteredData = this.filteredData.filter((item: any) => item.year === this.selectedYear)
      }
      this.dataSource = new MatTableDataSource<Data>(this.filteredData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const sortState: Sort = { active: 'year', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
  }

  showMore() {
    this.InitShowDataNumber += 5;
    this.MobileDataArray = this.filteredData.slice(0, this.InitShowDataNumber)

  }

  private addItems() {
    if (!this.recipe.dataStoreProperty) {
      return;
    }

    this.setMatTableDataSource();

    this.addItemsSubs = this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.DATASTORE_ASSIGN) {
        this.setMatTableDataSource();
      }
    });
    this.subscription.add(this.addItemsSubs);
  }

  private setMatTableDataSource(): void {
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if (!!this.items) {
      this.contentLoaded = true;

      this.Data = this.items;
      this.dataSource = new MatTableDataSource<Data>(this.Data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const sortState: Sort = { active: 'year', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      this.showMore();

      this.Data.forEach((item: any) => {
        this.filterDocs.push(item.docType);
        this.filterYears.push(item.year);
        this.showSpinnerBtnArr = [...this.showSpinnerBtnArr, false];
      });

      this.filterYears.sort();
      this.filterYears.reverse();
      this.filterDocs.sort();
      this.filterDocs = Array.from(new Set(this.filterDocs))
      this.filterYears = Array.from(new Set(this.filterYears))

      this.filteredData = this.Data;
    }
  }

  async getPdfLink(receiptId: any, idx: number) {
    try {
      this.showSpinnerBtnArr[idx] = true;
      this.context.iceModel.elements['statement.pdf.base64'].setSimpleValue(null);
      this.context.iceModel.elements['statement.url'].setSimpleValue(receiptId);
      const action = this.context.iceModel.actions['actionGetStatementPdf'];
      if (action) {
        await action.executionRules[0].execute();
        await action.executionRules[1].execute();
        this.showSpinnerBtnArr[idx] = false;
      }
    } catch (error) {
      this.showSpinnerBtnArr[idx] = false;
      console.error('MyDocumentsComponent getPdfLink', error);
    }
  }

  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(255, 255, 255)');
    svg.setAttribute('width', '28.4');
    svg.setAttribute('height', '32');

    return svg;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

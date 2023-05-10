import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from "lodash";
import { LifecycleType } from '@impeo/ice-core';
import { ReviewConfirmComponent } from '../../page/review-confirm/review-confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

export interface Data {
  docType: string;
  date: string;
  url: string
}

@Component({
  selector: 'app-my-dafs',
  templateUrl: './my-dafs.component.html',
  styleUrls: ['./my-dafs.component.scss']
})


export class MyDafsComponent extends SectionComponentImplementation implements OnInit, OnDestroy {

  docType = 'pages.myDafs.docType';

  Data: any = [];
  // filterDocs: any[] = [];
  // filterYears: any[] = [];
  // selectedYear: number = 0;
  // selectedDoc: string = 'none';

  displayedColumns: string[] = ['docType', 'date', 'url'];
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

  constructor(parent: IceSectionComponent, private modalService: NgbModal) {
    super(parent);
  }

  ngOnInit() {
    // this.SpinnerService.start();
     if(this.page.name=="myDafs")
 //    this.openDialogNotification();



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
    this.filteredData = this.Data;
    this.dataSource = new MatTableDataSource<Data>(this.filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  showMore() {
    this.InitShowDataNumber += 5;
    this.MobileDataArray = this.filteredData.slice(0, this.InitShowDataNumber)

  }

  formatDate(date: any) {
    if (date != null || date != undefined) {
      return new Date(date);
    }

  }

  private addItems(): any {
    if (this.recipe.dataStoreProperty == null) {
      return;
    }

    this.setMatTableDataSource();

    this.addItemsSubs = this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.ICE_MODEL_READY) {
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
      const sortState: Sort = { active: 'date', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      this.showMore();

      if (this.Data) {
        this.Data.forEach((item: any) => {
          this.showSpinnerBtnArr = [...this.showSpinnerBtnArr, false];
        });
      }
      this.filteredData = this.Data;
    }
  }

  openDialogNotification() {
    if(this.page.name=="myDafs" && this.getCurrentDate()<="29/02/2020")
    this.modalService.open(ReviewConfirmComponent, { windowClass: 'notModal',backdropClass:"popupMultiContractClass"});
  }


  async getPdfLink(receiptId: any, idx: number) {
    try {
      this.showSpinnerBtnArr[idx] = true;
      this.context.iceModel.elements['statement.pdf.base64'].setSimpleValue(null);
      this.context.iceModel.elements['daf.url'].setSimpleValue(receiptId);
      const action = this.context.iceModel.actions['actionGetDafPdf'];
      if (action) {
        await action.executionRules[0].execute();

        await action.executionRules[1].execute();
        this.showSpinnerBtnArr[idx] = false;
      }
    } catch (error) {
      this.showSpinnerBtnArr[idx] = false;
      console.error('MyDafsComponent getPdfLink', error);
    }
  }

  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(255, 255, 255)');
    svg.setAttribute('width', '28.4');
    svg.setAttribute('height', '32');

    return svg;
  }

  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate() - 1;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

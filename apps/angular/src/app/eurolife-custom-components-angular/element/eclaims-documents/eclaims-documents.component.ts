import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ElementComponentImplementation } from "@impeo/ng-ice";
import { Subscription, Subject } from 'rxjs';



export interface DocumentsArray {
  Title: string;
  Created: string;
  FileID:string
}



@Component({
  selector: 'app-eclaims-documents',
  templateUrl: './eclaims-documents.component.html',
  styleUrls: ['./eclaims-documents.component.scss']
})

export class EclaimsDocumentsComponent extends ElementComponentImplementation implements OnInit  {
  displayedColumns: string[] = ['Title', 'Created', 'Download'];
  dataSource: MatTableDataSource<any>;
  Documents:any;
  showSpinnerBtn: boolean;



  private destroy$ = new Subject<void>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.showDocuments();

      //Subscribe
      // this.documentList =this.context.iceModel.elements["eclaims.requests.documents.array"].$dataModelValueChange
      // .pipe(takeUntil(this.destroy$))
      // .subscribe((value: IndexedValue) => {
      //   if (value.element.getValue().forIndex(null)){
      //       this.showDocuments();
      //     }
      //   });
      //   this.subscriptions.push(this.documentList);
  }

  showDocuments(){
    this.Documents= this.context.iceModel.elements["eclaims.requests.documents.array"].getValue().values[0].value;

    this.dataSource = new MatTableDataSource<DocumentsArray>(this.Documents);
  }

	handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
		svg.setAttribute('style', 'display: block; margin: auto; fill: rgb(30, 32, 29)');
		svg.setAttribute('width', '22');
		svg.setAttribute('height', '21.2');

		return svg;
	}

  async downloadDoc(fileId: any) {

    try {
      this.showSpinnerBtn = false;
      this.context.iceModel.elements['eclaims.document.fileId'].setSimpleValue(fileId);

      //find the filetype of file
      let document =this.Documents.filter((item:any)=>item.FileID==fileId)[0];
      let filetype=document.Title.split(".")[1];

      this.context.iceModel.elements['eclaims.document.filetype'].setSimpleValue(filetype);

      const action = this.context.iceModel.actions['action-request-downloadfile'];
      if (action) {
        this.showSpinnerBtn = true;
        await action.executionRules[0].execute();
        await action.executionRules[1].execute();

        this.showSpinnerBtn = false;
      }
    } catch (error) {
     this.showSpinnerBtn = false;
      console.error('eclaimsDocument downloadDoc', error);
    }
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();

    this.context.iceModel.elements["eclaims.requests.documents.array"].reset(null);
  }


}

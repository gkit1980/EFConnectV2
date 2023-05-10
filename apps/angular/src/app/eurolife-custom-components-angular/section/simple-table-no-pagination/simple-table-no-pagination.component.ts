import { environment } from './../../../../environments/environment';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IceElement } from '@impeo/ice-core';
import { Component } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { LifecycleType,LifecycleEvent } from '@impeo/ice-core';
import * as fsave from "file-saver";
import { SpinnerService } from '../../../services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CommunicationService } from '../../../services/communication.service';
import * as moment from "moment";


@Component({
  selector: 'app-simple-table-no-pagination',
  templateUrl: './simple-table-no-pagination.component.html',
  styleUrls: ['./simple-table-no-pagination.component.scss']
})
export class SimpleTableNoPaginationComponent extends SectionComponentImplementation {

  dataSource: MatTableDataSource<any>;
  cols: string[];
  table: MatTable<any>;
  selectedRow: any;
  selectionElement: IceElement;
  allReceipts: any[] = [];
  allUnpaidReceipts: any[] = [];
  allLastNotes: any[] = [];
  filterCols: string[] = [];
  index: number[];
  dataWithNoteURLs: any[] = [];
  isLooped: boolean = false;
  data: any;
  showUnpaidReceipts: boolean = false;
  showLastReceipts: boolean = false;
  showLastNotes: boolean = false;
  refreshCounter: number = 0;
  currentPaymentCode: any;
  branch: any;
  amount: any;


  constructor(parent: IceSectionComponent, private SpinnerService: SpinnerService,
    private activateRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private communicationService: CommunicationService,
    private route: Router) {
    super(parent);
  }


  title = 'sections.simplePageNoPagination.title.label';
  dateR = 'sections.simplePageNoPagination.dateR.label';
  dateP = 'sections.simplePageNoPagination.dateP.label';
  contractKey = 'sections.simplePageNoPagination.contractKey.label';
  paymentCode = 'sections.simplePageNoPagination.paymentCode.label';
  totalAmount = 'sections.simplePageNoPagination.totalAmount.label';
  alert = 'sections.simplePageNoPagination.alert.label';
  lastPayments = 'sections.simplePageNoPagination.lastPayments.label';
  lastNotes = 'sections.simplePageNoPagination.lastNotes.label';
  dateSub = 'sections.simplePageNoPagination.dateSub.label';
  wayPayment = 'sections.simplePageNoPagination.wayPayment.label';
  request = 'sections.simplePageNoPagination.request.label';
  paymentButton = 'sections.simplePageNoPagination.paymentButton.label'



  ngOnInit() {

    //
    super.ngOnInit();


    this.activateRoute.queryParamMap.subscribe((params: any) => {
      if (params.params.email != null) {
        this.localStorage.setDataToLocalStorage("email", params.params.email);
      }

    })
    this.cols = this.recipe.cols;
    this.filterCols = this.filtercols(this.cols);

    if (!this.cols)
      return console.error("no 'cols' in recipe for section of '" + this.page.name + "'");

    if (this.recipe.selectionElement)
    {
      this.selectionElement = this.iceModel.elements[this.recipe.selectionElement];
      if (!this.selectionElement) {
        console.warn("Section '" + this.section.name + "' \t\t\t\t\tcannot set selection to unknown element '" + this.recipe.selectionElement + "'");
      }
    }



    if (_.has(this.recipe, 'dataStore'))
    {
      this.context.$lifecycle.subscribe(event => {
        if (event.type == LifecycleType.ICE_MODEL_READY) {
          this.data = this.context.dataStore[this.recipe.dataStore];
          // this.SpinnerService.stop();
          if (this.localStorage.getDataFromLocalStorage("refreshStatus") == 1)
          {
            this.refreshCounter++;
            if(this.data!=undefined)
            {
              this.isLooped=false;
              this.localStorage.setDataToLocalStorage("refreshStatus", 0);
            }

          }

          if (!this.isLooped) {
            this.showData(this.data);
            this.isLooped=true;

          }

        }

        this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

          const actionName = _.get(e, ['payload', 'action']);



          if (actionName.includes("actionGetLastURLNote") && e.type === 'ACTION_FINISHED') {
            this.dataWithNoteURLs = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
         //   this.context.$actionEnded.observers.pop();
          }

        });

      });

    }
    // this.SpinnerService.start();
    this.data = _.get(this.context.dataStore, this.recipe.dataStore);
    if(this.data!= undefined && !this.isLooped)
    {
      this.showData(this.data);
      this.isLooped=true;
    }




  }

  handleSVGPaymentCode(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    return svg;
  }


  filtercols(cols: any[]): string[] {
    var filtelCols = new Array;

    for (let item of cols) {
      if (item != "contractNum") {
        filtelCols.push(item);
      }
    }
    return filtelCols;
  }

  getBranchClass(branch: any): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life_text';
      case 'ΥΓΕΙΑΣ':
        return 'health_text';
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor_text';
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house_text';
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings_text';
      case 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ':
        return 'otherpc_text';
      case 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ':
        return 'otherpc_text';
    }
  }




  selectRow(row: any): void {

    this.selectedRow = row;
    if (!this.selectionElement)
      return;
    var index = _.indexOf(this.dataSource.data, row);
    this.selectionElement.setSimpleValue(index);
  }

  getLabelName(col: string): string {
    // var name=this.context.iceResource.resolve("sections.home." + this.section.name + "." + col, "[" + col + "]")
    var name = this.resource.resolve("sections.home." + this.section.name + "." + col, col)
    return name;
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  orderByDate(arr: any[], dateProp: any) {
    return arr.slice().sort(function (a, b) {
      return b[dateProp] < a[dateProp] ? -1 : 1;
    });
  }

  showIcon(col: any): boolean {
    if (col === "contract")
      return true;
    else
      return false;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; float: right; fill: #383b38');
    svg.setAttribute('width', '29');
    svg.setAttribute('height', '30');

    return svg;
  }

  handleSVGLastPay(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; float: right; fill: #383b38');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  getPdfLink(receiptId: any) {

    if (this.allUnpaidReceipts.length != 0) {
      for (var i in this.allUnpaidReceipts) {
        var specificReceipt = this.dataWithNoteURLs[this.allUnpaidReceipts[i].index].Receipts.filter((x: any) =>
          (x.ReceiptKey === receiptId));

        if (specificReceipt.length == 0)
          continue;
        else
          break;
      }

      this.context.iceModel.elements['receipts.url'].setSimpleValue(null);
      this.context.iceModel.elements['receipts.url'].setSimpleValue(specificReceipt[0].UrlNote);

      this.SpinnerService.setMessage("Φόρτωση");
      //  this.SpinnerService


      this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

        const actionName = _.get(e, ['payload', 'action']);

        if (actionName.includes("actionGetHomePdf") &&  e.type === 'ACTION_FINISHED'){
          let data = this.context.iceModel.elements["statement.pdf.base64"].getValue().values[0].value;
          let blob: Blob = this.base64StringToBlob(data);
          this.save(blob);
          // this.SpinnerService.visible.next(false);
          //this.context.$actionEnded.observers.pop();

        }
      });
    }


  }

  getLastNotePdfLink(receiptId: any) {

    this.context.iceModel.elements['receipts.url'].setSimpleValue(null);
    this.context.iceModel.elements['receipts.url'].setSimpleValue(receiptId);
    // this.SpinnerService.visible.next(true);

    this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

      const actionName = _.get(e, ['payload', 'action']);


      if (actionName.includes("actionGetHomePdf") && e.type === 'ACTION_FINISHED') {
        let data = this.context.iceModel.elements["statement.pdf.base64"].getValue().values[0].value;
        let blob: Blob = this.base64StringToBlob(data);
        this.save(blob);
        // this.SpinnerService.visible.next(false);
        //this.context.$actionEnded.observers.pop();

      }
    });

  }


  showDownloadButton(receiptId: any): boolean {

    if (this.allUnpaidReceipts.length != 0) {
      for (let i in this.allUnpaidReceipts) {
        try {
          let specificReceipt = this.dataWithNoteURLs[this.allUnpaidReceipts[i].index].Receipts.filter((x: any) => {
            if (x.ReceiptKey == receiptId)
              return x;
          });


          if (specificReceipt.length == 0)
            continue;


          if (specificReceipt[0].UrlNote === "")
            return false;
          else
            return true;

        }
        catch (error) {
          return false;
        }
      }
    }
    return false;

  }

  showLastNoteButton(receiptId: any): boolean {
    try {
      if (receiptId == "" || receiptId == undefined) {
        return false;
      }
      else
        return true;
    }
    catch (error) {
      return;
    }
  }


  get filename(): string {

  let fname= this.iceModel.elements["policy.Documents.pdf-table-link-note"].getValue().values[0].element.recipe["pdfTableLinkComponentFileName"] ?
    this.iceModel.elements["policy.Documents.pdf-table-link-note"].getValue().values[0].element.recipe["pdfTableLinkComponentFileName"] as string : "unknown";

    var current_timestamp = moment().format("DD_MM_YYYY_HH:mm:ss");
    fname=fname+"_"+current_timestamp+".pdf"

    return  fname;

  }

  private base64StringToBlob(data: string): Blob {
    if (data == undefined)
      throw new Error("Base 64 data is undefined");

    var binary = atob(data.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }

    return new Blob([view], { type: "application/pdf" });
  }

  private save(blob: Blob) {
    let filename = this.filename;
    if (!filename.toLowerCase().endsWith(".pdf"))
      filename += ".pdf";
    fsave.saveAs(blob, filename);
  }

  handleSVGButton(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '70');
    svg.setAttribute('height', '70');

    return svg;
  }

  showData(data: any) {
//    this.isLooped = true;
    if (data) {

      for (let i = 0; i < data.length; i++) {
        var newRow: any = {};

        var contract = data[i].ProductDescritpion;
        var contractNum = data[i].ContractKey;
        var branch = data[i].Branch;

        if (data[i].Branch === "ΖΩΗΣ" || data[i].Branch === "ΥΓΕΙΑΣ" || data[i].Branch === "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
          this.communicationService.emitChange(true);
          this.localStorage.setDataToLocalStorage("dropDownDocs", true);
        }
        else {
          this.localStorage.setDataToLocalStorage("dropDownDocs", false);
        }


        for (let colItem of data[i].Receipts.filter((x: any) => x.ReceiptStatusDescription == "Εξοφλημένη" && x.PaidAmount > 0)) {
          if (Object.keys(colItem).length > 0) {
            this.showLastReceipts = true;
            var newRow: any = {};
            if (colItem.PaymentType === "ΕΛΤΑ" || colItem.PaymentType === "ΜΕΤΡΗΤΑ ") {
              newRow["paymentType"] = "ΜΕΤΡΗΤΑ";
            } else {
              newRow["paymentType"] = colItem.PaymentType;
            }

            newRow["contract"] = contract;
            newRow["contractNum"] = contractNum;
            newRow["amount"] = colItem.PaidAmount;
            newRow["paymentDate"] = colItem.PaymentDate;
            newRow["branch"] = (colItem.ClassDesctiption != null) ? colItem.ClassDescription : branch;
            this.allReceipts.push(newRow);

          }
        }

        for (let j = 0; j < data[i].Receipts.length; j++) {
          if (data[i].Receipts[j].ReceiptStatusDescription == "Ανείσπρακτη") {
            this.index[0] = i
            this.showUnpaidReceipts = true;
            this.currentPaymentCode = data[i].Receipts[j].paymentCode;
            this.amount = data[i].Receipts[j].GrossPremium;
            this.branch = data[i].Branch;
            var newRowUnpaid: any = {};
            newRowUnpaid["contract"] = contract;
            newRowUnpaid["contractNum"] = data[i].ContractKey;    //this will be hidden for UnpaidReceipts
            newRowUnpaid["paymentCode"] = this.currentPaymentCode;
            newRowUnpaid["amount"] = this.amount;
            newRowUnpaid["renewal"] = this.formatDate(data[i].Receipts[j].StartDate);
            newRowUnpaid["branch"] = this.branch;
            newRowUnpaid["receiptKey"] = data[i].Receipts[j].ReceiptKey;
            newRowUnpaid["paymentType"] = data[i].Receipts[j].PaymentType;
            newRowUnpaid["AccountNumber"] = "Αυτόματη Πληρωμή: **" + data[i].Receipts[j].AccountNumber;
            newRowUnpaid["index"] = this.index[0];
            this.allUnpaidReceipts.push(newRowUnpaid);
          }

        }




        this.allReceipts = this.orderByDate(this.allReceipts, "paymentDate");
        this.allUnpaidReceipts = this.orderByDate(this.allUnpaidReceipts, "paymentDate");

        //all Last Notes
        if (data[i].hasOwnProperty("LastUrlNotes")) {
          if (data[i].LastUrlNotes.length != 0) {
            this.showLastNotes = true;
            // this.context.iceModel.elements['policies.showLastNotes'].setSimpleValue(true);
            // this.localStorage.setDataToLocalStorage("showLastNotes",true);



            for (let ii = 0; ii < data[i].LastUrlNotes.length; ii++) {
              this.index[0] = ii;
              var newRowLastNote: any = {};
              newRowLastNote["branch"] = data[i].Branch;
              newRowLastNote["contract"] = data[i].ProductDescritpion;
              newRowLastNote["urlNote"] = data[i].LastUrlNotes[ii].url;
              newRowLastNote["docDate"] = this.formatDate(data[i].LastUrlNotes[ii].docDate);
              newRowLastNote["contractKey"] = data[i].ContractKey;
              this.allLastNotes.push(newRowLastNote);
            }
          }

        }


        if (this.allLastNotes.length > 0) {
          this.context.iceModel.elements['policies.showLastNotes'].setSimpleValue(true);
          this.localStorage.setDataToLocalStorage("showLastNotes", true);
        }
        else {
          this.context.iceModel.elements['policies.showLastNotes'].setSimpleValue(false);
          this.localStorage.setDataToLocalStorage("showLastNotes", false);
        }
      }

      //end Last Notes

      this.context.iceModel.elements['policy.contract.general.info.indexHolderHome'].setSimpleValue(null);
      this.context.iceModel.elements['policy.contract.general.info.indexHolderHome'].setSimpleValue(this.index[0]);

      for (let item of this.allReceipts)
        item.paymentDate = this.formatDate(item.paymentDate);

      this.allReceipts = this.allReceipts.slice(0, 3);
      this.allUnpaidReceipts = this.allUnpaidReceipts.slice(0, 3);
      this.dataSource = new MatTableDataSource(this.allReceipts);





    }

  }


  onReceipts(row: any) {
    let branch: number;

    //map index of selected contract
    let contractIndex = this.mapContract(row.contractNum);
    var indexOfContractIDType: any;
    //map branches
    if (row.branch == "ΥΓΕΙΑΣ") {
      branch = 1;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      // indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      // this.iceModel.elements["policy.selectedContractIDType"].setSimpleValue(this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1));
    } else if (row.branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
      indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "2") {
        branch = 11;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else {
        branch = 2;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
    } else if (row.branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      branch = 3;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΠΕΡΙΟΥΣΙΑΣ") {
      indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "13") {
        branch = 13;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else {
        branch = 4;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
    } else if (row.branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ") {
      branch = 6;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΣΚΑΦΩΝ") {
      branch = 7;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΑΣΤΙΚΗ ΕΥΘΥΝΗ") {
      branch = 8;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    } else if (row.branch == "ΖΩΗΣ") {
      indexOfContractIDType = this.data[contractIndex].ContractIDType.indexOf('_');
      if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "6") {
        branch = 12;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "3") {
        branch = 15;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "7") {
        branch = 14;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "4") {
        branch = 16;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else if (this.data[contractIndex].ContractIDType.substr(indexOfContractIDType + 1) === "5") {
        branch = 17;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
      else {
        branch = 9;
        this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
      }
    }
    else {
      branch = 5;
      this.iceModel.elements["policy.selectedBranch"].setSimpleValue(branch);
    }

    this.iceModel.elements["policy.contract.general.info.ContractID"].setSimpleValue(null);
    this.iceModel.elements["policy.contract.general.info.ContractID"].setSimpleValue(this.data[contractIndex].ContractID);

    //set data to localStorage
    this.localStorage.setDataToLocalStorage("index", contractIndex);
    this.localStorage.setDataToLocalStorage("selectedBranch", this.context.iceModel.elements['policy.selectedBranch'].getValue().values[0].value);
    // this.localStorage.setDataToLocalStorage("selectedContractIDType", this.context.iceModel.elements['policy.selectedContractIDType'].getValue().values[0].value);
    this.localStorage.setDataToLocalStorage("contractID", this.data[contractIndex].ContractID);
    this.localStorage.setDataToLocalStorage("contractKey", row.contractNum);


    //Add in local storage the navigation info
    this.localStorage.setDataToLocalStorage("navigation", this.iceModel.elements["exclude.Navigation.Tab"].getValue().values[0].value);
    this.context.iceModel.elements['policy.contract.general.info.indexHolder'].setSimpleValue(contractIndex);
    this.route.navigate([
      "/ice/default/customerArea.motor/policyDetails"
    ], {
      queryParams: {
        id: 4,
        contractID: row.contractNum,
        branch: branch,
        index: contractIndex,
        redirect: 1

      }
    });
  }

  mapContract(myData: any): number {
    var index = -1;
    for (let item of this.data) {
      if (item.ContractKey === myData)
        return this.data.indexOf(item);
    }
    return index;
  }

  redirectToPayment(row: any) {
    this.context.iceModel.elements["policies.details.TotalUnpaidAmount"].setSimpleValue(row.amount);
    this.route.navigate(['/ice/default/customerArea.motor/paymentManagement']
      , {
        queryParams: {
          paymentCode: row.paymentCode,
          branch: row.branch,
          index: row.index
        }
      });

  }


  redirectPaymentCondition(row: any): boolean {
    if ((row.branch != 'ΠΡΟΣΩΠΙΚΟΥ ΑΤΥΧΗΜΑΤΟΣ' && row.branch != 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ' && row.branch != 'ΑΣΤΙΚΗ ΕΥΘΥΝΗ') &&
      row.paymentCode != null &&
      (row.paymentType === 'ΜΕΤΡΗΤΑ' || row.paymentType === 'ΕΛΤΑ')
    )
      return true;
    else
      return false;

  }

  ///*Walkthrough Purpose */

  icon(): string {
    let icon = environment.sitecore_media + "C8705EB508D542E59548EF002F938768" + ".ashx";
    return icon;
  }

  handleSVGIndexIcon(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');

    return svg;
  }



  get getJoyrideStep(): string {

    if (this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null) == true && this.showLastNotes)
      return "fourthStep";
    if (this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null) == true && !this.showLastNotes)
      return "";
    if (!this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null) == true && this.showLastNotes)
      return "thirdStep";
    if (!this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null) == true && !this.showLastNotes)
      return "";
  }



}


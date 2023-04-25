import { Component, OnDestroy, OnInit } from '@angular/core';
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { environment } from "./../../../../environments/environment";
import { LocalStorageService } from "../../../services/local-storage.service";
import * as _ from "lodash";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { PopUpPageComponent } from '../../page/pop-up-page/pop-up-page.component';
import { Subject } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SpinnerService } from '../../../services/spinner.service';
import { takeUntil } from 'rxjs/operators';
import { IceSection,IndexedValue } from '@impeo/ice-core';




export interface Insured {
  MainInsured: boolean;
  Contractkey: string;
  CustomerCode:string;
  Fullname: string;
  Id: string;
  MainInsuredId: string;
  InsuredId: number;
}

@Component({
  selector: 'app-eclaims-available-contracts',
  templateUrl: './eclaims-available-contracts.component.html',
  styleUrls: ['./eclaims-available-contracts.component.scss']
})
export class EclaimsAvailableContractsComponent extends SectionComponentImplementation implements OnInit,OnDestroy {


  NgdialogRef: NgbModalRef;
  header: string;
  innerheader: string;
  active: boolean =false;
  data: any[] = [];
  filteredData: any[] = [];
  isLooped: boolean;
  showData: any;
  dataWithNoteURLs: any[] = [];
  refreshStatus: any;
  contentLoaded: boolean = false;
  contentData: any[] = [];
  GroupHealthInsured: any[] = [];
  FilterGroupHealthInsured: any[]=[];
  members:number=0;
  numberOfGroupHealthContracts: number=0;
  multipleNumberContracts: boolean=false;
  selectedGroupHealthParticipant: Insured;
  private destroy$ = new Subject<void>();
  participantSelected : boolean =false;
  LastNameInsured: string='';
  FirstNameInsured: string='';
  mainInsuredId: string;

  constructor( parent: IceSectionComponent,private localStorage: LocalStorageService,public ngbModal: NgbModal, public modalService: ModalService,
    private spinnerService: SpinnerService) {
    super(parent);
   }

  async ngOnInit() {



    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === 1) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      },
      (err: any) =>
        console.error('EclaimsGridViewComponent eclaims.step', err)
    );

    this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if (valElem === null ){
          this.selectedGroupHealthParticipant.Contractkey=null;
          this.selectedGroupHealthParticipant.CustomerCode=null;
          this.selectedGroupHealthParticipant.Fullname=null;
          this.selectedGroupHealthParticipant.Id=null;
          this.selectedGroupHealthParticipant.InsuredId=null;
          this.selectedGroupHealthParticipant.MainInsured=null;
          this.selectedGroupHealthParticipant.MainInsuredId=null;
          this.participantSelected=false;
          this.getData();
        }
      },
      (err: any) =>
        console.error('EclaimsGridViewComponent eclaims.step', err)
    );

    this.LastNameInsured=this.context.iceModel.elements['customer.details.LastName'].getValue().forIndex(null);
    this.FirstNameInsured=this.context.iceModel.elements['customer.details.FirstName'].getValue().forIndex(null);

    this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].setSimpleValue(null);
    this.context.iceModel.elements['eclaims.selected.Incident'].setSimpleValue(null);

    this.context.iceModel.elements['eclaims.receipt.company'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.receipt.receiptAmount'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.receipt.taxNumber'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.receipt.issueDate'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.receipt.codeNumber'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.receipt.codeNumber'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.receipt.series'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.selected.ailmentId'].setSimpleValue("");
    this.context.iceModel.elements['eclaims.selected.finalCover'].setSimpleValue("");

    this.spinnerService.loadingOn();
    const actName2='actionWriteFromOtherForRefresh';
    const action2 = this.context.iceModel.actions[actName2];
    if (!!action2) {
      await this.context.iceModel.executeAction(actName2);
    }
    this.spinnerService.loadingOff();


    this.getData();
    this.refreshStatus = this.localStorage.getDataFromLocalStorage("refreshStatus");

  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; float: right; fill: #383b38");
    svg.setAttribute("width", "29");
    svg.setAttribute("height", "30");

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    return svg;
  }

  radioChange(event:any,item:any) {

    for (const contract of this.contentData) {
      if(contract===item)
      {
      contract.active=true;
      contract.GroupHealthInsured=item.GroupHealthInsured;
      }
      else
      {
      contract.active=false;
      }
    }

    this.context.iceModel.elements['eclaims.step'].setSimpleValue(11);
  }

  onChange(event:any)
  {
    if(event.value!="")
    {
    this.context.iceModel.elements['eclaims.selected.DependentMemberId'].setSimpleValue(event.value.Id);

    //Log Dependent Id
      // let action = this.context.iceModel.actions['actionLogDependantId'];
      // if (action != null) {
      //   let executionRule1 = action.executionRules[0];
      //   this.context.executeExecutionRule(executionRule1);
      // }
      ///
    this.context.iceModel.elements['eclaims.selected.ContractKey'].setSimpleValue(event.value.Contractkey);
    this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].setSimpleValue(event.value.Fullname);
    this.context.iceModel.elements['policies.details.grouphealth.CustomerCode'].setSimpleValue(event.value.CustomerCode);
    this.context.iceModel.elements['eclaims.selected.InsuredId'].setSimpleValue(event.value.MainInsuredId);
    this.context.iceModel.elements['eclaims.selected.participant.InsuredId'].setSimpleValue(event.value.InsuredId);

    if(event.value.MainInsured==true)    //his.iceModel.elements["customer.details.FullName"].getValue().forIndex(null)
    {
      this.participantSelected=false;
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(11);
    }
    else
    {
      this.participantSelected=true;
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
    }


    }
  }

  public toggle(event: MatSlideToggleChange) {
    if(event.checked)
    {
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(11);
    }
    else
    {
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
    }
  }

  checkParticipantSelected() :boolean{

    return this.participantSelected;

  }


  getContentLoaded()
  {
    return this.contentLoaded;
  }

  private async getData() {
    this.data = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if (!!this.data) {
      this.numberOfGroupHealthContracts=0;
      for (const contract of this.data)
      {
        if (contract.Branch === 'ΖΩΗΣ' && contract.ContractGroupHealthDetails)
        {
         // contract.Coverages=this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;

          //Log Coverages
          // let action = this.context.iceModel.actions['actionLogCoverages'];
          // if (action != null) {
          //   let executionRule1 = action.executionRules[0];
          //  await this.context.executeExecutionRule(executionRule1);
          // }
          ///

          contract.GroupHealthInsured=[];
          contract.FilterGroupHealthInsured=[];
          this.addGroupHealthInsured(contract);
          this.contentData = [...this.data];
          this.numberOfGroupHealthContracts++;
        }
      }
      if(this.numberOfGroupHealthContracts==1)
      {
        const indexPos=this.contentData.findIndex((contract)=>(contract.Branch === 'ΖΩΗΣ' && !!contract.ContractGroupHealthDetails));
        this.contentData[indexPos].active=true;
      }
      this.contentLoaded = true;
    }
  }


   addGroupHealthInsured(contract: any)  {
    //close lwc if it's open
    if( this.context.iceModel.elements['eclaims.step'].getValue().values[0].value == 2
    ){
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
    }
    this.members=0;

    contract.Coverages.forEach((coverage: any) => {
      //ομαδικα Συμβολαια
           switch (coverage.CalculationMethodDescription) {
            case "Ανάλωση":

              if(coverage.InsuredId!=undefined)
              {

                    var insured:Insured={
                      MainInsured: false,
                      Contractkey: contract.ContractKey,
                      CustomerCode: contract.CustomerCode,
                      Fullname: coverage.InsuredLastName + " " + coverage.InsuredFirstName,
                      Id:coverage.InsuredId,
                      MainInsuredId:null,
                      InsuredId: null
                    };

                    if(coverage.InsuredId){
                      insured.InsuredId=coverage.InsuredId;
                    }


                    if(coverage.DependantRelation==undefined)
                    {
                     insured.MainInsured=true;
                     this.mainInsuredId=coverage.InsuredId;                  //Bug fix DC-862
                    }
                    else
                     insured.MainInsured=false;

              }

              contract.GroupHealthInsured.push(insured);
              this.members++;



              break;
            default:
              break;
          }
  });


   contract.GroupHealthInsured=contract.GroupHealthInsured.map((item: any) => {
   const newItem= Object.assign({}, item);
   newItem.MainInsuredId=this.mainInsuredId;
   return newItem;
   }
   );  //Bug fix DC-862

   //Log Insured Id
  //  let action = this.context.iceModel.actions['actionLogInsuredId'];
  //  if (action != null) {
  //    let executionRule1 = action.executionRules[0];
  //    this.context.executeExecutionRule(executionRule1);
  //  }
   ///

  //Log Dependent Id
    //  let action = this.context.iceModel.actions['actionLogDependantId'];
    //  if (action != null) {
    //    let executionRule1 = action.executionRules[0];
    //    this.context.executeExecutionRule(executionRule1);
    //  }
     ///



  //start initial flow from start....not from the flow you attach the files
  if(!this.context.iceModel.elements['eclaims.update.request.flag'].getValue().forIndex(null) && this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].getValue().values[0].value)
  this.context.iceModel.elements['eclaims.step'].setSimpleValue(11);

  ///Filter By MainInsured=true
  contract.FilterGroupHealthInsured=[
    ...contract.GroupHealthInsured.filter(
      (insured: Insured) => insured.MainInsured === true
    ),
    ...contract.GroupHealthInsured.filter(
      (insured: Insured) => insured.MainInsured === false
    )
    ];

    //Remove duplicates
    contract.FilterGroupHealthInsured = contract.FilterGroupHealthInsured.reduce((unique:any, o:any) => {
      if(!unique.some((obj:any) => obj.Id === o.Id)) {
        unique.push(o);
      }
      return unique;
  },[]);

  }



  getNumberOfGroupHealthContracts() :boolean{

    if(this.numberOfGroupHealthContracts>1)
    return true;
    else
    false;
  }

  addStyleMoreContracts() : string {

    if(this.numberOfGroupHealthContracts>1)
    return "";
    else
    return "remove-space";

  }

  openDialog(item:any): void {

      this.modalService.ismodalOpened();

      //selected
      this.context.iceModel.elements['eclaims.contractID'].setSimpleValue(item.ContractID
      );

      const popupPageName = 'eclaimsCoveragesPopUp';
      if ((!popupPageName) || (!this.context.iceModel.pages[popupPageName])) return console.error(`Page ${popupPageName} does not exists, dialog will not be displayed`);
      PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];

      this.NgdialogRef = this.ngbModal.open(PopUpPageComponent, { windowClass: 'xxxlModal', centered:true });
      this.NgdialogRef.result.then(() => { console.log('When user closes'); }, () => { this.modalService.isModalClosed(); })

  }

  fillDatastore()
  {
    this.context.iceModel.elements["triggerActionWriteFromOther"].setSimpleValue(1);
  }

  getExistingMembers(item:any) : boolean
  {
    return (item.GroupHealthInsured.length>0)?true:false;
  }

  ngOnDestroy(){
    for (const contract of this.contentData) {
      contract.active=false;
    }

    this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].setSimpleValue(null);

    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { environment } from "@insis-portal/environments/environment";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import * as _ from "lodash";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';
import { Subject } from 'rxjs';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import {eclaimsData} from "@insis-portal/data/eclaims.data";
import { takeUntil } from 'rxjs/operators';
import { IceSection,IndexedValue } from '@impeo/ice-core';

@Component({
  selector: 'app-eclaims-select-incident',
  templateUrl: './eclaims-select-incident.component.html',
  styleUrls: ['./eclaims-select-incident.component.scss']
})
export class EclaimsSelectIncidentComponent extends SectionComponentImplementation implements OnInit,OnDestroy {


  NgdialogRef: NgbModalRef;
  header: string;
  innerheader: string;
  data: any[] = [];
  refreshStatus: any;
  private destroy$ = new Subject<void>();
  incidentsData:  any[] =[];
  incidentsMobileData:  any[] =[];
  ailmentsData:  any[] =[];
  searchIncidentsData:  any[] =[];
  searchValue: string = null;
  selectedIncident: string = null;
  selectedTabIndex:number=0;
  hospitalizationCodes: any[] =[];
  sickLeaveCodes: any[] = [];
  testPapCodes: any[] = [];
  myopiaCodes: any[] = [];
  expensesDoctorsMedicinesDiagnosticTestsCodes: any[] = [];
  showHospitalzationOption: boolean = false;
  showSickLeaveOption: boolean = false;
  showMedicinesDiagnosticTestsOptions: boolean = false;
  selectMedicinesDiagnosticTestsOptions: boolean = false;
  showTestPap: boolean = false;
  showMyopia: boolean = false;
  hospitalFinalCover: string = null;
  sickLeaveFinalCover: string = null;
  medicinesFinalCover: string = null;


  adult: boolean =  true;

  constructor( parent: IceSectionComponent,private localStorage: LocalStorageService,public ngbModal: NgbModal, public modalService: ModalService,
    private spinnerService: SpinnerService) {
    super(parent);
   }

  async ngOnInit() {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.context.iceModel.elements['eclaims.step'].$dataModelValueChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (value: IndexedValue) => {
        const valElem = value.element.getValue().forIndex(null);
        if ( valElem === 12 || valElem === 14 || valElem === 15) {
          this.selectMedicinesDiagnosticTestsOptions = false;
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

    this.hospitalizationCodes = eclaimsData.hospitalizationCodes;
    this.sickLeaveCodes = eclaimsData.sickLeaveCodes;
    this.testPapCodes = eclaimsData.testPapCodes;
    this.myopiaCodes = eclaimsData.myopiaCodes;
    this.expensesDoctorsMedicinesDiagnosticTestsCodes = eclaimsData.expensesDoctorsMedicinesDiagnosticTestsCodes;
    this.incidentsData = [...eclaimsData.incidentsData];
    this.ailmentsData = eclaimsData.ailmentsData;

    this.context.iceModel.elements["eclaims.selected.Incident"].$dataModelValueChange.subscribe((value: any) => {
      this.selectedIncident = value.element.getValue().forIndex(null);
      if(!this.selectedIncident){
        this.ailmentsData.forEach(item => item.collapse = true);
      }
    });

    this.context.iceModel.elements["eclaims.selected.ContractKey"].$dataModelValueChange.subscribe((value: any) => {
      for (const contract of this.data)
      {
        if (value.element.getValue().forIndex(null)==contract.ContractKey)
        {
          this.showHospitalzationOption = false;
          this.showSickLeaveOption = false;
          this.showMedicinesDiagnosticTestsOptions = false;
          this.showTestPap = false;
          this.showMyopia = false;

          contract.Coverages.forEach( (cover:any) => {
            this.checkCoverages(cover);
          });

          contract.Benefits.ContractGroupHealthInsuredBenefits.forEach( (benefit:any) => {
            if(!this.showTestPap){
              this.showTestPap = this.testPapCodes.findIndex( item =>  benefit.BenefitCode === item) < 0 ? false : true;
            }
            if(!this.showMyopia){
              this.showMyopia = this.myopiaCodes.findIndex( item =>  benefit.BenefitCode === item) < 0 ? false : true;
            }
          });
        }
      }
    });

    this.context.iceModel.elements["eclaims.selected.participant.InsuredId"].$dataModelValueChange.subscribe((value: any) => {
      if (value.element.getValue().forIndex(null))
      {
        let MainInsured = true;
        this.ailmentsData.forEach(item => item.collapse = true);
        for (const contract of this.data)
        {
            contract.Participants.forEach((participant: any )=>{
              if(participant.InsuredId === value.element.getValue().forIndex(null)){
                MainInsured = false;
                if(participant.BirthDate){
                  let participantAge = this.getAge(participant.BirthDate);
                  if( participantAge < 18 ) {
                    this.adult = false;
                  }else{
                    this.adult = true;
                  }
                }
              }
            });
        }
        if(MainInsured){
          this.adult = true;
        }
      }
    });

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
    svg.setAttribute("style", "display: block; float: right;");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");

    return svg;
  }

  handleSVGProduct(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");

    return svg;
  }




  private async getData() {
    this.data = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if (!!this.data) {
      for (const contract of this.data)
      {
        if (contract.Branch === 'ΖΩΗΣ' && contract.ContractGroupHealthDetails)
        {
          if(this.context.iceModel.elements['eclaims.selected.ContractKey'].getValue().values[0].value === contract.ContractKey){
            this.showHospitalzationOption = false;
            this.showSickLeaveOption = false;
            this.showMedicinesDiagnosticTestsOptions = false;
            contract.Coverages.forEach( (cover:any) => {
              this.checkCoverages(cover);
            });
            contract.Benefits.ContractGroupHealthInsuredBenefits.forEach( (benefit:any) => {
              if(!this.showTestPap){
                this.showTestPap = this.testPapCodes.findIndex( item =>  benefit.BenefitCode === item) < 0 ? false : true;
              }
              if(!this.showMyopia){
                this.showMyopia = this.myopiaCodes.findIndex( item =>  benefit.BenefitCode === item) < 0 ? false : true;
              }
            });
          }
        }
      }
    }
  }

  checkCoverages(cover:any){
    this.hospitalizationCodes.findIndex( item =>{
      if(cover.CoverKey === item){
        if(this.hospitalFinalCover == null || this.hospitalFinalCover > cover.CoverKey){
          this.hospitalFinalCover = cover.CoverKey;
        }
        if(!this.showHospitalzationOption)this.showHospitalzationOption = true;
      }
      return cover.CoverKey === item;
    });

    this.sickLeaveCodes.findIndex( item =>{
      if(cover.CoverKey === item){
        if(this.sickLeaveFinalCover == null || this.sickLeaveFinalCover > cover.CoverKey){
          this.sickLeaveFinalCover = cover.CoverKey;
        }
        if(!this.showSickLeaveOption)this.showSickLeaveOption = true;
      }
      return cover.CoverKey === item;
    });

    this.expensesDoctorsMedicinesDiagnosticTestsCodes.findIndex( item =>{
      if(cover.CoverKey === item){
        if(this.medicinesFinalCover == null || this.medicinesFinalCover > cover.CoverKey){
          this.medicinesFinalCover = cover.CoverKey;
        }
        if(!this.showMedicinesDiagnosticTestsOptions) this.showMedicinesDiagnosticTestsOptions = true;
      }
      return cover.CoverKey === item;
    });
  }

  ngOnDestroy(){
    this.ailmentsData = eclaimsData.ailmentsData.slice();
    this.destroy$.next();
    this.destroy$.complete();
    this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].setSimpleValue(null);
  }


  toggleCollapse(item: any): void {
    item.collapse = !item.collapse;
  }

  onSearchClick(value: string) {
     console.log(value);
     this.searchValue = value;
     this.searchIncidentsData = this.incidentsData.filter(incidents => incidents.filter((incident: string | string[]) => incident.includes(value)));
     this.incidentsData.forEach( incidents => incidents.filter((incident: string | string[]) => incident.includes(value)))
  }

  checkSearchIncident(incident: any) {
    return incident.includes(this.searchValue);
  }

  onValChange(incidentName: any, incidentCode?: any) {
    if(incidentCode){
      this.context.iceModel.elements['eclaims.selected.Incident'].setSimpleValue(incidentName);
      this.context.iceModel.elements['eclaims.selected.ailmentId'].setSimpleValue(incidentCode.toString());
      this.context.iceModel.elements['eclaims.selected.requestType'].setSimpleValue("1");
      this.context.iceModel.elements['eclaims.selected.finalCover'].setSimpleValue(this.medicinesFinalCover);
      this.selectedIncident = incidentName;
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(13);
    }else{
      if(incidentName == 'Φάρμακα / Διαγνωστικές εξετάσεις / Ιατρικές επισκέψεις'){
        this.selectMedicinesDiagnosticTestsOptions = true;
        this.selectedIncident = null;
        this.context.iceModel.elements["eclaims.selected.Incident"].setSimpleValue(null);
        this.context.iceModel.elements['eclaims.step'].setSimpleValue(12);
      }else{
        this.selectMedicinesDiagnosticTestsOptions = false;
        this.context.iceModel.elements['eclaims.selected.Incident'].setSimpleValue(incidentName);
        this.selectedIncident = incidentName;
        if (incidentName == 'Νοσηλεύτηκα σε νοσοκομείο'){
          this.context.iceModel.elements['eclaims.selected.requestType'].setSimpleValue("2");
          this.context.iceModel.elements['eclaims.selected.finalCover'].setSimpleValue(this.hospitalFinalCover);

        }else if(incidentName == 'Έχασα μισθούς λόγω ασθένειας'){
          this.context.iceModel.elements['eclaims.selected.requestType'].setSimpleValue("3");
          this.context.iceModel.elements['eclaims.selected.finalCover'].setSimpleValue(this.sickLeaveFinalCover);

        }
        this.context.iceModel.elements['eclaims.step'].setSimpleValue(13);
      }
    }

  }

  moveNextTab() {
    this.selectedTabIndex= (this.selectedTabIndex+1)%3
  }

  movePreviousTab() {
    this.selectedTabIndex=(((this.selectedTabIndex-1) % 3) + 3) % 3;
  }

  showCategory2(value: any){
    return value>2 && value<6;

  }

  getAge(birthDate: any) {
    let today = new Date();
    birthDate = new Date(birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

}




import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
} from '@impeo/ng-ice';
import * as _ from "lodash";
import { Subject } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { environment } from "../../../../environments/environment";




@Component({
  selector: 'app-amendments-life-beneficiaries',
  templateUrl: './amendments-life-beneficiaries.component.html',
  styleUrls: ['./amendments-life-beneficiaries.component.scss'],
})
export class AmendmentsLifeBeneficiariesComponent 
  extends SectionComponentImplementation
  implements OnInit, OnDestroy
{

  myinput: any;
  errorMsg: String = '';
  showField: boolean;
  regexpios: RegExp = undefined;
  @ViewChild('messageInput') messageInput: ElementRef;
  search: string;   // text to search
  regexp: RegExp;
  jwt_data: any;
  NgdialogRef: NgbModalRef;
  private destroy$ = new Subject<void>();
  private _html = [''];
  rows : any[]=[];
  showNotification=false;
  editable : boolean =false;
  availableIndexOfBenef = [0,1,2];
  lockArrayOfBeneficiaries = [false, false, false];
  elementBenefName: any;
  elementPercentage: any;
  elementRelationship: any;
  data: any[] = [];
  activeComponent: string;
  


  

  constructor(
    parent: IceSectionComponent,
    private zone:NgZone,
    public modalService: ModalService,
    public ngbModal: NgbModal
  ) {
  
    super(parent);
    this.zone.run(() => { console.log('Do change detection here'); });
  }

  ngOnInit(): void {
    

    this.context.iceModel.elements["amendments.step2"].$dataModelValueChange.subscribe((value: any) => {
      if(this.rows.length>0){
        this.initializeValues();
      }
    });


    this.getData();
    //benefiaries items
    //this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries'].setSimpleValue(null);
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
    this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
    this.lockArrayOfBeneficiaries[0] = this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock1`].getValue().values[0].value;
    this.lockArrayOfBeneficiaries[1] = this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock2`].getValue().values[0].value;
    this.lockArrayOfBeneficiaries[2] = this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock3`].getValue().values[0].value;

  

  }
  private getData() {

    this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.subscribe((value: any) => {
      if (value.element.getValue().forIndex(null)==1 && !this.showBeneficiaries())
      {
        this.showNotification=true
      }
        else{
        this.showNotification=false;
        }
    });



  }
  //initialize values (back button)
  initializeValues(){
    this.rows =[];
    this.availableIndexOfBenef = [0,1,2];
    this.lockArrayOfBeneficiaries = [false, false, false];
  }

  getGridColumnClass(col: any): string {
    let result: any;
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
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

    if (col.css) css = css + " " + col.css;
    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-md-" + col.internalCol;
    if (col.css) css = css + " " + col.css;
    return css;
  }

  get elementClass(): string {
    return '';
  }

  showBeneficiaries():boolean
  {
    if(this.context.iceModel.elements["policy.beneficiaries"].getValue().values[0].value.length>0)
    {
    this.data=this.context.iceModel.elements["policy.beneficiaries"].getValue().values[0].value;
    return true;
    }
    else
    return false;
  }

  getSectionClass(row: any) {
    let result: any;
    if (row.css) {
      if (this.context.iceModel.elements[row.css] != undefined) {
        let dt_name = this.context.iceModel.elements[row.css].recipe.dtName;
        let dt = this.page.iceModel.dts[dt_name];
        if (dt) {
          result = dt.evaluateSync();
          if (result.defaultValue) {
            return result.defaultValue;
          }
          else {
            return 'section-breaks-gen';
          }

        }
      }else{
        return row.css;
      }

    }
    return null;
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
    svg.setAttribute("width", "25");
    svg.setAttribute("height", "25");

    return svg;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addBeneficiary(): void {
    this.showNotification= false;
    if(this.availableIndexOfBenef[0]>=0 && this.availableIndexOfBenef[0]<=2){
      const recipe = [this.recipe.rows[this.availableIndexOfBenef[0]], this.availableIndexOfBenef[0]];
      this.rows.push(recipe);
      this.context.iceModel.elements['amendments.beneficiaries.length'].setSimpleValue( this.rows.length);
      this.checkPercentage();
      this.availableIndexOfBenef.splice(0, 1);
      this.page.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
    }
  }

  removeBeneficiary(index:number): void {
    this.lockArrayOfBeneficiaries[this.rows[index][1]] = false;
    this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock${this.rows[index][1]+1}`].setSimpleValue(false);
    this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[index][1]+1}`].setSimpleValue(0);
    this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.name.input${this.rows[index][1]+1}`].setSimpleValue(null);
    this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.relationship.input${this.rows[index][1]+1}`].setSimpleValue('-');
    this.availableIndexOfBenef.push( this.rows[index][1]);
    this.availableIndexOfBenef.sort((a,b) => a-b);
    this.rows.splice(index, 1);
    if(this.rows.length == 0 && !this.showBeneficiaries()) this.showNotification= true;
    this.context.iceModel.elements['amendments.beneficiaries.length'].setSimpleValue( this.rows.length);
    this.checkPercentage();
    this.checkIfBeneficiariesInputsIsFilled();
  }

  lockBeneficiary(index:number): void{
      if(!this.lockArrayOfBeneficiaries[this.rows[index][1]]){        
        this.lockArrayOfBeneficiaries[this.rows[index][1]] = true;
        this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock${this.rows[index][1]+1}`].setSimpleValue(true);
      }else{
        this.lockArrayOfBeneficiaries[this.rows[index][1]] = false;
        this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock${this.rows[index][1]+1}`].setSimpleValue(false);
      }
  }

  checkPercentage(): void{
      if(this.context.iceModel.elements['amendments.beneficiaries.length'].getValue().values[0].value == 1){
        this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].setSimpleValue(100);
      }else if(this.context.iceModel.elements['amendments.beneficiaries.length'].getValue().values[0].value == 2){
        if((this.lockArrayOfBeneficiaries[0] && this.lockArrayOfBeneficiaries[1]) || this.lockArrayOfBeneficiaries[0]){
          let value0 = this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].getValue().values[0].value;
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[1][1]+1}`].setSimpleValue(100-value0);
        }else{
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].setSimpleValue(50);
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[1][1]+1}`].setSimpleValue(50);  
        }

      }else if(this.context.iceModel.elements['amendments.beneficiaries.length'].getValue().values[0].value == 3){
        if((this.lockArrayOfBeneficiaries[0] && this.lockArrayOfBeneficiaries[1] && this.lockArrayOfBeneficiaries[2]) || (this.lockArrayOfBeneficiaries[0] && this.lockArrayOfBeneficiaries[1])){
          let value0 = this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].getValue().values[0].value;
          let value1 = this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[1][1]+1}`].getValue().values[0].value;
          let value3=0
          if(100-value0-value1 >= 0) value3 = 100-value0-value1; 
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[2][1]+1}`].setSimpleValue(value3);

        }else if(this.lockArrayOfBeneficiaries[0]){
          let value0 = this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].getValue().values[0].value;
          let newValue = 100-value0;
          let value2,value3 =0;
          if(newValue % 2 == 0){
            value2 = value3 = newValue/2;
          }else{
            value2 = value3 = ~~(newValue/2);
            value2+=1;
          }
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[1][1]+1}`].setSimpleValue(value2);
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[2][1]+1}`].setSimpleValue(value3);
        }else if(this.lockArrayOfBeneficiaries[1]){
          let value1 = this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[1][1]+1}`].getValue().values[0].value;
          let newValue = 100-value1;
          let value0,value3 =0;
          if(newValue % 2 == 0){
            value0 = value3 = newValue/2;
          }else{
            value0 = value3 = ~~(newValue/2);
            value0+=1;
          }
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].setSimpleValue(value0);
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[2][1]+1}`].setSimpleValue(value3);
        }else{
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[0][1]+1}`].setSimpleValue(34);
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[1][1]+1}`].setSimpleValue(33);
          this.context.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${this.rows[2][1]+1}`].setSimpleValue(33);
        }
      }
  }

  checkIfBeneficiariesInputsIsFilled():void{
    let filledBeneficiariesInputs=0;
    for(let i=1; i<=3; i++ ){
      if( this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.name.input${i}`].getValue().values[0].value != null &&
      this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.relationship.input${i}`].getValue().values[0].value != null &&
      this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.relationship.input${i}`].getValue().values[0].value != '-' &&
      this.page.iceModel.elements[`amendments.health.life.finance.addBeneficiaries.percentage.input${i}`].getValue().values[0].value != null){
        filledBeneficiariesInputs+=1;
      }
    }
    if(this.page.iceModel.elements["amendments.beneficiaries.length"].getValue().values[0].value == filledBeneficiariesInputs){
      this.page.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(true);
    }else {
      this.page.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
    }
  }
}

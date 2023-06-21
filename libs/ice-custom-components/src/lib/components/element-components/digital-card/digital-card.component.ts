import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { Subject } from 'rxjs';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import * as _ from "lodash";
import { LocalStorageService } from '@insis-portal/services/local-storage.service';




export interface Insured {
  MainInsured: boolean;
  Contractkey: string;
  CustomerCode: string;
  LastName: string;
  FirstName: string;
  Id: string;
}


@Component({
  selector: 'app-digital-card',
  templateUrl: './digital-card.component.html',
  styleUrls: ['./digital-card.component.scss']
})
export class DigitalCardComponent  extends ElementComponentImplementation implements OnInit {

  options: any = [];
  dataList: any = [];
  showOptions: boolean = true;
  selectedValue: any;
  selectedBranch: string;
  selectedContractId: string;
  typeScope: any;
  buttonClass: string;
  labelDropdown:string;
  dropdownOpen: boolean = false;
  showSpinnerBtn: boolean = false;
  data: any[] = [];
  mainGroupHealthInsured: any[];
  isValidated=true;

  private destroy$ = new Subject<void>();
  filteredData: any;


  constructor( private spinnerService: SpinnerService,private localStorage:LocalStorageService) {
    super();
  }


  ngOnInit() {

    this.labelDropdown=this.element.recipe['label'].ResourceLabelRule.key.slice(
      1,
      this.element.recipe['label'].ResourceLabelRule.key.length);

    this.selectedBranch = localStorage.getItem('selectedBranch');
    this.typeScope = this.element.recipe['typeScope'];
    this.selectedContractId=this.localStorage.getDataFromLocalStorage('contractID');

  }


  getDataList():any{
    if(this.options.length>0)
    this.isValidated=false;
    else
    {
      if(this.typeScope=="group-digital-card")
      this.grouGetInfo();
      else if(this.typeScope=="individual-digital-card")
      this.individualGetInfo();
    }

    return this.options;
  }



  individualGetInfo() {
    this.data = _.get(this.context.dataStore, this.element.recipe['dataStoreProperty'])


    if (!!this.data) {

      this.filteredData = this.data.filter((item: any) => {
        return item.ContractID === this.selectedContractId
    })

      for (const contract of this.filteredData)
      {
        if (contract.Branch === 'ΥΓΕΙΑΣ' && contract.ContractType==1 && contract.Participants!=undefined)
        {

          contract.Participants.forEach((item: any) => {

            if (item.Relationship === 'ΤΕΚΝΟ'
            || item.Relationship === 'ΣΥΖΥΓΟΣ'
            || item.Relationship === 'Τέκνο'
            || item.Relationship === 'Σύζυγος'
            || item.Relationship.includes('ΑΣΦΑΛΙΣΜΕΝΟΣ')
            )
            {
            let Participant :string =item.FirstName+" "+item.LastName;
            this.options.push(Participant);
            }
          });
        }
      }

    }
  }


  private async grouGetInfo() {
    this.data = _.get(this.context.dataStore, this.element.recipe['dataStoreProperty'])
    if (!!this.data) {

      this.filteredData = this.data.filter((item: any) => {
        return item.ContractID === this.selectedContractId
    })

      for (const contract of this.filteredData)
      {
        if (contract.Branch === 'ΖΩΗΣ' && contract.ContractGroupHealthDetails)
        {
       //   contract.Coverages=this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;
          contract.GroupHealthInsured=[];
          contract.FilterGroupHealthInsured=[];
          this.addGroupHealthInsured(contract);
        }
      }

    }
  }

  addGroupHealthInsured(contract: any)  {

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
                      LastName:  coverage.InsuredLastName,
                      FirstName: coverage.InsuredFirstName,
                      Id:coverage.InsuredId
                    };


                    if(coverage.DependantRelation==undefined)
                     insured.MainInsured=true;
                    else
                     insured.MainInsured=false;


              }

              contract.GroupHealthInsured.push(insured);


              break;
            default:
              break;
          }
  });


  ///Filter By MainInsured=true
  contract.FilterGroupHealthInsured=[
    ...contract.GroupHealthInsured.filter(
      (insured: Insured) => insured.MainInsured === true
    ),
    ...contract.GroupHealthInsured.filter(
      (insured: Insured) => insured.MainInsured === false
    )
    ];

   contract.FilterGroupHealthInsured.forEach((item: { FirstName: string; LastName: string; }) => {
    this.options.push(item.FirstName+" "+item.LastName)
   });


     //Remove duplicates
    contract.FilterGroupHealthInsured = contract.FilterGroupHealthInsured.reduce((unique:any, o:any) => {
      if(!unique.some((obj:any) => obj.Id === o.Id)) {
        unique.push(o);
      }
      return unique;
  },[]);



  }



  async onSelectedItem(item:any)
  {
    this.labelDropdown=item;
    this.showSpinnerBtn=true;

    this.context.iceModel.elements["digital.card.selected.participant"].setSimpleValue(item);
    this.dropdownOpen=!this.dropdownOpen;

    this.context.iceModel.elements['digital.card.pdf.base64'].reset(null);
    //Group
    if(this.typeScope=="group-digital-card")
    {
    const actName="actionGetGroupDigitalCardPDF";
    const action = this.context.iceModel.actions[actName];
    if (!!action)
    await this.context.iceModel.executeAction(actName);
    }
    //end Group

    //Individual
    else if(this.typeScope=="individual-digital-card")
    {
    const actName="actionGetDigitalCardPDF";
    const action = this.context.iceModel.actions[actName];
    if (!!action)
    await this.context.iceModel.executeAction(actName);
    }


    this.showSpinnerBtn=false;
    this.labelDropdown=this.element.recipe['label'].ResourceLabelRule.key.slice(
      1,
      this.element.recipe['label'].ResourceLabelRule.key.length
    );
  }

  get additionalClasses() {
    let additionalClasses = this.element.recipe['additionalClasses'];

   // Digital Card
   if (additionalClasses === 'digital-card-css')
   {
    let digitalCls = 'eurolife_btn-default btn-minw';
    if (this.selectedBranch === '1' || this.selectedBranch === '99')
    digitalCls += ' eurolife_btn-stroke-red horizontal';

    return digitalCls;
  }


    // getRecipeParam('additionalClasses');
    if (additionalClasses == null) return '';
    return additionalClasses;
  }

  get imageSource() {
    let imageSource = this.element.recipe['buttonIcon'];
    if (imageSource == null) return '';
    return imageSource;
  }

  get alignmentClass(): string {
    let dt_name = this.element.recipe['alignmentClass'];
    let dt = this.page.iceModel.dts[dt_name];

    if (dt) {
      let result = dt.evaluateSync();
      this.buttonClass = result["visibilityPDFButton"];
      return this.buttonClass
    }
    return null;

  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '27.4');

    return svg;
  }

  get svgFillColor() {
    let svgFillColor = this.element.recipe['svgFillColor'];

    if (this.typeScope === 'booklets-guide') {
      return 'disable_color';
    }

    if (svgFillColor === 'booklets-css') {
      if (this.selectedBranch === '3') {
        return 'motor_color'
      }
    }

    if (svgFillColor === 'booklets-css') {
      if (this.selectedBranch === '4' || this.selectedBranch === '13') {
        return 'home_color'
      }
    }

    if (svgFillColor == null) return '';
    return svgFillColor;
  }



  getArrow(arg: any) {
    if (this.dropdownOpen) {
      return "fa-angle-up";
    } else {
      return "fa-angle-down";
    }
  }



  onClick()
    {
      this.dropdownOpen = !this.dropdownOpen;
    }


}

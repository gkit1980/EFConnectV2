import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import {SectionComponentImplementation,IceSectionComponent} from "@impeo/ng-ice";
import { LocalStorageService }  from "@insis-portal/services/local-storage.service";
import { environment } from "@insis-portal/environments/environment.prod";
import * as _ from "lodash";

@Component({
  selector: 'app-eclaims-coverages',
  templateUrl: './eclaims-coverages.component.html',
  styleUrls: ['./eclaims-coverages.component.scss']
})
export class EclaimsCoveragesComponent extends SectionComponentImplementation implements OnInit{

  @ViewChildren('messageInput') messageInputs: QueryList<ElementRef>;


  headerCoveragesGroupHealth:any = ["Περιγραφή", "Κεφάλαιο Κάλυψης","Διαθέσιμο Ποσό προς Ανάλωση"];  //ΟΜΑΔΙΚΑ ΣΥΜΒΟΛΑΙΑ ΖΩΗΣ
  headers: any = [];
  showCoverKey: boolean = true;
  activeComponent: string;
  data: any = [];
  header: string;
  showDataCoveragesSpecific: boolean = true;
  showDataCoveragesForGroupHealth: boolean = false;
  branch: any;
  amendmentsInProgress: any;
  amendmentsInProgressCount: any = 0;
  items: any[];
  currentContract: any;
  life: boolean = false;
  index: any;
  intermediate: any[];
  amendmentsExist: boolean = true;
  hasAmount: boolean = false;


  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService,
  ) {
    super(parent);
  }

  ngOnInit() {
    super.ngOnInit();
    this.iceModel.elements["selectedcontractbranch"].setSimpleValue(99);
    this.activeComponent = this.recipe.componentFlag;
    if (this.activeComponent === "Coverages")
    {

      this.headers = this.headerCoveragesGroupHealth;
      this.header = "Καλύψεις";
      let specifiedContract=this.context.dataStore.data.clientContracts.filter((item:any)=>
      item.ContractID==this.context.iceModel.elements["eclaims.contractID"].getValue().forIndex(null))
      this.data =  specifiedContract[0].Coverages;


      if(this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null)==99)   //ομαδικα
      this.showDataCoveragesForGroupHealth=true;



      this.data.forEach((item: any) => {

          //ομαδικα Συμβολαια
            if(this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null)==99)
            {

                ///description
                this.showCoverKey=false;
                item.coverDescription=this.getMappingDescriptionFromCode(item.CoverKey);

                if(item.LimitPriority)
                  {
                    if(item.LimitPriority>1)
                     item.coverDescription='Εξωνοσοκομειακή Περίθαλψη';

                    // if(item.GroupHealthLimitPriority==1)
                    //  item.coverDescription=this.getMappingDescriptionFromCode(item.coverkey);

                  }


               switch (item.CalculationMethodDescription) {
                case "Πληθος μισθών":

                  if(item.MaxAmount!=null)
                  item.InsuredValue= item.UnitCount +" Μισθοί"+" Μέγιστο: "+ this.getCurrencyFormat(item.MaxAmount);
                  else
                  item.InsuredValue= item.UnitCount +" Μισθοί";
                  break;
                case "Σταθερό Ποσό":
                  item.InsuredValue=this.getCurrencyFormat(item.Amount);
                  break;
                case "Ποσοστό επί μισθού":
                  if(item.MaxAmount!=null)
                  item.InsuredValue=  item.Percentage +"% επί του Μισθού"+" Μέγιστο: "+ item.MaxAmount;
                  else
                  item.InsuredValue=  item.Percentage +"% επί του Μισθού";
                  break;
                case "Ανάλωση":


                  item.coverDescription= item.coverDescription +"*"+ (item.InsuredLastName==undefined ?" ": item.InsuredLastName)+ " "+
                  (item.InsuredFirstName==undefined ? "":item.InsuredFirstName);

                  item.InsuredValue=this.getCurrencyFormat(item.InsuredAmount);
                //  item.RemainingValue=this.getCurrencyFormat(item.RemainingValue);
                  break;
                default:
                  item.InsuredValue = this.getCurrencyFormat(item.Amount);
                  break;
              }

              this.hasAmount=true;

          }
          else   //ατομικα
          {

              if (item.InsuredValue !== "" && item.InsuredValue !== undefined) {
                this.hasAmount = true;
              } else {
                this.hasAmount = false;
              }
          }

      });


      if (!this.hasAmount)
        this.headers.pop();

    }

    super.ngOnInit();
    this.addItems();
    this.indexFunction();
    this.removeAdditionalCovers();
  }

  private indexFunction(): any {
  //  let indexValue = this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().values[0].value;



    this.currentContract = this.context.dataStore.data.clientContracts.filter((item:any)=>
                           item.ContractID==this.context.iceModel.elements["eclaims.contractID"].getValue().forIndex(null))[0];


    ///Specific for Coverages
    if (this.activeComponent === "Coverages")
    {
      if (this.currentContract.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ")
      {
        this.headers = this.headerCoveragesGroupHealth; //override
        this.showDataCoveragesSpecific = false;
      }
      else if(this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null)==99)   //ΟΜΑΔΙΚΑ ΣΥΜΒΟΛΑΙΑ ΖΩΗΣ
      {
        this.headers = this.headerCoveragesGroupHealth; //override
        this.showDataCoveragesSpecific = false;
        this.showDataCoveragesForGroupHealth=true;
      }
      else
      {
        this.showDataCoveragesSpecific = true;
      }

      if (
        this.currentContract.Branch == "ΖΩΗΣ" ||
        this.currentContract.Branch == "ΥΓΕΙΑΣ" ||
        this.currentContract.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"
      ) {
        this.life = true;
      }
       else
       {
        this.showCoverKey = false;
        this.headers.shift();
      }
    }

    return this.life;
  }

  private removeAdditionalCovers() {
    this.intermediate = [];
    if (
      this.currentContract.Branch == "ΖΩΗΣ" ||
      this.currentContract.Branch == "ΥΓΕΙΑΣ" ||
      this.currentContract.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"
    ) {
      for (
        var i = 0;
        i < this.iceModel.dataModel.data["policy"].coverages.length;
        i++
      ) {
        if (
          this.iceModel.dataModel.data["policy"].coverages[i].coverKey !=
          undefined
        ) {
          this.index = i;
        }
      }

      if (this.index > 0) {
        for (var i = 0; i < this.index + 1; i++) {
          this.intermediate.push(
            this.iceModel.dataModel.data["policy"].coverages[i]
          );
        }
        this.iceModel.dataModel.data["policy"].coverages = this.intermediate;
      }
    }
  }

  private addItems(): any {
    if (this.recipe.dataStoreProperty == null) {
      return;
    }
    //dataStoreProperty comes from the page
    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute("width", "22");
    svg.setAttribute("height", "22");
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  getSectionClass(): any {
    let result: any;

    let dt_name = this.context.iceModel.elements["policies.details.border.titles.color"].recipe.dtName;
    let dt = this.page.iceModel.dts[dt_name];
    if (dt) {
      result = dt.evaluateSync();
      if (result.defaultValue) {
        return result.defaultValue;
      } else {
        return "section-breaks-gen";
      }
    }

    return null;
  }

  formatDate(date: any) {
    if (date == null) return null;
    else return new Date(date);
  }

  getCurrencyFormat(value: string) {
    let currencySign: string = "€ ";
    if(value)
    {
    let amount = Intl.NumberFormat("EUR").format(parseInt(value));

    let amountFixed = amount.replace(/[,.]/g, m => (m === "," ? "." : ","));

    return currencySign + amountFixed;
    }
    else
    return '-';
  }

  //Ομαδικα Συμβολαια
  getMappingDescriptionFromCode(coverKey:number):string
  {
    if(coverKey>=40100 && coverKey<=40314)
    return "Ασφάλιση Απώλειας Ζωής";

    if(coverKey>=50000 && coverKey<=50014)
    return "Ασφάλιση Απώλειας Ζωής Από Ατύχημα";

    if(coverKey>=50100 && coverKey<=50114)
    return "Ασφάλιση Μονιμης Ανικανότητας (Oλική - Μερική) Από Ατύχημα";

    if(coverKey>=60000 && coverKey<=60000)
    return "Ασφάλιση Μόνιμης Ανικανότητας (Oλική - Μερική) Από Ασθένεια";

    if(coverKey>=60002 && coverKey<=60014)
    return "Ασφάλιση Μονιμης Oλικής Ανικανότητας Από Ασθένεια";

    if(coverKey>=60105 && coverKey<=60114)
    return "Ιατροφαρμακευτικές Δαπάνες Από Ατύχημα";

    if(coverKey>=60201 && coverKey<=60201)
    return "Ευρεία Υγειονομική Περίθαλψη";

    if(coverKey>=60203 && coverKey<=60207)
    return "Νοσοκομειακή Περίθαλψη";

    if(coverKey>=60209 && coverKey<=60209)
    return "Ευρεία Υγειονομική Περίθαλψη";

    if(coverKey>=60210 && coverKey<=60217)
    return "Νοσοκομειακή Περίθαλψη";

    if(coverKey>=60219 && coverKey<=60219)
    return "Ευρεία Υγειονομική Περίθαλψη";

    if(coverKey>=60400 && coverKey<=60400)
    return " Εκτός Νοσοκομείου 'Εξοδα - Διαγνωστικές Εξετάσεις";

    if(coverKey>=60402 && coverKey<=60402)
    return "Εξόδα Εκτός Νοσοκομείου - Συμβεβλημένο Κέντρο ΒΙΟΙΑΤΡΙΚΗ";

    if(coverKey>=60414 && coverKey<=60418)
    return "Eκτός Νοσοκομείου 'Εξοδα";

    if(coverKey>=60419 && coverKey<=60419)
    return "Εξόδα Εκτός Νοσοκομείου - Συμβεβλημένο Κέντρο HEALTHNET";

    if(coverKey>=60420 && coverKey<=60423)
    return "Eκτός Νοσοκομείου 'Εξοδα";

    if(coverKey>=60505 && coverKey<=60507)
    return "Απώλεια  εισοδήματος από ασθένεια ή ατύχημα";

  }





  getYear(elementDate: any) {
    var date = new Date(elementDate);
    return date.getFullYear();
  }

  calculateDiffOfDays(renewalDate: any) {
    var showInput: boolean = false;
    let diff = Math.abs(new Date(renewalDate).getTime() - new Date().getTime());
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));
    if (diffDays > 10 && diffDays < 60) {
      showInput = true;
    }
    return showInput;
  }

  ngAfterViewInit()
  {
    this.messageInputs.forEach((element:any) =>{

      var wrapperEl=element.nativeElement.innerHTML;

      if(wrapperEl.includes('Μέγιστο'))
      element.nativeElement.innerHTML= wrapperEl.replace('Μέγιστο','<br/>Μέγιστο');

     if(wrapperEl.includes('*'))
      element.nativeElement.innerHTML= wrapperEl.replace('*','<br/>');
    })
  //  this.messageInput.nativeElement.innerHTML=item.GroupHealthInsuredValue;

  }

}

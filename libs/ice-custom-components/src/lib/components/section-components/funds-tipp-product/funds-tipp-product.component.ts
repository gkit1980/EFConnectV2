import { SectionComponentImplementation,IceSectionComponent } from '@impeo/ng-ice';
import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions,ChartType } from 'chart.js';
import { environment } from "@insis-portal/environments/environment";
import { MatTableDataSource } from '@angular/material/table';
import { IndexedValue} from "@impeo/ice-core";

import { Subscription } from 'rxjs';


export interface PeriodicElement {
  f_name: string;
  f_sharenetvalue: string;
  f_shares: any;
  f_value: any;
  f_ratedate: string;
  f_colour: string;
  f_active: boolean;
}


@Component({
  selector: 'app-funds-tipp-product',
  templateUrl: './funds-tipp-product.component.html',
  styleUrls: ['./funds-tipp-product.component.scss']
})

export class FundsTippProductComponent extends SectionComponentImplementation {

  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  headers: string[] = ['Διάρθρωση', '%', 'Τίτλος (LF-FoF)', 'Καθ. Τιμή. Μερ. €', 'Μερίδια', 'Αξία Λογαριασμού €'];
  label :string ="";
  displayedColumns: string[] = ['f_name','f_sharenetvalue', 'f_shares', 'f_value'];
  contentLoaded:boolean=false;
  showContent:boolean=false;
  totalValueNumber: number;
  dataSource: MatTableDataSource<any>;
  percentageData: number[]=[];
  complementarypercentageData: number[]=[];
  backgroundColor:string[]=[];
  complementarybackgroundColor:string[]=[];
  chartLabels:string[]=[];
  totalValue:string;
  basket:string;
  totalSurrenderValue:string;
  ELEMENT_DATA: PeriodicElement[] = [];
  finalRateDate:string;

  private subscription1$: Subscription;
  private subscriptions: Subscription[] = [];


  active:boolean =false;
  dataFromElements: any[];



  public barChartOptions:any = {
       scaleShowVerticalLines: false,
       animation: false,
       scaledisplay:false,
       responsive: true,
       legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem:any) {
          if(tooltipItem.datasetIndex==0)
            return ("Διάρθρωση:"+tooltipItem.value+"/100");
          }
        }
      },
       scales: {
             xAxes: [
                      {
                       display: false,
                       stacked: true,
                       ticks: {
                        min: 0
                      }
                      }
                     ],
             yAxes: [
                      {
                    display: false,
                    stacked:true,
                    barPercentage: 1,
                    categoryPercentage:1
                      }
                   ]
              }
          };

  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartData: ChartDataSets[]=[{ data: [], label: '' },];

  //Dynamic part
  public barChartLabels: string[] = [];

  counter:boolean=false;
  arrayOfColours:string[]=['#E16136','#E2190B','#0CA2B1','#4E7DAC','#58A96A'];

  ngOnInit() {

    if(this.parent.section.recipe.type=="RegularBasket")
    {

      this.totalValueNumber=this.iceModel.elements["policies.details.tipp.RegularAmount"].getValue().values[0].value;
      if(this.totalValueNumber>0)
      this.showContent=true;

    }

    if(this.parent.section.recipe.type=="ExtraBasket")
    {
      this.totalValueNumber=this.iceModel.elements["policies.details.tipp.ExtraAmount"].getValue().values[0].value;
      if(this.totalValueNumber>0)
      this.showContent=true;
    }



    //Subscribe
   this.subscription1$=this.context.iceModel.elements["fundvaluation.execution"].$dataModelValueChange.subscribe((value: IndexedValue) => {
    if (value.element.getValue().values[0].value==true && this.counter==false)
      {

        if(this.parent.section.recipe.type=="RegularBasket")
        {

          this.totalValueNumber=this.iceModel.elements["policies.details.tipp.RegularAmount"].getValue().values[0].value;
          if(this.totalValueNumber>0)
          this.showContent=true;

        }

        if(this.parent.section.recipe.type=="ExtraBasket")
        {
          this.totalValueNumber=this.iceModel.elements["policies.details.tipp.ExtraAmount"].getValue().values[0].value;
          if(this.totalValueNumber>0)
          this.showContent=true;
        }

        this.counter=true;
        this.ELEMENT_DATA=[];
        this.label= this.resource.resolve("elements."+this.parent.section.recipe.label.ResourceSectionLabelRule.labelKey+".label");
        this.dataFromElements=this.iceModel.elements["policy.fundsvaluation"].getValue().values[0].value;
        this.basket="Επενδυτική Στρατηγική-"+this.iceModel.elements["policies.details.ulVanilla.BasketDescription"].getValue().values[0].value;
        this.addItems();
        this.contentLoaded=true;

      }
    });

this.subscriptions.push(this.subscription1$);

//Init
this.basket="Επενδυτική Στρατηγική-"+this.iceModel.elements["policies.details.ulVanilla.BasketDescription"].getValue().values[0].value;
this.ELEMENT_DATA=[];
this.label= this.resource.resolve("elements."+this.parent.section.recipe.label.ResourceSectionLabelRule.labelKey+".label");
this.dataFromElements=this.iceModel.elements["policy.fundsvaluation"].getValue().values[0].value;

if(this.dataFromElements!=undefined && this.dataFromElements.length>0)
{
this.addItems();
this.contentLoaded=true;
}
else
{
this.contentLoaded=true;
//  this.showContent=false;
}


  }


  private addItems(): any {

    ///Regular Basket vs Extra Basket
    if(this.parent.section.recipe.type=="RegularBasket")
    {

      this.totalValue=new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(this.iceModel.elements["policies.details.ulVanilla.RegularAmount"].getValue().values[0].value);
      this.totalSurrenderValue=new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(this.iceModel.elements["policies.details.ulVanilla.RegularSurrenderValue"].getValue().values[0].value);
    }

    if(this.parent.section.recipe.type=="ExtraBasket")
    {
      this.totalValue=new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(this.iceModel.elements["policies.details.ulVanilla.ExtraAmount"].getValue().values[0].value);
      this.totalSurrenderValue=new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(this.iceModel.elements["policies.details.ulVanilla.ExtraSurrenderValue"].getValue().values[0].value);

    }



    for (let i = 0; i < this.dataFromElements.length; i++)  //for(let item of this.dataFromElements)
    {

      if(this.parent.section.recipe.type=="RegularBasket")
      {
      var element=
      {
        // f_percentage: this.dataFromElements[i].basketparticipatepercent,
        f_name: this.dataFromElements[i].description,
        f_sharenetvalue: new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:4,minimumFractionDigits:4 }).format(this.dataFromElements[i].rate),
        f_shares: new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:3,minimumFractionDigits:3 }).format(this.dataFromElements[i].regularshares),
        f_value:new Intl.NumberFormat('el-GR', { style: 'decimal',maximumFractionDigits:2,minimumFractionDigits:2 }).format(this.dataFromElements[i].regularamount),
        f_colour: this.arrayOfColours[i], //this.getRandomRgb(),
        f_ratedate: this.dataFromElements[i].ratedate,
        f_active:false
      }
     }

      this.finalRateDate=element.f_ratedate;
      this.ELEMENT_DATA.push(element);


    //Colors
      let bcolourY=element.f_colour;
      let cbcolourY="#EEEEEE";
      this.backgroundColor.push(bcolourY);
      this.complementarybackgroundColor.push(cbcolourY);


     //  this.percentageData.push(parseInt(element.f_percentage));
     //  this.backgroundColor.push(element.f_colour);



      this.barChartLabels.push(element.f_name);

    }


   //Set the Bar Chart Data

    this.barChartData= [
      {
      barPercentage: 1,
      barThickness: 18,
      maxBarThickness: 18,
      minBarLength: 5,
      data: this.percentageData,
      backgroundColor:this.backgroundColor
      },
      {
       barPercentage: 1,
       barThickness: 18,
       maxBarThickness: 18,
       minBarLength: 5,
       data: this.complementarypercentageData,
       backgroundColor:this.complementarybackgroundColor
       }
      ]




    //Set the data for the table

    this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);


   }

   showData():boolean
   {
    return this.showContent;
   }

   getGridColumnClass(col: any): string {
     return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
   }

   getSectionClass(): any {
     let result: any;

     let dt_name = this.context.iceModel.elements['policies.details.border.titles.color'].recipe.dtName;
     let dt = this.page.iceModel.dts[dt_name];
     if (dt) {
       result = dt.evaluateSync();
       if (result.defaultValue) {
         return result.defaultValue;
       } else {
         return 'section-breaks-gen';
       }
     }

     return null;
   }

   getValueFromElement(elementName: string): any {
     let element = this.context.iceModel.elements[elementName];
     if (element == null) return "";

     return element.getValue().forIndex(null);
   }

    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
     // console.log(event, active);
     return;
   }

   public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
     // console.log(event, active);
     return;
   }

   handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
     svg.setAttribute('width', '25');
     svg.setAttribute('height', '25');
     svg.setAttribute('pointer', 'cursor');
     return svg;
 }

 getIcon(iconID: string): string {
   let icon = environment.sitecore_media + iconID + '.ashx';
   return icon;
 }

 fundCollapse(item: PeriodicElement) {
   item.f_active=!item.f_active;
   // this.filteredData[index].active = !this.filteredData[index].active;
 }

 public getColour(name:string)
 {
   switch (name) {
     case 'Global Low':
       return 'orange_bg';
     case 'Global Medium':
       return 'red_bg';
     case 'Equity Blend':
       return 'hardgreen_bg';
     case 'ESG Focus':
       return 'blue_bg';
     case 'Global High':
       return 'green_bg';

   }
 }

 public getRandomRgb() {
   var num = Math.round(0xffffff * Math.random());
   var r = num >> 16;
   var g = num >> 8 & 255;
   var b = num & 255;
   return 'rgb(' + r + ', ' + g + ', ' + b + ')';
 }


 formatDate(date: any) {
   if (date == null) return null;
   else return new Date(date);
 }


 ngOnDestroy() {
   this.subscriptions.forEach((subscription) => subscription.unsubscribe());
 }

}

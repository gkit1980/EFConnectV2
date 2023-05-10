import { SectionComponentImplementation,IceSectionComponent } from '@impeo/ng-ice';
import { Component } from '@angular/core';
import { LifecycleType} from "@impeo/ice-core";
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { ChartDataSets} from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { MatTableDataSource } from '@angular/material/table';



declare global {
  interface Date{
    getMonthName():string;
    getShortMonthName():string
  }
}

Date.prototype.getMonthName = function() {
  var monthNames = ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλης", "Μάιος", "Ιούνιος",
    "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
  ];
  return monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
  return this.getMonthName().substr(0, 3);
};




export interface PeriodicElement {
  f_name: string;
  f_colour:string,
  f_variance: string;
  factsheet: string;
  f_active:boolean;
}


export class TableFlexBasicExample {
  displayedColumns: string[] = ['f_name', 'f_variance', 'factsheet'];
  // dataSource = ELEMENT_DATA;
}


@Component({
  selector: 'app-tipp-line-chart',
  templateUrl: './tipp-line-chart.component.html',
  styleUrls: ['./tipp-line-chart.component.scss']
})
export class TippLineChartComponent extends SectionComponentImplementation {



  public Title: string ="Αποδόσεις προηγούμενων ετών";

  displayedColumns: string[] = ['f_name', 'f_variance', 'factsheet'];
  displayedColumnsForDates: string[] = ['f_name', 'f_variance','f_type'];
  dataSource: MatTableDataSource<any>;
  dataSourceBuyDates: MatTableDataSource<string>;
  showContent:boolean=false;
  totalValueNumber:number;
  active:boolean =false;
  dataFromElements: any;
  items: any[] = [];
  FundsRates:any[]=[];
  ELEMENT_DATA: PeriodicElement[] = [];
  lineChart:any;
  arrayOfColours:string[]=['#E16136','#E2190B','#0CA2B1','#4E7DAC','#58A96A'];


  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];

  public lineChartLabels: Label[] =[];


  public lineChartColors: Color[] = [];

  //constant values

  public lineChartOptions:any = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display:true,
        ticks:
        {
          fontSize:10
        },
        gridLines:
        {
          // drawBorder: true,
          display: true,
          drawOnChartArea:false
        }
      }],
      yAxes:[{
        display: true,
        scaleLabel:
        {
          display: true,
          labelString: 'Euro'
        },
        gridLines:
        {
          display: true,
          drawOnChartArea:false
        }
      }]
    }
  };
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];



  constructor(parent: IceSectionComponent) {
    super(parent);
  }



  ngOnInit() {



    //Check is mobile or desktop

    let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if(isMobile)
    {
      this.lineChartOptions.scales.xAxes[0].ticks.fontSize=7;
    }

    this.addItems();


   this.context.$lifecycle.subscribe(event => {
      if (event.type == LifecycleType.ICE_MODEL_READY) {

        this.addItems();
      }
    });


  }

  showData():boolean
  {
   return this.showContent;
  }

  private addItems(): any {
    if (this.recipe.dataStoreProperty == null) {
      return;
    }

    this.items = _.get(this.context.dataStore, this.recipe.dataStoreProperty);
    if(this.items==undefined || this.items==null)
    return;

    this.ELEMENT_DATA=[];

    if(this.items && this.items[this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().forIndex(null)].FundsRates)
    {

      if(this.items[this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().forIndex(null)].FundsRates.length>0)
      {
        this.showContent=true;
        this.FundsRates=this.items[this.iceModel.elements["policy.contract.general.info.indexHolder"].getValue().forIndex(null)].FundsRates; // array of Funds
        if(this.FundsRates)
          this.lineChartData=[];
        else
          return;

      //!! FIND  the oldest fund based on the buy date- construct linechart labels
          let oldestBuyFund= this.oldestFund(this.FundsRates)
          this.lineChartLabels=[];

        for(let fundrate of oldestBuyFund.FundRates)
          {
          let dateL=new Date(fundrate.DateReference);
          let dateD=dateL.getUTCDate().toString();
          let dateM=dateL.getShortMonthName().toString();
          let dateY=dateL.getFullYear().toString();

          (oldestBuyFund.TimeRange==="daily")? this.lineChartLabels.push(dateD+" "+dateM+" "+dateY): this.lineChartLabels.push(dateM+" "+dateY);
         }

      //// End




        for(let item of this.FundsRates)
        {

            /// process the table of data

            //Net rate for fund
            let varianceDifference:string=item.FundRates.length==0 ? "0": (item.FundRates[item.FundRates.length-1].NetRate-item.FundRates[0].NetRate).toFixed(2);
            let totalVariance=item.FundRates.length==0? 0: (parseFloat(varianceDifference) / item.FundRates[0].NetRate.toFixed(2))*100;


            var element:PeriodicElement= {
              f_name: item.Description,
              f_colour: item.FundColour,//this.getRandomRgb(),
              f_variance: (totalVariance.toFixed(2)+"%").replace(".", ","),
              factsheet:item.Url,
              f_active:false
            };

            this.lineChartColors.push(
            {
            borderColor: element.f_colour,
            backgroundColor: 'transparent'
            }
            )


             //Quarantine rate for fund
             let varianceDifferenceQuarantine:string=item.FundRates.length==0 ? "0": (item.FundRates[item.FundRates.length-1].QuarantineRate-item.FundRates[0].QuarantineRate).toFixed(2);
             let totalVarianceQuarantine=item.FundRates.length==0? 0: (parseFloat(varianceDifferenceQuarantine) / item.FundRates[0].QuarantineRate.toFixed(2))*100;


             var elementQuarantine:PeriodicElement= {
               f_name: "Επίπεδο Προστασίας-"+item.Description,
               f_colour: this.getRandomRgb(),
               f_variance: '',   //(totalVarianceQuarantine.toFixed(2)+"%").replace(".", ","),
               factsheet:item.Url,
               f_active:false
             };

             this.lineChartColors.push(
             {
             borderColor: elementQuarantine.f_colour,
             backgroundColor: 'transparent'
             }
             )




            //for each fund we have the list of rates
             var data:any[]=[];
             var dataQuarantine:any[]=[];

             let difference=this.lineChartLabels.length-item.FundRates.length;
             for(let ii=0;ii<difference;ii++)
             {
             data.push(undefined);
             dataQuarantine.push(undefined);
             }


            for(let fundrate of item.FundRates)
            {
            data.push(parseFloat(fundrate.NetRate).toFixed(2));
            dataQuarantine.push(parseFloat(fundrate.QuarantineRate).toFixed(2));
            }

            ///end of list rates


            var dataobject={ data: data};
            var dataQuarantineObject={ data: dataQuarantine};
            this.lineChartData.push(dataobject);
            this.lineChartData.push(dataQuarantineObject);
            this.ELEMENT_DATA.push(element);
            this.ELEMENT_DATA.push(elementQuarantine);

        }
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);


      //Ημερομηνιες αγορών
      let fundsValuation=this.iceModel.elements["policy.fundsvaluation"].getValue().values[0].value.map((item: { regularshares: number; description: any; firstregularbuydate: any; extrashares: number; firstextrabuydate: any; },index:number)=>
         {

          var newRegularItem:any;
          var newExtraItem:any;
           if(item.regularshares>=0)
           {
            newRegularItem={
                "FundDescription": item.description,
                "DateRef": item.firstregularbuydate,
                "Type": "Τακτική",
                "Colour": this.arrayOfColours[index],
                "Active": false,
                "Shares": item.regularshares
             }
           }
           if(item.extrashares>=0)
           {
            newExtraItem= {
                "FundDescription": item.description,
                "DateRef": item.firstextrabuydate,
                "Type": "'Εκτακτη",
                "Colour": this.arrayOfColours[index],
                "Active": false,
                "Shares": item.extrashares
             }
           }
           return [newRegularItem,newExtraItem];
         }

      );


      this.dataSourceBuyDates= fundsValuation.flat(1).filter((item:any) => item.Shares>0);

        }


    }




  }


  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

   public getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }


  public openFactSheet(name:string)
  {
    window.open(name, '_blank');
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

formatDate(date: any) {
  if (date == null) return null;
  else return new Date(date);
}


fundCollapse(element: PeriodicElement) {
  element.f_active=!element.f_active;
}

fundDateCollapse(element: any) {
  element.Active=!element.Active;
}


oldestFund(funds: any) :any  {
  let oldest =  funds.reduce((c:any, n:any) => Date.parse(n.FirstRegularBuyDate) < Date.parse(c.FirstRegularBuyDate) ? n : c);
  return oldest;
}



}

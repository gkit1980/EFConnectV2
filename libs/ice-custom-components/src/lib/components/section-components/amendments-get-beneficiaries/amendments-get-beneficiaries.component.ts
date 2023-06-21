
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IceSectionComponent,
  SectionComponentImplementation,
  ElementComponentImplementation
} from '@impeo/ng-ice';
import { environment } from "@insis-portal/environments/environment";
@Component({
  selector: 'app-amendments-get-beneficiaries',
  templateUrl: './amendments-get-beneficiaries.component.html',
  styleUrls: ['./amendments-get-beneficiaries.component.scss']
})
export class AmendmentsGetBeneficiariesComponent   extends SectionComponentImplementation
implements OnInit, OnDestroy {

  showBenef=false;
  showChangeBeneficiariesText=false;
  showAddBeneficiariesText=false;
  data:any;
  headersParticipants: any = ["Ονοματεπώνυμο", "Συγγένεια", "Ποσοστό"];
  headers: any = [];

  constructor(
    parent: IceSectionComponent
  ) {
    super(parent);
  }

  ngOnInit() {

    this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.subscribe((value: any) => {
      if (value.element.getValue().forIndex(null)==1 && this.showBeneficiaries()
           && (value.element.iceModel.elements["amendments.health.category.dropdown"].getValue().forIndex(null)=="1"
                ||value.element.iceModel.elements["amendments.finance.category.dropdown"].getValue().forIndex(null)=="1"
                || value.element.iceModel.elements["amendments.life.category.dropdown"].getValue().forIndex(null)=="1")//Αλλαγη Στοιχείων Προσώπων Συμβολαιου
          )
      {
        this.showBenef=true;
      }
        else{
          this.showBenef=false;
        }
    });

    this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.subscribe((value: any) => {
      if (value.element.getValue().forIndex(null)==1 && this.showBeneficiaries()
           && (value.element.iceModel.elements["amendments.health.subcategory.dropdown"].getValue().forIndex(null)=="1"
                ||value.element.iceModel.elements["amendments.finance.subcategory.dropdown"].getValue().forIndex(null)=="1"
                || value.element.iceModel.elements["amendments.life.subcategory.dropdown"].getValue().forIndex(null)=="1")//Αλλαγη Δικαιουχου
          )
      {
        this.showChangeBeneficiariesText=true;
      }
        else{
          this.showChangeBeneficiariesText=false;
        }
    });

    this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.subscribe((value: any) => {
      if (value.element.getValue().forIndex(null)==1 && this.showBeneficiaries()
           && (value.element.iceModel.elements["amendments.health.subcategory.dropdown"].getValue().forIndex(null)=="2"
                ||value.element.iceModel.elements["amendments.finance.subcategory.dropdown"].getValue().forIndex(null)=="2"
                || value.element.iceModel.elements["amendments.life.subcategory.dropdown"].getValue().forIndex(null)=="2")//Προσθήκη Δικαιουχου
          )
      {
        this.showAddBeneficiariesText=true;
      }
        else{
          this.showAddBeneficiariesText=false;
        }
    });
  }

  showBeneficiaries():boolean
  {
    if(this.context.iceModel.elements["policy.beneficiaries"].getValue().values[0].value.length>0)
    {
    this.headers = this.headersParticipants;
    this.data=this.context.iceModel.elements["policy.beneficiaries"].getValue().values[0].value;
    return true;
    }
    else
    return false;
  }

  ngOnDestroy(): void {

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

}

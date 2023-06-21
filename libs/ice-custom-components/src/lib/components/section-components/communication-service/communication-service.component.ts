import { IceSectionComponent, SectionComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotorCustomTableComponent } from '../motor-custom-table/motor-custom-table.section.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopUpPageComponent } from '../../page-components/pop-up-page/pop-up-page.component';
import { environment } from '@insis-portal/environments/environment';
import { SpinnerService } from '@insis-portal/services/spinner.service';


@Component({
  selector: 'app-communication-service',
  templateUrl: './communication-service.component.html',
  styleUrls: ['./communication-service.component.scss']
})


export class CommunicationServiceComponent extends SectionComponentImplementation {

  dialogRef: MatDialogRef<PopUpPageComponent>;
  section: any;

  frequentQuestions = 'elements.communication.faq.frequentQuestions.label';
  communicationInsuranceDictionary = 'elements.communication.glossary.communicationInsuranceDictionary.label';

  constructor(parent: IceSectionComponent, public dialog: MatDialog, private modalService: NgbModal, private spinnerService: SpinnerService) {
    super(parent);
  }

  // async ngOnInit()
  // {
  //  this.spinnerService.setMessage("");
  // }

  openDialog(): void {

    // this.dialogRef = this.dialog.open(PopUpPageComponent, {
    //   width: '730px',
    //   height: '602px',
    //   data: {
    //     page: 'contactForm',
    //     iceContext: this.page.context
    //   }
    // });
    let inputData = {
      page: 'contactForm',
      iceContext: this.page.context
    }
    const modalRef = this.modalService.open(PopUpPageComponent, { windowClass: "xlModal", centered: true, backdropClass: "backgroundClass" });
    modalRef.componentInstance.inputData = inputData;
    // modalRef.componentInstance.skata = skata;

  }

  getGridColumnClass(col: any) {
    return col.arrayElements ? 'col-12' : 'col-' + col.col;
  };

  getGridColumnClassResp(col: any) {
    return col.arrayElements ? 'col-sm-12' : 'col-sm-' + col.col;
  }

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
}

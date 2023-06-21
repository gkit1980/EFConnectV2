import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IceSection } from '@impeo/ice-core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { ModalService } from '@insis-portal/services/modal.service';
import { SpinnerService } from '@insis-portal/services/spinner.service';
import { Router } from '@angular/router';
import * as _ from "lodash";

import { Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';



@Component({
  selector: 'app-eclaims-page-error',
  templateUrl: './eclaims-page-error.component.html',
  styleUrls: ['./eclaims-page-error.component.scss']
})
export class EclaimsPageErrorComponent extends PageComponentImplementation implements OnInit
{
  flag: string = '';
  refreshStatus: number;
  NgdialogRef: NgbModalRef;
  redirectUrl:string= String.toString();
  showTopSection = false;
  ios: boolean=false;
  others: boolean=false;
  private renderer: Renderer2
  timer: NodeJS.Timeout;



  constructor(
    private localStorage: LocalStorageService,
    public ngbModal: NgbModal,
    public modalService: ModalService,
    private spinnerService: SpinnerService,
    private router:Router,
    private rendererFactory: RendererFactory2
  ) {
    super();
    this.renderer = rendererFactory.createRenderer(null, null)
  }
  ngOnInit() {

    super.ngOnInit();

    this.flag = this.page.recipe['componentFlag'];
    this.showTopSection = this.page.recipe['showTopSection'];





    this.localStorage.setDataToLocalStorage('selectedBranchText',this.page.recipe['selectedBranch']);
    this.refreshStatus=this.localStorage.getDataFromLocalStorage('refreshStatus');


    if (this.refreshStatus == 1) {
      this.router.navigate(['/ice/default/customerArea.motor/viewClaims']);
      this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);

    }

  }

  getTopSection(): IceSection {
    return this.page.sections.find(
      (section) => section.component === 'EclaimsStepperComponent'
    );
  }

  getGreySections(): IceSection {
    return this.page.sections.find(
      (section) => section.component === 'EclaimsStepperComponent'
    );
  }

  getClassSection(section: IceSection): string {
    switch (section.recipe.cssClass) {
      case 'with-padding':
        return 'with-padding';
      case 'no-padding':
        return 'no-padding';
      case 'regular-padding':
        return 'regular-padding';
    }
  }


  showCoverages(): boolean {
    const eclaimsStep: number = this.context.iceModel.elements['eclaims.step']
      .getValue()
      .forIndex(null);

    if (eclaimsStep === 1) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit(){

    const importantFlag = RendererStyleFlags2.Important;
    this.renderer.setStyle(document.body, 'height', 'unset', importantFlag);

  }

}

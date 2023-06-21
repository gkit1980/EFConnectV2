import { Component, OnInit, ElementRef,ChangeDetectorRef } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { IceSection, IndexedValue } from '@impeo/ice-core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "@insis-portal/services/modal.service";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-split-page-with-icon',
  templateUrl: './split-page-with-icon.component.html',
  styleUrls: ['./split-page-with-icon.component.scss']
})
export class SplitPageWithIconComponent extends PageComponentImplementation implements OnInit {

  static componentName = "SplitPageWithIcon";

  showsection: boolean = true;
  modalOpen: boolean = false;

  private showSalesChannelSectionSubs: Subscription;
  private startTourSubs: Subscription;
  private indexCommunicationSubs: Subscription;

  private subscription = new Subscription();

  constructor(
    public ngbModal: NgbModal, public modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef, private localStorage: LocalStorageService
    // private readonly joyride: JoyrideService
  ) {
    super();

  }

  ngOnInit() {
    super.ngOnInit();
    this.showSalesChannelSectionSubs = this.context.iceModel.elements["showSalesChannelSection"].$dataModelValueChange
      .subscribe((value: IndexedValue) => {
        if (value.value) {
          this.showsection = true;
        }
        else {
          this.showsection = false;
        }
      });

    this.subscription.add(this.showSalesChannelSectionSubs);

  }

  getImgSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "FlatSectionComponent"
    );
  }

  getClickToChatSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "CommunicationServiceComponent"
    );
  }

  getBrokerDetailsSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "SalesChannelDetailsComponent"
    );
  }

  getFaqSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "SimpleGridViewComponent"
    );
  }

  getMyRightsFormSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "PopUpComponent"
    );
  }




  closeDialog() {
    this.modalOpen = !this.modalOpen;
    this.modalService.isModalClosed();
    this.ngbModal.dismissAll();
  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }

}

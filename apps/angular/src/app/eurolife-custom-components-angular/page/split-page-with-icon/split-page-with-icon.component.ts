import { Component, OnInit, ElementRef,ChangeDetectorRef } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { IceSection, IndexedValue } from '@impeo/ice-core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "../../../services/modal.service";
import { LocalStorageService } from "../../../services/local-storage.service";
// import { JoyrideService } from 'ngx-joyride';
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

  ngAfterViewInit() {

//   ///*Walkthrough Purpose */
// if(!this.context.iceModel.elements["home.isMobileDevice"].getValue().forIndex(null))
// {

//         if (this.localStorage.getDataFromLocalStorage("walkthrough") === undefined)
//         {
//             this.localStorage.setDataToLocalStorage("walkthrough", true);

//             this.startTourSubs = this.joyride.startTour(
//               {
//                 steps: ['communicationService_firstStep','communicationService_secondStep'],
//                 showCounter:false
//               }).subscribe(
//                 (step) => {
//                   if(step.number==2)
//                   {
//                     window.scroll(250,250);
//                   }
//                 });

//             this.subscription.add(this.startTourSubs);

//       }
//       else
//       {
//         ///2.Joy ride for walkthrough functionality.This is referefed for communication service page

//           this.indexCommunicationSubs = this.context.iceModel.elements["walkthrough.page.index.communication"].$dataModelValueChange.subscribe((value: IndexedValue) => {
//             if (value.element.getValue().forIndex(null) === 1) {

//               this.startTourSubs = this.joyride.startTour(
//                 {
//                   steps: ['communicationService_firstStep','communicationService_secondStep'],
//                   showCounter:false
//                 }).subscribe(
//                   (step) => {
//                     if(step.number==2)
//                     {
//                       window.scroll(250,250);
//                     }
//                   });

//               this.subscription.add(this.startTourSubs);
//             }
//           });

//           this.subscription.add(this.indexCommunicationSubs);

//       }

// }
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
  //   if(!this.context.iceModel.elements["home.isMobileDevice"].getValue().forIndex(null))
  //   {
  //  this.joyride.closeTour();
  //   }

    this.subscription.unsubscribe();
  }

}

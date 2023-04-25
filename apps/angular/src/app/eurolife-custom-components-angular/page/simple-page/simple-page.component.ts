import { Component, OnInit, ElementRef } from "@angular/core";
import { PageComponentImplementation } from "@impeo/ng-ice";
import { IceSection } from "@impeo/ice-core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from "../../../services/modal.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { IndexedValue, ItemElement, ValueOrigin } from "@impeo/ice-core";
import { JoyrideService } from 'ngx-joyride';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-simple-page",
  templateUrl: "./simple-page.component.html",
  styleUrls: ["./simple-page.component.scss"]
})
export class SimplePageComponent extends PageComponentImplementation
  implements OnInit {
  static componentName = "SimplePage";
  showHeader = true;
  showTitle = true;
  flag = '';

  modalOpen: boolean = false;

  private indexCommunicationSubs: Subscription;

  private subscription = new Subscription();

  constructor(public ngbModal: NgbModal, public modalService: ModalService, private elementRef: ElementRef, private localStorage: LocalStorageService,
              private readonly joyride: JoyrideService) {
    super();
  }


  ngOnInit() {
    super.ngOnInit();
    this.flag = this.page.recipe['flag']

    //only for Amendments page
    if(this.flag=="viewAmendments"){
      this.context.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);  //initialize the step status

      //nullable values from different amendments
      this.context.iceModel.elements["amendments.health.category.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.health.subcategory.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.life.category.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.life.subcategory.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
      this.context.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
      this.context.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
      this.context.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
      this.context.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
      this.context.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
      this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock1`].setSimpleValue(false);
      this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock2`].setSimpleValue(false);
      this.context.iceModel.elements[`amendments.beneficiaries.percentage.lock3`].setSimpleValue(false);
      //
      this.context.iceModel.elements[`amendments.upload.file`].setSimpleValue(false);
      this.context.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.step2"].setSimpleValue(false);
      console.log("category list - change fop", this.context.iceModel.elements["request.amendment.change.fop"].getValue().forIndex(null));
      this.context.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
      this.context.iceModel.elements["amendments.motor.category.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.motor.subcategory.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.driver.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.mileage.new.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.category.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.subcategory.dropdown"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(null);
      this.context.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(null);

    }
    this.showHeader = this.page.recipe['showHeader'];
    this.showTitle = this.page.recipe['showTitle'];

  }

  getTopSection(): IceSection {
    return this.page.sections.find(
      section => section.component === "HeaderComponent"
    );
  }

  getMainPageSection(): IceSection[] {
    var sectionsWithoutHeader: IceSection[] = this.page.sections.filter((section) => {
      return section.component != "HeaderComponent"
    });
    return sectionsWithoutHeader;
  }

  getColorBackground(): string {
    if (this.page.recipe['backColor'] == undefined || this.page.recipe['backColor'] == null)
      return 'grey-background';

    if (this.page.recipe['backColor'] == 'white')
      return 'white-background';

    if (this.page.recipe['backColor'] == 'unset')
      return 'background-unset';

  }

  ngAfterViewInit() {
    ///walkthrough
    if(!this.context.iceModel.elements["home.isMobileDevice"].getValue().forIndex(null))
    {
        if (this.localStorage.getDataFromLocalStorage("walkthrough") === undefined)
        {
          this.localStorage.setDataToLocalStorage("walkthrough", true);
          if (this.page.name === 'viewClaims') {
            //joy ride.... Claims page
            this.joyride.startTour(
              {
                steps: ['viewClaims_firstStep'],
                showCounter:false
              })
          }
        }
        else
        {
          this.indexCommunicationSubs = this.context.iceModel.elements["walkthrough.page.index.viewClaims"].$dataModelValueChange.subscribe((value: IndexedValue) => {
            if (value.element.getValue().forIndex(null) === 1 && this.page.name=="viewClaims")
            {
            this.joyride.startTour(
                {
                  steps: ['viewClaims_firstStep'],
                  showCounter:false
                })
            }
          });

          this.subscription.add(this.indexCommunicationSubs);
        }
    }
}

    ngOnDestroy()
    {
      if(!this.context.iceModel.elements["home.isMobileDevice"].getValue().forIndex(null))
      {
     this.joyride.closeTour();
      }

      this.subscription.unsubscribe();
    }

  }






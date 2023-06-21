import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import {LifecycleEvent } from '@impeo/ice-core';
import { environment } from "@insis-portal/environments/environment.prod";
import {
  SectionComponentImplementation,
  IceSectionComponent
} from "@impeo/ng-ice";
import * as _ from "lodash";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DecodeJWTService } from '@insis-portal/services/decode-jwt.service';


@Component({
  selector: "app-details-custom-table",
  templateUrl: "./details-custom-table.component.html",
  styleUrls: ["./details-custom-table.component.scss"]
})
export class DetailsCustomTableComponent extends SectionComponentImplementation implements OnInit {

  @ViewChildren('messageInput') messageInputs: QueryList<ElementRef>;

  headersCoverages: any = ["Κωδικός Κάλυψης", "Περιγραφή", "Κεφάλαιο Κάλυψης"];
  headersCoveragesSpecific: any = ["Κωδικός Κάλυψης", "Περιγραφή"]; // 'ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ'
  headerCoveragesGroupHealth: any = ["Περιγραφή", "Κεφάλαιο Κάλυψης", "Διαθέσιμο Ποσό προς Ανάλωση"];  //ΟΜΑΔΙΚΑ ΣΥΜΒΟΛΑΙΑ ΖΩΗΣ

  headersAmendments: any = [
    "Περιγραφή",
    "Ημερομηνία Έκδοσης",
    "Ημερομηνία Ισχύος"
  ];
  headersParticipants: any = ["Ονοματεπώνυμο", "Συγγένεια", "Ποσοστό"];
  headers: any = [];
  showCoverKey: boolean = true;
  activeComponent: string;
  data: any = [];
  dataAmendements: any = [];
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
  insuredName: string;
  excludedAmendments: string[] = [
    "Περιγραφική Πρόσθετη Πράξη",
    "Μεταφορά Χαρτοφυλακίου",
    "Περιγραφική Πρόσθετη Πράξη σε άκυρο συμβόλαιο",
    "Καταγγελία Συνεργάτη για σοβαρό λόγο",
    "Καταγγελία Συνεργάτη",
    "Δέσμευση",
    "Άρση δέσμευσης",
    "Αναφορά στην Αρχή",
    "Ευθύνη Compliance",
    "Ευθύνη Operations",
    "Δέσμευση σε άκυρο συμβόλαιο",
    "Άρση δέσμευσης σε άκυρο συμβόλαιο",
    "Αναφορά στην Αρχή σε άκυρο συμβόλαιο",
    "Ευθύνη Compliance σε άκυρο συμβόλαιο",
    "Ευθύνη Operations σε άκυρο συμβόλαιο",
    "Μεταφορά Χαρτοφυλακίου (Ακυρο Συμβ.)"
  ];
  partnerName: boolean;
  paymentType: string;


  private destroy$ = new Subject<void>();

  constructor(
    parent: IceSectionComponent,
    private localStorage: LocalStorageService,
    private router: Router,
    private decodeJWT: DecodeJWTService
  ) {
    super(parent);
  }

  ngOnInit() {
    super.ngOnInit();
    this.decodeJWT.decodeToken(this.localStorage.getDataFromLocalStorage('token'));
    this.insuredName = this.decodeJWT.decodedToken.name;
    this.amendmentsInProgress = _.get(this.context.dataStore, 'amendmentsInprogress');
    if (this.amendmentsInProgress != null) {
      if (this.amendmentsInProgress.length > 0) {
        this.amendmentsInProgress.forEach((item: any) => {
          if (item.Status != "Closed") {
            this.amendmentsInProgressCount = this.amendmentsInProgressCount + 1;
          }
        })
      }
    }
    this.branch = this.localStorage.getDataFromLocalStorage("selectedBranchText");
    this.activeComponent = this.recipe.componentFlag;
    if (this.activeComponent === "Coverages") {

      this.headers = this.headersCoverages;
      this.header = "Καλύψεις";
      this.data = this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;


      if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) == 99)   //ομαδικα
        this.showDataCoveragesForGroupHealth = true;



      this.data.forEach((item: any) => {

        //ομαδικα Συμβολαια
        if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) == 99) {

          ///description
          this.showCoverKey = false;
          item.coverDescription = this.getMappingDescriptionFromCode(item.coverKey);

          if (item.GroupHealthLimitPriority) {
            if (item.GroupHealthLimitPriority > 1)
              item.coverDescription = 'Εξωνοσοκομειακή Περίθαλψη';

            // if(item.GroupHealthLimitPriority==1)
            //  item.coverDescription=this.getMappingDescriptionFromCode(item.coverkey);

          }


          switch (item.GroupHealthCalculationMethodDescription) {
            case "Πληθος μισθών":

              if (item.GroupHealthMaxAmount != null)
                item.GroupHealthInsuredValue = item.GroupHealthUnitCount + " Μισθοί" + " Μέγιστο: " + this.getCurrencyFormat(item.GroupHealthMaxAmount);
              else
                item.GroupHealthInsuredValue = item.GroupHealthUnitCount + " Μισθοί";
              break;
            case "Σταθερό Ποσό":
              item.GroupHealthInsuredValue = this.getCurrencyFormat(item.GroupHealthAmount);
              break;
            case "Ποσοστό επί μισθού":
              if (item.GroupHealthMaxAmount != null)
                item.GroupHealthInsuredValue = item.GroupHealthPercentage + "% επί του Μισθού" + " Μέγιστο: " + item.GroupHealthMaxAmount;
              else
                item.GroupHealthInsuredValue = item.GroupHealthPercentage + "% επί του Μισθού";
              break;
            case "Ανάλωση":

              item.coverDescription = item.coverDescription + "*" + (item.GroupHealthInsuredLastName == undefined ? " " : item.GroupHealthInsuredLastName) + " " +
                (item.GroupHealthInsuredFirstName == undefined ? "" : item.GroupHealthInsuredFirstName);
              item.GroupHealthInsuredValue = this.getCurrencyFormat(item.GroupHealthInsuredAmount);
              //  item.GroupHealthRemainingValue=this.getCurrencyFormat(item.GroupHealthRemainingValue);
              break;
            default:
              item.GroupHealthInsuredValue = this.getCurrencyFormat(item.GroupHealthAmount);
              break;
          }

          this.hasAmount = true;

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
    else if (this.activeComponent === "Amendments")
    {
      this.header = "Τροποποιήσεις";
      this.headers = this.headersAmendments;
      this.LoadAmendments();

      this.context.$lifecycle
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: LifecycleEvent) => {

        const actionName = _.get(e, ['payload', 'action']);

        if (actionName === 'actionGetContractEndorsement' && e.type === 'ACTION_FINISHED') {
          this.LoadAmendments();
        }
      });


    }
    else if (this.activeComponent === "Participants")
    {
      this.header = "Δικαιούχοι";
      this.headers = this.headersParticipants;
      this.data = this.context.iceModel.elements[
        "policy.beneficiaries"
      ].getValue().values[0].value;
    }

    super.ngOnInit();
    this.addItems();
    this.indexFunction();
    this.removeAdditionalCovers();
  }

  private indexFunction(): any {
    let indexValue = this.iceModel.elements[
      "policy.contract.general.info.indexHolder"
    ].getValue().values[0].value;

    this.currentContract = this.items[indexValue];

    ///Specific for Coverages
    if (this.activeComponent === "Coverages") {
      if (this.currentContract.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ") {
        this.headers = this.headersCoveragesSpecific; //override
        this.showDataCoveragesSpecific = false;
      }
      else if (this.iceModel.elements["selectedcontractbranch"].getValue().forIndex(null) == 99)   //ΟΜΑΔΙΚΑ ΣΥΜΒΟΛΑΙΑ ΖΩΗΣ
      {
        this.headers = this.headerCoveragesGroupHealth; //override
        this.showDataCoveragesSpecific = false;
        this.showDataCoveragesForGroupHealth = true;
      }
      else {
        this.showDataCoveragesSpecific = true;
      }

      if (
        this.currentContract.Branch == "ΖΩΗΣ" ||
        this.currentContract.Branch == "ΥΓΕΙΑΣ" ||
        this.currentContract.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"
      ) {
        this.life = true;
      }
      else {
        this.showCoverKey = false;
        this.headers.shift();
      }
    }

    return this.life;
  }

  private LoadAmendments()
  {
    this.data = this.context.iceModel.elements["policy.Endorsements"].getValue().values[0].value;
    this.context.iceModel.elements['policy.Endorsements'].reset(null);


    if (
      this.branch == "ΖΩΗΣ" ||
      this.branch == "ΥΓΕΙΑΣ" ||
      this.branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"||
      this.branch == "ΠΕΡΙΟΥΣΙΑΣ"
    )
    {
      this.data = this.data.filter((i: any) => {
        let flag = true;
        this.excludedAmendments.map((j: any) => {
          if (j === i.EndorsementTypeDescription.trim()) {
            flag = false;
          }
        });
        return flag;
      });
    }

    if (this.data.length == 0)
    {
      this.amendmentsExist = false;
    } else
    {
      this.amendmentsExist = true;
    }
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

    let dt_name = this.context.iceModel.elements[
      "policies.details.border.titles.color"
    ].recipe.dtName;
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
    if (value) {
      let amount = Intl.NumberFormat("EUR").format(parseInt(value));

      let amountFixed = amount.replace(/[,.]/g, m => (m === "," ? "." : ","));

      return currencySign + amountFixed;
    }
    else
      return '-';
  }

  //Ομαδικα Συμβολαια
  getMappingDescriptionFromCode(coverKey: number): string {
    if (coverKey >= 40100 && coverKey <= 40314)
      return "Ασφάλιση Απώλειας Ζωής";

    if (coverKey >= 50000 && coverKey <= 50014)
      return "Ασφάλιση Απώλειας Ζωής Από Ατύχημα";

    if (coverKey >= 50100 && coverKey <= 50114)
      return "Ασφάλιση Μονιμης Ανικανότητας (Oλική - Μερική) Από Ατύχημα";

    if (coverKey >= 60000 && coverKey <= 60000)
      return "Ασφάλιση Μόνιμης Ανικανότητας (Oλική - Μερική) Από Ασθένεια";

    if (coverKey >= 60002 && coverKey <= 60014)
      return "Ασφάλιση Μονιμης Oλικής Ανικανότητας Από Ασθένεια";

    if (coverKey >= 60105 && coverKey <= 60114)
      return "Ιατροφαρμακευτικές Δαπάνες Από Ατύχημα";

    if (coverKey >= 60201 && coverKey <= 60201)
      return "Ευρεία Υγειονομική Περίθαλψη";

    if (coverKey >= 60203 && coverKey <= 60207)
      return "Νοσοκομειακή Περίθαλψη";

    if (coverKey >= 60209 && coverKey <= 60209)
      return "Ευρεία Υγειονομική Περίθαλψη";

    if (coverKey >= 60210 && coverKey <= 60217)
      return "Νοσοκομειακή Περίθαλψη";

    if (coverKey >= 60219 && coverKey <= 60219)
      return "Ευρεία Υγειονομική Περίθαλψη";

    if (coverKey >= 60400 && coverKey <= 60400)
      return " Εκτός Νοσοκομείου 'Εξοδα - Διαγνωστικές Εξετάσεις";

    if (coverKey >= 60402 && coverKey <= 60402)
      return "Εξόδα Εκτός Νοσοκομείου - Συμβεβλημένο Κέντρο ΒΙΟΙΑΤΡΙΚΗ";

    if (coverKey >= 60414 && coverKey <= 60418)
      return "Eκτός Νοσοκομείου 'Εξοδα";

    if (coverKey >= 60419 && coverKey <= 60419)
      return "Εξόδα Εκτός Νοσοκομείου - Συμβεβλημένο Κέντρο HEALTHNET";

    if (coverKey >= 60420 && coverKey <= 60423)
      return "Eκτός Νοσοκομείου 'Εξοδα";

    if (coverKey >= 60505 && coverKey <= 60507)
      return "Απώλεια  εισοδήματος από ασθένεια ή ατύχημα";

  }

  navigateToAmendments() {
    this.router.navigate(
      ["/ice/default/customerArea.motor/viewAmendments"], {}
    );
  }

  checkPartnerName(){

    //AgentInfo part for SalesChannel Condition

     if(this.currentContract.AgentInfo!=undefined)
     {
     // console.log("AgentInfo inside",  this.data[i].AgentInfo);
     // console.log("AgentInfo Channel inside", this.data[i].AgentInfo.ChannelDescription);
           if (
             this.currentContract.AgentInfo.ChannelDescription === SalesChannel.HHLMortgage ||
             this.currentContract.AgentInfo.ChannelDescription === SalesChannel.HHLConsumer ||
             this.currentContract.AgentInfo.ChannelDescription === SalesChannel.Network ||
             this.currentContract.AgentInfo.ChannelDescription === SalesChannel.Open24Branches ||
             this.currentContract.AgentInfo.ChannelDescription === SalesChannel.Open24Europhone ||
             this.currentContract.AgentInfo.ChannelDescription === SalesChannel.Open24Telemarketing
           ) {
             this.partnerName = true;
             console.log("partnerName", true)
           }
           else
           {
             this.partnerName = false;
             console.log("partnerName", false)
           }
      }
      else
      {
       this.partnerName = true;
      }


   }

  async requestAmendment(row: any) {


    ///find selected contract branch....it should be placed in home
    ////////////////////
    if (row.Branch == "ΥΓΕΙΑΣ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(1);
      this.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);
      this.iceModel.elements["amendments.step2"].setSimpleValue(false);
      this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);
      this.iceModel.elements["amendments.health.category.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.health.subcategory.dropdown"].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
      this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
      this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
      this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
      this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractIndividualDetails.PaymentType);
      this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
      this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
      this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
      //console.log(row.ContractIndividualDetailsPaymentType)
      for(let participant of row.Participants){
        if(participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
          if(row.ContractIndividualDetails.PaymentType !== "ΕΛΤΑ" || row.ContractIndividualDetails.PaymentType !== "ΜΕΤΡΗΤΑ"){
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) {
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else{
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
            }
          }else{
            if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) {
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

            }else{
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
            }
          }

        }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
          if(row.ContractIndividualDetails.PaymentType !== "ΕΛΤΑ" || row.ContractIndividualDetails.PaymentType !== "ΜΕΤΡΗΤΑ"){
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName == false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);

            }
          }else{
            if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" && this.partnerName === true){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

            }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName == false){
              this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);

            }
          }

        }
      }

    }
    else if (row.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ") {
      let indexOfContractIDType = row.ContractType

      if (indexOfContractIDType == "2")
      {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(11);

        this.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);
        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);

        this.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
        if(row.ContractIndividualDetails != undefined){
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractIndividualDetails.PaymentType);
          this.paymentType = row.ContractIndividualDetails.PaymentType;
        }else{
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.PensionContractDetails.PaymentType);
          this.paymentType = row.PensionContractDetails.PaymentType;
        }
        this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
        let showExtraPaymentField =await this.showExtraPaymentField();
        this.checkPartnerName();    //check if there is partner name
        //console.log(row.ContractIndividualDetails.PaymentType)
        for(let participant of row.Participants){
          if(participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" )
            {
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }

            }else if(this.paymentType !== "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{

              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }


          }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" ){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else if(this.paymentType === "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }

          }
        }

      }else if (indexOfContractIDType == "1") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(2);

        this.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);
        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);
        this.iceModel.elements["amendments.finance.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.iceModel.elements["amendments.health.life.finance.extra.payment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.decrease.amount.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.health.life.finance.new.increase.amount.input"].setSimpleValue(null);
        if(row.ContractIndividualDetails != undefined){
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractIndividualDetails.PaymentType);
          this.paymentType = row.ContractIndividualDetails.PaymentType;
        }else{
          this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.PensionContractDetails.PaymentType);
          this.paymentType = row.PensionContractDetails.PaymentType;
        }
        this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
        let showExtraPaymentField = await this.showExtraPaymentField();
        this.checkPartnerName();    //check if there is partner name
        //console.log(row.ContractIndividualDetails.PaymentType)
        for(let participant of row.Participants){
          if(participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" )
            {
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }

            }else if(this.paymentType !== "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{

              if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" && this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);
                }

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);
                }

              }else {
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }


          }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(this.paymentType === "ΕΛΤΑ" ){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else if(this.paymentType === "ΜΕΤΡΗΤΑ"){
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);

              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }else{
              if(row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);


              }else if(row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true){

                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);


              }else{
                if(showExtraPaymentField){
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
                }else{
                  this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(7);
                }
              }
            }

          }
        }
      }
      else {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(2);
      }
    }
    else if (row.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(3);
      //Initialize the related elements
      this.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);
      this.iceModel.elements["amendments.step2"].setSimpleValue(false);
      this.iceModel.elements["amendments.motor.category.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.motor.subcategory.dropdown"].setSimpleValue(null);
      this.iceModel.elements["amendments.plate.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.mileage.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.capital.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.largest.capital.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.dob.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.licence.dob.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.driver.licence.new.input"].setSimpleValue(null);
      this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
      this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
      // this.iceModel.elements["amendments.upload.file"].setSimpleValue(false);

      this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString);
      this.iceModel.elements["amendments.plate.id.value"].setSimpleValue(row.ContractMotorDetails.VehicleLicensePlate);
      this.iceModel.elements["amendments.frequencyOfPayment.current.value"].setSimpleValue(row.paymentFrequencyToString);
      this.iceModel.elements["amendments.capital.current.value"].setSimpleValue(this.getCurrencyFormat(row.ContractMotorDetails.VehicleMarketValue));
      this.iceModel.elements["amendments.largest.capital.current.value"].setSimpleValue(this.getCurrencyFormat(row.ContractMotorDetails.VehicleMarketValue));
      this.iceModel.elements["amendments.driver.current.dob.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverBirthDate));
      this.iceModel.elements["amendments.intermediate.dob"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverBirthDate));
      this.iceModel.elements["amendments.driver.licence.current.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverPermitYear));
      this.iceModel.elements["amendments.intermediate.licence"].setSimpleValue(this.getYear(row.ContractMotorDetails.DriverPermitYear));
      this.iceModel.elements["policies.details.Bdriver"].setSimpleValue(row.ContractMotorDetails.DriverBYearsOfLicence);
      this.iceModel.elements["policies.details.Cdriver"].setSimpleValue(row.ContractMotorDetails.DriverCYearsOfLicence);
      //This is for second driver if exists
      if (row.ContractMotorDetails.DriverBYearsOfLicence != 0) {
        this.iceModel.elements["amendments.second.driver.dob.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver2BirthDate));
        this.iceModel.elements["amendments.second.driver.date.licence.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver2PermitYear));
      }
      //This is for third driver if exists
      if (row.ContractMotorDetails.DriverCYearsOfLicence != 0) {
        this.iceModel.elements["amendments.third.driver.dob.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver3BirthDate));
        this.iceModel.elements["amendments.third.driver.date.licence.value"].setSimpleValue(this.getYear(row.ContractMotorDetails.Driver3PermitYear));
      }
      var renewalDate = row.ExpirationDate;
      if (renewalDate != null && this.calculateDiffOfDays(renewalDate)) {
        this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
      }
    }
    else if (row.Branch == "ΠΕΡΙΟΥΣΙΑΣ") {

        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(13);
        //Initialize the related elements
        this.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);
        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["amendments.property.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.insured.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.add.insuredcomments"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.apartment.number.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.year.construction.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.parking.number.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.building.measures.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.storage.room.number.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.storage.room.measures.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.parking.measures.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.property.new.property.code.input"].setSimpleValue(null);
        this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString);
        this.iceModel.elements["amendments.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
        var renewalDate = row.ExpirationDate;
        if (renewalDate != null && this.calculateDiffOfDays(renewalDate)) {
          this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);
        }
    }
    else if (row.Branch == "ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(6);
    }
    else if (row.Branch == "ΣΚΑΦΩΝ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(7);
    }
    else if (row.Branch == "ΑΣΤΙΚΗ ΕΥΘΥΝΗ") {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(8);
    }
    else if (row.Branch == "ΖΩΗΣ")
    {
      let indexOfContractIDType = row.ContractType;
      if (indexOfContractIDType == "6")
      {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(12);
      }
      else if (indexOfContractIDType == "3")
      {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(15);
        this.iceModel.elements["amendments.details.step.status"].setSimpleValue(0);
        this.iceModel.elements["amendments.step2"].setSimpleValue(false);
        this.iceModel.elements["policy.contract.amendments.info.ContractID"].setSimpleValue(row.ContractID);
        this.iceModel.elements["amendments.life.category.dropdown"].setSimpleValue(null);
        this.iceModel.elements["amendments.life.subcategory.dropdown"].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input1'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input1'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input2'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input2'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.name.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.relationship.input3'].setSimpleValue('-');
        this.iceModel.elements['amendments.health.life.finance.addBeneficiaries.percentage.input3'].setSimpleValue(null);
        this.iceModel.elements['amendments.beneficiaries.filledInputs'].setSimpleValue(false);
        this.iceModel.elements["amendments.beneficiaries.length"].setSimpleValue(0);
        this.iceModel.elements["amendments.health.life.finance.new.birthdate.input"].setSimpleValue(null);
        this.iceModel.elements["policies.details.frequencyOfPayment"].setSimpleValue(row.paymentFrequencyToString + " " + row.ContractMortgageDetails.PaymentType);
        this.iceModel.elements["amendments.health.life.finance.frequencyOfPayment.input"].setSimpleValue(null);
        this.iceModel.elements["amendments.commentuser"].setSimpleValue(false);
        this.iceModel.elements["amendments.verifieduser"].setSimpleValue(false);
        this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(false);
        this.checkPartnerName();    //check if there is partner name
        //console.log(row.ContractMortgageDetails.PaymentType)
        for(let participant of row.Participants){
          if( participant.Relationship === "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(row.ContractMortgageDetails.PaymentType !== "ΕΛΤΑ" || row.ContractMortgageDetails.PaymentType !== "ΜΕΤΡΗΤΑ"){
              if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5)
              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }

            }else{
              if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === false) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(1);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(4);

              }else if((row.paymentFrequencyToString !== "ΜΗΝΙΑΙΑ" || this.partnerName === true) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName === true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(2);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(5)
              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }
            }

          }else if(participant.Relationship !== "ΑΣΦΑΛΙΣΜΕΝΟΣ - ΣΥΜΒΑΛΛΟΜΕΝΟΣ"){
            if(row.ContractMortgageDetails.PaymentType !== "ΕΛΤΑ" || row.ContractMortgageDetails.PaymentType !== "ΜΕΤΡΗΤΑ"){
              if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }

            }else{
              if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == true) && !row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else if((row.paymentFrequencyToString === "ΜΗΝΙΑΙΑ" || this.partnerName == false) && row.ProductDescritpion.startsWith('Credit Life')){
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(3);

              }else{
                this.iceModel.elements["request.amendment.change.fop"].setSimpleValue(0);
              }
            }

          }

        }
      }
      else if (indexOfContractIDType == "7") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(14);
      }
      else if (indexOfContractIDType == "4") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(16);
      }
      else if (indexOfContractIDType == "5") {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(17);
      }
      else {
        this.iceModel.elements["selectedcontractbranch"].setSimpleValue(9);
      }
    }
    else {
      this.iceModel.elements["selectedcontractbranch"].setSimpleValue(5);
    }

    /////////////////////// End
    this.iceModel.elements['amendments.details.ProductName'].setSimpleValue(row.ProductDescritpion);
    this.iceModel.elements['amendments.details.PolicyNumberHeader'].setSimpleValue(row.ContractKey);
    let action = this.context.iceModel.actions['actionRedirectToAmendmentDetails'];
    let actionHome = this.context.iceModel.actions['actionRedirectToAmendmentHomeDetails'];
    let actionHealth = this.context.iceModel.actions['actionRedirectToAmendmentHealthDetails'];
    let actionLife = this.context.iceModel.actions['actionRedirectToAmendmentLifeDetails'];
    let actionFinance = this.context.iceModel.actions['actionRedirectToAmendmentFinanceDetails'];
    if (action != null && row.Branch == "ΑΥΤΟΚΙΝΗΤΩΝ") {
      action.executionRules[0].execute();
    }
    if (actionHome != null && row.Branch == "ΠΕΡΙΟΥΣΙΑΣ"){
      actionHome.executionRules[0].execute();
    }
    if (actionHealth != null && row.Branch == "ΥΓΕΙΑΣ"){
      actionHealth.executionRules[0].execute();
    }
    if (actionLife != null &&  row.Branch == "ΖΩΗΣ"){
      actionLife.executionRules[0].execute();
    }
    if (actionFinance != null &&  row.Branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"){
      actionFinance.executionRules[0].execute();
    }
  }

  canRequestAmendment(): boolean {
    if (this.context.iceModel.elements["amendments.showAmendments"].getValue().forIndex(null) && (this.branch == "ΑΥΤΟΚΙΝΗΤΩΝ" || this.branch == "ΠΕΡΙΟΥΣΙΑΣ" || this.branch =="ΖΩΗΣ" || this.branch == "ΥΓΕΙΑΣ" || this.branch == "ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ"))
      return true;
    else
      return false;
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

  ngAfterViewInit() {
    this.messageInputs.forEach((element: any) => {

      var wrapperEl = element.nativeElement.innerHTML;

      if (wrapperEl.includes('Μέγιστο'))
        element.nativeElement.innerHTML = wrapperEl.replace('Μέγιστο', '<br/>Μέγιστο');

      if (wrapperEl.includes('*'))
        element.nativeElement.innerHTML = wrapperEl.replace('*', '<br/>');
    })
    //  this.messageInput.nativeElement.innerHTML=item.GroupHealthInsuredValue;

  }

  ngOnDestroy()
  {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async showExtraPaymentField(): Promise<boolean>{
    let showExtraPaymentField = false;
    let codes = await this.context.iceModel.elements["policy.coverages"].getValue().values[0].value;
    if(codes != undefined){
      let basicCoverages = ['10403', '10406', '10407', '10433', '10434', '10436', '10437', '10443', '10451', '10522', '10532', '10541', '10549', '70036', '70037', '70056', '70059', '70065' , '70066' , '70069' , '70070'];
      for(let coverage of  codes){
        if(basicCoverages.includes(coverage.coverKey)){
          showExtraPaymentField = true;
        }
      }
    }
    return showExtraPaymentField;
  }
}
export enum SalesChannel {
  BrokerAgent = 'Broker/Agent',
  CDU = 'CDU',
  DSF = 'DSF',
  EurolifeTeam = 'Eurolife Team',
  HQEurolife = 'H/Q Eurolife',
  HHLMortgage = 'HHL Mortgage',
  HHLConsumer = 'HHL Consumer',
  Network = 'Network',
  Open24Branches = 'Open24 Branches',
  Open24Europhone = 'Open24 Europhone',
  Open24Telemarketing = 'Open24 Telemarketing',
  SBB = 'SBB',
  CaptiveBroker = 'Captive Broker',
  InwardsCoolgen = 'Inwards/Coolgen',
  VIPUnit = 'VIP Unit',
  InwardsLife = 'Inwards/Life',
  PolicyFeeLife = 'Policy Fee/ife',
  TOKA = 'TO.KA.',
  ΣτερείταιΧαρακτηρισμόΚαναλιού = 'Στερείται Χαρακτηρισμό Καναλιού',
}

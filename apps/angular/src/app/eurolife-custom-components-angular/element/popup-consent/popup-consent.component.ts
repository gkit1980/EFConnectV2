import { Component } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import { NgbModalRef, NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { PopUpPageComponent } from "../../page/pop-up-page/pop-up-page.component";
import { ModalService } from "../../../services/modal.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { IndexedValue, ItemElement, ValueOrigin } from "@impeo/ice-core";



@Component({
  selector: "app-popup-consent",
  templateUrl: "./popup-consent.component.html",
  styleUrls: ["./popup-consent.component.scss"]
})
export class PopupConsentComponent extends ElementComponentImplementation {
  dialogRef: NgbModalRef;

  motorMobilePhone = "elements.motor.motorMobilePhone.text.label";

  constructor(public ngbModal: NgbModal, public modalService: ModalService,private localStorage: LocalStorageService) {
    super();
  }

  ngOnInit() {
    // subscribe to the element which keeps the dialog open
    this.context.iceModel.elements[
      "home.tokenwithconsent"
    ].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
        if (this.localStorage.getDataFromLocalStorage("consents")==true)
        {

          this.openFirstDialog();  //open the first induction dialog

        //this.openDialog(); //open second consent dialog only from login process..
           this.localStorage.setDataToLocalStorage("consents",false);
        }


      }else{
        this.context.iceModel.elements["adv.toload"].setSimpleValue(true);
      }
    });



     //trigger the first dialog
     this.context.iceModel.elements["consent.flag.openfirstdialog"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {

        this.ngbModal.dismissAll();
        this.openFirstDialog();

        //reset values in order to proceed to next dialog
        let element=this.context.iceModel.elements['consent.flag.openfirstdialog'] as ItemElement;
        element.setValue(new IndexedValue(element,false,null,ValueOrigin.UI));

        this.context.iceModel.elements['consent.flag.opendialog'].setSimpleValue(false);
      }
    });


    //trigger the main dialog
    this.context.iceModel.elements["consent.flag.opendialog"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
        this.ngbModal.dismissAll();
        this.openDialog(); //open second consent dialog only from login process..

      }
    });



    // // subscribe to the element which close the dialog
    this.context.iceModel.elements["consent.popupdialog"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
      //  var x = document.getElementsByClassName('my-class');
          var x =document.querySelector('.my-class');

          x.classList.remove('my-class');
          x.classList.add('close-class');


         this.context.iceModel.elements["consent.succesfull.submition"].setSimpleValue(false);
         this.context.iceModel.elements["consent.showcloseicon"].setSimpleValue(false);
      }
      else
      {
        var xx = document.getElementsByClassName('close-class');
        if(xx!=undefined)
        {
          for (var i = 0; i < xx.length; i++) {
          //  xx[i].classList.remove("close-class");
            xx[i].classList.add('my-class');
          }
        }

      }


    });



     ///subscribe successfull submition of consents
     this.context.iceModel.elements["consent.succesfull.submition"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
        this.ngbModal.dismissAll();
        this.context.iceModel.elements["adv.toload"].setSimpleValue(true);
        const popupPageName = "consentClose";
        if (!popupPageName || !this.context.iceModel.pages[popupPageName])
          return console.error(
            `Page ${popupPageName} does not exists, dialog will not be displayed`
          );
        PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[popupPageName];
        this.ngbModal.open(PopUpPageComponent, {
          windowClass: "close-class",
          backdrop  : 'static',
          keyboard  : false
         // windowClass: "xlModal"
        });
      }
    });

     ///subscribe successfull submition of consents
     this.context.iceModel.elements["consent.popupdialog.close"].$dataModelValueChange.subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) == true)
      {
        this.context.iceModel.elements["adv.toload"].setSimpleValue(true);
        this.ngbModal.dismissAll();
      }
    });

  }
  openFirstDialog() {
    const popupPageName = "consentInitial";
    if (!popupPageName || !this.context.iceModel.pages[popupPageName])
      return console.error(
        `Page ${popupPageName} does not exists, dialog will not be displayed`
      );
    PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[
      popupPageName
    ];

    this.modalService.ismodalOpened();
    this.ngbModal.open(PopUpPageComponent, {
      windowClass: "my-class",
      backdrop  : 'static',
      keyboard  : false
    });
    // this.dialogRef.result.then(
    //   () => {
    //     console.log("When user closes");
    //   },
    //   () => {
    //     this.modalService.isModalClosed();
    //   }
    // );
  }

  openDialog(): void {
    const popupPageName = this.element.recipe["dialogpage"];
    if (!popupPageName || !this.context.iceModel.pages[popupPageName])
      return console.error(
        `Page ${popupPageName} does not exists, dialog will not be displayed`
      );
    PopUpPageComponent.pageToDisplay = this.context.iceModel.pages[
      popupPageName
    ];
   ///we should not show the close icon
    this.context.iceModel.elements["consent.showcloseicon"].setSimpleValue(true);

    this.modalService.ismodalOpened();
    this.dialogRef = this.ngbModal.open(PopUpPageComponent, {
      windowClass: "my-class",
      backdrop  : 'static',
      keyboard  : false
    });
    this.dialogRef.result.then(
      () => {
        console.log("When user closes");
      },
      () => {
        this.modalService.isModalClosed();
      }
    );
  }

}

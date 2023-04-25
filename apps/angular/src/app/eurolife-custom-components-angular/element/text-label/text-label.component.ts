import { Component } from "@angular/core";
import {
  ElementComponentImplementation
} from "@impeo/ng-ice";
import { environment } from "../../../../environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IceContextService } from "@impeo/ng-ice";


@Component({
  selector: 'app-text-label',
  templateUrl: './text-label.component.html',
  styleUrls: ['./text-label.component.scss']
})
export class TextLabelComponent extends ElementComponentImplementation {

  constructor(public ngbModal: NgbModal,private contextService:IceContextService) {
    super();
  }

  ngOnInit() {
  }


  get text() {
    // Read first class
    let text = this.getRecipeParam("text");
    return text;
  }

  get AdditionalClasses() {
    // Read first class
    let AdditionalClasses = this.getRecipeParam("AdditionalClasses");
    return AdditionalClasses;
  }

}

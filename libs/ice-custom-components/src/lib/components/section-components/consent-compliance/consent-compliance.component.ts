import { Component, OnInit } from "@angular/core";
import {
  SectionComponentImplementation,
  IceSectionComponent
} from "@impeo/ng-ice";

@Component({
  selector: "app-consent-compliance",
  templateUrl: "./consent-compliance.component.html",
  styleUrls: ["./consent-compliance.component.scss"]
})
export class ConsentComplianceComponent extends SectionComponentImplementation
  implements OnInit {
  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  showConsentCards(): boolean {
    if (
      this.context.iceModel.elements["consent.page.index"]
        .getValue()
        .forIndex(null) == 2
    )
      return false;
    else return true;
  }

  ngOnInit() {}
}

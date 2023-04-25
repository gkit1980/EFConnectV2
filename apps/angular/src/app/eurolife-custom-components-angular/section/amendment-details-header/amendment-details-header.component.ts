import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { SpinnerService } from "../../../services/spinner.service";

@Component({
  selector: 'app-amendment-details-header',
  templateUrl: './amendment-details-header.component.html',
  styleUrls: ['./amendment-details-header.component.scss']
})
export class AmendmentDetailsHeaderComponent extends SectionComponentImplementation {

  constructor(
    parent: IceSectionComponent,
    private SpinnerService: SpinnerService
  ) {
    super(parent);
  }


  ngOnInit() {
  }


  getGridColumnClass(col: any): string {
    let css;
    if (this.recipe.componentFlag=="amnendmentDetails" || this.recipe.componentFlag =="amendmentHomeDetails" || this.recipe.componentFlag == "amendmentHealthDetails" || this.recipe.componentFlag == "amendmentLifeDetails" || this.recipe.componentFlag == "amendmentFinanceDetails") {
      css = col.css;
    } else {
      css = col.arrayElements ? "col-md-12" : "col-md-" + col.col;
      if (col.css) {
        css = css + " " + col.css;
      }
    }

    return css;
  }
  getGridInternalColumnClass(col: any): string {
    var css = col.arrayElements ? "col-md-12" : "col-" + col.internalCol;
    if (col.css)
      css = css + " " + col.css;
    return css;
  }

  getElementClass(col: any): string {
    var css = col.css;
    return css;
  }

  getInternalRowClass(row: any): string {
    var css = row.css;
    return css;
  }

}

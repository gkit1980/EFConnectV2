import { Component } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'app-flat-section',
  templateUrl: './flat-section.component.html',
  styleUrls: ['./flat-section.component.css']
})
export class FlatSectionComponent extends SectionComponentImplementation {
  getGridColumnClass(col: any) {
    if (this.recipe.pageSource != undefined && this.recipe.pageSource === 'home') {
      return col.arrayElements ? 'col-md-12' : 'col-md-' + col.col;
    }
    
    return col.arrayElements ? 'col-sm-12' : 'col-sm-' + col.col;
  };

}

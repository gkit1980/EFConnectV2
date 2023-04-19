import { Component, OnInit } from '@angular/core';
import { IceAutocompleteComponent } from '@impeo/ng-ice';

@Component({
  selector: 'insis-autocomplete',
  templateUrl: './insis-autocomplete.component.html',
})
export class InsisAutocompleteComponent extends IceAutocompleteComponent implements OnInit {
  static componentName = 'InsisAutocomplete';

  showValidationErrors = true;

  ngOnInit() {
    super.ngOnInit();

    this.showValidationErrors = this.getRecipeParam('showValidationErrors', true);
  }
}

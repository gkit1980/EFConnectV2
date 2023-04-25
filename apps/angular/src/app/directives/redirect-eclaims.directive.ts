import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IceContextService } from '@impeo/ng-ice';
import { LocalStorageService } from '../services/local-storage.service';
import { SpinnerService } from '../services/spinner.service';
import * as _ from 'lodash';

@Directive({
  selector: '[appRedirectEclaims]',
})
export class RedirectEclaimsDirective {
  @Input() selectedItem: any;
  constructor(
    private contextService: IceContextService,
    private localStorage: LocalStorageService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {}

  @HostListener('click', ['$event'])
  async onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const context =await this.contextService.getContext("customerArea");

    const clientContracts = _.get(context.dataStore, 'clientContracts');
    if (!clientContracts) {
      return;
    }

    context.iceModel.elements[
      'eclaims.details.close.dialog.status'
    ].setSimpleValue(false);
    context.iceModel.elements['eclaims.update.request.flag'].setSimpleValue(
      false
    );


    if (!!clientContracts && this.selectedItem==undefined)
    {
      clientContracts.some((contract: any) => {
        if (contract.ContractType === 99) {
          context.iceModel.elements['selectedcontractbranch'].setSimpleValue(
            99
          );
        }
      });
    }
    else
    {
          this.localStorage.setDataToLocalStorage('showGroupHealth', true);
          context.iceModel.elements['eclaims.contractID'].setSimpleValue(this.selectedItem.ContractID);
          context.iceModel.elements['eclaims.contractKey'].setSimpleValue(this.selectedItem.ContractKey);
          context.iceModel.elements['selectedcontractbranch'].setSimpleValue(99);
    }

    try {


        context.iceModel.elements['eclaims.step'].setSimpleValue(1);

        this.router.navigate(['/ice/default/customerArea.motor/viewEclaimsDetails',]);

    } catch (err) {
      console.error(err);
      this.spinnerService.loadingOff();
    }
  }
}

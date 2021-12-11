import { ValueRule } from '@impeo/ice-core';
import { v4 } from 'uuid';

//
//
export class DigitalDocumentsCrossDeviceUrlValueRule extends ValueRule {
  //
  //
  public getValue(index: number[] | null): any {
    
    //origin
    let origin = '';
    if (typeof window !== 'undefined') {
      console.log("window undefined");
      origin = window.location.origin;
    }

    //
    const relativeUrl = this.requireParam('relativeUrl') as string;
    const flag = this.requireParam('flag') as string;
    const dynId = this.context.dataStore.get(`${this.iceModel.definition.name}.dynId`) ?? "-";
    return `${origin}${relativeUrl}?id=${dynId}&flag=${flag}`;


  }
}

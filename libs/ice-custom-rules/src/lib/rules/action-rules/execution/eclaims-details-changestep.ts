import { ExecutionRule } from '@impeo/ice-core';

export class EclaimsDetailsChangestep extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      let step =
        this.iceModel.elements['eclaims.step'].getValue().values[0].value;
      switch (step) {
        case 1:
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(
            this.context.iceModel.elements['eclaims.step'].getValue().values[0]
              .value + 1
          );
          break;
        case 11:
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(12);
          //this.context.iceModel.elements['eclaims.step'].setSimpleValue(2);
          break;
        case 2:
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(
            this.context.iceModel.elements['eclaims.step'].getValue().values[0]
              .value + 1
          );
          break;
        case 31:
          const actName = 'action-eclaims-uploadfiles';
          const action = this.context.iceModel.actions[actName];
          if (!!action) {
            await this.context.iceModel.executeAction(actName);
          }
          break;
        case 13:
          if(this.context.iceModel.elements['eclaims.selected.Incident'].getValue().values[0].value === "Απώλεια εισοδήματος" || this.context.iceModel.elements['eclaims.selected.Incident'].getValue().values[0].value === "Νοσηλεία" || this.context.iceModel.elements['eclaims.selected.Incident'].getValue().values[0].value === "Ράμματα"){
            this.context.iceModel.elements['eclaims.step'].setSimpleValue(2);
          }else{
            this.context.iceModel.elements['eclaims.step'].setSimpleValue(14);
          }
          break;
        case 15:
          const action2 = this.context.iceModel.actions[ "action-eclaims-get-aade-receipt-fields"];  // executing 3 action rules with spinner
          await action2.executionRules[0].execute();

          await action2.executionRules[1].execute();


          await  action2.executionRules[2].execute();

          this.context.iceModel.elements['eclaims.step'].setSimpleValue(2);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

import { ExecutionRule } from '@impeo/ice-core';

export class EclaimsDetailsPreviousStep extends ExecutionRule {
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
        case 12:
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
          this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].setSimpleValue(null);
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
          this.context.iceModel.elements["eclaims.selected.Incident"].setSimpleValue(null);
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(1);
          this.context.iceModel.elements['eclaims.selected.ClaimInsuredName'].setSimpleValue(null);
          break;
        case 15:
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(12);
          this.context.iceModel.elements["eclaims.selected.Incident"].setSimpleValue(null);
          break;
        case 14:
          this.context.iceModel.elements['eclaims.step'].setSimpleValue(12);
          this.context.iceModel.elements["eclaims.selected.Incident"].setSimpleValue(null);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

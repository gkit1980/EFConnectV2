import { ExecutionRule } from '@impeo/ice-core';

export class InsisGeolocationExecutionRule extends ExecutionRule {
  private static POSITION_ERROR: PositionError;

  async execute(actionContext?: any): Promise<any> {
    if (
      InsisGeolocationExecutionRule.POSITION_ERROR &&
      InsisGeolocationExecutionRule.POSITION_ERROR.code === 1
    ) {
      return Promise.reject();
    }

    return this.getGeoLocation()
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  getGeoLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  handleSuccess = ({ coords }) => {
    const { latitude, longitude } = coords;

    const latElementName = this.requireParam('latElement');
    const lngElementName = this.requireParam('lngElement');

    if (!latElementName || !lngElementName) return;

    const latElement = this.context.iceModel.elements[latElementName];
    const lngElement = this.context.iceModel.elements[lngElementName];

    if (!latElement || !lngElement) return;

    latElement.setSimpleValue(latitude);
    lngElement.setSimpleValue(longitude);
  };

  handleError = err => {
    InsisGeolocationExecutionRule.POSITION_ERROR = err;
    //TODO: We need to do something with the error
    console.log({ err });
  };
}

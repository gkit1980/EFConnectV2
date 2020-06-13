import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { IceElement } from '@impeo/ice-core';

@Component({
  selector: 'insis-google-map',
  templateUrl: './insis-google-map.component.html',
})
export class InsisGoogleMapComponent extends MaterialSelectComponentImplementation
  implements OnInit {
  static componentName = 'InsisGoogleMap';

  lat = 0;
  lng = 0;
  latMap = 0;
  lngMap = 0;

  latElement: IceElement;
  lngElement: IceElement;

  ngOnInit() {
    super.ngOnInit();

    const latElementName = this.getRecipeParam('latElement');
    const lngElementName = this.getRecipeParam('lngElement');

    if (!latElementName || !lngElementName) return;

    const latElement = this.context.iceModel.elements[latElementName];
    const lngElement = this.context.iceModel.elements[lngElementName];

    if (!latElement || !lngElement) return;

    this.latElement = latElement;
    this.lngElement = lngElement;

    const latValue = latElement.getValue().forIndex([0]);
    const lngValue = lngElement.getValue().forIndex([0]);
    if (latValue && lngValue) {
      this.lat = parseFloat(latValue);
      this.lng = parseFloat(lngValue);
    }

    latElement.$dataModelValueChange.subscribe((v) => {
      if (this.lat === 0) {
        this.lat = parseFloat(v.value);
      }
    });
    lngElement.$dataModelValueChange.subscribe((v) => {
      if (this.lng === 0) {
        this.lng = parseFloat(v.value);
      }
    });
  }

  centerChange({ lat, lng }) {
    this.latElement.setSimpleValue(lat);
    this.lngElement.setSimpleValue(lng);
    this.latMap = lat;
    this.lngMap = lng;
  }
}

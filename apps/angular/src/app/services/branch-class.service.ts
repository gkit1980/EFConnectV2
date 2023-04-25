import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BranchClassService {

  constructor() { }

  iconClass(branch: string): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life';
        break;
      case 'ΥΓΕΙΑΣ':
        return 'health';
        break;
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor';
        break;
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house';
        break;
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings';
        break;
      default:
        return 'otherpc';
        break;
    }
    return 'otherpc';
  }

  textClass(branch: string): string {
    switch (branch) {
      case 'ΖΩΗΣ':
        return 'life_text';
        break;
      case 'ΥΓΕΙΑΣ':
        return 'health_text';
        break;
      case 'ΑΥΤΟΚΙΝΗΤΩΝ':
        return 'motor_text';
        break;
      case 'ΠΕΡΙΟΥΣΙΑΣ':
        return 'house_text';
        break;
      case 'ΔΙΑΦΟΡΑ ΕΠΕΝΔΥΤΙΚΑ':
        return 'savings_text';
        break;
      default:
        return 'otherpc_text';
        break;
    }
    return 'otherpc_text';
  }

}

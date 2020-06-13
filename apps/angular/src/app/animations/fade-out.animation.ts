import {
  trigger,
  transition,
  style,
  state,
  animate,
  AnimationTriggerMetadata,
} from '@angular/animations';

export const fadeOut: AnimationTriggerMetadata = trigger('fadeOut', [
  state('in', style({ opacity: 1 })),
  transition(':enter', [style({ opacity: 0 }), animate(600)]),
  transition(':leave', animate(600, style({ opacity: 0 }))),
]);

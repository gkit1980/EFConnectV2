import { BREAKPOINT } from '@angular/flex-layout';

const BREAKPOINTS = [
  {
    alias: 'xs',
    mediaQuery: 'screen and (min-width: 0px) and (max-width: 599.9px)',
    priority: 1000
  },
  {
    alias: 'sm',
    mediaQuery: 'screen and (min-width: 600px) and (max-width: 839.9px)',
    priority: 900
  },
  {
    alias: 'md',
    mediaQuery: 'screen and (min-width: 840px)',
    priority: 800
  }
];

export const CustomBreakpointsProvider = {
  provide: BREAKPOINT,
  useValue: BREAKPOINTS,
  multi: true
};

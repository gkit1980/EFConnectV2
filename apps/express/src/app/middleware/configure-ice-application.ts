import * as express from 'express';
import { expressIce, ExpressIceApplicationOptions } from '@impeo/exp-ice';

export function configureIceApplication(
  app: express.Application,
  appOptions: ExpressIceApplicationOptions
) {
  app.use(expressIce(appOptions));
}

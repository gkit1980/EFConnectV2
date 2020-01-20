import * as express from 'express';
import { ServerPrincipal } from '@impeo/ice-core';

export function configureIcePrincipal(app: express.Application) {
  const defaultLocale = 'en';

  app.use('/api/v1', async (request, response, next) => {
    /**
     * TIP: Validate requests here and set the correct principal
     */
    request['principal'] = new ServerPrincipal('n/a', defaultLocale, [], {});
    next();
  });
}

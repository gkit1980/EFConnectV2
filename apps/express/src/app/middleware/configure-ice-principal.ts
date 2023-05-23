import * as express from 'express';
import { ServerPrincipal } from '@impeo/ice-core';
import jwt from 'jsonwebtoken';

export function configureIcePrincipal(app: express.Application) {
  const defaultLocale = 'en';

  app.use('/api/v1', async (request, response, next) => {
    /**
     * TIP: Validate requests here and set the correct principal
     */

    //if the request has an Authorization Bearer header, use it to create the ICE principal
    if (
      request.header('Authorization') != null &&
      request.header('Authorization').startsWith('Bearer')
    ) {
      //assume it is a JWT token!
      const token = request.header('Authorization').replace('Bearer ', '');
      const secret = process.env['JWT_SECRET'];



      const payload = jwt.verify(token, secret);
      const principal = new ServerPrincipal(
        payload['id'],
        token,
        defaultLocale,
        payload['roles'],
        payload['data']
      );
      request['principal'] = principal;
    }
    //no Authorization header was passed, but we are on a /api/v1/external REST path:
    //so we will create a default ICE principal
    else if (request.path.startsWith('/external/')) {
      console.warn('Created default principal for request path', request.path);
      request['principal'] = new ServerPrincipal('n/a', null, defaultLocale, [], {});
    }

    next();
  });
}

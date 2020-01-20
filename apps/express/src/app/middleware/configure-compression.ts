import * as express from 'express';
import * as compression from 'compression';

export function configureCompression(app: express.Application) {
  app.use(compression());
}

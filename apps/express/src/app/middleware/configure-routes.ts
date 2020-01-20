import * as express from 'express';

import { createHeloWorldRouter } from '../routes/hello-world';

export function configureRoutes(app: express.Application) {
  const prefix = '/api/v1';

  app.use(prefix, createHeloWorldRouter());
}

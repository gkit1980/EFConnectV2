import * as express from 'express';

import { createHeloWorldRouter } from '../routes/hello-world';
import { CrossDeviceRouter } from '../routes/cross-device.router';

export function configureRoutes(app: express.Application) {
  const prefix = '/api/v1';

  app.use(prefix, createHeloWorldRouter());
    
  // register crossdevice routes
  const crossDeviceRouter = new CrossDeviceRouter();
  app.use(prefix, crossDeviceRouter.getRoutes());
}

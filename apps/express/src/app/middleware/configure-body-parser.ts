import * as express from 'express';
import * as bodyParser from 'body-parser';

export function configureBodyParser(app: express.Application) {
  app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.text({ limit: '2mb' }));
}

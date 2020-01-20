import * as express from 'express';
import * as cors from 'cors';

export function configureCors(app: express.Application) {
  const whitelist = [
    /**
     * TIP: Add your CORS-whitelisted hostnames here
     */
  ];
  const corsOptions = {
    origin: (origin: any, callback: any) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200
  };
  app.get('/api/v1/external', cors(corsOptions));
}

import * as express from 'express';
import { APIError, HttpStatusCode } from '@impeo/exp-ice';

export function configureErrorHandling(app: express.Application) {
  // 404
  app.use((req, res, next) => {
    const err = new APIError('Not found', HttpStatusCode.NOT_FOUND);
    next(err);
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiError = APIError.fromError(err);
    if (apiError.status === HttpStatusCode.NOT_FOUND) {
      // no need to stack for 404... just clutters logs
      apiError.stack = undefined;
    }

    console.error('Error cought by express error handler', apiError);
    res.status(apiError.status).send(apiError);
  });
}

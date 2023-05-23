import * as express from 'express';
import lightningOutEclaimsController from '../../controllers/lightningout-eclaims.controller';

export class lightningOutEclaimsRouter {
  public static getRoutes(): express.Router {
    const router = express.Router();

    router
      .route('/GenerateEclaimsToken')
      .post((req: express.Request, res: express.Response) =>
        lightningOutEclaimsController.GenerateAccessToken(req, res)
      );

    router
      .route('/SalesforceDocsUploaded')
      .post((req: express.Request, res: express.Response) =>
        lightningOutEclaimsController.SalesforceDocsUploaded(req, res)
      );

    return router;
  }
}

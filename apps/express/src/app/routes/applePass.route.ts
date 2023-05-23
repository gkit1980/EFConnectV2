import * as express from 'express';
import applePassController from '../../controllers/applePass.controller';

export class applePassRouter {
  public static getRoutes(): express.Router {
    const router = express.Router();

    router
      .route('/CreateApplePass')
      .get((req: express.Request, res: express.Response) =>
        applePassController.CreateApplePass(req, res)
      );

    return router;
  }
}

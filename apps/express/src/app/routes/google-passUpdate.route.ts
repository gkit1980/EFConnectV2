import * as express from 'express';
import googlePassUpdateController from '../../controllers/googlePassUpdate.controller';

export class  googlePassUpdateRouter {
  public static getRoutes(): express.Router {
    const router = express.Router();

    router
      .route('/GooglePassUpdate')
      .post((req: express.Request, res: express.Response) =>
      googlePassUpdateController.GooglePassUpdate(req, res)
      );



    return router;
  }
}

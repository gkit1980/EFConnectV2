import * as express from 'express';
import oauth2AuthorizationController from '../../controllers/oauth2-authorization.controller';

export class oauth2AuthorizationRouter {
  public static getRoutes(): express.Router {
    const router = express.Router();

    router
      .route('/Oauth2GoogleAccess')
      .post((req: express.Request, res: express.Response) =>
      oauth2AuthorizationController.Oauth2GoogleAccess(req, res)
      );



    return router;
  }

  public static getRoutesUniversalLink(app: express.Application): express.Router {
		let router = express.Router();

		router.get('/',oauth2AuthorizationController.getUniversalLinkJson);
		return router;
	}
  public static getRouteRedirectToPlayStore(app: express.Application): express.Router {
		let router = express.Router();

    router.get('/',oauth2AuthorizationController.redirectToPlayStore);

		return router;
  }

  public static getRouteRedirectToAppStore(app: express.Application): express.Router {
		let router = express.Router();

    router.get('/',oauth2AuthorizationController.redirectToAppStore);

		return router;
  }

}

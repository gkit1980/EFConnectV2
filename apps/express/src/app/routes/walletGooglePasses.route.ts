import * as express from 'express';
import WalletGooglePassesController from '../../controllers/walletGooglePassesController';

export class WalletGooglePassesRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		router.get('/retrieveGooglePasses', this.checkAuthorization, WalletGooglePassesController.retrieveGooglePasses);
		return router;
	}

	private static checkAuthorization(req: any, res: any, next: any) {
		if (req.headers.authorization != 'Give me old Google Passes!') {
		  return res.status(401).send();
		}
		next()
	  }

}

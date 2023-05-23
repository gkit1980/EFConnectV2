import * as express from 'express';
import WalletStatisticsController from '../../controllers/walletStatistics.controller';

export class WalletStatisticsRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();

		router.get('/statistics', this.checkAuthorization, WalletStatisticsController.retrieveStatistics);

		return router;
	}

	private static checkAuthorization(req: any, res: any, next: any) {
		if (req.headers.authorization != 'Give me the statistics please!!!') {
		  return res.status(401).send();
		}
		next()
	  }

}

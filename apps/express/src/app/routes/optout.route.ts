import * as express from 'express';
import optOutController from '../../controllers/optout.controller'

export class optOutRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		router.post('/OptOut', optOutController.OptOut)
		return router;
	}
}

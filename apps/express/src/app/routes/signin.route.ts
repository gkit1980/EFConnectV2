import * as express from 'express';
import signinController from '../../controllers/signin.controller'

export class signInRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		router.post('/Login', signinController.Login)
		return router;
	}
}

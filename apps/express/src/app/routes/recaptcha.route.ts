import * as express from 'express';
import recaptchaController from '../../controllers/recaptcha.controller'

export class recaptchaRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		router.post('/recaptcha', recaptchaController.Recaptcha)
		return router;
	}
}

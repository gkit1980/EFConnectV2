import * as express from 'express';
import forgotstuffController from '../../controllers/forgotstuff.controller'

export class forgotRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
        router.post('/ForgetPassword', forgotstuffController.ForgetPassword)
        router.post('/VerifyForgetPassword', forgotstuffController.VerifyForgetPassword)
        router.post('/GetUserName', forgotstuffController.GetUserName)
		return router;
	}
}

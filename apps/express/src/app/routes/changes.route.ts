import * as express from 'express';
import changeMobileController from '../../controllers/changemobile.controller';
import changeEmailController from '../../controllers/changemail.controller';
import changePasswordController from '../../controllers/changepassword.controller';

export class changesRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();

		//--  email --//
		router.post('/ChangeEmail', changeEmailController.ChangeEmail);
		router.post('/VerifyChangeEmailSMS', changeEmailController.VerifyChangeEmailSMS);
		router.post('/VerifyChangeEmail', changeEmailController.VerifyChangeEmail);
		// -- password -- //
		router.post('/ChangePassword', changePasswordController.ChangePassword);
		// -- mobile -- //
		router.post('/VerifyChangeMobile', changeMobileController.VerifyChangeMobile);
		router.post('/ChangeMobile', changeMobileController.ChangeMobile);

		return router;
	}
}

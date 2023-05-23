import * as express from 'express';
import amendmentsOtpController from '../../controllers/amendmentsotp.controller'

export class amendmentsOtpRouter {
	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
        router.post('/SendOTP', amendmentsOtpController.SendOTP)
        router.post('/VerifyOTP', amendmentsOtpController.VerifyOTP)
		return router;
	}
}

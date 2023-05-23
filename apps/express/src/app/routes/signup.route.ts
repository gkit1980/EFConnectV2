import * as express from 'express';
import signupController from '../../controllers/signup.controller'

export class signUpRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		// methods for sign up
		router.post('/EmailExists', signupController.EmailExists)
		router.post('/InitSignUp', signupController.InitSignUp)
		router.post('/InitSignUpGroup', signupController.InitSignUpGroup)
		router.post('/GetRegistrationCode', signupController.GetRegistrationCode)
		router.post('/VerifyRegistrationCode', signupController.VerifyRegistrationCode)
		router.post('/VerifyMobile', signupController.VerifyMobile)
		router.post('/ReSendSMS', signupController.ReSendSMS)
		router.post('/VerifySMS', signupController.VerifySMS)
		router.post('/VerifyEmail', signupController.VerifyEmail)
		router.post('/CreateUser', signupController.CreateUser)
		router.post('/IsValidRegistrationCode', signupController.IsValidRegistrationCode)
		router.post('/UpdateUserGroup', signupController.UpdateUserGroup)

		// methods for sign up group
		router.post('/InsuredRegistration', signupController.InsuredRegistration)
		router.post('/Insured',signupController.Insured)

		return router;
	}
}

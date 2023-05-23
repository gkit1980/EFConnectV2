import * as express from 'express';
import AppleWalletController from '../../controllers/appleWallet.controller';

export class AppleWalletRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();

		router.get('/',AppleWalletController.getUniversalLinkJson);
		router.post('/log', AppleWalletController.registerLogs);
		router.post('/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber', this.checkAuthorization, AppleWalletController.registerPass);
		router.delete('/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber', this.checkAuthorization, AppleWalletController.deletePass);
		router.get('/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier', AppleWalletController.retrievePasses);
		router.get('/passes/:passTypeIdentifier/:serialNumber', this.checkAuthorization ,AppleWalletController.sendPass);

		return router;
	}

	private static checkAuthorization(req: any, res: any, next: any) {
		if (req.headers.authorization != 'ApplePass ZXVyb2xpZmVQYXNzOmV1cm9saWZlRkZI') {
		  return res.status(401).send();
		}
		next()
	  }

}

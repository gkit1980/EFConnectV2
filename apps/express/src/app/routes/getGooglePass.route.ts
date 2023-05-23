import * as express from 'express';
import GetGooglePassController from '../../controllers/getGooglePass.controller';

export class GetGooglePassRouter {

	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();

		router.get('/getGooglePass', this.checkAuthorization, GetGooglePassController.getGooglePass);

		return router;
	}

	private static checkAuthorization(req: any, res: any, next: any) {
		if (req.headers.authorization != 'Give me google pass please!!!') {
		  return res.status(401).send();
		}
		next()
	  }

}

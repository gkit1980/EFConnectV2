
import * as express from 'express';

export class ExternalRoutes {

	public static getRoutes(): express.Router {
		let router = express.Router();

		router.route('/').get(async (request, response) => {
			response.send("ok");
		});

		return router;
	}
}

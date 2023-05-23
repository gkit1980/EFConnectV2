import * as express from 'express';
import * as winston from "winston";
import { APIError} from '@impeo/exp-ice';
import { IceResourceBuilder } from '../../builders/ice-resource-builder';
import { ExpressApplicationOptions } from '../express-application-options';



export class ResourceRouter {


    public static getRoutes(app: express.Application,appOptions:ExpressApplicationOptions): express.Router {
        let router = express.Router();
        let expIce=app;
        router.route('/resources/:repo').get(async (request, response) => {
            response.setHeader('Cache-Control', 'max-age=0, must-revalidate');
            let resourceBuilder = new IceResourceBuilder(appOptions.iceRepoPath);
            try {
                let resources = await resourceBuilder.buildResourceRecipe();
                response.send({ success: true, data: resources });
            } catch (error) {
                let apiError = APIError.fromError(error);
                winston.loggers['application'].error("Error while executing service call", apiError);
                console.error(apiError);
                response.status(apiError.status).send(apiError);
            }
        });
        return router;
    }
}

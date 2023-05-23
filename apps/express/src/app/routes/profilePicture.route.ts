import * as express from 'express';
import profilePictureController from '../../controllers/profilePicture.controller'

export class profilePictureRouter {

    public static getRoutes(app: express.Application): express.Router {
        let router = express.Router();
        router.post('/UploadPhoto', profilePictureController.uploadPhoto)
        router.post('/GetPhoto', profilePictureController.getPhoto)
        return router;
    }
}

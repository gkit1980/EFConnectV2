import { Curl } from 'node-libcurl';
import * as express from 'express';
import Axios, * as axios from 'axios';


export class ContractIDRoute {


	public static getRoutes(app: express.Application): express.Router {
		let router = express.Router();
		let curl = new Curl();

		router.route('/').get(async (request, response) => {
            response.header('Access-Control-Allow-Origin', '*');

            Axios.post('https://login.microsoftonline.com/eurob2c.onmicrosoft.com/oauth2/v2.0/token?p=B2C_1_resource-owner&grant_type=password&client_id=668f01f7-aa44-41b0-9d99-4d7517c44296&username=vtsionis@hotmail.com&password=erbtest5%25&scope=https://eurob2c.onmicrosoft.com/tasks/read',{})
            .then((res:any) => {
                response.end(res.data.access_token);
            })
            .catch((error) => {
            })
            // res.send('Hello word');
            // curl.setOpt(Curl.option.URL, 'https://login.microsoftonline.com/eurob2c.onmicrosoft.com/oauth2/v2.0/token?p=B2C_1_resource-owner&grant_type=password&client_id=668f01f7-aa44-41b0-9d99-4d7517c44296&username=vtsionis@hotmail.com&password=erbtest5%&scope=https://eurob2c.onmicrosoft.com/tasks/read'+''+'https://eurob2c.onmicrosoft.com/tasks/write'+''+'offline_access');
            // curl.setOpt(Curl.option.HTTPAUTH, Curl.auth.XOAUTH2_BEARER);
            // curl.setOpt(Curl.option.VERBOSE, false);
            // curl.setOpt(Curl.option.HTTPHEADER, ['Content-Type: application/json']);
            // curl.setOpt(Curl.option.POSTFIELDS, JSON.stringify({
            //     "ContractID": 7825042,
            //     "LOBId": 5
            // }));
            // curl.setOpt(Curl.option.SSL_VERIFYPEER, 0);
            // curl.on('end', (statusCode: any, body: any, headers: any) => {
            //     console.info(statusCode);
            //     console.info('---');
            //     console.info(body);
            //     console.info('Success');
            //     response.end(body);
            //     //res.send(body);
            // });
            // curl.perform();
		});

		return router;
	}
}

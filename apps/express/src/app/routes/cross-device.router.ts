import * as express from 'express';
import * as path from 'path';
import * as asyncFs from 'async-file';
import * as _ from 'lodash';
import { HttpStatusCode } from '@impeo/exp-ice';
import * as lru from 'lru-cache';
import { stringify } from 'querystring';

interface CrossDeviceHeader {
  id: string;
  element: string;
}

//
//
export class CrossDeviceRouter {
  private cache: lru.Cache<string, any>;

  constructor() {
    let options: lru.Options = {
      max: 1000,
      maxAge: 1000 * 60,
    };

    this.cache = new lru<string, any>(options);
  }
  public getRoutes(): express.Router {
    let router = express.Router();

    router.route('/cross-device/').put(async (request, response) => {
      response.setHeader('Cache-Control', 'max-age=0, must-revalidate');

      //store in LRU
      const key = _.toArray(request.query).join('_');
      this.cache.set(key, request.body);
      response.send({ success: true });
    });

    router.route('/cross-device/').get(async (request, response) => {
      response.setHeader('Cache-Control', 'max-age=0, must-revalidate');

      //load and remove from LRU
      const key = _.toArray(request.query).join('_');
      const dataOut = this.cache.get(key);
      this.cache.del(key);

      //complete
      response.send(dataOut ?? {});
    });

    router.route('/cross-device/dump/').get(async (request, response) => {
      response.setHeader('Cache-Control', 'max-age=0, must-revalidate');

      //load and all keys and return
      //TODO: remove from production
      const dump = this.cache.dump();

      response.send(dump);
    });

    return router;
  }
}

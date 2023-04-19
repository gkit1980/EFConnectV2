import * as express from 'express';

export function createHeloWorldRouter(): express.Router {
  const router = express.Router();

  router.route('/hello-world').get(async (request, response) => {
    response.send({ message: 'Hello, world!' });
  });

  return router;
}

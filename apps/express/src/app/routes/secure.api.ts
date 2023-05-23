import * as express from 'express';
import { APIError } from '@impeo/exp-ice';

export class SecureAPI {
    public static secureHandler(): express.Handler {
        return (req, res, next) => {
            if (req.url.startsWith('/api')) {
                var cookie = req.cookies.ice_cookie;
                if (cookie === undefined) throw new APIError("Forbidden", 403);
            }
            next();
        };
    }
}
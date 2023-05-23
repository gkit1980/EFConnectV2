import * as express from 'express';
import * as path from 'path';
import * as asyncFs from 'async-file';
import { APIError } from '@impeo/exp-ice';

export class SecureVIRoutes {
    public static secureHandler(): express.Handler {
        return (req, res, next) => {
            let forbiddenUrlPrefixes = [
                "/log",
                "/api/v1/internal/git",
                "/api/v1/internal/work",
                "/api/v1/internal/repositories",
                "/api/v1/internal/repository"
            ];

            forbiddenUrlPrefixes.forEach(val => {
                if (req.url.startsWith(val)) {
                    throw new APIError("Forbidden", 403);
                }
            });
            next();
        };
    }
}
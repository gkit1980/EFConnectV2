import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Hashed filenames are the ones created by webpack
const isHashedFilename = (filename: string) =>
  /^[a-zA-Z0-9\-\_\.]+\.[a-fA-F0-9]{20}\.[a-zA-Z0-9\-\_\.]+$/.test(filename);

export function configureStaticFiles(app: express.Application, folder: string) {
  if (!fs.existsSync(folder)) {
    console.warn(
      `Folder '${folder}' does not exist when trying to configure ` +
        'static file serving in express.js'
    );
  }

  app.use(
    express.static(folder, {
      maxAge: '100d',
      setHeaders: (response, filepath, stat) => {
        // Static files not hashed by webpack, should be always 'fresh'
        const isHashed = isHashedFilename(path.basename(filepath));
        if (!isHashed) {
          response.setHeader('Cache-Control', 'max-age=0, must-revalidate');
        }
      }
    })
  );
}

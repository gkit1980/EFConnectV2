import * as express from 'express';
import * as path from 'path';
import { VisualIceOptions } from '../express-application-options';

export function configureVisualIce(app: express.Application, visualIceOptions: VisualIceOptions) {
  app.use(
    visualIceOptions.urlRelativePath,
    express.static(visualIceOptions.physicalAbsolutePath, {
      setHeaders: (response, filepath, stat) => {
        // index.html is the entry point for the application, so it should
        // never be cached to avoid updates to Visual ICE
        const isIndex = path.basename(filepath).toLowerCase() === 'index.html';
        if (isIndex) {
          response.setHeader('Cache-Control', 'max-age=0, must-revalidate');
        }
      }
    })
  );
  console.log(
    `Visual ICE available at '${visualIceOptions.urlRelativePath}'\n\tserved from '${visualIceOptions.physicalAbsolutePath}'\n`
  );
}

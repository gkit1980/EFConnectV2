import * as http from 'http';
import * as express from 'express';
import * as expressListEndpoints from 'express-list-endpoints';

import { configureStaticFiles } from './middleware/configure-static-files';
import { configureIceApplication } from './middleware/configure-ice-application';
import { configureErrorHandling } from './middleware/configure-error-handling';
import { configureRoutes } from './middleware/configure-routes';
import { configureCors } from './middleware/configure-cors';
import { configureCompression } from './middleware/configure-compression';
import { configureBodyParser } from './middleware/configure-body-parser';
import { ExpressApplicationOptions } from './express-application-options';
import { configureIcePrincipal } from './middleware/configure-ice-principal';
import { configureVisualIce } from './middleware/configure-visual-ice';
import { registerCustomRules } from '@insis-portal/ice-custom-rules';
import { registerCustomServerRules } from '@insis-portal/ice-custom-server-rules';

export class ExpressApplication {
  private app: express.Application = express();
  private server: http.Server;

  constructor(private appOptions: ExpressApplicationOptions) {}

  start() {
    /**
     * TIP: Here we register custom rules into express application, this will allow
     * the execution of custom rules on the server.
     */
    registerCustomRules();
    registerCustomServerRules();

    configureCompression(this.app);

    configureStaticFiles(this.app, this.appOptions.wwwRootPath);

    // Needed to parsing JSON request body
    configureBodyParser(this.app);

    configureIcePrincipal(this.app);

    configureIceApplication(this.app, this.appOptions);

    if (this.appOptions.visualIce) {
      configureVisualIce(this.app, this.appOptions.visualIce);
    }

    configureRoutes(this.app);

    configureCors(this.app);

    configureErrorHandling(this.app);

    this.handleProcessSignals();

    this.dumpRoutes();

    this.createListeningServer();
  }

  private handleProcessSignals() {
    process.on('SIGINT', () => {
      console.warn('received SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.warn('received SIGTERM');
      process.exit(0);
    });

    process.on('exit', () => {
      console.warn('exiting S-ICE');

      if (this.server) {
        this.server.close();
      }
    });
  }

  private createListeningServer() {
    const listener = async () => {
      console.log(`
S-ICE started \x1b[36m http://localhost:${this.appOptions.serverPort} \x1b[0m
  CWD ${process.cwd()}
  ARG ${process.argv[process.argv.length - 1]}
  NODE_ENV ${process.env.NODE_ENV}
`);
    };

    this.server = http.createServer(this.app).listen(this.appOptions.serverPort, listener);
  }

  private dumpRoutes() {
    const endpointLines = (<any[]>expressListEndpoints(this.app)).map(
      (endpoint) => `\t${endpoint.methods}:\t${endpoint.path}`
    );
    console.log(`Custom routes:\n${endpointLines.join('\n')}\n`);
  }
}

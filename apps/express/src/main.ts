import * as path from 'path';
import * as cluster from 'cluster';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { cpus } from 'os';
import { ExpressApplication } from './app/express-application';
import { ExpressApplicationOptions, VisualIceOptions } from './app/express-application-options';

/**
 * TIP: You can create a file `user.env` with custom env variables only for you.
 * This file is ignored and won't be checked in to the git repository.
 */

//loadEnvFile('process.env');

/**
 * TIP: Put all development-related env variables in `development.env`.
 * The file will not be included in the final Docker image.
 */

//loadEnvFile('development.env');

if (process.env.NODE_ENV== 'development' || process.env.NODE_ENV == null || process.env.NODE_ENV==undefined) {
  loadEnvFile('development.env');
} else if(process.env.NODE_ENV== 'production')
{
  loadEnvFile('process.env');
}

const numCPUs = cpus().length;
const numInstances = process.env.ENABLE_NODE_CLUSTER === 'true' ? numCPUs : 1;

console.log('Starting express ...');
console.log('Root path: ', __dirname);

startWebServer(numInstances);

function startApp() {
  const enableVisualIce = process.env.ENABLE_VISUAL_ICE === 'true';
  const visualIceOptions: VisualIceOptions = enableVisualIce
    ? {
        physicalAbsolutePath: path.resolve(
          __dirname,
          process.env.VISUAL_ICE_PATH || '../visual-ice/app'
        ),
        /**
         * TIP: Change here if you want to serve Visual ICE on a different path
         */
        urlRelativePath: '/visual-ice',
      }
    : null;

  const appOptions: ExpressApplicationOptions = {
    wwwRootPath: path.resolve(__dirname, '../angular'),
    visualIce: visualIceOptions,
    serverPort: +(process.env.PORT || 3000),
    applicationRoot: __dirname,
    iceRepoPath: path.resolve(__dirname, process.env.ICE_REPO_PATH || '../../../ice-repo'),
    publicPath: path.resolve(__dirname, './assets/public'),
    sIceAssetsPath: path.resolve(__dirname, './assets/exp-ice'),
    descriptorsPaths: [
      path.resolve(__dirname, './assets/documentation'),
      path.resolve(__dirname, './assets/ice-core'),
      path.resolve(__dirname, './assets/ice-server-rules'),
      path.resolve(__dirname, './assets/ice-insurance-rules'),
      path.resolve(__dirname, './assets/insis-server-rules'),
      path.resolve(__dirname, './assets'),

      /**
       * TIP: Register your custom descriptors here. Important !!! the URL should
       * point only to the root folder which inside it self should contain '/descriptors' folder.
       *
       * CORRECT: path.resolve(__dirname, './my_custom_folder')
       * WRONG: path.resolve(__dirname, './my_custom_folder/descriptors')
       *
       */
    ],
    integrationsLogPath:
      process.env.INTEGRATIONS_LOG_PATH != null
        ? path.resolve(__dirname, process.env.INTEGRATIONS_LOG_PATH)
        : undefined,
    logIntegrationsToFile: process.env.LOG_INTEGRATIONS_TO_FILE == 'true' ? true : false,
  };
  const app = new ExpressApplication(appOptions);
  app.start();
}

function loadEnvFile(filename: string) {
  const filePath = path.resolve(__dirname, '../../../apps/express/src/', filename);
  if (fs.existsSync(filePath)) {
    console.log('Loading env file: ', filePath);
    dotenv.config({ path: filePath });
  }
}

function startWebServer(activeNodes: number) {
  if (activeNodes <= 1) {
    startApp();
  } else {
    if (cluster.isMaster) {
      for (let i = 0; i < activeNodes; i++) {
        cluster.fork();
      }

      cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
      });

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
        console.log('Starting a new worker...');
        cluster.fork();
      });
    } else {
      startApp();
    }
  }
}

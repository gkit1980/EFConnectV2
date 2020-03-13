# ICE Portal Workspace

This repository contains a template for creating new portals based on ICE.

## Apps & libs

The workspace containts the following applications:

- _angular_ - the front-end for the portal
- _express_ - the back-end for the portal

Visual ICE is distributed as an individual application. It is served from `node_modules/@impeo/visual-ice` during development and copied over to `dist/apps/visual-ice` for production (see [Environment variables](#environment-variables) below).

## Build & run

For development, you can run

```
npm start
```

For production, the following command will build all applications in the `dist` folder:

```
npm run build
```

You can then run express.js app:

```
node dist/apps/express/main.js
```

## Debug

### Debug ICE Foundation sources

To build the portal using ICE Foundation sources, run the following command:

```
node ./tools/enable-ice-foundation-sources.js
```

When you build later, it will build against ICE Foundation sources, rather than using the npm packages.

### Environment variables

Environment variables are used to affect some of the settings of the portal. They are used when starting S-ICE in `apps/express/src/main.ts`. All environment variables have default values, which can be overriden for development or production.

- **ICE_REPO_PATH** determines the location of the ICE repo. It can be a relative/absolute path on the file system. By default, the ICE repo is part of the project, under `ice-repo` folder.
- **WWW_ROOT_PATH** determines the location of the Angular front-end project. It can be a relative/absolute path on the file system. By default, it resides in `dist/apps/angular`.
- **ENABLE_VISUAL_ICE** determines if Visual ICE is enabled. By default, it is set to `true`.
- **VISUAL_ICE_PATH** determines the location of Visual ICE. It can be a relative/absolute path on the file system. For development, it is consumed from `node_modules/@impeo/visual-ice`, while for distributions, it is copied over to `dist/apps/visual-ice`.
- **ENABLE_NODE_CLUSTER** determines whether to run S-ICE in a clustered mode. By default, it is `false`.
- **PORT** determines S-ICE port. By default, it uses port `3000`.

#### Overriding environment variables for development

Overriding environment variables for development happens via `*.env` files.

- `apps/express/src/development.env` is included in the project and will be applied for every developer
- `apps/express/src/user.env` is not included in the project (it is in `.gitignore`), but can be created manually and will only be applied for the current developer

#### Overriding environment variables for production

Default values are defines in `Dockerfile`, but can be overriden when the Docker container is being run.

### CI pipeline

The workspace contains a build pipeline in the `.azuredevops` folder, which can be created in Azure DevOps. When you do it, you will be asked to authorize access to external resources, like agent pool and docker registry.

## Using tips

Comments starting with `TIP:` point to places, where you can apply changes to the concrete portal implementations.

## Workspace

The workspace is created using the following sequence of actions:

### Create initial structure using Nx

```
npx create-nx-workspace@latest insis-portal --preset=empty --cli=angular
```

### Add Angular capabilities

```
npx ng add @nrwl/angular --unitTestRunner=jest --e2eTestRunner=cypress
```

### Create Angular application for the portal front-end

```
npx ng g @nrwl/angular:application angular --routing --style=scss --directory='' --e2eTestRunner=none --prefix=app
```

### Add express.js capabilities

```
npx ng add @nrwl/express
```

### Create express.js application for the portal back-end

```
npx ng g @nrwl/express:application express --frontendProject=angular --directory='' --unitTestRunner=jest
```

### Adding Library to Workspace

By default all NX Libraries are not publishable, you will need to add '--publishable' parameter in order to get a library with package.json.

- **Angular Library** <br />

  ```
  ng generate @nrwl/angular:library test-library --style=scss
  ```

- **None Angular Library** <br />

  ```
  ng generate @nrwl/workspace:library test-library
  ```

- **Express Library** <br />

  ```
  ng generate @nrwl/node:library test-library
  ```

### Configure ICE

- You need to manually install npm dependencies
- You need to pull the latest ICE packages and place them in `ice-packages`

#### Create Angular application for Visual ICE

```
npx ng g @nrwl/angular:application visual-ice --routing --style=scss --directory='' --e2eTestRunner=none --skipTests --prefix=vi
```

## Known issues

**extractLicenses causes error for Node.js builder** - when fixed, change `extractLicenses` to `true` for the express project in `angular.json`  
https://github.com/nrwl/nx/issues/2107

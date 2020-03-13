/**
 * Enables building of ICE Foundation sources directly, rather than using them
 * via npm packages.
 */

const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
const rimraf = require('rimraf');

const iceFoundationRelativePath = '../ice-foundation';
const iceFoundationAbsolutePath = path.resolve(__dirname, '../', iceFoundationRelativePath);

console.log('Enable building of ICE Foundation sources directly');
console.log('\tICE Foundation:', iceFoundationAbsolutePath);

function registerIceFoundationLibs(paths, ...packagePatterns) {
  packagePatterns.forEach(packagePattern => {
    const lib = packagePattern.substring(packagePattern.indexOf('@impeo/') + 7);
    paths[packagePattern] = [`${iceFoundationRelativePath}/libs/${lib}/src/index.ts`];
  });
}

function registerDependentLibs(paths, ...packagePatterns) {
  packagePatterns.forEach(packagePattern => {
    paths[packagePattern] = [`${iceFoundationRelativePath}/node_modules/${packagePattern}`];
  });
}

console.log('\tOverwriting ICE Foundation paths in tsconfig.json');

const tsConfigPath = path.resolve(__dirname, '../tsconfig.json');
const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
const paths = tsConfig.compilerOptions.paths;

registerIceFoundationLibs(
  paths,
  '@impeo/ice-core',
  '@impeo/ice-core/default-rules',
  '@impeo/ice-core/default-rules/rules/*',
  '@impeo/ice-insurance-rules',
  '@impeo/ice-insurance-rules/rules/*',
  '@impeo/insis-server-rules',
  '@impeo/insis-server-rules/rules/*',
  '@impeo/ng-ice',
  '@impeo/exp-ice',
  '@impeo/ice-tea'
);

registerDependentLibs(
  paths,
  '@angular/*',
  'rxjs',
  'rxjs/operators',
  'rxjs/testing',
  'rxjs/ajax',
  'rxjs/webSocket',
  'rxjs/fetch',
  'rxjs/internal/*'
);

const updatedTsConfigJson = prettier.format(JSON.stringify(tsConfig), { parser: 'json-stringify' });
fs.writeFileSync(tsConfigPath, updatedTsConfigJson, 'utf-8');

console.log(
  '\tDeleting @impeo/* packages from node_modules, so that they are requested from ICE Foundation'
);

/**
 * ng-ice is only allowed to stay, because of ng-ice.mixin.scss import. I cannot hack the
 * Angular webpack to use different path defined in tsconfig.json
 */
const iceFoundationIgnorePackages = ['dmn-eval-js', 'visual-ice', 'documentation', 'ng-ice'];
const iceFoundationNodeModulesPath = path.resolve(__dirname, '../node_modules/@impeo');

fs.readdirSync(iceFoundationNodeModulesPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !iceFoundationIgnorePackages.includes(dirent.name))
  .forEach(dirent => rimraf.sync(path.resolve(iceFoundationNodeModulesPath, dirent.name)));

console.log('\tDone\n');
console.log('\tNOTE: To undo these changes:');
console.log('\t\t* npm run install-ice-packages');
console.log('\t\t* git checkout tsconfig.json\n');

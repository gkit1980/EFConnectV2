/**
 * When we want to test a single file from the workspace, we have to
 * find its corresponding project in angular.json, so that we can
 * reuse the configured test runner. This scripts accepts a relative
 * path to a file and tries to find its corresponding project. It
 * then runs `ng test PROJECT`
 *
 * @param {string} relativeTestFile - the relative path to the test/spec file
 * @param {...string} additionalCLIParams - additional CLI params
 */

const cli = require('@angular/cli');
const fs = require('fs');
const path = require('path');

let [, , relativeTestFile, ...additionalCLIParams] = process.argv;
if (!relativeTestFile) {
  throw 'No relative path to a test file provided';
}

// Convert \ to / for Windows users
relativeTestFile = relativeTestFile.replace('\\', '/');

// Remove leading /, if any
if (relativeTestFile.startsWith('/')) {
  relativeTestFile = relativeTestFile.substring(1);
}

const { projects } = JSON.parse(fs.readFileSync('./angular.json', 'utf8'));
const project = Object.keys(projects).find(p => relativeTestFile.startsWith(projects[p].root));
if (!project) {
  throw `Cannot find Angular project for '${relativeTestFile}'`;
}

cli
  .default({
    cliArgs: [
      'test',
      project,
      `--testFile=${path.basename(relativeTestFile)}`,
      '--codeCoverage=false',
      '--runInBand=true',
      '--passWithNoTests=true',
      '--reporters=default',
      ...additionalCLIParams
    ]
  })
  .then(exitCode => {
    process.exit(exitCode);
  });

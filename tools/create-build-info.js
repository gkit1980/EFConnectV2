/**
 * Creates a JSON file with information about the current build.
 * The information contains:
 * - the full branch name
 * - the abbreviated SHA of the last commit
 * - the date of the last commit
 * - the build number when it runs on the build server
 */

const getRepoInfo = require('git-repo-info');
const path = require('path');
const { writeFileSync } = require('fs');

function createBuildInfo() {
  const gitInfo = getRepoInfo();
  return {
    branch: process.env.BUILD_SOURCEBRANCH
      ? process.env.BUILD_SOURCEBRANCH.replace('refs/heads/', '')
      : gitInfo.branch,
    commit: gitInfo.abbreviatedSha,
    date: gitInfo.committerDate || new Date(),
    buildNumber: process.env.BUILD_BUILDNUMBER || '0.0.1'
  };
}

function printToConsole(buildInfo) {
  Object.entries(buildInfo).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
}

function writeToFile(buildInfo, filePath) {
  const jsonString = JSON.stringify(buildInfo, null, 2);
  writeFileSync(filePath, jsonString);
}

console.log('Creating build info 📁');
const buildInfo = createBuildInfo();
printToConsole(buildInfo);
writeToFile(buildInfo, path.resolve(__dirname, '../build-info.json'));

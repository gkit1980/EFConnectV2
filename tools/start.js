const concurrently = require('concurrently');
const fs = require('fs');
const path = require('path');

const packagejsonFilePath = path.resolve(__dirname, '../package.json');
const { name } = JSON.parse(
  fs.readFileSync(packagejsonFilePath, { encoding: 'utf-8' })
);
console.log(`Starting ${name} 🚀`);

concurrently(
  [
    { command: 'ng serve angular', prefixColor: 'blue', name: 'ng' },
    { command: 'ng serve express', prefixColor: 'yellow', name: 'ex' }
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3
  }
);

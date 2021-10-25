const fs = require('fs');
fs.readFile('./resources.yml', null, (error, data) => {
  const fileContent = data.toString();
  const output = [];
  fileContent.split('\n').forEach(line => {
    output.push(line);
    if (!line.includes('de:')) return;
    const amountOfWhiteSpace = line.length - line.trimLeft().length;
    output.push(' '.repeat(amountOfWhiteSpace) + 'nl: \'\'');
  });

  fs.writeFile('./resources-new.yml', output.join('\n'), {}, () => {});
});

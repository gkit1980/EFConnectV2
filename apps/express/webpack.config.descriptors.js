const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const yml = require('js-yaml');
const lodash = require('lodash');

function readdirDirsSync(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());
}

function readdirFilesSync(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).filter((dirent) => dirent.isFile());
}

function tryResolveAvailableEntitiesAndAspects() {
  try {
    const iceCoreFolder = path.dirname(require.resolve('@impeo/ice-core'));
    const defaultRulesFolder = path.resolve(iceCoreFolder, 'descriptors/rules');

    return readdirDirsSync(defaultRulesFolder).reduce(
      (result, dirent) =>
        Object.assign(result, {
          [dirent.name]: readdirFilesSync(path.resolve(defaultRulesFolder, dirent.name)).map(
            (x) => {
              // Descriptor entity folders are in camelCase,
              // but the source entity folders are in kebab-case.
              // So we transform from camelCase to kebab-case.
              return path
                .basename(x.name, path.extname(x.name))
                .replace(/([A-Z]+)/g, '-$1')
                .toLowerCase();
            }
          ),
        }),
      {}
    );
  } catch (err) {
    console.warn('Error when trying to resolve available entities and apsects', err);
    return null;
  }
}

const availableEntitiesAndAspects = tryResolveAvailableEntitiesAndAspects();

function getDescriptorFiles(sourceFolder) {
  return getFolderFiles(sourceFolder).filter((file) => path.extname(file) === '.yml');
}

function getFolderFiles(folder) {
  const files = [];
  fs.readdirSync(folder, { withFileTypes: true }).forEach((file) => {
    const absolutePath = path.join(folder, file.name);

    if (file.isDirectory()) return files.push(...getFolderFiles(absolutePath));

    files.push(absolutePath);
  });

  return files;
}

function extractEntityAndAspectFolders(folder) {
  const pathParts = path.dirname(folder).split(path.sep);
  const rulesPartIdx = pathParts.indexOf('rules');
  if (rulesPartIdx < 0 || pathParts.length <= rulesPartIdx + 2)
    throw new Error(
      'All rules must follow the following folder structure: rules/ENTITY-rules/ASPECT/*\n' +
        `Rule '${folder}' does not`
    );

  const entityFolder = pathParts[rulesPartIdx + 1];
  const aspectFolder = pathParts[rulesPartIdx + 2];

  // Validate entity and aspect folders
  if (availableEntitiesAndAspects) {
    if (!(entityFolder in availableEntitiesAndAspects))
      throw new Error(`Folder '${entityFolder}' is not a valid entity folder`);

    /*if (!availableEntitiesAndAspects[entityFolder].includes(aspectFolder))
      throw new Error(
        `Folder '${aspectFolder}' is not a valid aspect folder under '${entityFolder}'`
      );*/
  }

  return [entityFolder, aspectFolder];
}

function loadYamlContent(filePath) {
  try {
    return yml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.warn(`Error: [${filePath}] - ${error}`);
  }
}

function saveYamlContent(filePath, content) {
  const dir = path.dirname(filePath);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return fs.writeFileSync(filePath, yml.dump(content));
  } catch (error) {
    console.warn(`Error: [${filePath}] - ${error}`);
  }
}

class MergeRuleDescriptorsPlugin {
  constructor(inputFolders, outputFolder) {
    this.inputFolders = inputFolders;
    this.outputFolder = outputFolder;
  }

  apply(compiler) {
    const plugin = { name: 'MergeCustomDescriptors' };

    compiler.hooks.emit.tap(plugin, (compilation) => {
      return this.emitHookHandler(compilation);
    });
  }

  emitHookHandler(compilation) {
    const descriptorFiles = this.inputFolders.reduce((all, folder) => {
      const files = getDescriptorFiles(folder);
      all = all.concat(files);
      return all;
    }, []);

    const allDescriptors = {};

    descriptorFiles.forEach((file) => {
      const ymlContent = loadYamlContent(file);

      const [entityFolder, aspectFolder] = extractEntityAndAspectFolders(file);
      const formattedAspectFolder = this.reformatAspectFolderName(aspectFolder);
      const mergedAspectRulesJSON =
        lodash.get(allDescriptors, [entityFolder, formattedAspectFolder]) || {};
      lodash.merge(mergedAspectRulesJSON, ymlContent);
      lodash.set(allDescriptors, [entityFolder, formattedAspectFolder], mergedAspectRulesJSON);
    });

    const entitieFolders = lodash.keys(allDescriptors);

    entitieFolders.forEach((entityFolder) => {
      const aspectsFiles = lodash.keys(lodash.get(allDescriptors, entityFolder));
      aspectsFiles.forEach((aspectName) => {
        const aspectJSON = lodash.get(allDescriptors, [entityFolder, aspectName]);
        const outputFile = path.resolve(this.outputFolder, entityFolder, aspectName) + '.yml';
        saveYamlContent(outputFile, aspectJSON);
      });
    });
    return true;
  }

  /**
   * Formats something like `view-mode` into `viewMode`. The former is
   * used in the code, but the latter is used to store the final
   * descriptors.
   */
  reformatAspectFolderName(folder) {
    const parts = folder.split('-').map((part, index) => {
      if (index > 0) part = lodash.capitalize(part);
      return part;
    });

    return parts.join('');
  }
}

module.exports = function (webpackConfig) {
  const componentRulesInputFolder = path.resolve(
    __dirname,
    '../../libs/ice-custom-components/src/lib/components'
  );

  const rulesInputFolder = path.resolve(__dirname, '../../libs/ice-custom-rules/src/lib/rules');

  const serverRulesInputFolder = path.resolve(
    __dirname,
    '../../libs/ice-custom-server-rules/src/lib/rules'
  );

  const componentDescriptorsOutputFolder = path.join(
    webpackConfig.output.path,
    'assets/descriptors/components'
  );

  const ruleDescriptorsOutputFolder = path.join(
    webpackConfig.output.path,
    'assets/descriptors/rules'
  );

  // We do this to allow putting the descriptor files next to the custom components. The
  // descriptor of the components will be put into dist/app/express/assets/descriptors/components/element.components
  webpackConfig.plugins.push(
    new CopyWebpackPlugin(
      fs
        .readdirSync(componentRulesInputFolder, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({
          from: path.join(componentRulesInputFolder, dirent.name, '**/*.yml'),
          to: path.join(componentDescriptorsOutputFolder, dirent.name),
          toType: 'dir',
          flatten: true,
        }))
    ),
    new MergeRuleDescriptorsPlugin(
      [rulesInputFolder, serverRulesInputFolder],
      ruleDescriptorsOutputFolder
    )
  );

  return webpackConfig;
};

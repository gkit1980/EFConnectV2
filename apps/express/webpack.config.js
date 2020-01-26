const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const yml = require("js-yaml");
const lodash = require("lodash");

const ICE_DEFAULT_MODULE_FOLDER = path.dirname(require.resolve('@impeo/ice-core'));
const ICE_DEFAULT_DESCRIPTORS_RULES_FOLDER = path.resolve(ICE_DEFAULT_MODULE_FOLDER, 'descriptors/rules');
const ICE_AVAILABLE_ENTITIES_FOLDERS = fs.readdirSync(ICE_DEFAULT_DESCRIPTORS_RULES_FOLDER, {withFileTypes: true})
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

function getDescriptorFiles(sourceFolder) {
    const descriptorFiles = getFolderFiles(sourceFolder)
        .filter(file => path.extname(file) === '.yml');

    return descriptorFiles;
}

function getFolderFiles(folder) {
    const files = [];
    fs.readdirSync(folder, {withFileTypes: true}).forEach(file => {
        const absolutePath = path.join(folder, file.name);

        if (file.isDirectory())
            return files.push(...getFolderFiles(absolutePath));

        files.push(absolutePath);
    });

    return files;
}

function getDirectories(folder) {
    return fs.readdirSync(folder, {withFileTypes: true})
        .filter(dir => dir.isDirectory());
}

/**
 * Will return a valid entity folder name.
 * @param folder
 * @returns {T}
 */
function extractEntityFolder(folder) {
    const pathParts = path.dirname(folder).split(path.sep);

    const entityFolder = pathParts.filter(part => getDefaultAvailableEntities().includes(part));

    if (!entityFolder || !entityFolder.length) {
        console.error('Not found valid entity folder inside path:', folder);
        return;
    }

    return entityFolder.pop();
}


/**
 * Will extract valid aspect folder name. This name will be latter used to bundle all the descriptors
 * for this aspect into a single yml file.
 *
 * @param folder
 * @returns {T}
 */
function extractAspectFolder(folder) {
    const entityFolder = extractEntityFolder(folder);
    const pathParts = path.dirname(folder).split(path.sep);

    const aspectFolder = pathParts.filter(part => getDefaultAvailableAspects(entityFolder).includes(part));

    if (!aspectFolder || !aspectFolder.length) {
        console.error('Not found valid aspect folder inside path:', folder);
        return;
    }

    return aspectFolder.pop();
}


/**
 * Return a list of available entity folder names.
 * They are extracted from: '@impeo/ice-core/descriptors/rules/**'
 *
 *
 * @param folder
 * @returns {*}
 */
function getDefaultAvailableEntities() {
    return ICE_AVAILABLE_ENTITIES_FOLDERS || [];
}

/**
 * Will return list of aspect folder names available for the provided entity.
 * They are extracted from: '@impeo/ice-core/descriptors/rules/[entityFolder]/**'
 *
 * @param folder
 * @returns {T[] | Array}
 */
function getDefaultAvailableAspects(entityFolder) {

    const availableAspects = getFolderFiles(path.resolve(ICE_DEFAULT_DESCRIPTORS_RULES_FOLDER, entityFolder))
        .filter(filename => path.extname(filename) === ".yml")
        .map(fileName => path.basename(fileName, ".yml"))
        .map(fileName => {
            // replace viewMode to view-Mode
            return fileName.replace(/([A-Z]+)/g, "-$1");
        })
        .map(fileName => {
            // convert view-Mode to view-mode
            const name = fileName.split('-').map(part => part.toLowerCase()).join('-');
            return name
        });

    if (!availableAspects && !availableAspects.length) {
        console.error("No aspects found inside folder:", path.resolve(ICE_DEFAULT_DESCRIPTORS_RULES_FOLDER, entityFolder));
        return [];
    }

    return availableAspects
}

function loadYamlContent(filePath) {
    try {
        return yml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.warn(`Error: [${filePath}] - ${error}`);
    }
}

//
//
function saveYamlContent(filePath, content) {
    const dir = path.dirname(filePath);
    try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
        return fs.writeFileSync(filePath, yml.dump(content));
    } catch (error) {
        console.warn(`Error: [${filePath}] - ${error}`);
    }
}


class MergeRuleDescriptorsPlugin {

    constructor(inputFolder, outputFolder) {
        this.inputFolder = inputFolder;
        this.outputFolder = outputFolder;
    }

    apply(compiler) {

        const plugin = {name: "MergeCustomDescriptors"};

        compiler.hooks.emit.tap(plugin, (compilation) => {
            return this.emitHookHandler(compilation);
        });
    }

    emitHookHandler(compilation) {

        const descriptorFiles = getDescriptorFiles(this.inputFolder);
        const allDescriptors = {};

        descriptorFiles.forEach(file => {
            const ymlContent = loadYamlContent(file);
            const entityFolder = extractEntityFolder(file);
            const aspectFolder = this.reformatAspectFolderName(extractAspectFolder(file));
            const mergedAspectRulesJSON = lodash.get(allDescriptors, [entityFolder, aspectFolder]) || {};
            lodash.merge(mergedAspectRulesJSON, ymlContent);
            lodash.set(allDescriptors, [entityFolder, aspectFolder], mergedAspectRulesJSON);
        });

        const entitieFolders = lodash.keys(allDescriptors);

        entitieFolders.forEach(entityFolder => {
            const aspectsFiles = lodash.keys(lodash.get(allDescriptors, entityFolder));
            aspectsFiles.forEach(aspectName => {
                const aspectJSON = lodash.get(allDescriptors, [entityFolder, aspectName]);
                const outputFile = path.resolve(this.outputFolder, entityFolder, aspectName) + '.yml';
                saveYamlContent(outputFile, aspectJSON);
            });
        });
        return true;
    }

    reformatAspectFolderName(folder) {
        const parts = folder.split("-").map((part, index) => {
            if (index > 0) part = lodash.capitalize(part);
            return part;
        });

        return parts.join('');
    }
}


module.exports = function (webpackConfig) {

    const componentRulesInputFolder = path.resolve(__dirname,
        "../../libs/ice-custom-components/src/lib/components");

    const rulesInputFolder = path.resolve(__dirname,
        "../../libs/ice-custom-rules/src/lib/rules");

    const serverRulesInputFolder = path.resolve(__dirname,
        "../../libs/ice-custom-server-rules/src/lib/rules");

    const componentDescriptorsOutputFolder = path.join(webpackConfig.output.path,
        "assets/descriptors/components");

    const ruleDescriptorsOutputFolder = path.join(webpackConfig.output.path,
        "assets/descriptors/rules");

    // We do this to allow putting the descriptor files next to the custom components. The
    // descriptor of the components will be put into dist/app/express/assets/descriptors/components/element.components
    webpackConfig.plugins.push(
        new CopyWebpackPlugin(
            fs.readdirSync(componentRulesInputFolder, {withFileTypes: true})
                .filter(dirent => dirent.isDirectory())
                .map(dirent => ({
                    from: path.join(componentRulesInputFolder, dirent.name, "**/*.yml"),
                    to: path.join(componentDescriptorsOutputFolder, dirent.name),
                    toType: "dir",
                    flatten: true
                }))
        ),
        new MergeRuleDescriptorsPlugin(rulesInputFolder, ruleDescriptorsOutputFolder),
        new MergeRuleDescriptorsPlugin(serverRulesInputFolder, ruleDescriptorsOutputFolder)
    );

    return webpackConfig;
};

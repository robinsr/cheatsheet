const packager = require('electron-packager');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

async function buildElectronApp(options) {
  const appPaths = await packager(options)
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}

const buildOpts = {
    dir: '.',
    out: 'dist_electron',
    name: 'Cheatsheet',
    platform: 'darwin',
    arch: 'x64',
    overwrite: true,
    prune: true,
    asar: false,
    afterCopy: [
        cleanSources
    ]
}

buildElectronApp(buildOpts);

// remove folders & files not to be included in the app
function cleanSources(buildPath, electronVersion, platform, arch, callback) {
    console.log('Removing unused project files and folders');

    const includes = [
        'dist',
        'src',
        'package.json',
        'node_modules'
    ];

    // throw new Error(buildPath);
    fs.readdirSync(buildPath).filter((item) => {
        return includes.indexOf(item) === -1;
    }).forEach((item) => {
        rimraf.sync(path.join(buildPath, item));
    });

    console.log('Removing unused node_modules');

    const module_path = path.resolve(buildPath, 'node_modules');

    // Remove some of the largest node_modules
    const exclude_modules = [
        'react', 'js-yaml', 'utrie', 'dom-to-svg', 'js-extra', 'css-line-break', 'mdn-data', 'csso', 'source-map',
        'mobx-react-lite', 'css-tree', 'mobx-state-tree', 'svgo-browser', 'mobx', 'react-dom', 'html2canvas',
        'es-abstract', 'lodash', 'react-icons',
    ];

    fs.readdirSync(module_path).filter((item) => {
        return exclude_modules.indexOf(item) > -1;
    }).forEach((item) => {
        rimraf.sync(path.join(module_path, item));
    });

    callback();
}
const packager = require('electron-packager');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');


async function buildElectronApp(options) {
  const appPaths = await packager(options)
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}

const includes = [
    'dist',
    'src/main',
    'package\\.json',
    'node_modules\/electron-active-window',
    'node_modules\/gm',
];

const r = new RegExp('^(' + includes.join('|') + ').*$')

const buildOpts = {
    dir: '.',
    out: 'dist_electron',
    name: 'Cheatsheet',
    platform: 'darwin',
    arch: 'x64',
    overwrite: true,
    prune: true,
    //asar: true,
    // afterPrune: [
    //     cleanSources
    // ]
}

buildElectronApp(buildOpts);

// TODO; remove
// remove folders & files not to be included in the app
function cleanSources(buildPath, electronVersion, platform, arch, callback) {
    console.log(buildPath);

    // throw new Error(buildPath);
    fs.readdirSync(buildPath).filter((item) => {
        return !r.test(item);
    }).forEach((item) => {
        rimraf.sync(path.join(buildPath, item));
    });

    console.log('removed folders & files not to be included in the app');
    callback();
}
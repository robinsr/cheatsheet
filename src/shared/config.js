const packageConfig = require('../../package.json');

/** @typedef {"dev"|"prod"} ConfigStage */

/**
 * Various config values
 * @typedef {object }StageConfig
 * @property {string} name
 * @property {boolean} saveEnabled
 * @property {string} profile
 * @property {string} saveKey
 * @property {debug} boolean
 * @property {{width: number, height: number}} window
 */

const stage = process.env.ELECTRON_DEV === 'true' ? 'dev' : 'prod';

const AppConfig = {
    dev: {
        name: packageConfig.productName,
        saveEnabled: true,
        saveDir: 'snapshots',
        profile: 'dev',
        debug: true,
        window: {
            width: 2000, height: 1600
        }
    },
    prod:  {
        name: packageConfig.productName,
        saveEnabled: false,
        saveDir: 'snapshots',
        profile: 'prod',
        debug: false,
        window: {
            width: 450, height: 980
        }
    }
}

/** @type {ConfigStage} */
module.exports.stage = stage;

/** @type StageConfig */
module.exports.conf = AppConfig[stage];

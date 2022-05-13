const packageConfig = require('../../package.json');

/** @typedef {"dev"|"prod"} ConfigStage */

/**
 * Various config values
 * @typedef {object} StageConfig
 * @property {string} name
 * @property {boolean} saveEnabled
 * @property {string} profile
 * @property {string} saveKey
 * @property {debug} boolean
 * @property {{width: number, height: number}} window
 */

/**
 * Settings for BrowserWindow
 * @typedef {object} WindowStageOverrides
 * @property {number} width     - startup X dimension, in px
 * @property {number} height    - startup Y dimension, in px
 * @property {number} minWidth  - minimum X dimension, in px
 * @property {number} minHeight - minimum Y dimension, in px
 */

const stage = process.env.ELECTRON_DEV === 'true' ? 'dev' : 'prod';

const minimums = {
    minWidth: 400,
    minHeight: 800
}

/** @type {Object.<any, StageConfig>} */
const AppConfig = {
    dev: {
        name: packageConfig.productName,
        saveEnabled: true,
        saveDir: 'snapshots',
        profile: 'dev',
        debug: true,
        window: Object.assign({}, minimums, {
            width: 2000,
            height: 1600
        })
    },
    prod:  {
        name: packageConfig.productName,
        saveEnabled: true,
        saveDir: 'snapshots',
        profile: 'prod',
        debug: false,
        window: Object.assign({}, minimums, {
            width: 400,
            height: 980,
        })
    }
}

/** @type {ConfigStage} */
module.exports.stage = stage;

/** @type StageConfig */
module.exports.conf = AppConfig[stage];

module.exports.isProd = () => stage === 'prod';
module.exports.isDev = () => stage === 'dev';

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

const stage = process.env.NODE_ENV_ELECTRON_VITE === 'development' ? 'dev' : 'prod';
const devTools = process.argv.includes('--console');

const minimums = {
    minWidth: 400,
    minHeight: 0
}

/** @type {Object.<any, StageConfig>} */
const AppConfig = {
    dev: {
        name: packageConfig.productName,
        saveEnabled: false,
        saveDir: 'snapshots',
        profile: 'dev',
        debug: true,
        vibrancy: false, // experiment
        window: Object.assign({}, minimums, {
            width: devTools ? 2000 : 400,
            height: devTools ? 1600 : 980
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

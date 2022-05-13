const { stage, conf, isDev } = require('../shared/config');

/*
    Main process augmentation for config here
 */

module.exports.DEV = isDev();
module.exports.stage = stage;
module.exports.conf = conf;
module.exports.devTools = process.argv.includes('--console');
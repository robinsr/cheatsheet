const { app, dialog, ipcMain: ipc } = require('electron');
const path = require('path');
const fs = require( 'fs' );
const gm = require('gm');
const { isProd } = require('../shared/config');
const { getLogger, logIPCEvent } = require('./logger');
const { CustomImage } = require('./images');

const log = getLogger('io');

const ENC = { encoding: 'utf8' };


class Store {
    /** @type boolean */
    saveEnabled;

    /**
     * @param {StageConfig} config
     */
    constructor(config) {
        let { saveEnabled, saveDir, profile } = config;

        this.saveEnabled = saveEnabled;

        const stores = {
            apps: getFileName(saveDir, profile, 'apps'),
            settings: getFileName(saveDir, profile, 'settings')
        };

        log.info('Creating store with config:', { saveEnabled, saveDir, profile, stores });

        ipc.handle('api:image:save', (e, imageData) => {
            logIPCEvent('api:image:save');
            return saveImage(imageData);
        });

        ipc.handle('api:apps:get', async (e) => {
            logIPCEvent('api:apps:get');
            return this.getJSON(stores.apps);
        });

        ipc.handle('api:apps:save', (e, data) => {
            logIPCEvent('api:apps:save');
            return this.writeJSON(stores.apps, data);
        });

        ipc.handle('api:settings:get', (e) => {
            logIPCEvent('api:settings:get');
            return this.getJSON(stores.settings);
        });

        ipc.handle('api:settings:save', (e, data) => {
            logIPCEvent('api:settings:save');
            ipc.emit('app:settingsUpdated', data);
            return this.writeJSON(stores.settings, data);
        });

        this.stores = stores;
    }

    getSettingsSync() {
        let filepath = this.stores.settings;

        log.info('Reading user settings...');

        try {
            const data = fs.readFileSync(filepath, ENC);
            return JSON.parse(data.toString());
        } catch (err) {
            if (err.code === 'ENOENT') {
                log.info('No settings file found', filepath);
                return {};
            } else {
                throw new Error('Could not read user settings')
            }
        }
    }

    getJSON(filepath) {
        log.debug('Reading file', filepath);

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, ENC, (err, data) => {
                if (err){
                    if (err.code === 'ENOENT') {
                        log.debug('Creating file for store', filepath);
                        this.writeJSON(filepath, {});
                        return resolve({});
                    } else {
                        log.error('failed to get snapshot', err)
                        return reject(err);
                    }

                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    writeJSON(filepath, data) {
        log.debug('Saving snapshot to: ', filepath);

        if (this.saveEnabled) {
            return new Promise((resolve, reject) => {
                writeFile(filepath, JSON.stringify(data, null, 4), ENC)
                    .then(() => {
                        log.debug('snapshot saved to ' + filepath)
                        resolve({ status: 'success', filepath });
                    })
                    .catch(err => {
                        log.error('failed to save snapshot');
                        log.error(err);
                        reject(err);
                    });
            });
        } else if (isProd()) {
            throw new Error('Save disabled in prod');
        } else {
            log.warn('Saving disabled');
            return Promise.resolve({ status: 'disabled', filepath })
        }
    }
}

const checkDir = dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const getFileName = (saveDir, profile, modelType) => {
    checkDir(app.getPath('userData'), saveDir);
    const fileName = `${profile}-store.${modelType}.json`;
    return path.resolve(app.getPath('userData'), saveDir, fileName);
}

const saveImage = (imageData) => {
    let imageModel = CustomImage.fromData(imageData);
    log.debug('ImageModel received:', imageModel);

    return new Promise((resolve, reject) => {
        dialog.showSaveDialog({
            defaultPath: imageModel.getFilename()
        })
        .then(result => {
            let { canceled, filePath } = result;

            if (canceled) {
                resolve(null);
            } else {
                imageModel.getBuffer()
                .then(buffer => {
                    writeFile(filePath, buffer)
                        .then(() => resolve(filePath))
                        .catch(reject);
                    })
                .catch(reject);
            }
        });
    });
}

const writeFile = function(filepath, data, options={}) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, options, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = Store;

const { app, dialog, ipcMain: ipc } = require('electron');
const path = require('path');
const fs = require( 'fs' );
const gm = require('gm');
const { CustomImage } = require('./images');


class Store {
    constructor({ saveEnabled = true, saveDir, profile }) {
        this.saveEnabled = saveEnabled;

        const stores = {
            apps: getFileName(saveDir, profile, 'apps'),
            settings: getFileName(saveDir, profile, 'settings')
        };

        console.info('Creating store', { saveEnabled, saveDir, profile, stores });

        ipc.handle('api:image:save', (e, imageData) => {
            return saveImage(imageData);
        });

        ipc.handle('api:apps:get', async (e) => {
            return this.getJSON(stores.apps);
        });

        ipc.handle('api:apps:save', (e, data) => {
            return this.writeJSON(stores.apps, data);
        });

        ipc.handle('api:settings:get', (e) => {
            return this.getJSON(stores.settings);
        });

        ipc.handle('api:settings:save', (e, data) => {
            return this.writeJSON(stores.settings, data);
        });
    }

    getJSON(filepath) {
        console.info('Reading file', filepath);

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, { encoding: 'utf8' }, (err, data) => {
                if (err){
                    if (err.code === 'ENOENT') {
                        console.info('Creating file for store', filepath);
                        this.writeJSON(filepath, {});
                        return resolve({});
                    } else {
                        console.error('failed to get snapshot', err)
                        return reject(err);
                    }

                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    writeJSON(filepath, data) {
        console.info('Saving snapshot to: ', filepath);

        if (this.saveEnabled) {
            return new Promise((resolve, reject) => {
                writeFile(filepath, JSON.stringify(data, null, 4), { encoding: 'utf8' })
                    .then(() => {
                        console.info('snapshot saved to ' + filepath)
                        resolve({ status: 'success', filepath });
                    })
                    .catch(err => {
                        console.error('failed to save snapshot');
                        console.error(err);
                        reject(err);
                    });
            });
        } else {
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
    console.log(imageModel)

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

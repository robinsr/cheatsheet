const { dialog, ipcMain } = require('electron');
const settings = require('electron-app-settings');
const path = require('path');
const fs = require( 'fs' );
const gm = require('gm')

const { CustomImage } = require('./images');


const saveImage = (e, imageData) => {
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

const checkdir = dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const saveSnapshot = (data) => {
    checkdir(settings.get('app.saveDir'));

    let filepath = path.resolve(settings.get('app.saveDir'), settings.get('app.saveKey'));
    console.log('Saving snapshot to: ', filepath);

    if (!settings.get('app.save')) {
        console.log('Save disabled');
        return Promise.resolve({ status: 'success', filepath });
    }

    return new Promise((resolve, reject) => {
        writeFile(filepath, JSON.stringify(data, null, 4), { encoding: 'utf8' })
            .then(() => {
                console.log('snapshot saved to ' + filepath)
                resolve({ status: 'success', filepath });
            })
            .catch(err => {
                console.error('failed to save snapshot');
                console.error(err);
                reject(err);
            });
    });
}

const getLatestSnapshot = () => {
    checkdir(settings.get('app.saveDir'));

    let filepath = path.resolve(settings.get('app.saveDir'), settings.get('app.saveKey'));
    console.log('getting snapshot at ', filepath);

    return new Promise((resolve, reject) => {
        fs.readFile(filepath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                console.error('failed to save snapshot')
                return reject(err);
            } else {
                resolve(JSON.parse(data));
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

module.exports = { saveImage, getLatestSnapshot, saveSnapshot };

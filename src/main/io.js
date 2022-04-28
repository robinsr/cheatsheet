const { dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require( 'fs-extra' );
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

const saveSnapshot = (path , data) => {
    checkdir(`${path}/snapshots/`);

    let filepath = `${path}/snapshots/latest.json`;

    writeFile(filepath, JSON.stringify(data, null, 4), { encoding: 'utf8' })
        .then(() => {
            console.log('snapshot saved to ' + filepath)
        })
        .catch(err => {
            console.error('failed to save snapshot');
            console.error(err);
        })
}

const getLatestSnapshot = (path) => {
    checkdir(`${path}/snapshots/`);

    let filepath = `${path}/snapshots/latest.json`;

    return new Promise((resolve, reject) => {
        fs.readFile(filepath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                console.error('failed to save snapshot')
                return reject(err);
            } else {
                console.log('getting snapshot');
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

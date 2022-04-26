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


const writeFile = function(filepath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = { saveImage };
